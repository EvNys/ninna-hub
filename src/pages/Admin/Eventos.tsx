import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { toast } from 'sonner';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import type { Evento } from '../../types';
import { Edit2, Trash2, Calendar, Link as LinkIcon, Download, FileSpreadsheet, Upload } from 'lucide-react';
import {
  AdminPageHeader,
  AdminFormModal,
  AdminFormFooter,
  AdminCheckbox,
} from '../../components/admin';

type EventoImportado = Omit<Evento, 'id' | 'createdAt' | 'updatedAt'>;

interface PreviaImportacao {
  eventos: EventoImportado[];
  erros: string[];
}

const csvHeaders = [
  'nome',
  'descricao',
  'data',
  'horario',
  'local',
  'imagem',
  'linkInscricao',
  'status',
  'destaque',
];

function parseCsv(content: string): string[][] {
  const text = content.replace(/^\uFEFF/, '');
  const separators = [',', ';', '\t'];
  let separator = ',';
  let highestSeparatorCount = -1;
  let inQuotes = false;
  let firstRecord = '';

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (inQuotes && text[index + 1] === '"') {
        firstRecord += '""';
        index += 1;
        continue;
      }
      inQuotes = !inQuotes;
    }
    if ((character === '\n' || character === '\r') && !inQuotes) break;
    firstRecord += character;
  }

  for (const candidate of separators) {
    let count = 0;
    let quoted = false;
    for (let index = 0; index < firstRecord.length; index += 1) {
      if (firstRecord[index] === '"') {
        if (quoted && firstRecord[index + 1] === '"') {
          index += 1;
          continue;
        }
        quoted = !quoted;
      } else if (firstRecord[index] === candidate && !quoted) {
        count += 1;
      }
    }
    if (count > highestSeparatorCount) {
      separator = candidate;
      highestSeparatorCount = count;
    }
  }

  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === separator && !quoted) {
      row.push(field.trim());
      field = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && text[index + 1] === '\n') index += 1;
      row.push(field.trim());
      if (row.some((value) => value !== '')) rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error('O arquivo contém aspas não fechadas.');
  row.push(field.trim());
  if (row.some((value) => value !== '')) rows.push(row);
  return rows;
}

function normalizeCsvHeader(header: string): string {
  return header
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function normalizeCsvValue(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function parseEventoCsv(content: string): PreviaImportacao {
  const rows = parseCsv(content);
  if (rows.length < 2) {
    throw new Error('O CSV precisa conter cabeçalho e pelo menos um evento.');
  }

  const headerAliases: Record<string, keyof EventoImportado> = {
    nome: 'nome',
    descricao: 'descricao',
    data: 'data',
    horario: 'horario',
    local: 'local',
    imagem: 'imagem',
    linkinscricao: 'linkInscricao',
    status: 'status',
    destaque: 'destaque',
  };
  const headers = rows[0].map((header) => headerAliases[normalizeCsvHeader(header)]);
  const requiredHeaders: Array<keyof EventoImportado> = ['nome', 'descricao', 'data'];
  const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));
  if (missingHeaders.length > 0) {
    throw new Error(`Colunas obrigatórias ausentes: ${missingHeaders.join(', ')}.`);
  }

  const eventos: EventoImportado[] = [];
  const erros: string[] = [];

  rows.slice(1).forEach((row, index) => {
    const values = Object.fromEntries(
      headers
        .map((header, columnIndex) => [header, row[columnIndex] ?? ''])
        .filter(([header]) => header),
    ) as Partial<Record<keyof EventoImportado, string>>;
    const registro = index + 2;
    const issues: string[] = [];

    const nome = values.nome?.trim() ?? '';
    const descricao = values.descricao?.trim() ?? '';
    const dataInformada = values.data?.trim() ?? '';
    let data = dataInformada;
    const brDate = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dataInformada);
    if (brDate) data = `${brDate[3]}-${brDate[2]}-${brDate[1]}`;
    const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data);
    const parsedDate = isoDate ? new Date(`${data}T00:00:00Z`) : null;

    if (!nome) issues.push('nome obrigatório');
    if (!descricao) issues.push('descrição obrigatória');
    if (!parsedDate || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== data) {
      issues.push('data inválida (use AAAA-MM-DD ou DD/MM/AAAA)');
    }

    const statusInformado = normalizeCsvValue(values.status ?? '');
    if (statusInformado && statusInformado !== 'ativo' && statusInformado !== 'inativo') {
      issues.push('status deve ser ativo ou inativo');
    }

    const destaqueInformado = normalizeCsvValue(values.destaque ?? '');
    const destaqueValores: Record<string, boolean> = {
      true: true,
      sim: true,
      yes: true,
      '1': true,
      false: false,
      nao: false,
      no: false,
      '0': false,
    };
    if (destaqueInformado && !(destaqueInformado in destaqueValores)) {
      issues.push('destaque deve ser sim/não ou true/false');
    }

    if (issues.length > 0) {
      erros.push(`Registro ${registro}: ${issues.join(', ')}.`);
      return;
    }

    eventos.push({
      nome,
      descricao,
      data,
      horario: values.horario?.trim() ?? '',
      local: values.local?.trim() ?? '',
      imagem: values.imagem?.trim() ?? '',
      linkInscricao: values.linkInscricao?.trim() ?? '',
      status: statusInformado === 'inativo' ? 'inativo' : 'ativo',
      destaque: destaqueInformado ? destaqueValores[destaqueInformado] : false,
    });
  });

  return { eventos, erros };
}

