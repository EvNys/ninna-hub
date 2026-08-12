import React, { useState } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import type { Premiacao } from '../../types';
import { Edit2, Trash2, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AdminPageHeader,
  AdminFormModal,
  AdminEmptyState,
  AdminLoadingGrid,
  AdminFormFooter,
} from '../../components/admin';

const AdminPremiacoes = () => {
  const { items, loading, refetch, create, update } = useFirestoreCollection<Premiacao>({
    collectionName: 'premiacoes',
    orderByField: 'createdAt',
    orderDirection: 'desc',
    successLabels: {
      create: 'Premiação adicionada',
      update: 'Premiação atualizada',
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Premiacao | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    organizacao: '',
    ano: '',
    imagem: '',
    status: 'ativo',
    destaque: false
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
    const promise = deleteDoc(doc(db, 'premiacoes', id));
    toast.promise(promise, {
      loading: 'Excluindo premiação...',
      success: () => { refetch(); setIsDeleting(null); return 'Premiação excluída com sucesso'; },
      error: 'Erro ao excluir premiação'
    });
  };

  const openEdit = (item: Premiacao) => {
    setEditingItem(item);
    setFormData({
      titulo: item.titulo,
      organizacao: item.organizacao,
      ano: item.ano || '',
      imagem: item.imagem || '',
      status: item.status || 'ativo',
      destaque: item.destaque || false
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      titulo: '',
      organizacao: '',
      ano: new Date().getFullYear().toString(),
      imagem: '',
      status: 'ativo',
      destaque: false
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-12">
      <AdminPageHeader
        icon={<Award className="text-brand-teal w-8 h-8" />}
        title="Premiações & Reconhecimentos"
        subtitle="Gerencie as conquistas que aparecem na home do Portal."
        addButtonLabel="Adicionar Premiação"
        onAdd={() => { resetForm(); setIsDialogOpen(true); }}
      />

      <AdminFormModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={`${editingItem ? 'Editar' : 'Nova'} Premiação`}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Título do Prêmio</label>
            <input type="text" required value={formData.titulo}
              onChange={e => setFormData({...formData, titulo: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Organização / Instituição</label>
            <input type="text" required value={formData.organizacao}
              onChange={e => setFormData({...formData, organizacao: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ano</label>
              <input type="text" required value={formData.ano}
                onChange={e => setFormData({...formData, ano: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm">
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Destaque</label>
              <select value={formData.destaque} onChange={e => setFormData({...formData, destaque: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm">
                <option value={false}>Não</option>
                <option value={true}>Sim</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Imagem / Badge (URL)</label>
            <input type="text" placeholder="https://..." value={formData.imagem}
              onChange={e => setFormData({...formData, imagem: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
          </div>

          <AdminFormFooter
            onCancel={() => setIsDialogOpen(false)}
            submitLabel={editingItem ? 'Salvar' : 'Adicionar'}
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
              className="relative w-full max-w-md bg-white border border-gray-100 rounded-[40px] p-12 text-center shadow-2xl">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Trash2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-wide italic mb-4">Excluir Premiação?</h2>
              <p className="text-gray-500 mb-10 font-medium">Esta ação não pode ser desfeita. A premiação será removida permanentemente do portal.</p>
              <div className="flex gap-4">
                <button onClick={() => setIsDeleting(null)}
                  className="flex-1 py-5 rounded-2xl bg-gray-50 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all">
                  Cancelar
                </button>
                <button onClick={() => handleDelete(isDeleting)}
                  className="flex-1 py-5 rounded-2xl bg-red-500 text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/20">
                  Confirmar Exclusão
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <AdminLoadingGrid count={3} height="h-64" />
        ) : items.length === 0 ? (
          <AdminEmptyState
            icon={<Award className="w-16 h-16 mb-6 opacity-20 text-brand-teal" />}
            message="Nenhuma premiação cadastrada"
          />
        ) : (
          items.map(item => (
            <motion.div layout key={item.id}
              className={`bg-white overflow-hidden group border border-gray-100 rounded-[40px] shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col ${item.status === 'inativo' ? 'opacity-60' : ''}`}
            >
              <div className="relative h-48 overflow-hidden bg-gray-50">
                {item.imagem ? (
                  <img src={item.imagem} alt={item.titulo} className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Award className="w-16 h-16 text-gray-200" />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(item)} className="p-3 bg-white/95 text-gray-900 hover:text-brand-teal rounded-2xl shadow-xl transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsDeleting(item.id)} className="p-3 bg-red-500 text-white hover:bg-red-600 rounded-2xl shadow-xl transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-brand-teal text-[10px] font-black uppercase tracking-widest">{item.ano}</span>
                  {item.status === 'inativo' && (
                    <span className="text-red-400 text-[8px] font-black uppercase tracking-widest border border-red-100 px-2 py-0.5 rounded-full">Inativo</span>
                  )}
                </div>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-wide italic leading-none mb-4">{item.titulo}</h3>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{item.organizacao}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPremiacoes;
