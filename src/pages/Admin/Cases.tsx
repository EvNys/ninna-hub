import React, { useState } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import type { Case } from '../../types';
import { Edit2, Trash2, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { handleFirestoreError, OperationType } from '../../lib/firestore-errors';
import {
  AdminPageHeader,
  AdminSearchBar,
  AdminFormModal,
  AdminEmptyState,
  AdminLoadingGrid,
  AdminFormFooter,
  AdminCheckbox,
} from '../../components/admin';

const AdminCases = () => {
  const { items: cases, loading, refetch, create, update } = useFirestoreCollection<Case>({
    collectionName: 'cases',
    orderByField: 'createdAt',
    orderDirection: 'desc',
    successLabels: {
      create: 'Case cadastrado',
      update: 'Case atualizado',
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Case | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    cliente: '',
    resumo: '',
    conteudo: '',
    imagem: '',
    link: '',
    status: 'ativo'
  });

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

  // Mantém o toast.promise com estado "Excluindo..." específico desta página.
  const handleDelete = async (id: string) => {
    const path = `cases/${id}`;
    const promise = deleteDoc(doc(db, 'cases', id));
    toast.promise(promise, {
      loading: 'Excluindo case...',
      success: () => { refetch(); setIsDeleting(null); return 'Case excluído com sucesso'; },
      error: (err) => { setIsDeleting(null); handleFirestoreError(err, OperationType.DELETE, path); return 'Erro ao excluir case'; }
    });
  };

  const openEdit = (item: Case) => {
    setEditingItem(item);
    setFormData({
      titulo: item.titulo,
      cliente: item.cliente,
      resumo: item.resumo || '',
      conteudo: item.conteudo || '',
      imagem: item.imagem || '',
      link: item.link || '',
      status: item.status
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({ titulo: '', cliente: '', resumo: '', conteudo: '', imagem: '', link: '', status: 'ativo' });
  };

  const filteredItems = cases.filter(c =>
    c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-12">
      <AdminPageHeader
        icon={<FileText className="text-brand-teal w-8 h-8" />}
        title="Sucesso & Cases"
        subtitle="Registre as histórias de impacto e resultados gerados no NINNA Hub."
        addButtonLabel="Novo Case"
        onAdd={() => { resetForm(); setIsDialogOpen(true); }}
      />

      <AdminSearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Filtrar por título ou cliente..." />

      <AdminFormModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={`${editingItem ? 'Editar' : 'Registrar'} Case`}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Título do Case</label>
              <input type="text" placeholder="Ex: Transformação Digital na Empresa X" required value={formData.titulo}
                onChange={e => setFormData({...formData, titulo: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cliente / Empresa</label>
              <input type="text" placeholder="Ex: Ambev, M. Dias Branco..." required value={formData.cliente}
                onChange={e => setFormData({...formData, cliente: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Resumo (Chamada)</label>
            <textarea placeholder="Uma descrição curta que aparece na listagem..." required rows={2} value={formData.resumo}
              onChange={e => setFormData({...formData, resumo: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm resize-none" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Conteúdo Completo</label>
            <textarea placeholder="Detalhes do projeto, desafios e resultados..." required rows={6} value={formData.conteudo}
              onChange={e => setFormData({...formData, conteudo: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Imagem de Capa (URL)</label>
              <input type="text" placeholder="https://imagem-do-case.jpg" value={formData.imagem}
                onChange={e => setFormData({...formData, imagem: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Link Relacionado (Opcional)</label>
              <input type="text" placeholder="https://artigo-ou-site.com" value={formData.link}
                onChange={e => setFormData({...formData, link: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>
          </div>

          <div className="flex items-center space-x-2 p-2">
            <AdminCheckbox
              checked={formData.status === 'ativo'}
              onToggle={() => setFormData({...formData, status: formData.status === 'ativo' ? 'inativo' : 'ativo'})}
              label="Publicar Case no Portal"
            />
          </div>

          <AdminFormFooter
            onCancel={() => setIsDialogOpen(false)}
            submitLabel={editingItem ? 'Salvar Alterações' : 'Publicar Case'}
          />
        </form>
      </AdminFormModal>

      {/* Modal de confirmação de exclusão */}
      <AnimatePresence>
        {isDeleting && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsDeleting(null)} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white border border-gray-100 rounded-[30px] p-8 shadow-2xl text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-wide italic mb-2">Confirmar Exclusão</h3>
              <p className="text-gray-500 text-sm font-medium mb-8 italic">Você tem certeza que deseja excluir este case de sucesso? Esta ação é irreversível.</p>
              <div className="flex gap-4">
                <button onClick={() => setIsDeleting(null)}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-100 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:bg-gray-50 transition-all">
                  Cancelar
                </button>
                <button onClick={() => handleDelete(isDeleting)}
                  className="flex-1 bg-red-500 text-white font-black uppercase text-[10px] tracking-widest py-3 rounded-xl transition-all shadow-xl shadow-red-500/20">
                  Excluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <AdminLoadingGrid count={3} height="h-32" />
        ) : filteredItems.length === 0 ? (
          <AdminEmptyState
            icon={<FileText className="w-16 h-16 mb-6 opacity-20 text-brand-teal" />}
            message="Nenhum case registrado"
          />
        ) : (
          filteredItems.map(item => (
            <motion.div layout key={item.id}
              className="bg-white p-8 group border border-gray-100 rounded-[40px] shadow-lg hover:shadow-2xl transition-all flex flex-col md:flex-row gap-8 items-center"
            >
              <div className="w-full md:w-32 h-32 rounded-3xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 shrink-0">
                {item.imagem ? (
                  <img src={item.imagem} alt={item.titulo} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <FileText className="w-10 h-10 text-gray-200" />
                )}
              </div>

              <div className="flex-grow text-center md:text-left">
                <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                  <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-brand-teal font-white text-white italic">Case</span>
                  <span className="text-xs font-black text-brand-teal uppercase tracking-widest">{item.cliente}</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-wide italic leading-none">{item.titulo}</h3>
                <p className="text-gray-500 mt-2 text-sm line-clamp-1 italic">{item.resumo}</p>
              </div>

              <div className="flex space-x-3 shrink-0">
                <button onClick={() => openEdit(item)} className="p-4 bg-gray-50 hover:bg-brand-teal text-gray-400 hover:text-white rounded-2xl shadow-sm transition-all">
                  <Edit2 className="w-5 h-5" />
                </button>
                <button onClick={() => setIsDeleting(item.id)} className="p-4 bg-gray-50 hover:bg-red-500 text-gray-400 hover:text-white rounded-2xl shadow-sm transition-all">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCases;
