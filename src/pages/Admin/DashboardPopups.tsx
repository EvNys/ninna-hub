import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  EyeOff,
  Megaphone,
  Calendar,
  Repeat,
  Loader2,
  ImageIcon,
  ExternalLink,
} from "lucide-react";

export type Frequencia = "sempre" | "sessao" | "uma_vez";

export interface Popup {
  id?: string;
  titulo: string;
  mensagem: string;
  imagem: string;
  botaoTexto: string;
  botaoLink: string;
  ativo: boolean;
  prioridade: number;
  dataInicio: string; // yyyy-mm-dd (vazio = sem início)
  dataFim: string; // yyyy-mm-dd (vazio = sem fim)
  frequencia: Frequencia;
  atraso: number; // segundos até abrir
}

const POPUP_VAZIO: Popup = {
  titulo: "",
  mensagem: "",
  imagem: "",
  botaoTexto: "",
  botaoLink: "",
  ativo: false,
  prioridade: 1,
  dataInicio: "",
  dataFim: "",
  frequencia: "sessao",
  atraso: 1,
};

const FREQUENCIA_LABEL: Record<Frequencia, string> = {
  sempre: "Toda visita",
  sessao: "Uma vez por sessão",
  uma_vez: "Só uma vez",
};

const logError = (error: any, operationType: string, path: string) =>
  console.error(
    "Firestore Error:",
    JSON.stringify({
      error: error.message,
      operationType,
      path,
      authInfo: {
        email: auth.currentUser?.email,
        uid: auth.currentUser?.uid,
      },
    }),
  );

const formatData = (d: string) => (d ? d.split("-").reverse().join("/") : "—");

const statusDoPopup = (p: Popup) => {
  if (!p.ativo) return { label: "Inativo", cor: "bg-gray-100 text-gray-400" };
  const hoje = new Date().toISOString().slice(0, 10);
  if (p.dataInicio && hoje < p.dataInicio)
    return { label: "Agendado", cor: "bg-amber-50 text-amber-500" };
  if (p.dataFim && hoje > p.dataFim)
    return { label: "Expirado", cor: "bg-red-50 text-red-400" };
  return { label: "No ar", cor: "bg-brand-teal/10 text-brand-teal" };
};

/* ---------- Preview (mesmo visual do pop-up da home) ---------- */
const PopupPreview = ({ popup }: { popup: Popup }) => (
  <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl w-full max-w-sm mx-auto">
    {popup.imagem ? (
      <img
        src={popup.imagem}
        alt=""
        className="w-full aspect-video object-cover"
        referrerPolicy="no-referrer"
      />
    ) : (
      <div className="w-full aspect-video bg-gray-50 flex items-center justify-center">
        <ImageIcon className="w-12 h-12 text-gray-200" />
      </div>
    )}
    <div className="p-8 text-center">
      <h3 className="text-2xl font-black text-gray-900 uppercase tracking-wide italic leading-tight mb-3">
        {popup.titulo || "Título do pop-up"}
      </h3>
      <p className="text-gray-500 font-medium text-sm whitespace-pre-line mb-6">
        {popup.mensagem || "A mensagem aparece aqui."}
      </p>
      {popup.botaoTexto && (
        <span className="inline-flex bg-brand-darker text-white font-black uppercase text-[10px] tracking-widest rounded-2xl px-8 py-4">
          {popup.botaoTexto}
        </span>
      )}
    </div>
  </div>
);

/* ---------- Campos reutilizáveis ---------- */
const inputCls =
  "w-full bg-[#fafafa] border border-gray-100 rounded-[16px] px-5 py-4 focus:outline-none focus:border-brand-teal font-medium text-sm";

const Campo = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
      {label}
    </span>
    {children}
  </label>
);

