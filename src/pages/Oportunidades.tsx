import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Briefcase, Calendar, Rocket, ArrowRight, ExternalLink, Zap } from 'lucide-react';

const Oportunidades = () => {
  const [oportunidades, setOportunidades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOportunidades = async () => {
      try {
        const q = query(
          collection(db, 'oportunidades'), 
          where('status', '==', 'ativo'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        setOportunidades(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOportunidades();
  }, []);

  const getTypeStyle = (tipo: string) => {
    switch (tipo) {
      case 'investimento': return 'bg-brand-teal text-white border-brand-teal/20';
      case 'edital': return 'bg-brand-teal/10 text-brand-teal border-brand-teal/20';
      case 'parceria': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  return (
    <div className="pb-32 bg-[#fafafa] min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32 border-b border-gray-100">
        <div className="absolute top-1/2 left-0 w-32 h-[400px] bg-brand-teal/5 -translate-y-1/2 -skew-x-12 z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/5 blur-[120px] rounded-full -mr-40 -mt-40 z-10 pointer-events-none" />
        
        {/* Low opacity background image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#fafafa]/85 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2000" 
            alt="Business Growth Opportunity" 
            className="w-full h-full object-cover grayscale scale-110 opacity-70"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#fafafa] to-transparent z-20" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="inline-block px-4 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              Dealflow & Growth
            </div>
            <h1 className="text-7xl md:text-[120px] font-black mb-8 uppercase tracking-tighter leading-[0.85] text-gray-900 ">
              OPORTU<br /><span className="gradient-text">NIDADES</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed border-t border-gray-200 pt-8 mt-8 font-medium">
              Acesso exclusivo a editais, investimentos e parcerias estratégicas para acelerar o crescimento da sua startup no ecossistema NINNA.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-100 h-80 animate-pulse rounded-[40px]" />
              ))}
            </div>
          ) : oportunidades.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[40px] border border-gray-100 p-20 shadow-xl">
              <Zap className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-gray-400 uppercase tracking-tight ">Nenhuma oportunidade aberta</h3>
              <p className="text-gray-500 font-medium">Novas chamadas e editais serão publicados em breve. Fique atento!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {oportunidades.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-10 md:p-14 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 flex flex-col h-full rounded-[40px] shadow-lg"
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getTypeStyle(item.tipo)}`}>
                      {item.tipo}
                    </div>
                    {item.destaque && (
                       <div className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
                    )}
                  </div>

                  <h3 className="text-3xl md:text-4xl font-black mb-6 group-hover:text-brand-teal transition-colors text-gray-900 uppercase tracking-tighter  leading-[0.9]">{item.titulo}</h3>
                  <p className="text-gray-500 mb-10 leading-relaxed text-lg font-medium flex-grow">
                    {item.descricao}
                  </p>

                  <div className="pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Prazo de Inscrição</span>
                      <div className="flex items-center text-gray-900 font-bold">
                        <Calendar className="w-4 h-4 mr-2 text-brand-teal" />
                        {item.dataLimite ? new Date(item.dataLimite).toLocaleDateString('pt-BR') : 'A fluxo contínuo'}
                      </div>
                    </div>
                    
                    {item.linkExterno && (
                      <a 
                        href={item.linkExterno} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto btn-primary flex items-center justify-center !px-8 shadow-lg shadow-brand-teal/20"
                      >
                        Quero saber mais <ExternalLink className="ml-2 w-5 h-5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Corporate Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-12 md:p-20 relative overflow-hidden border border-gray-100 rounded-[60px] shadow-2xl">
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-teal/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 uppercase tracking-tighter ">SUA EMPRESA QUER <br /><span className="text-brand-teal">LANÇAR UM EDITAL?</span></h2>
                <p className="text-gray-500 text-lg font-medium mb-10 max-w-lg leading-relaxed">
                  Conectamos os desafios da sua corporação com as melhores soluções do mercado através de chamadas personalizadas e curadoria especializada.
                </p>
                <button className="flex items-center text-brand-teal font-black uppercase text-sm tracking-widest hover:underline group">
                  Falar com nosso time de Inovação Aberta <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-8 bg-gray-50 border border-gray-100 rounded-3xl">
                  <div className="text-brand-teal font-black text-4xl mb-2  tracking-tighter">+20</div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Editais Lançados</div>
                </div>
                <div className="p-8 bg-gray-50 border border-gray-100 rounded-3xl">
                  <div className="text-brand-teal font-black text-4xl mb-2  tracking-tighter">R$5M</div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Em Investimentos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Oportunidades;