const AdminEventos = () => {
  const { items: eventos, loading, create, createMany, update, remove } = useFirestoreCollection<Evento>({
    collectionName: 'eventos',
    orderByField: 'data',
    orderDirection: 'desc',
    successLabels: {
      create: 'Evento criado',
      update: 'Evento atualizado',
      delete: 'Excluído',
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Evento | null>(null);
  const [uploading, setUploading] = useState(false);
  const [importacao, setImportacao] = useState<PreviaImportacao | null>(null);
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [importando, setImportando] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    data: '',
    horario: '',
    local: '',
    imagem: '',
    linkInscricao: '',
    status: 'ativo',
    destaque: false
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `eventos/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData(prev => ({ ...prev, imagem: url }));
      toast.success('Imagem carregada com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await update(editingItem.id, formData);
    } else {
      await create(formData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    remove(id, 'Excluir evento?');
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setImportacao(null);
    setNomeArquivo('');
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Selecione um arquivo CSV.');
      return;
    }

    try {
      const preview = parseEventoCsv(await file.text());
      setImportacao(preview);
      setNomeArquivo(file.name);
      if (preview.eventos.length === 0) {
        toast.error('Nenhum evento válido encontrado no CSV.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Não foi possível ler o arquivo CSV.');
      setImportacao(null);
      setNomeArquivo('');
    }
  };

  const handleImport = async () => {
    if (!importacao || importacao.eventos.length === 0) return;
    setImportando(true);
    try {
      await createMany(importacao.eventos);
      setImportacao(null);
      setNomeArquivo('');
    } finally {
      setImportando(false);
    }
  };

  const downloadCsvTemplate = () => {
    const template = [
      csvHeaders.join(';'),
      ['Nome do evento', 'Descrição do evento', '2026-12-31', '19:00', 'NINNA Hub', '', '', 'ativo', 'false']
        .map((value) => `"${value.replace(/"/g, '""')}"`)
        .join(';'),
    ].join('\r\n');
    const link = document.createElement('a');
    const url = URL.createObjectURL(new Blob(['\uFEFF', template], { type: 'text/csv;charset=utf-8;' }));
    link.href = url;
    link.download = 'modelo-eventos.csv';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const openEdit = (item: Evento) => {
    setEditingItem(item);
    setFormData({
      nome: item.nome,
      descricao: item.descricao,
      data: item.data,
      horario: item.horario || '',
      local: item.local || '',
      imagem: item.imagem || '',
      linkInscricao: item.linkInscricao || '',
      status: item.status,
      destaque: item.destaque || false
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({ nome: '', descricao: '', data: '', horario: '', local: '', imagem: '', linkInscricao: '', status: 'ativo', destaque: false });
  };

  return (
    <div className="max-w-7xl mx-auto py-12">
      <AdminPageHeader
        icon={<Calendar className="text-brand-teal w-8 h-8" />}
        title="Agenda de Eventos"
        subtitle="Gerencie as artes, datas e inscrições dos eventos do Hub."
        addButtonLabel="Novo Evento"
        onAdd={() => { resetForm(); setIsDialogOpen(true); }}
        extraActions={
          <>
            <button
              type="button"
              onClick={downloadCsvTemplate}
              className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 transition-all hover:border-brand-teal hover:text-brand-teal"
            >
              <Download className="mr-2 inline h-4 w-4" /> Modelo CSV
            </button>
            <label className={`cursor-pointer rounded-xl bg-gray-900 px-5 py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-gray-700 ${importando ? 'pointer-events-none opacity-50' : ''}`}>
              <input type="file" accept=".csv,text/csv" className="hidden" onChange={handleCsvUpload} disabled={importando} />
              <Upload className="mr-2 inline h-4 w-4" /> Importar CSV
            </label>
          </>
        }
      />

      <p className="-mt-8 mb-8 text-xs text-gray-400">
        CSV com as colunas <strong>nome</strong>, <strong>descricao</strong> e <strong>data</strong> obrigatórias.
        As datas podem estar em AAAA-MM-DD ou DD/MM/AAAA; use o modelo para ver todas as colunas disponíveis.
      </p>

      {importacao && (
        <section className="mb-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-900">
                <FileSpreadsheet className="h-5 w-5 text-brand-teal" /> Prévia da importação
              </h2>
              <p className="mt-2 text-sm text-gray-500">{nomeArquivo}</p>
              <p className="mt-1 text-xs font-bold text-brand-teal">
                {importacao.eventos.length} evento(s) pronto(s) para importar
                {importacao.erros.length > 0 && ` · ${importacao.erros.length} registro(s) serão ignorados`}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setImportacao(null); setNomeArquivo(''); }}
                disabled={importando}
                className="rounded-xl border border-gray-200 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleImport}
                disabled={importando || importacao.eventos.length === 0}
                className="rounded-xl bg-brand-teal px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {importando ? 'Importando...' : `Importar ${importacao.eventos.length} evento(s)`}
              </button>
            </div>
          </div>
          {importacao.erros.length > 0 && (
            <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-xs text-amber-800">
              <p className="mb-2 font-black uppercase tracking-wider">Registros inválidos</p>
              <ul className="space-y-1">
                {importacao.erros.slice(0, 5).map((erro) => <li key={erro}>{erro}</li>)}
              </ul>
              {importacao.erros.length > 5 && (
                <p className="mt-2 font-bold">E mais {importacao.erros.length - 5} registro(s).</p>
              )}
            </div>
          )}
        </section>
      )}

      <AdminFormModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={`${editingItem ? 'Editar' : 'Novo'} Evento`}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome do Evento</label>
              <input type="text" placeholder="Ex: Demo Day Startup Ceará" required value={formData.nome}
                onChange={e => setFormData({...formData, nome: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descrição</label>
              <textarea placeholder="Descreva o que vai rolar no evento..." required rows={3} value={formData.descricao}
                onChange={e => setFormData({...formData, descricao: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 resize-none shadow-sm" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Data</label>
              <input type="date" required value={formData.data}
                onChange={e => setFormData({...formData, data: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Horário</label>
              <input type="text" placeholder="Ex: 19:00" value={formData.horario}
                onChange={e => setFormData({...formData, horario: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Local ou Link (Online)</label>
              <input type="text" placeholder="Ex: NINNA Hub ou Zoom" value={formData.local}
                onChange={e => setFormData({...formData, local: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>

            <div className="space-y-2 col-span-2 p-6 rounded-3xl bg-gray-50 border border-gray-100 shadow-inner">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-3">Arte do Evento</label>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-grow">
                  <label className="text-[10px] text-gray-400 uppercase block mb-1 ml-1">Link Direto</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="https://sua-arte.jpg" value={formData.imagem}
                      onChange={e => setFormData({...formData, imagem: e.target.value})}
                      className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-brand-teal transition-all text-gray-900 text-sm shadow-sm" />
                  </div>
                </div>
                <div className="md:w-48">
                  <label className="text-[10px] text-gray-400 uppercase block mb-1 ml-1">Ou Upload</label>
                  <label className={`flex flex-col items-center justify-center h-[46px] w-full rounded-2xl border border-dashed border-gray-200 hover:border-brand-teal transition-all cursor-pointer bg-white shadow-sm ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                    <span className="text-[10px] font-black uppercase text-gray-400">{uploading ? 'Subindo...' : 'Escolher Arquivo'}</span>
                  </label>
                </div>
              </div>
              {formData.imagem && (
                <div className="mt-6 relative w-32 h-32 rounded-2xl overflow-hidden border border-gray-100 group shadow-lg">
                  <img src={formData.imagem} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setFormData({...formData, imagem: ''})}
                    className="absolute inset-0 bg-gray-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="text-white w-6 h-6" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Link de Inscrição</label>
              <input type="text" placeholder="Sympla, Eventbrite, etc." value={formData.linkInscricao}
                onChange={e => setFormData({...formData, linkInscricao: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>

            <div className="flex items-center space-x-6 col-span-2 p-2">
              <AdminCheckbox
                checked={formData.destaque}
                onToggle={() => setFormData({...formData, destaque: !formData.destaque})}
                label="Destaque na Home"
              />
              <AdminCheckbox
                checked={formData.status === 'ativo'}
                onToggle={() => setFormData({...formData, status: formData.status === 'ativo' ? 'inativo' : 'ativo'})}
                label="Evento Ativo"
              />
            </div>
          </div>

          <AdminFormFooter
            onCancel={() => setIsDialogOpen(false)}
            submitLabel={editingItem ? 'Salvar Alterações' : 'Criar Evento'}
          />
        </form>
      </AdminFormModal>

      <div className="bg-white border border-gray-100 rounded-[40px] shadow-xl overflow-x-auto relative z-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-8 px-10 font-black uppercase text-[10px] tracking-[0.3em] text-gray-400">Evento</th>
              <th className="py-8 px-6 font-black uppercase text-[10px] tracking-[0.3em] text-gray-400">Data</th>
              <th className="py-8 px-6 font-black uppercase text-[10px] tracking-[0.3em] text-gray-400">Status</th>
              <th className="py-8 px-10 font-black uppercase text-[10px] tracking-[0.3em] text-gray-400 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-24 text-center text-gray-400 animate-pulse font-black uppercase tracking-widest text-sm">
                  Carregando agenda...
                </td>
              </tr>
            ) : eventos.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-32 text-center text-gray-400 font-black uppercase tracking-widest text-sm italic">
                  Nenhum evento agendado.
                </td>
              </tr>
            ) : (
              eventos.map(item => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="py-8 px-10">
                    <div className="flex items-center space-x-6">
                      {item.imagem && (
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 hidden sm:block shadow-sm">
                          <img src={item.imagem} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <span className={`font-black uppercase tracking-wide text-xl italic ${item.destaque ? 'text-brand-teal' : 'text-gray-900'}`}>
                          {item.nome}
                        </span>
                        {item.destaque && (
                          <div className="text-[8px] font-black bg-brand-teal/10 text-brand-teal px-3 py-1 rounded-full inline-block ml-4 uppercase tracking-widest align-middle border border-brand-teal/20">
                            Destaque
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-8 px-6">
                    <div className="flex flex-col">
                      <span className="font-black text-gray-900 text-sm tracking-wide">{new Date(item.data).toLocaleDateString('pt-BR')}</span>
                      <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1 italic">{item.horario}</span>
                    </div>
                  </td>
                  <td className="py-8 px-6">
                    <div className={`inline-flex items-center px-4 py-1.5 rounded-full uppercase text-[8px] font-black tracking-widest border ${item.status === 'ativo' ? 'bg-brand-teal/10 text-brand-teal border-brand-teal/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                      {item.status}
                    </div>
                  </td>
                  <td className="py-8 px-10 text-right">
                    <div className="flex justify-end space-x-3">
                      <button onClick={() => openEdit(item)} className="p-3 bg-gray-50 hover:bg-brand-teal text-gray-400 hover:text-white rounded-2xl shadow-sm transition-all">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-3 bg-gray-50 hover:bg-red-500 text-gray-400 hover:text-white rounded-2xl shadow-sm transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEventos;
