import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import type { Popup } from "../pages/Admin/DashboardPopups"; // ajuste o caminho

const chaveVisto = (id: string) => `popup_visto_${id}`;

const jaFoiVisto = (p: Popup) => {
  try {
    if (p.frequencia === "uma_vez")
      return !!localStorage.getItem(chaveVisto(p.id!));
    if (p.frequencia === "sessao")
      return !!sessionStorage.getItem(chaveVisto(p.id!));
  } catch {}
  return false;
};

const marcarVisto = (p: Popup) => {
  try {
    if (p.frequencia === "uma_vez")
      localStorage.setItem(chaveVisto(p.id!), "1");
    if (p.frequencia === "sessao")
      sessionStorage.setItem(chaveVisto(p.id!), "1");
  } catch {}
};

const HomePopup = () => {
  const [popup, setPopup] = useState<Popup | null>(null);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    (async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "popups"), where("ativo", "==", true)),
        );
        const hoje = new Date().toISOString().slice(0, 10);
        const elegivel = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }) as Popup)
          .filter(
            (p) =>
              (!p.dataInicio || hoje >= p.dataInicio) &&
              (!p.dataFim || hoje <= p.dataFim) &&
              !jaFoiVisto(p),
          )
          .sort((a, b) => (a.prioridade ?? 99) - (b.prioridade ?? 99))[0];

        if (elegivel) {
          setPopup(elegivel);
          timer = setTimeout(
            () => {
              setAberto(true);
              marcarVisto(elegivel);
            },
            (elegivel.atraso ?? 0) * 1000,
          );
        }
      } catch (error) {
        console.error("Erro ao carregar pop-up:", error);
      }
    })();

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aberto]);

  if (!popup) return null;

  const linkExterno = /^https?:\/\//.test(popup.botaoLink);

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          className="fixed inset-0 z-[100] bg-gray-900/70 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setAberto(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-popup-titulo"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[32px] overflow-hidden shadow-2xl w-full max-w-md relative"
          >
            <button
              onClick={() => setAberto(false)}
              aria-label="Fechar"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-brand-teal hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {popup.imagem && (
              <img
                src={popup.imagem}
                alt=""
                className="w-full aspect-video object-cover"
                referrerPolicy="no-referrer"
              />
            )}

            <div className="p-8 text-center">
              <h3
                id="home-popup-titulo"
                className="text-2xl font-black text-gray-900 uppercase tracking-wide italic leading-tight mb-3"
              >
                {popup.titulo}
              </h3>
              {popup.mensagem && (
                <p className="text-gray-500 font-medium text-sm whitespace-pre-line mb-6">
                  {popup.mensagem}
                </p>
              )}
              {popup.botaoTexto && popup.botaoLink && (
                <a
                  href={popup.botaoLink}
                  target={linkExterno ? "_blank" : undefined}
                  rel={linkExterno ? "noopener noreferrer" : undefined}
                  onClick={() => setAberto(false)}
                  className="inline-flex bg-brand-darker text-white font-black uppercase text-[10px] tracking-widest rounded-2xl px-8 py-4 hover:bg-brand-teal transition-all"
                >
                  {popup.botaoTexto}
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HomePopup;
