import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, ArrowLeft, ArrowRight, ExternalLink, Rocket, Building2, Zap, X } from 'lucide-react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

const Cases = () => {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<any>(null);

  useEffect(() => {
    const fetchCases = async () => {
      const path = 'cases';
      try {
        const q = query(
          collection(db, path),
          where('status', '==', 'ativo'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        setCases(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, path);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  return (
    <div className="pb-32 bg-[#fafafa] min-h-screen">
      {/* Header */}
      <section className="relative py-24 overflow-hidden border-b border-gray-100">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-brand-teal/5 blur-[120px] rounded-full z-10 pointer-events-none" />
        
        {/* Low opacity background image with slightly increased opacity and visibility */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#fafafa]/85 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000" 
            alt="Corporate Success Stories" 
            className="w-full h-full object-cover grayscale scale-110 opacity-70"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#fafafa] to-transparent z-20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <Link 
            to="/empresas" 
            className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-brand-teal transition-colors mb-12 group"
          >
            <ArrowLeft className="mr-3 w-4 h-4 group-hover:-translate-x-2 transition-transform" />
            Voltar para Empresas
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="inline-block px-4 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                Success Stories
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-0 uppercase tracking-wide leading-[0.85] text-gray-900 ">
                HISTÓRIAS DE <br /><span className="gradient-text">SUCESSO</span>
              </h1>
            </div>
            <p className="text-xl text-gray-500 max-w-md font-medium leading-relaxed ">
              Resultados reais gerados através da conexão entre grandes empresas e startups no ecossistema NINNA.
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-[40px] h-96 animate-pulse border border-gray-100 shadow-xl" />
              ))}
            </div>
          ) : cases.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[60px] border border-gray-100 shadow-2xl">
              <FileText className="w-16 h-16 text-gray-200 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-wide ">Nenhuma história registrada ainda</h3>
              <p className="text-gray-500 mt-2 font-medium">Estamos preparando grandes novidades para você.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cases.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => setSelectedCase(item)}
                  className="group bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={item.imagem || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"} 
                      alt={item.titulo} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-60" />
                    <div className="absolute top-6 left-6">
                      <div className="px-3 py-1 bg-brand-teal text-white text-[8px] font-black uppercase tracking-widest rounded shadow-lg ">
                        {item.cliente}
                      </div>
                    </div>
                  </div>
                  <div className="p-10">
                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-wide  leading-none mb-4 group-hover:text-brand-teal transition-colors">
                      {item.titulo}
                    </h3>
                    <p className="text-gray-500 font-medium line-clamp-3 mb-8 ">
                      {item.resumo}
                    </p>
                    <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-brand-teal group-hover:translate-x-2 transition-transform">
                      Ver Case Completo <ArrowRight className="ml-3 w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCase && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCase(null)}
              className="absolute inset-0 bg-gray-900/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[60px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedCase(null)}
                className="absolute top-8 right-8 z-20 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-brand-teal transition-all shadow-xl"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                <img 
                  src={selectedCase.imagem || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"} 
                  alt={selectedCase.titulo} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-teal/20" />
              </div>

              <div className="p-10 md:p-16 flex-grow overflow-y-auto">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-teal ">{selectedCase.cliente}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-200" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ">Case de Sucesso</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-wide  leading-[0.9] mb-10">
                  {selectedCase.titulo}
                </h2>

                <div className="prose prose-gray max-w-none mb-12">
                  <p className="text-xl text-gray-600 font-medium  border-l-4 border-brand-teal pl-8 mb-10 leading-relaxed">
                    {selectedCase.resumo}
                  </p>
                  <div className="text-gray-500 font-medium leading-relaxed whitespace-pre-wrap">
                    {selectedCase.conteudo}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-10 border-t border-gray-100">
                  <button 
                    onClick={() => setSelectedCase(null)}
                    className="px-8 py-4 rounded-xl border border-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all font-sans"
                  >
                    Fechar Detalhes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cases;
