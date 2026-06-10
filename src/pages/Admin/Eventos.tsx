import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { toast } from 'sonner';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import type { Evento } from '../../types';
import { Edit2, Trash2, Calendar, Link as LinkIcon } from 'lucide-react';
import {
  AdminPageHeader,
  AdminFormModal,
  AdminFormFooter,
  AdminCheckbox,
} from '../../components/admin';

const AdminEventos = () => {
  const { items: eventos, loading, create, update, remove } = useFirestoreCollection<Evento>({
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
      />

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
                        <span className={`font-black uppercase tracking-tighter text-xl italic ${item.destaque ? 'text-brand-teal' : 'text-gray-900'}`}>
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
                      <span className="font-black text-gray-900 text-sm tracking-tight">{new Date(item.data).toLocaleDateString('pt-BR')}</span>
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