/* ---------- Página ---------- */
const DashboardPopups = () => {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editando, setEditando] = useState<Popup | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState("");
  const [confirmarExclusao, setConfirmarExclusao] = useState<Popup | null>(
    null,
  );

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    try {
      const q = query(collection(db, "popups"), orderBy("prioridade", "asc"));
      const snap = await getDocs(q);
      setPopups(
        snap.docs.map(
          (d) => ({ ...POPUP_VAZIO, id: d.id, ...d.data() }) as Popup,
        ),
      );
    } catch (error: any) {
      logError(error, "list", "popups");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(
    () =>
      popups.filter(
        (p) =>
          p.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.mensagem?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [popups, searchTerm],
  );

  const noAr = popups.filter((p) => statusDoPopup(p).label === "No ar").length;

  const set = <K extends keyof Popup>(campo: K, valor: Popup[K]) =>
    setEditando((prev) => (prev ? { ...prev, [campo]: valor } : prev));

  const salvar = async () => {
    if (!editando) return;
    if (!editando.titulo.trim()) return setErroForm("Dê um título ao pop-up.");
    if (editando.botaoTexto && !editando.botaoLink)
      return setErroForm("O botão precisa de um link de destino.");
    if (
      editando.dataInicio &&
      editando.dataFim &&
      editando.dataFim < editando.dataInicio
    )
      return setErroForm("A data de fim precisa ser depois da data de início.");

    setErroForm("");
    setSalvando(true);
    const { id, ...dados } = editando;
    try {
      if (id) {
        await updateDoc(doc(db, "popups", id), {
          ...dados,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "popups"), {
          ...dados,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      setEditando(null);
      await fetchPopups();
    } catch (error: any) {
      logError(error, id ? "update" : "create", "popups");
      setErroForm("Não foi possível salvar. Verifique sua permissão de admin.");
    } finally {
      setSalvando(false);
    }
  };

  const alternarAtivo = async (p: Popup) => {
    if (!p.id) return;
    setPopups((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, ativo: !x.ativo } : x)),
    );
    try {
      await updateDoc(doc(db, "popups", p.id), {
        ativo: !p.ativo,
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      logError(error, "update", `popups/${p.id}`);
      fetchPopups();
    }
  };

  const excluir = async () => {
    if (!confirmarExclusao?.id) return;
    const id = confirmarExclusao.id;
    setConfirmarExclusao(null);
    try {
      await deleteDoc(doc(db, "popups", id));
      setPopups((prev) => prev.filter((p) => p.id !== id));
    } catch (error: any) {
      logError(error, "delete", `popups/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero */}
      <section className="bg-brand-darker py-24 px-8 rounded-[40px] m-4 md:m-8 overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal opacity-10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-4xl">
          <h2 className="text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] mb-4">
            Comunicação
          </h2>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-wide italic leading-none mb-6">
            GESTÃO DE <span className="gradient-text">POP-UPS</span>
          </h1>
          <p className="text-gray-400 font-medium text-lg italic">
            Crie avisos que aparecem para quem abre a home. Defina período,
            frequência e prioridade de cada um.
          </p>
        </div>
      </section>

      <section className="px-4 md:px-8 pb-32">
        <div className="max-w-7xl mx-auto">
          {/* Barra de ações */}
          <div className="mb-12 flex flex-col md:flex-row gap-6 items-stretch md:items-center">
            <div className="relative flex-grow group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-teal" />
              <input
                placeholder="Buscar por título ou mensagem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-[20px] pl-14 pr-6 py-5 focus:outline-none focus:border-brand-teal font-medium shadow-xl shadow-gray-200/50"
              />
            </div>
            <div className="bg-white px-8 py-5 rounded-[20px] border border-gray-100 flex items-center gap-3 text-brand-teal font-black uppercase text-[10px] tracking-widest shadow-xl shadow-gray-200/50">
              <Megaphone className="w-5 h-5" /> {noAr} No ar · {popups.length}{" "}
              Total
            </div>
            <button
              onClick={() => {
                setErroForm("");
                setEditando({
                  ...POPUP_VAZIO,
                  prioridade: popups.length + 1,
                });
              }}
              className="bg-brand-darker text-white px-8 py-5 rounded-[20px] flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-gray-200/50 hover:bg-brand-teal transition-all"
            >
              <Plus className="w-5 h-5" /> Novo pop-up
            </button>
          </div>

          {/* Lista */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-[4/5] bg-white animate-pulse rounded-[40px] border border-gray-100"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl p-16 text-center">
              <Megaphone className="w-16 h-16 text-gray-200 mx-auto mb-6" />
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-wide italic mb-2">
                {searchTerm ? "Nada encontrado" : "Nenhum pop-up criado"}
              </h3>
              <p className="text-gray-400 font-medium">
                {searchTerm
                  ? "Tente outro termo de busca."
                  : "Clique em “Novo pop-up” para criar o primeiro aviso da home."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((popup, i) => {
                const status = statusDoPopup(popup);
                return (
                  <motion.div
                    key={popup.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (i % 3) * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-xl group hover:shadow-2xl transition-all flex flex-col"
                  >
                    <div className="aspect-video relative overflow-hidden bg-gray-50">
                      {popup.imagem ? (
                        <img
                          src={popup.imagem}
                          alt={popup.titulo}
                          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${popup.ativo ? "" : "grayscale"}`}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Megaphone className="w-16 h-16 text-gray-200" />
                        </div>
                      )}
                      <span
                        className={`absolute top-5 left-5 px-4 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest backdrop-blur-sm ${status.cor}`}
                      >
                        {status.label}
                      </span>
                      <span className="absolute top-5 right-5 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center font-black text-gray-900 text-sm italic">
                        #{popup.prioridade}
                      </span>
                    </div>

                    <div className="p-8 flex-grow flex flex-col">
                      <h3 className="text-xl font-black text-gray-900 uppercase tracking-wide italic mb-2 line-clamp-2">
                        {popup.titulo}
                      </h3>
                      <p className="text-gray-400 font-medium text-sm line-clamp-2 mb-6">
                        {popup.mensagem}
                      </p>

                      <div className="space-y-2 mb-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <p className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-brand-teal" />
                          {formatData(popup.dataInicio)} até{" "}
                          {formatData(popup.dataFim)}
                        </p>
                        <p className="flex items-center gap-2">
                          <Repeat className="w-4 h-4 text-brand-teal" />
                          {FREQUENCIA_LABEL[popup.frequencia]}
                        </p>
                        {popup.botaoLink && (
                          <p className="flex items-center gap-2 truncate">
                            <ExternalLink className="w-4 h-4 text-brand-teal shrink-0" />
                            <span className="truncate normal-case tracking-normal font-bold">
                              {popup.botaoLink}
                            </span>
                          </p>
                        )}
                      </div>

                      <div className="flex gap-3 mt-auto">
                        <button
                          onClick={() => alternarAtivo(popup)}
                          title={popup.ativo ? "Desativar" : "Ativar"}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${popup.ativo ? "bg-brand-teal text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}
                        >
                          {popup.ativo ? (
                            <Eye className="w-5 h-5" />
                          ) : (
                            <EyeOff className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setErroForm("");
                            setEditando({ ...popup });
                          }}
                          className="flex-grow bg-gray-900 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-teal transition-all"
                        >
                          <Pencil className="w-4 h-4" /> Editar
                        </button>
                        <button
                          onClick={() => setConfirmarExclusao(popup)}
                          title="Excluir"
                          className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Modal de edição */}
      <AnimatePresence>
        {editando && (
          <motion.div
            className="fixed inset-0 z-50 bg-gray-900/70 backdrop-blur-sm flex items-start md:items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !salvando && setEditando(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[40px] w-full max-w-6xl shadow-2xl overflow-hidden grid lg:grid-cols-[1fr_420px] my-8"
            >
              {/* Formulário */}
              <div className="p-8 md:p-12">
                <div className="flex items-start justify-between mb-10">
                  <div>
                    <h2 className="text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] mb-2">
                      {editando.id ? "Editar" : "Novo"}
                    </h2>
                    <h3 className="text-3xl font-black text-gray-900 uppercase tracking-wide italic leading-none">
                      Pop-up da home
                    </h3>
                  </div>
                  <button
                    onClick={() => setEditando(null)}
                    className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  <Campo label="Título *">
                    <input
                      className={inputCls}
                      value={editando.titulo}
                      onChange={(e) => set("titulo", e.target.value)}
                      placeholder="Ex.: Inscrições abertas para o Demo Day"
                    />
                  </Campo>

                  <Campo label="Mensagem">
                    <textarea
                      className={`${inputCls} min-h-[120px] resize-y`}
                      value={editando.mensagem}
                      onChange={(e) => set("mensagem", e.target.value)}
                      placeholder="Texto que aparece abaixo do título."
                    />
                  </Campo>

                  <Campo label="URL da imagem">
                    <input
                      className={inputCls}
                      value={editando.imagem}
                      onChange={(e) => set("imagem", e.target.value)}
                      placeholder="https://..."
                    />
                  </Campo>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <Campo label="Texto do botão">
                      <input
                        className={inputCls}
                        value={editando.botaoTexto}
                        onChange={(e) => set("botaoTexto", e.target.value)}
                        placeholder="Ex.: Quero me inscrever"
                      />
                    </Campo>
                    <Campo label="Link do botão">
                      <input
                        className={inputCls}
                        value={editando.botaoLink}
                        onChange={(e) => set("botaoLink", e.target.value)}
                        placeholder="https://... ou /pagina"
                      />
                    </Campo>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <Campo label="Exibir a partir de">
                      <input
                        type="date"
                        className={inputCls}
                        value={editando.dataInicio}
                        onChange={(e) => set("dataInicio", e.target.value)}
                      />
                    </Campo>
                    <Campo label="Exibir até">
                      <input
                        type="date"
                        className={inputCls}
                        value={editando.dataFim}
                        onChange={(e) => set("dataFim", e.target.value)}
                      />
                    </Campo>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-6">
                    <Campo label="Frequência">
                      <select
                        className={inputCls}
                        value={editando.frequencia}
                        onChange={(e) =>
                          set("frequencia", e.target.value as Frequencia)
                        }
                      >
                        {Object.entries(FREQUENCIA_LABEL).map(([v, l]) => (
                          <option key={v} value={v}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </Campo>
                    <Campo label="Abrir após (seg)">
                      <input
                        type="number"
                        min={0}
                        className={inputCls}
                        value={editando.atraso}
                        onChange={(e) =>
                          set("atraso", Math.max(0, Number(e.target.value)))
                        }
                      />
                    </Campo>
                    <Campo label="Prioridade">
                      <input
                        type="number"
                        min={1}
                        className={inputCls}
                        value={editando.prioridade}
                        onChange={(e) =>
                          set("prioridade", Math.max(1, Number(e.target.value)))
                        }
                      />
                    </Campo>
                  </div>

                  <button
                    type="button"
                    onClick={() => set("ativo", !editando.ativo)}
                    className="flex items-center gap-4"
                  >
                    <span
                      className={`w-14 h-8 rounded-full p-1 transition-all ${editando.ativo ? "bg-brand-teal" : "bg-gray-200"}`}
                    >
                      <span
                        className={`block w-6 h-6 rounded-full bg-white shadow transition-transform ${editando.ativo ? "translate-x-6" : ""}`}
                      />
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      {editando.ativo
                        ? "Ativo na home"
                        : "Salvar como rascunho"}
                    </span>
                  </button>

                  {erroForm && (
                    <p className="text-red-500 font-bold text-sm">{erroForm}</p>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setEditando(null)}
                      disabled={salvando}
                      className="px-8 py-5 rounded-[20px] bg-gray-100 text-gray-500 font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={salvar}
                      disabled={salvando}
                      className="flex-grow px-8 py-5 rounded-[20px] bg-brand-darker text-white font-black uppercase text-[10px] tracking-widest hover:bg-brand-teal transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {salvando && <Loader2 className="w-4 h-4 animate-spin" />}
                      {editando.id ? "Salvar alterações" : "Criar pop-up"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-brand-darker p-8 md:p-12 flex flex-col relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-teal opacity-10 blur-[100px] translate-y-1/2 -translate-x-1/2" />
                <h4 className="text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] mb-8">
                  Pré-visualização
                </h4>
                <div className="flex-grow flex items-center">
                  <PopupPreview popup={editando} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmação de exclusão */}
      <AnimatePresence>
        {confirmarExclusao && (
          <motion.div
            className="fixed inset-0 z-50 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmarExclusao(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[40px] p-10 max-w-md w-full text-center shadow-2xl"
            >
              <Trash2 className="w-12 h-12 text-red-400 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-wide italic mb-2">
                Excluir pop-up?
              </h3>
              <p className="text-gray-400 font-medium mb-8">
                “{confirmarExclusao.titulo}” será removido de vez. Para só tirar
                da home, desative-o.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setConfirmarExclusao(null)}
                  className="flex-1 py-5 rounded-[20px] bg-gray-100 text-gray-500 font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={excluir}
                  className="flex-1 py-5 rounded-[20px] bg-red-500 text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-600 transition-all"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPopups;
