import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Edit2,
  PlayCircle,
  Save,
  X,
  GraduationCap,
  Link2,
  Layout,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import type { Treinamento } from "../../types";

const AdminTreinamentos = () => {
  const navigate = useNavigate();
  const [trainings, setTrainings] = useState<Treinamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<{
    id: string;
    titulo: string;
  } | null>(null);
  const [editingItem, setEditingItem] = useState<Treinamento | null>(null);

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    capa: "",
    categoria: "Estratégico",
    ordem: 0,
    status: "ativo",
  });

  const categories = [
    "Marketing",
    "Vendas",
    "Operacional",
    "Estratégico",
    "Jurídico",
    "Outros",
  ];

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const q = query(collection(db, "treinamentos"), orderBy("ordem", "asc"));
      const querySnapshot = await getDocs(q);
      setTrainings(
        querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Treinamento,
        ),
      );
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar treinamentos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateDoc(doc(db, "treinamentos", editingItem.id), {
          ...formData,
          updatedAt: new Date().toISOString(),
        });
        toast.success("Treinamento atualizado!");
      } else {
        const docRef = await addDoc(collection(db, "treinamentos"), {
          ...formData,
          createdAt: new Date().toISOString(),
        });
        toast.success("Treinamento adicionado!");
        navigate(`/admin/treinamentos/${docRef.id}/aulas`);
      }
      setIsDialogOpen(false);
      resetForm();
      fetchTrainings();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar treinamento");
    }
  };

  const toggleStatus = async (item: Treinamento) => {
    const newStatus = item.status === "ativo" ? "inativo" : "ativo";
    try {
      await updateDoc(doc(db, "treinamentos", item.id), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      toast.success(`Status alterado para ${newStatus}`);
      fetchTrainings();
    } catch (error) {
      toast.error("Erro ao alterar status");
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, "treinamentos", deletingItem.id));
      toast.success(`Treinamento "${deletingItem.titulo}" excluído!`);
      await fetchTrainings();
      setIsConfirmOpen(false);
      setDeletingItem(null);
    } catch (error: any) {
      console.error("Erro na exclusão:", error);
      toast.error("Erro ao excluir treinamento");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: string, titulo: string) => {
    setDeletingItem({ id, titulo });
    setIsConfirmOpen(true);
  };

  const openEdit = (item: Treinamento) => {
    setEditingItem(item);
    setFormData({
      titulo: item.titulo,
      descricao: item.descricao || "",
      capa: item.capa || "",
      categoria: item.categoria || "Estratégico",
      ordem: item.ordem || 0,
      status: item.status || "ativo",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      titulo: "",
      descricao: "",
      capa: "",
      categoria: "Estratégico",
      ordem: trainings.length,
      status: "ativo",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black flex items-center gap-4 uppercase tracking-wide italic text-gray-900">
            <GraduationCap className="text-brand-teal w-8 h-8" />
            Gestão de Treinamentos
          </h1>
          <p className="text-gray-500 font-medium mt-2 italic">
            Publique cursos e aulas exclusivas para a comunidade.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          className="bg-brand-teal text-white rounded-xl py-4 px-8 font-black uppercase text-[10px] tracking-widest flex items-center justify-center transition-all shadow-xl shadow-brand-teal/20"
        >
          <Plus className="mr-2 w-5 h-5" /> Adicionar Treinamento
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
              <button
                onClick={() => setIsDialogOpen(false)}
                className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-black mb-8 uppercase tracking-wide italic text-gray-900">
                {editingItem ? "Editar Treinamento" : "Novo Treinamento"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Título do Treinamento
                  </label>
                  <input
                    required
                    value={formData.titulo}
                    onChange={(e) =>
                      setFormData({ ...formData, titulo: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Descrição
                  </label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData({ ...formData, descricao: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm h-32 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Capa (URL)
                    </label>
                    <div className="relative">
                      <Layout className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        value={formData.capa}
                        onChange={(e) =>
                          setFormData({ ...formData, capa: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Categoria
                    </label>
                    <select
                      value={formData.categoria}
                      onChange={(e) =>
                        setFormData({ ...formData, categoria: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm cursor-pointer appearance-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Ordem
                    </label>
                    <input
                      type="number"
                      value={formData.ordem}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ordem: parseInt(e.target.value),
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm cursor-pointer appearance-none"
                    >
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-grow bg-brand-teal text-white font-black uppercase text-[10px] tracking-widest py-5 rounded-2xl transition-all shadow-xl shadow-brand-teal/20"
                  >
                    <Save className="w-4 h-4 inline-block mr-2" />
                    {editingItem ? "Salvar Alterações" : "Publicar Treinamento"}
                  </button>

                  {editingItem && (
                    <button
                      type="button"
                      onClick={() =>
                        confirmDelete(editingItem.id, editingItem.titulo)
                      }
                      className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-6 rounded-2xl transition-all border border-red-100"
                      title="Excluir Treinamento"
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
        {loading
          ? [1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white h-72 animate-pulse rounded-[40px] border border-gray-100"
              />
            ))
          : trainings.map((item) => (
              <motion.div
                key={item.id}
                className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-xl relative group"
              >
                <div className="aspect-video bg-gray-50 rounded-[30px] mb-6 overflow-hidden relative">
                  {item.capa ? (
                    <img
                      src={item.capa}
                      alt={item.titulo}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PlayCircle className="w-12 h-12 text-gray-200" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openEdit(item);
                      }}
                      className="p-3 bg-white/90 backdrop-blur-sm text-gray-900 hover:text-brand-teal rounded-2xl shadow-xl transition-all border border-gray-100"
                      title="Editar treinamento"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleStatus(item);
                      }}
                      className={`p-3 backdrop-blur-sm rounded-2xl shadow-xl transition-all border ${item.status === "ativo" ? "bg-white/90 text-brand-teal border-gray-100" : "bg-gray-900/90 text-white border-transparent"}`}
                      title={
                        item.status === "ativo"
                          ? "Desativar (Ocultar)"
                          : "Ativar (Mostrar)"
                      }
                    >
                      {item.status === "ativo" ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        confirmDelete(item.id, item.titulo);
                      }}
                      className="p-3 bg-red-500 text-white hover:bg-red-600 rounded-2xl shadow-xl transition-all"
                      title="Excluir treinamento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {item.status === "inativo" && (
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                      <span className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest backdrop-blur-md">
                        Inativo
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${item.status === "ativo" ? "bg-brand-teal/5 text-brand-teal border-brand-teal/10" : "bg-gray-100 text-gray-400 border-gray-200"}`}
                  >
                    {item.status}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-gray-200">
                    {item.categoria}
                  </span>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    Ordem: {item.ordem}
                  </span>
                </div>

                <h3 className="text-xl font-black text-gray-900 uppercase tracking-wide italic leading-none mb-3 line-clamp-2">
                  {item.titulo}
                </h3>
                <p className="text-gray-500 text-sm font-medium line-clamp-4 italic mb-6">
                  {item.descricao}
                </p>

                <Link
                  to={`/admin/treinamentos/${item.id}/aulas`}
                  className="w-full bg-gray-900 text-white font-black uppercase text-[10px] tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-teal transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Layout className="w-4 h-4" /> Gerenciar Aulas
                </Link>
              </motion.div>
            ))}
      </div>
      <AnimatePresence>
        {isConfirmOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfirmOpen(false)}
              className="absolute inset-0 bg-gray-900/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-[40px] p-10 shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black mb-4 uppercase tracking-wide italic text-gray-900">
                Excluir?
              </h2>
              <p className="text-gray-500 font-medium italic mb-8">
                Tem certeza que deseja apagar permanentemente o treinamento{" "}
                <span className="text-gray-900 font-black">
                  "{deletingItem?.titulo}"
                </span>
                ?
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

export default AdminTreinamentos;
