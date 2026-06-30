import React, { useState } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import type { Parceiro } from '../../types';
import { Edit2, Trash2, Building2, Globe, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AdminPageHeader,
  AdminSearchBar,
  AdminFormModal,
  AdminEmptyState,
  AdminLoadingGrid,
  AdminFormFooter,
  AdminCheckbox,
} from '../../components/admin';

const AdminParceiros = () => {
  const { items: parceiros, loading, refetch, create, update } = useFirestoreCollection<Parceiro>({
    collectionName: 'parceiros',
    orderByField: 'nome',
    orderDirection: 'asc',
    successLabels: {
      create: 'Parceiro cadastrado',
      update: 'Parceiro atualizado',
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Parceiro | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'corporacao',
    logo: '',
    site: '',
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
    const promise = deleteDoc(doc(db, 'parceiros', id));
    toast.promise(promise, {
      loading: 'Excluindo parceiro...',
      success: () => { refetch(); setIsDeleting(null); return 'Parceiro excluído com sucesso'; },
      error: 'Erro ao excluir parceiro'
    });
  };

  const openEdit = (item: Parceiro) => {
    setEditingItem(item);
    setFormData({ nome: item.nome, tipo: item.tipo, logo: item.logo || '', site: item.site || '', status: item.status });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({ nome: '', tipo: 'corporacao', logo: '', site: '', status: 'ativo' });
  };

  const filteredItems = parceiros.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto py-12">
      <AdminPageHeader
        icon={<Building2 className="text-brand-teal w-8 h-8" />}
        title="Empresas & Parceiros"
        subtitle="Gerencie as corporações que fazem parte da vitrine do NINNA Hub."
        addButtonLabel="Novo Parceiro"
        onAdd={() => { resetForm(); setIsDialogOpen(true); }}
      />

      <AdminSearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Filtrar por nome..." />

      <AdminFormModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={`${editingItem ? 'Editar' : 'Cadastrar'} Parceiro`}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome da Empresa</label>
            <input type="text" placeholder="Ex: Ambev, Google, Petrobras..." required value={formData.nome}
              onChange={e => setFormData({...formData, nome: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipo de Parceria</label>
            <select value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 appearance-none shadow-sm cursor-pointer">
              <option value="corporacao">Corporações</option>
              <option value="startup">Startup Portfólio</option>
              <option value="parceiro_estrategico">Parceiro Estratégico</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-brand-teal">URL do Logo (PNG Transparente preferencial)</label>
            <div className="relative">
              <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="https://link-da-imagem.png" required value={formData.logo}
                onChange={e => setFormData({...formData, logo: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>
            {formData.logo && (
              <div className="mt-4 p-6 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-inner">
                <img src={formData.logo} alt="Preview" className="h-16 object-contain" referrerPolicy="no-referrer" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Website</label>
            <div className="relative">
              <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="https://empresa.com.br" value={formData.site}
                onChange={e => setFormData({...formData, site: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>
          </div>

          <div className="flex items-center space-x-2 p-2">
            <AdminCheckbox
              checked={formData.status === 'ativo'}
              onToggle={() => setFormData({...formData, status: formData.status === 'ativo' ? 'inativo' : 'ativo'})}
              label="Empresa Ativa na Vitrine"
            />
          </div>

          <AdminFormFooter
            onCancel={() => setIsDialogOpen(false)}
            submitLabel={editingItem ? 'Salvar' : 'Cadastrar'}
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
              <p className="text-gray-500 text-sm font-medium mb-8 italic">Ao excluir este parceiro, ele não será mais exibido na vitrine. Confirmar?</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <AdminLoadingGrid count={6} height="h-48" />
        ) : filteredItems.length === 0 ? (
          <AdminEmptyState
            icon={<Building2 className="w-16 h-16 mb-6 opacity-20 text-brand-teal" />}
            message="Nenhum parceiro encontrado"
          />
        ) : (
          filteredItems.map(item => (
            <motion.div layout key={item.id}
              className="bg-white p-8 flex flex-col group border border-gray-100 rounded-[40px] shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all cursor-default"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center p-3 border border-gray-100 shadow-inner overflow-hidden">
                  {item.logo ? (
                    <img src={item.logo} alt={item.nome} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    <Building2 className="w-10 h-10 text-gray-200" />
                  )}
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => openEdit(item)} className="p-3 bg-gray-50 hover:bg-brand-teal text-gray-400 hover:text-white rounded-2xl shadow-sm transition-all">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => setIsDeleting(item.id)} className="p-3 bg-gray-50 hover:bg-red-500 text-gray-400 hover:text-white rounded-2xl shadow-sm transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-wide italic mb-2 leading-none">{item.nome}</h3>
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">
                  {item.tipo === 'corporacao' ? 'Corporações' : item.tipo.replace('_', ' ')}
                </span>
                <div className={`w-3 h-3 rounded-full ${item.status === 'ativo' ? 'bg-brand-teal shadow-[0_0_12px_rgba(45,212,191,0.5)]' : 'bg-red-500'} transition-all`} />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminParceiros;
