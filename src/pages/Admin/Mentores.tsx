import React, { useState } from 'react';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import type { Mentor } from '../../types';
import { Edit2, Trash2, Users } from 'lucide-react';
import { motion } from 'motion/react';
import {
  AdminPageHeader,
  AdminFormModal,
  AdminEmptyState,
  AdminLoadingGrid,
  AdminFormFooter,
} from '../../components/admin';

const AdminMentores = () => {
  const { items: mentores, loading, create, update, remove } = useFirestoreCollection<Mentor>({
    collectionName: 'mentores',
    orderByField: 'ordem',
    orderDirection: 'asc',
    successLabels: {
      create: 'Mentor adicionado',
      update: 'Mentor atualizado',
      delete: 'Excluído',
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Mentor | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    cargo: '',
    empresa: '',
    foto: '',
    linkedin: '',
    ordem: 0,
    status: 'ativo'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, ordem: Number(formData.ordem) };
    if (editingItem) {
      await update(editingItem.id, payload);
    } else {
      await create(payload);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    remove(id, 'Excluir mentor?');
  };

  const openEdit = (item: Mentor) => {
    setEditingItem(item);
    setFormData({
      nome: item.nome,
      cargo: item.cargo,
      empresa: item.empresa || '',
      foto: item.foto || '',
      linkedin: item.linkedin || '',
      ordem: item.ordem || 0,
      status: item.status || 'ativo'
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      nome: '',
      cargo: '',
      empresa: '',
      foto: '',
      linkedin: '',
      ordem: mentores.length,
      status: 'ativo'
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-12">
      <AdminPageHeader
        icon={<Users className="text-brand-teal w-8 h-8" />}
        title="Mentores"
        subtitle="Gerencie os mentores que apoiam nossas startups."
        addButtonLabel="Adicionar Mentor"
        onAdd={() => { resetForm(); setIsDialogOpen(true); }}
      />

      <AdminFormModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={`${editingItem ? 'Editar' : 'Novo'} Mentor`}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
            <input type="text" required value={formData.nome}
              onChange={e => setFormData({...formData, nome: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cargo / Função</label>
              <input type="text" required value={formData.cargo}
                onChange={e => setFormData({...formData, cargo: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Empresa</label>
              <input type="text" required value={formData.empresa}
                onChange={e => setFormData({...formData, empresa: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Foto (URL)</label>
            <input type="text" placeholder="https://..." value={formData.foto}
              onChange={e => setFormData({...formData, foto: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">LinkedIn (URL)</label>
              <input type="text" placeholder="https://..." value={formData.linkedin}
                onChange={e => setFormData({...formData, linkedin: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ordem de Exibição</label>
              <input type="number" value={formData.ordem}
                onChange={e => setFormData({...formData, ordem: Number(e.target.value)})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>
          </div>

          <AdminFormFooter
            onCancel={() => setIsDialogOpen(false)}
            submitLabel={editingItem ? 'Salvar' : 'Adicionar'}
          />
        </form>
      </AdminFormModal>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {loading ? (
          <AdminLoadingGrid count={4} height="h-64" />
        ) : mentores.length === 0 ? (
          <AdminEmptyState
            icon={<Users className="w-16 h-16 mb-6 opacity-20 text-brand-teal" />}
            message="Nenhum mentor cadastrado"
          />
        ) : (
          mentores.map(item => (
            <motion.div layout key={item.id}
              className="bg-white overflow-hidden group border border-gray-100 rounded-[40px] shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                {item.foto ? (
                  <img src={item.foto} alt={item.nome} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale hover:grayscale-0" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="w-16 h-16 text-gray-200" />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(item)} className="p-3 bg-white/95 text-gray-900 hover:text-brand-teal rounded-2xl shadow-xl transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-3 bg-red-500 text-white hover:bg-red-600 rounded-2xl shadow-xl transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic leading-none mb-2">{item.nome}</h3>
                <p className="text-brand-teal text-[10px] font-black uppercase tracking-widest leading-none mb-1">{item.cargo}</p>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-none">{item.empresa}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminMentores;
