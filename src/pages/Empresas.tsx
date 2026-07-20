import { motion } from 'motion/react';
import { Target, Zap, Users, ShieldCheck, ArrowRight, BarChart3, Globe, Rocket, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Empresas = () => {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const q = query(
          collection(db, 'parceiros'),
          where('status', '==', 'ativo'),
          orderBy('nome', 'asc')
        );
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => {
          const data = doc.data();
          let logoUrl = data.logo;
          
          if (
            (data.nome && data.nome.toLowerCase().includes('igc')) ||
            (data.logo && data.logo.toLowerCase().includes('igc'))
          ) {
            logoUrl = '/Imagens_NINNA/IGCLogo.png';
          } else if (
            (data.nome && data.nome.toLowerCase().includes('uece')) ||
            (data.logo && data.logo.toLowerCase().includes('uece'))
          ) {
            logoUrl = '/Imagens_NINNA/UECE.png';
          }
          return { id: doc.id, ...data, logo: logoUrl } as any;
        });

        const seen = new Set<string>();
        const finalPartners: any[] = [];

        fetched.forEach(partner => {
          const nameLower = partner.nome?.toLowerCase() || '';
          let groupKey = nameLower;

          if (nameLower.includes('uece') || nameLower.includes('universidade estadual')) {
            groupKey = 'uece';
            partner.nome = 'UECE';
            partner.logo = '/Imagens_NINNA/Uece.png';
          } else if (nameLower.includes('igc') || nameLower.includes('gestão e cidadania') || nameLower.includes('gestao e cidadania')) {
            groupKey = 'igc';
            partner.nome = 'Instituto de Gestão e Cidadania';
            partner.logo = '/Imagens_NINNA/IGCLogo.png';
          }

          if (partner.nome === 'IGC') {
            return;
          }

          if (!seen.has(groupKey)) {
            seen.add(groupKey);
            finalPartners.push(partner);
          }
        });

        setPartners(finalPartners);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  const services = [
    {
      title: 'Inovação Aberta',
      description: 'Conectamos os desafios da sua empresa às melhores soluções do ecossistema de startups.',
      icon: <Zap className="w-8 h-8 text-brand-orange" />
    },
    {
      title: 'Corporate Venture',
      description: 'Apoiamos a estruturação de teses de investimento e aproximação com startups estratégicas.',
      icon: <BarChart3 className="w-8 h-8 text-brand-purple" />
    },
    {
      title: 'Cultura de Inovação',
      description: 'Programas de intraempreendedorismo e workshops para transformar o mindset do seu time.',
      icon: <Users className="w-8 h-8 text-brand-green" />
    },
    {
      title: 'Conexões Estratégicas',
      description: 'Acesso privilegiado a uma rede de atores, especialistas e outras grandes corporações.',
      icon: <Globe className="w-8 h-8 text-blue-500" />
    }
  ];

  return (
    <div className="pb-32 bg-[#fafafa]">
      {/* Hero */}
      <section className="relative py-32 overflow-hidden border-b border-gray-100">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-[#00c9a7]/5 blur-[120px] rounded-full z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-[#00c9a7]/5 blur-[120px] rounded-full z-10 pointer-events-none" />
        
        {/* Low opacity background image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#fafafa]/85 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" 
            alt="Corporate Atmosphere" 
            className="w-full h-full object-cover grayscale scale-110 opacity-70"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#fafafa] to-transparent z-20" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="px-4 py-1 rounded-full bg-[#00c9a7]/10 text-[#00c9a7] text-[10px] font-black uppercase tracking-[0.3em] mb-8 inline-block">
                Corporate Innovation
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.85] text-gray-900 uppercase tracking-wide">
                IMPULSIONE SUA <br /><span className="gradient-text">ESTRATÉGIA</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-xl font-medium">
                Ajudamos grandes empresas a navegar na complexidade da inovação, gerando eficiência, novos modelos de negócio e impacto real.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <a
                  href="https://wa.me/558532114201?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20a%20equipe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#00c9a7] text-white px-8 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#00c9a7]/20">
                  Falar com Especialista
                </a>
                <Link 
                  to="/cases"
                  className="px-8 py-5 rounded-2xl border-2 border-gray-900 bg-white hover:bg-gray-900 hover:text-white transition-all font-black uppercase text-sm tracking-widest text-gray-900 inline-block text-center hover:scale-105 active:scale-95 shadow-lg shadow-black/5"
                >
                  Ver Cases
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="bg-white p-4 relative z-10 rounded-[40px] overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-700 shadow-2xl border border-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200" 
                  alt="Corporate Innovation" 
                  className="rounded-[30px] w-full h-auto grayscale hover:grayscale-0 transition-all duration-700 object-cover aspect-video"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#00c9a7]/10 blur-3xl rounded-full -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Showcase (Vitrine) */}
      <section className="py-32 border-b border-gray-100 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-wide">empresas que acreditam no <span className="text-[#00c9a7] underline decoration-gray-200">NINNA</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto font-medium">
              Conheça as corporações que acreditam e investem no NINNA Hub como motor de transformação e inovação.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {loading ? (
              Array(10).fill(0).map((_, i) => (
                <div key={i} className="h-40 rounded-3xl bg-gray-50 animate-pulse border border-gray-100" />
              ))
            ) : partners.length === 0 ? (
              <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">
                Nenhum parceiro cadastrado no momento.
              </div>
            ) : (
              partners.map((partner, index) => (
                <motion.a
                  key={partner.id}
                  href={partner.site || '#'}
                  target={partner.site ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="group relative h-48 bg-white border border-gray-100 rounded-3xl flex items-center justify-center p-8 hover:bg-gray-50 hover:border-[#00c9a7]/30 hover:shadow-xl transition-all overflow-hidden"
                >
                  {partner.logo ? (
                    <img 
                      src={partner.logo} 
                      alt={partner.nome} 
                      className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 scale-90 group-hover:scale-100" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <Building2 className="w-10 h-10 text-gray-300 group-hover:text-[#00c9a7] transition-colors mb-2" />
                      <span className="font-extrabold text-[#1a1a1a] text-[10px] uppercase tracking-wider block">{partner.nome}</span>
                    </div>
                  )}
                </motion.a>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32 bg-[#050911] relative overflow-hidden text-white" id="como-apoiamos-jornada-section">
        {/* Background Image with Dark Gradients */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000" 
            alt="Corporate Journey Background" 
            className="w-full h-full object-cover opacity-10 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17] via-[#050911]/95 to-[#0a0e17] z-10" />
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#00c9a7]/10 blur-[130px] rounded-full z-15" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-green/10 blur-[130px] rounded-full z-15" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="text-center mb-24">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#00c9a7]/10 border border-[#00c9a7]/20 text-[#00c9a7] text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              Nossas Soluções
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-wide leading-none">Como apoiamos sua <br />
              <span className="font-black bg-gradient-to-r from-[#00C9B1] to-[#00c9a7] bg-clip-text text-transparent">
                Jornada Corporativa
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const borderColorsGlow = [
                "group-hover:border-[#00c9a7]/40 hover:shadow-[#00c9a7]/10",
                "group-hover:border-[#0ae2b1]/40 hover:shadow-[#0ae2b1]/10",
                "group-hover:border-brand-green/40 hover:shadow-brand-green/10",
                "group-hover:border-blue-400/40 hover:shadow-blue-400/10"
              ][index % 4];

              const iconBgColors = [
                "bg-brand-orange/5 text-brand-orange border border-brand-orange/15",
                "bg-brand-purple/5 text-brand-purple border border-brand-purple/15",
                "bg-brand-green/5 text-brand-green border border-brand-green/15",
                "bg-blue-500/5 text-blue-400 border border-blue-500/15"
              ][index % 4];

              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className={`bg-white/[0.03] backdrop-blur-md border border-white/10 p-12 transition-all duration-500 flex flex-col md:flex-row gap-8 items-start rounded-[40px] shadow-2xl group ${borderColorsGlow}`}
                  id={`service-corporate-card-${index}`}
                >
                  <div className={`p-6 rounded-3xl shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-md ${iconBgColors}`}>
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-wide group-hover:text-[#00c9a7] transition-colors">{service.title}</h3>
                    <p className="text-white/60 leading-relaxed mb-8 font-barlow group-hover:text-white/80 transition-colors">
                      {service.description}
                    </p>
                    <button className="text-xs font-black text-[#00c9a7] flex items-center hover:translate-x-2 transition-transform uppercase tracking-[0.2em] cursor-pointer">
                      Saiba mais <ArrowRight className="ml-2 w-4 h-4 text-[#b5ff53]" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA / Proposal */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-12 md:p-24 rounded-[60px] border border-gray-100 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#00c9a7]/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
              <div>
                <h3 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 uppercase tracking-wide leading-[0.85]">Por que ser uma <br /><span className="text-[#00c9a7]">Corporação?</span></h3>
                <div className="space-y-10 mt-12">
                  {[
                    { title: 'Acesso ao Dealflow', desc: 'Curadoria exclusiva de startups alinhadas aos seus desafios estratégicos.', color: 'text-[#00c9a7]' },
                    { title: 'Networking C-Level', desc: 'Troca de experiências com outros executivos de grandes corporações nacionais.', color: 'text-brand-purple' },
                    { title: 'Visibilidade de Marca', desc: 'Posicionamento como líder em inovação no cenário global corporativo.', color: 'text-brand-green' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start space-x-6">
                      <div className="mt-1 flex-shrink-0">
                        <div className="w-6 h-6 rounded-full border-2 border-[#00c9a7] flex items-center justify-center p-1">
                          <div className="w-full h-full bg-[#00c9a7] rounded-full" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-gray-900 uppercase tracking-wide mb-2">{item.title}</h4>
                        <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -inset-1 bg-[#00c9a7]/20 blur-2xl rounded-[40px]" />
                <div className="relative bg-[#fafafa] border border-gray-200 p-10 md:p-14 rounded-[40px] shadow-inner">
                  <h3 className="text-3xl font-black text-gray-900 mb-8 uppercase tracking-wide">Solicite uma Proposta</h3>
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Nome Completo</label>
                      <input type="text" placeholder="Seu nome" className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#00c9a7] text-gray-900" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">E-mail Corporativo</label>
                      <input type="email" placeholder="nome@empresa.com.br" className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#00c9a7] text-gray-900" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Sua Empresa</label>
                      <input type="text" placeholder="Nome da empresa" className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#00c9a7] text-gray-900" />
                    </div>
                    <div className="space-y-4 pt-2 mb-6">
                      <label className="flex items-center space-x-3 cursor-pointer group">
                        <div className="w-6 h-6 rounded border-2 border-gray-200 flex items-center justify-center group-hover:border-[#00c9a7] transition-all">
                          {/* Visual Checkbox using a simple indicator */}
                          <div className="w-full h-full p-1 opacity-100 bg-[#00c9a7]/0 group-hover:bg-[#00c9a7]/5">
                            <Rocket className="w-full h-full text-[#00c9a7] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-gray-900 transition-colors">Desejo conectar-me com soluções tecnológicas</span>
                      </label>
                    </div>
                    <button className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl hover:bg-[#00c9a7] transition-all">
                      Enviar Solicitação
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Empresas;
