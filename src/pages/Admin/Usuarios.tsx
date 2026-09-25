import React, { useState, useEffect } from "react";
import { initializeApp, getApp, getApps } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  setDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import firebaseConfig from "../../../firebase-applet-config.json";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Users,
  Shield,
  Mail,
  Lock,
  UserPlus,
  X,
  ChevronDown,
  Rocket,
  Edit2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Usuario } from "../../types";

// Help helper for secondary auth app to create users without logging out current user
const getAdminApp = () => {
  const name = "AdminHelper";
  if (getApps().find((app) => app.name === name)) {
    return getApp(name);
  }
  return initializeApp(firebaseConfig, name);
};

const AdminUsuarios = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    telefone: "",
    nomeEmpresa: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      setUsers(
        querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Usuario,
        ),
      );
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      if (editingUser) {
        // Update existing user doc
        await updateDoc(doc(db, "users", editingUser.id), {
          name: formData.name,
          role: formData.role,
          telefone: formData.telefone,
          nomeEmpresa: formData.nomeEmpresa,
          updatedAt: new Date().toISOString(),
        });
        toast.success("Perfil atualizado com sucesso!");
      } else {
        // Try to create auth account first
        let uid = "";
        try {
          const adminApp = getAdminApp();
          const adminAuth = getAuth(adminApp);
          const userCredential = await createUserWithEmailAndPassword(
            adminAuth,
            formData.email.trim(),
            formData.password,
          );
          uid = userCredential.user.uid;
          await signOut(adminAuth);
        } catch (authError: any) {
          console.warn(
            "Auth creation failed, falling back to database-only registration:",
            authError,
          );
          if (authError.code === "auth/operation-not-allowed") {
            uid = "pending_" + btoa(formData.email.trim()).replace(/=/g, "");
          } else {
            throw authError;
          }
        }

        // Add to Firestore
        await setDoc(doc(db, "users", uid), {
          uid,
          name: formData.name,
          email: formData.email.trim().toLowerCase(),
          role: formData.role,
          telefone: formData.telefone,
          nomeEmpresa: formData.nomeEmpresa,
          publico: true,
          createdAt: new Date().toISOString(),
          pendingAuth: uid.startsWith("pending_"),
        });

        toast.success(
          uid.startsWith("pending_")
            ? "Membro registrado no banco! (Deverá usar Login com Google)"
            : "Usuário criado com sucesso!",
        );
      }

      setIsDialogOpen(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      let message = error.message;
      if (error.code === "auth/email-already-in-use")
        message = "Este e-mail já está em uso.";
      toast.error("Erro ao processar usuário: " + message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (user: Usuario) => {
    if (
      user.email === "adm@ninnahub.com.br" ||
      user.email === "ninnaventures@gmail.com"
    ) {
      toast.error("Administradores principais não podem ser excluídos.");
      return;
    }

    if (
      window.confirm(
        `Excluir acesso para ${user.email}? (Isso removerá apenas o registro no banco)`,
      )
    ) {
      try {
        await deleteDoc(doc(db, "users", user.id));
        toast.success("Usuário removido com sucesso.");
        fetchUsers();
      } catch (error) {
        toast.error("Erro ao remover usuário.");
      }
    }
  };

  const openEdit = (user: Usuario) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "password_hidden", // Not editable here
      role: user.role || "user",
      telefone: user.telefone || "",
      nomeEmpresa: user.nomeEmpresa || "",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
      telefone: "",
      nomeEmpresa: "",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black flex items-center gap-4 uppercase tracking-wide italic text-gray-900">
            <Users className="text-brand-teal w-8 h-8" />
            Gestão da Comunidade
          </h1>
          <p className="text-gray-500 font-medium mt-2">
            Gerencie membros, acessos e perfis da comunidade NINNA.
          </p>
        </div>

        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl py-4 px-8 font-black uppercase text-[10px] tracking-widest flex items-center justify-center transition-all shadow-xl shadow-brand-teal/20"
        >
          <UserPlus className="mr-2 w-5 h-5" /> Adicionar Usuário
        </button>
      </div>

      {/* Modal Personalizado */}
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
              className="relative w-full max-w-md bg-white border border-gray-100 rounded-[40px] p-10 shadow-2xl"
            >
              <button
                onClick={() => setIsDialogOpen(false)}
                className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-black mb-8 uppercase tracking-wide italic text-gray-900">
                {editingUser ? "Editar Usuário" : "Novo Administrador"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: João Silva"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm"
                  />
                </div>

                {!editingUser && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        E-mail de Acesso
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          placeholder="email@exemplo.com"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Senha Inicial
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="password"
                          placeholder="Mínimo 6 caracteres"
                          required
                          minLength={6}
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Telefone
                    </label>
                    <input
                      type="text"
                      placeholder="(00) 00000-0000"
                      value={formData.telefone}
                      onChange={(e) =>
                        setFormData({ ...formData, telefone: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Empresa
                    </label>
                    <input
                      type="text"
                      placeholder="Nome da Startup/Empresa"
                      value={formData.nomeEmpresa}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nomeEmpresa: e.target.value,
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Nível de Permissão
                  </label>
                  <div className="relative">
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-teal transition-all text-gray-900 appearance-none shadow-sm cursor-pointer"
                    >
                      <option value="user">Usuário (Membro)</option>
                      <option value="editor">Editor (Apenas Conteúdo)</option>
                      <option value="admin">Administrador (Total)</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full bg-brand-teal hover:bg-brand-teal/90 text-white font-black uppercase text-[10px] tracking-widest py-5 rounded-2xl transition-all shadow-xl shadow-brand-teal/20 disabled:opacity-50"
                >
                  {creating
                    ? "Processando..."
                    : editingUser
                      ? "Atualizar Membro"
                      : "Criar e Conceder Acesso"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tabela Customizada */}
      <div className="bg-white border border-gray-100 rounded-[40px] shadow-xl overflow-x-auto relative z-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-8 px-10 font-black uppercase text-[10px] tracking-[0.3em] text-gray-400">
                Usuário
              </th>
              <th className="py-8 px-6 font-black uppercase text-[10px] tracking-[0.3em] text-gray-400">
                Email
              </th>
              <th className="py-8 px-6 font-black uppercase text-[10px] tracking-[0.3em] text-gray-400">
                Permissão
              </th>
              <th className="py-8 px-6 font-black uppercase text-[10px] tracking-[0.3em] text-gray-400">
                Desde
              </th>
              <th className="py-8 px-10 font-black uppercase text-[10px] tracking-[0.3em] text-gray-400 text-right">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-24 text-center text-gray-400 animate-pulse font-black uppercase tracking-widest text-sm"
                >
                  Carregando usuários...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-32 text-center text-gray-400 font-black uppercase tracking-widest text-sm italic"
                >
                  Nenhum usuário secundário encontrado.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="py-8 px-10">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-teal font-black text-xl italic shadow-sm border border-brand-teal/10">
                        {user.name?.charAt(0) ||
                          user.email.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-black text-gray-900 text-lg tracking-wide italic uppercase">
                        {user.name || "Sem nome"}
                      </span>
                    </div>
                  </td>
                  <td className="py-8 px-6 text-gray-500 font-medium">
                    {user.email}
                  </td>
                  <td className="py-8 px-6">
                    <span
                      className={`inline-flex items-center px-4 py-1.5 rounded-full uppercase text-[8px] font-black tracking-widest border ${user.role === "admin" ? "bg-brand-teal/10 text-brand-teal border-brand-teal/20" : "bg-gray-50 text-gray-400 border-gray-100"}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-8 px-6 text-gray-400 text-[10px] font-black uppercase tracking-widest italic">
                    {typeof user.createdAt === "string"
                      ? new Date(user.createdAt).toLocaleDateString()
                      : (user.createdAt?.toDate().toLocaleDateString() ??
                        "N/A")}
                  </td>
                  <td className="py-8 px-10 text-right">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => openEdit(user)}
                        className="p-3 bg-gray-50 text-gray-400 hover:text-brand-teal hover:bg-brand-teal/5 rounded-2xl shadow-sm transition-all"
                        title="Editar perfil"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        disabled={
                          user.email === "adm@ninnahub.com.br" ||
                          user.email === "ninnaventures@gmail.com"
                        }
                        className="p-3 bg-gray-50 text-gray-400 hover:text-white hover:bg-red-500 rounded-2xl shadow-sm transition-all disabled:opacity-30 disabled:hover:bg-gray-50 disabled:hover:text-gray-400"
                        title="Remover produto"
                      >
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

export default AdminUsuarios;
