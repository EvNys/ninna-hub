import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2, PlayCircle, Save, X, ArrowLeft, Link2, Layout, Music, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Aula, Treinamento } from '../../types';

const AdminAulas = () => {
  const { trainingId } = useParams();
  const navigate = useNavigate();
  const [training, setTraining] = useState<Treinamento | null>(null);
  const [lessons, setLessons] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<{id: string, titulo: string} | null>(null);
  const [editingItem, setEditingItem] = useState<Aula | null>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    mediaUrl: '',
    capa: '',
    ordem: 0
  });

  useEffect(() => {
    if (trainingId) {
      fetchTraining();
      fetchLessons();
    }
  }, [trainingId]);

  const fetchTraining = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'treinamentos', trainingId!));
      if (docSnap.exists()) {
        setTraining(docSnap.data());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLessons = async () => {
    try {
      const q = query(collection(db, 'treinamentos', trainingId!, 'aulas'), orderBy('ordem', 'asc'));
      const querySnapshot = await getDocs(q);
      setLessons(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar aulas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const aulasRef = collection(db, 'treinamentos', trainingId!, 'aulas');
      if (editingItem) {
        await updateDoc(doc(db, 'treinamentos', trainingId!, 'aulas', editingItem.id), {
          ...formData,
          updatedAt: new Date().toISOString()
        });
        toast.success('Aula atualizada!');
      } else {
        await addDoc(aulasRef, {
          ...formData,
          createdAt: new Date().toISOString()
        });
        toast.success('Aula adicionada!');
      }
      setIsDialogOpen(false);
      resetForm();
      fetchLessons();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar aula');
    }
  };

  const handleDelete = async () => {
    if (!deletingItem || !trainingId) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, 'treinamentos', trainingId, 'aulas', deletingItem.id));
      toast.success(`Aula "${deletingItem.titulo}" excluída!`);
      await fetchLessons();
      setIsConfirmOpen(false);
      setDeletingItem(null);
    } catch (error: any) {
      console.error("Erro na exclusão da aula:", error);
      toast.error('Erro ao excluir aula');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: string, titulo: string) => {
    setDeletingItem({ id, titulo });
    setIsConfirmOpen(true);
  };

  const openEdit = (item: Aula) => {
    setEditingItem(item);
    setFormData({
      titulo: item.titulo,
      descricao: item.descricao || '',
      mediaUrl: item.mediaUrl || '',
      capa: item.capa || '',
      ordem: item.ordem || 0
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      titulo: '',
      descricao: '',
      mediaUrl: '',
      capa: '',
      ordem: lessons.length
    });
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Youtube
    const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/);
    if (ytMatch && ytMatch[1]) {
      const id = ytMatch[1].split('&')[0].split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    // Vimeo
    const vimeoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(.+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    return url;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate('/admin/treinamentos')}
        className="flex items-center gap-2 text-gray-400 hover:text-brand-teal font-black uppercase text-[10px] tracking-widest mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para Treinamentos
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black flex items-center gap-4 uppercase tracking-wide italic text-gray-900">
            {training?.titulo || 'Carregando...'}
          </h1>
          <p className="text-gray-500 font-medium mt-2 italic px-1">Gerenciamento de aulas para este treinamento.</p>
        </div>

        <button 
          onClick={() => { resetForm(); setIsDialogOpen(true); }}
          className="bg-brand-teal text-white rounded-xl py-4 px-8 font-black uppercase text-[10px] tracking-widest flex items-center justify-center transition-all shadow-xl shadow-brand-teal/20"
        >
          <Plus className="mr-2 w-5 h-5" /> Adicionar Aula
        </button>
      </div>

      <AnimatePresence>
        {isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDialogOpen(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white border border-gray-100 rounded-[40px] p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button onClick={() => setIsDialogOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-black mb-8 uppercase tracking-wide italic text-gray-900">
                {editingItem ? 'Editar Aula' : 'Nova Aula'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {formData.mediaUrl && (
                  <div className="aspect-video w-full bg-black rounded-3xl overflow-hidden mb-6 shadow-inner border border-gray-100">
                    <iframe 
                      src={getEmbedUrl(formData.mediaUrl)}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Título da Aula</label>
                  <input 
                    required 
                    value={formData.titulo} 
                    onChange={e => setFormData({...formData, titulo: e.target.value})} 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descrição</label>
                  <textarea 
                    value={formData.descricao} 
                    onChange={e => setFormData({...formData, descricao: e.target.value})} 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm h-32 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Capa (URL)</label>
                    <div className="relative">
                      <Layout className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        value={formData.capa} 
                        onChange={e => setFormData({...formData, capa: e.target.value})} 
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Link Video/Audio</label>
                    <div className="relative">
                      <Link2 className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        value={formData.mediaUrl} 
                        onChange={e => setFormData({...formData, mediaUrl: e.target.value})} 
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ordem de Exibição</label>
                  <input 
                    type="number"
                    value={formData.ordem} 
                    onChange={e => setFormData({...formData, ordem: parseInt(e.target.value)})} 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm"
                  />
                </div>

                <div className="flex gap-4">
                  <button 
                    type="submit" 
                    className="flex-grow bg-brand-teal text-white font-black uppercase text-[10px] tracking-widest py-5 rounded-2xl transition-all shadow-xl shadow-brand-teal/20"
                  >
                    <Save className="w-4 h-4 inline-block mr-2" />
                    {editingItem ? 'Salvar Alterações' : 'Adicionar Aula'}
                  </button>

                  {editingItem && (
                    <button 
                      type="button"
                      onClick={() => confirmDelete(editingItem.id, editingItem.titulo)}
                      className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-6 rounded-2xl transition-all border border-red-100"
                      title="Excluir Aula"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="bg-white h-64 animate-pulse rounded-[40px] border border-gray-100" />)
        ) : lessons.map(item => (
          <motion.div key={item.id} className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-xl relative group">
            <div className="aspect-video bg-gray-50 rounded-[30px] mb-6 overflow-hidden relative">
              {item.capa ? (
                <img src={item.capa} alt={item.titulo} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <PlayCircle className="w-12 h-12 text-gray-200" />
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2 transition-all">
                <button 
                  onClick={(e) => { e.stopPropagation(); openEdit(item); }} 
                  className="p-3 bg-white/90 backdrop-blur-sm text-gray-900 hover:text-brand-teal rounded-2xl shadow-xl transition-all border border-gray-100"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); confirmDelete(item.id, item.titulo); }} 
                  className="p-3 bg-red-500 text-white hover:bg-red-600 rounded-2xl shadow-xl transition-all"
                  title="Excluir aula"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-black text-brand-teal uppercase tracking-widest">Aula {item.ordem + 1}</span>
              {item.mediaUrl?.includes('audio') || item.mediaUrl?.includes('.mp3') ? (
                <Music className="w-4 h-4 text-gray-400" />
              ) : (
                <Film className="w-4 h-4 text-gray-400" />
              )}
            </div>
            
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-wide italic leading-none mb-3 line-clamp-2">{item.titulo}</h3>
            <p className="text-gray-500 text-sm font-medium line-clamp-3 italic">{item.descricao}</p>
          </motion.div>
        ))}
        {lessons.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
            <PlayCircle className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest italic">Nenhuma aula cadastrada ainda.</p>
          </div>
        )}
      </div>
      <AnimatePresence>
        {isConfirmOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsConfirmOpen(false)}
              className="absolute inset-0 bg-gray-900/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-[40px] p-10 shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black mb-4 uppercase tracking-wide italic text-gray-900">Excluir Aula?</h2>
              <p className="text-gray-500 font-medium italic mb-8">
                Tem certeza que deseja apagar a aula <span className="text-gray-900 font-black">"{deletingItem?.titulo}"</span>?
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleDelete}
                  className="w-full bg-red-500 text-white font-black uppercase text-[10px] tracking-widest py-5 rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
                >
                  Sim, Excluir Agora
                </button>
                <button 
                  onClick={() => setIsConfirmOpen(false)}
                  className="w-full bg-gray-50 text-gray-400 font-black uppercase text-[10px] tracking-widest py-5 rounded-2xl hover:bg-gray-100 transition-all font-black"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAulas;
