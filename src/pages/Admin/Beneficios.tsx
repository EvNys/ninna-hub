import React, { useState } from 'react';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import type { Beneficio } from '../../types';
import { Edit2, Trash2, Gift, Save } from 'lucide-react';
import { motion } from 'motion/react';
import {
  AdminPageHeader,
  AdminFormModal,
  AdminEmptyState,
  AdminLoadingGrid,
} from '../../components/admin';

const AdminBeneficios = () => {
  const { items: beneficios, loading, create, update, remove } = useFirestoreCollection<Beneficio>({
    collectionName: 'beneficios',
    orderByField: 'ordem',
    orderDirection: 'asc',
    successLabels: {
      create: 'Benefício adicionado',
      update: 'Benefício atualizado',
      delete: 'Benefício removido com sucesso',
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Beneficio | null>(null);

  const [formData, setFormData] = useState({
    nomeEmpresa: '',
    logo: '',
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
    remove(id);
  };

  const openEdit = (item: Beneficio) => {
    setEditingItem(item);
    setFormData({ nomeEmpresa: item.nomeEmpresa, logo: item.logo || '', ordem: item.ordem || 0, status: item.status || 'ativo' });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({ nomeEmpresa: '', logo: '', ordem: beneficios.length, status: 'ativo' });
  };

  return (
    <div className="max-w-7xl mx-auto py-12">
      <AdminPageHeader
        icon={<Gift className="text-brand-teal w-8 h-8" />}
        title="Clube de Benefícios"
        subtitle="Gerencie as empresas e benefícios oferecidos às nossas startups."
        addButtonLabel="Adicionar Benefício"
        onAdd={() => { resetForm(); setIsDialogOpen(true); }}
      />

      <AdminFormModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={`${editingItem ? 'Editar' : 'Novo'} Benefício`}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome da Empresa</label>
            <input type="text" required value={formData.nomeEmpresa}
              onChange={e => setFormData({...formData, nomeEmpresa: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Logo (URL)</label>
              <input type="text" required placeholder="https://..." value={formData.logo}
                onChange={e => setFormData({...formData, logo: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ordem de Exibição</label>
              <input type="number" value={formData.ordem}
                onChange={e => setFormData({...formData, ordem: Number(e.target.value)})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>
          </div>

          {/* Footer com botão de exclusão inline — Benefícios usa padrão especial */}
          <div className="flex flex-col gap-4 pt-4">
            <div className="flex gap-4">
              <button type="button" onClick={() => setIsDialogOpen(false)}
                className="flex-1 px-8 py-4 rounded-2xl border border-gray-100 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:bg-gray-50 transition-all">
                Cancelar
              </button>
              <button type="submit"
                className="flex-1 bg-brand-teal text-white font-black uppercase text-[10px] tracking-widest py-4 rounded-2xl transition-all shadow-xl shadow-brand-teal/20">
                <Save className="w-4 h-4 inline-block mr-2" />
                {editingItem ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
            {editingItem && (
              <button type="button"
                onClick={() => { handleDelete(editingItem.id); setIsDialogOpen(false); }}
                className="w-full py-4 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-50 rounded-2xl transition-all flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" /> Excluir permanentemente
              </button>
            )}
          </div>
        </form>
      </AdminFormModal>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {loading ? (
          <AdminLoadingGrid count={4} height="h-64" />
        ) : beneficios.length === 0 ? (
          <AdminEmptyState
            icon={<Gift className="w-16 h-16 mb-6 opacity-20 text-brand-teal" />}
            message="Nenhum benefício cadastrado"
          />
        ) : (
          beneficios.map(item => (
            <motion.div layout key={item.id}
              className="bg-white overflow-hidden group border border-gray-100 rounded-[40px] shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col"
            >
              <div className="p-8 flex-grow flex items-center justify-center bg-gray-50 relative">
                {item.logo ? (
                  <img src={item.logo} alt={item.nomeEmpresa} className="max-h-24 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                ) : (
                  <Gift className="w-16 h-16 text-gray-200" />
                )}
                <div className="absolute top-4 right-4 flex space-x-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={e => { e.stopPropagation(); openEdit(item); }} className="p-3 bg-white/95 text-gray-900 hover:text-brand-teal rounded-2xl shadow-xl transition-all border border-gray-100">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={e => { e.stopPropagation(); handleDelete(item.id); }} className="p-3 bg-red-500 text-white hover:bg-red-600 rounded-2xl shadow-xl transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-8 border-t border-gray-100">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-wide italic leading-none mb-2">{item.nomeEmpresa}</h3>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminBeneficios;
