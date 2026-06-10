import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import type { EquipeMember } from '../../types';
import { Edit2, Trash2, Users } from 'lucide-react';
import { motion } from 'motion/react';
// Equipe padrão fica em src/data/equipe-fallback.ts (compartilhada com a página /sobre).
import { EQUIPE_PADRAO } from '../../data/equipe-fallback';
import {
  AdminPageHeader,
  AdminFormModal,
  AdminLoadingGrid,
  AdminFormFooter,
} from '../../components/admin';

// Usada pelo botão "Importar equipe oficial" para popular o Firestore.
// `id` é descartado aqui — o Firestore gera o id de cada documento.
const DEFAULT_MEMBERS = EQUIPE_PADRAO.map(({ id, ...member }) => member);

const AdminEquipe = () => {
  const { items: membros, loading, refetch, create, update, remove } = useFirestoreCollection<EquipeMember>({
    collectionName: 'equipe',
    orderByField: 'ordem',
    orderDirection: 'asc',
    successLabels: {
      create: 'Membro adicionado',
      update: 'Membro atualizado',
      delete: 'Excluído',
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EquipeMember | null>(null);
  const [importing, setImporting] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    cargo: '',
    foto: '',
    linkedin: '',
    ordem: 0,
    status: 'ativo'
  });

  // Importa os membros padrão de uma vez. Usa addDoc direto (em vez do hook)
  // para gravar todos em paralelo e recarregar a lista só uma vez no final.
  const handleImportDefaultMembros = async () => {
    setImporting(true);
    try {
      const batchPromises = DEFAULT_MEMBERS.map(member =>
        addDoc(collection(db, 'equipe'), { ...member, createdAt: serverTimestamp() })
      );
      await Promise.all(batchPromises);
      toast.success('Membros oficiais importados com sucesso!');
      refetch();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao importar equipe oficial');
    } finally {
      setImporting(false);
    }
  };

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
    remove(id, 'Excluir membro da equipe?');
  };

  const openEdit = (item: EquipeMember) => {
    setEditingItem(item);
    setFormData({
      nome: item.nome,
      cargo: item.cargo,
      foto: item.foto || '',
      linkedin: item.linkedin || '',
      ordem: item.ordem || 0,
      status: item.status || 'ativo'
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({ nome: '', cargo: '', foto: '', linkedin: '', ordem: membros.length, status: 'ativo' });
  };

  const importButton = membros.length === 0 && !loading ? (
    <button
      onClick={handleImportDefaultMembros}
      disabled={importing}
      className="bg-white border border-gray-150 hover:bg-gray-50 text-gray-700 rounded-xl py-4 px-8 font-black uppercase text-[10px] tracking-widest flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
    >
      {importing ? 'Importando...' : 'Importar Equipe Oficial'}
    </button>
  ) : undefined;

  return (
    <div className="max-w-7xl mx-auto py-12">
      <AdminPageHeader
        icon={<Users className="text-brand-teal w-8 h-8" />}
        title="Nossa Equipe"
        subtitle="Gerencie os membros que fazem o NINNA Hub acontecer."
        addButtonLabel="Adicionar Membro"
        onAdd={() => { resetForm(); setIsDialogOpen(true); }}
        extraActions={importButton}
      />

      <AdminFormModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={`${editingItem ? 'Editar' : 'Novo'} Membro`}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
            <input type="text" required value={formData.nome}
              onChange={e => setFormData({...formData, nome: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cargo / Função</label>
            <input type="text" required value={formData.cargo}
              onChange={e => setFormData({...formData, cargo: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading ? (
          <AdminLoadingGrid count={4} height="h-96" />
        ) : membros.length === 0 ? (
          <div className="col-span-full py-32 text-center text-gray-400 flex flex-col items-center bg-white rounded-[40px] border border-gray-100 shadow-xl">
            <Users className="w-16 h-16 mb-6 opacity-20 text-brand-teal" />
            <span className="font-black uppercase tracking-widest text-sm italic mb-2">Nenhum membro cadastrado</span>
            <p className="text-gray-400 max-w-sm text-xs font-semibold leading-relaxed mb-6">Comece inserindo manualmente ou importe a equipe padrão do NINNA.</p>
            <button
              onClick={handleImportDefaultMembros}
              disabled={importing}
              className="bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl py-3.5 px-8 font-black uppercase text-[10px] tracking-widest flex items-center justify-center transition-all shadow-lg shadow-brand-teal/15 disabled:opacity-50"
            >
              {importing ? 'Importando...' : 'Importar Equipe Oficial'}
            </button>
          </div>
        ) : (
          membros.map(item => (
            <motion.div layout key={item.id}
              className="bg-white overflow-hidden group border border-gray-120 rounded-[40px] shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-50 border-b border-gray-100">
                {item.foto ? (
                  <img src={item.foto} alt={item.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="w-16 h-16 text-gray-200" />
                  </div>
                )}
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic leading-tight mb-2 min-h-[2.5rem] flex items-end">{item.nome}</h3>
                  <p className="text-brand-teal text-[10px] font-black uppercase tracking-widest leading-none mb-6">{item.cargo}</p>
                </div>

                <div className="flex gap-2.5 pt-4 border-t border-gray-100">
                  <button onClick={() => openEdit(item)}
                    className="flex-1 py-3 px-4 bg-gray-50 hover:bg-brand-teal/10 hover:text-brand-teal text-gray-700 hover:border-brand-teal/20 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-gray-100">
                    <Edit2 className="w-3.5 h-3.5" /> Editar
                  </button>
                  <button onClick={() => handleDelete(item.id)}
                    className="py-3 px-4 bg-red-50 hover:bg-red-150 text-red-600 rounded-xl hover:border-red-200 font-black uppercase text-[9px] tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-red-100/50">
                    <Trash2 className="w-3.5 h-3.5 mr-0.5" /> Excluir
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminEquipe;
