import React, { useState } from 'react';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import type { Oportunidade } from '../../types';
import { Edit2, Trash2, Briefcase, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import {
  AdminPageHeader,
  AdminFormModal,
  AdminEmptyState,
  AdminLoadingGrid,
  AdminFormFooter,
  AdminCheckbox,
} from '../../components/admin';

const AdminOportunidades = () => {
  const { items: oportunidades, loading, create, update, remove } = useFirestoreCollection<Oportunidade>({
    collectionName: 'oportunidades',
    orderByField: 'createdAt',
    orderDirection: 'desc',
    successLabels: {
      create: 'Oportunidade criada',
      update: 'Oportunidade atualizada',
      delete: 'Excluído',
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Oportunidade | null>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    tipo: 'investimento',
    linkExterno: '',
    dataLimite: '',
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

  const handleDelete = (id: string) => {
    remove(id, 'Excluir oportunidade?');
  };

  const openEdit = (item: Oportunidade) => {
    setEditingItem(item);
    setFormData({
      titulo: item.titulo,
      descricao: item.descricao,
      tipo: item.tipo,
      linkExterno: item.linkExterno || '',
      dataLimite: item.dataLimite || '',
      imagem: item.imagem || '',
      status: item.status,
      destaque: item.destaque || false
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      titulo: '',
      descricao: '',
      tipo: 'investimento',
      linkExterno: '',
      dataLimite: '',
      imagem: '',
      status: 'ativo',
      destaque: false
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-12">
      <AdminPageHeader
        icon={<Briefcase className="text-brand-teal w-8 h-8" />}
        title="Oportunidades"
        subtitle="Editais, investimentos e parcerias para o ecossistema."
        addButtonLabel="Nova Oportunidade"
        onAdd={() => { resetForm(); setIsDialogOpen(true); }}
      />

      <AdminFormModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={`${editingItem ? 'Editar' : 'Nova'} Oportunidade`}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Título</label>
            <input type="text" placeholder="Ex: Edital de Fomento 2024" required value={formData.titulo}
              onChange={e => setFormData({...formData, titulo: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipo</label>
            <select value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 appearance-none shadow-sm cursor-pointer">
              <option value="investimento">Investimento</option>
              <option value="edital">Edital / Chamada Pública</option>
              <option value="parceria">Parceria Estratégica</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descrição</label>
            <textarea placeholder="Detalhes sobre a oportunidade..." required rows={4} value={formData.descricao}
              onChange={e => setFormData({...formData, descricao: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 resize-none shadow-sm" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Data Limite</label>
              <input type="date" value={formData.dataLimite}
                onChange={e => setFormData({...formData, dataLimite: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Link Externo</label>
              <input type="text" placeholder="https://..." value={formData.linkExterno}
                onChange={e => setFormData({...formData, linkExterno: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
            </div>
          </div>

          <div className="flex items-center space-x-2 p-2">
            <AdminCheckbox
              checked={formData.destaque}
              onToggle={() => setFormData({...formData, destaque: !formData.destaque})}
              label="Destaque na Home"
            />
          </div>

          <AdminFormFooter
            onCancel={() => setIsDialogOpen(false)}
            submitLabel={editingItem ? 'Salvar' : 'Criar'}
          />
        </form>
      </AdminFormModal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
          <AdminLoadingGrid count={4} height="h-48" />
        ) : oportunidades.length === 0 ? (
          <AdminEmptyState
            icon={<Briefcase className="w-16 h-16 mb-6 opacity-20 text-brand-teal" />}
            message="Nenhuma oportunidade encontrada"
          />
        ) : (
          oportunidades.map(item => (
            <motion.div layout key={item.id}
              className="bg-white p-10 flex flex-col group border border-gray-100 rounded-[40px] shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              <div className="flex items-start justify-between mb-8">
                <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${item.destaque ? 'bg-brand-teal/10 text-brand-teal border-brand-teal/20 scale-105' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                  {item.tipo}
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => openEdit(item)} className="p-3 bg-gray-50 hover:bg-brand-teal group-hover:shadow-lg text-gray-400 hover:text-white rounded-2xl transition-all">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-3 bg-gray-50 hover:bg-red-500 group-hover:shadow-lg text-gray-400 hover:text-white rounded-2xl transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <h3 className="text-3xl font-black text-gray-900 uppercase tracking-wide italic mb-4 leading-none">{item.titulo}</h3>
              <p className="text-gray-500 text-sm font-medium line-clamp-3 mb-10 leading-relaxed">{item.descricao}</p>

              <div className="flex items-center justify-between mt-auto pt-8 border-t border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Prazo final</span>
                  <div className="text-xs text-gray-900 font-black uppercase tracking-widest italic">
                    {item.dataLimite ? new Date(item.dataLimite).toLocaleDateString('pt-BR') : 'Sem prazo'}
                  </div>
                </div>
                {item.linkExterno && (
                  <a href={item.linkExterno} target="_blank" rel="noopener noreferrer" className="text-brand-teal flex items-center gap-3 hover:scale-105 transition-transform">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Link Externo</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOportunidades;
