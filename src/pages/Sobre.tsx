import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Rocket, History, Users, MapPin, Globe, ShieldCheck, Heart, ArrowRight, Target, Linkedin, FolderOpen, Rotate3D} from 'lucide-react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
// Equipe padrão fica em src/data/equipe-fallback.ts (compartilhada com /admin/equipe).
import { EQUIPE_PADRAO, type MembroEquipePadrao } from '../data/equipe-fallback';

const DEFAULT_MEMBERS = EQUIPE_PADRAO;

const Sobre = () => {
  const [equipe, setEquipe] = useState<MembroEquipePadrao[]>([]);
  const [loadingEquipe, setLoadingEquipe] = useState(true);

  useEffect(() => {
    const fetchEquipe = async () => {
      try {
        const q = query(collection(db, 'equipe'), orderBy('ordem', 'asc'));
        const querySnapshot = await getDocs(q);
        const fbMembers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MembroEquipePadrao[];
        
        if (fbMembers.length > 0) {
          // Merge default members with database edits, matching by matching names
          const merged = [...DEFAULT_MEMBERS];
          fbMembers.forEach(fb => {
            const index = merged.findIndex(m => m.nome.toLowerCase() === fb.nome.toLowerCase());
            if (index !== -1) {
              merged[index] = { ...merged[index], ...fb };
            } else {
              merged.push(fb);
            }
          });
          // Sort final merged list by order parameter
          merged.sort((a, b) => a.ordem - b.ordem);
          setEquipe(merged);
        } else {
          setEquipe(DEFAULT_MEMBERS);
        }
      } catch (error) {
        console.error('Erro ao buscar equipe:', error);
        setEquipe(DEFAULT_MEMBERS);
      } finally {
        setLoadingEquipe(false);
      }
    };

    fetchEquipe();
  }, []);
  const values = [
    {
      title: 'Transparência',
      description: 'Nós começamos com transparência, porque acreditamos que a clareza e a verdade em nossas ações e decisões criam confiança entre todos os envolvidos.',
      icon: <ShieldCheck className="w-10 h-10" />
    },
    {
      title: 'Profissionalismo',
      description: 'Reforça a seriedade, a ética e a excelência que o NINNA entrega no seu trabalho.',
      icon: <Users className="w-10 h-10" />
    },
    {
      title: 'Organização',
      description: 'É o que transforma ideias em resultados, permitindo que nossos processos sejam consistentes e alinhados.',
      icon: <FolderOpen className="w-10 h-10" />
    },
    {
      title: 'Engajamento',
      description: 'O coração pulsante, representando a energia coletiva e a colaboração para atingir objetivos é o que conecta nossa equipe, parceiros e clientes. ',
      icon: <Target className="w-10 h-10" />
    },
    {
      title: 'Ousadia',
      description: 'A coragem de experimentar e desafiar o status quo. Nos inspira a ir além do esperado.',
      icon: <Heart className="w-10 h-10" />
    },
    {
      title: 'Inquietude',
      description: 'O espírito de constante questionamento e evolução, essencial para manter a relevância em um mercado dinâmico.',
      icon: <Rocket className="w-10 h-10" />
    },
    {
      title: 'Transformação',
      description: 'O impacto que o NINNA busca gerar em seus parceiros, no mercado e no ecossistema de inovação é a essência do nosso propósito.',
      icon: <Rotate3D className="w-10 h-10" />
    },
  ];

  return (
    <div className="bg-[#fafafa] min-h-screen overflow-hidden">
      <meta name="description" content="Conheça a história, os valores do NINNA Hub e a Equipe do espaço de inovação e conexão entre startups, empresas e profissionais." />
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden border-b border-gray-100">
        <div className="absolute top-1/2 left-0 w-32 h-[400px] bg-brand-teal/5 -translate-y-1/2 -skew-x-12 z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/5 blur-[120px] rounded-full -mr-40 -mt-40 z-10 pointer-events-none" />
        
        {/* Low opacity background image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#fafafa]/85 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000" 
            alt="NINNA Collaboration" 
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
              Nossa Essência
            </div>
            <h1 className="text-7xl md:text-[120px] font-black mb-8 uppercase tracking-wide leading-[0.85] text-gray-900 ">
              NOSSA <br /><span className="gradient-text">HISTÓRIA</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed border-t border-gray-200 pt-8 mt-8 font-medium">
              Conheça a trajetória do NINNA Hub, um polo de inovação que nasceu para transformar o futuro através da tecnologia e do empreendedorismo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* History & Projects */}
      <section className="py-32 bg-[#050911] relative overflow-hidden border-t border-b border-white/5 text-white" id="dna-cearense-section">
        {/* Dark Background Overlay details */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-teal/5 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-green/5 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <div className="flex items-center space-x-3 text-brand-teal font-black uppercase tracking-[0.2em] text-[10px] mb-8 ">
                <History className="w-5 h-5 text-[#0ae2b1]" />
                <span className="text-[#0ae2b1]">Trajetória</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black mb-10 leading-[0.9] text-white uppercase tracking-wide ">
                INOVAÇÃO COM <br /><span className="text-[#0ae2b1] underline decoration-white/20">DNA CEARENSE</span>
              </h2>
              <div className="space-y-4 text-white/75 text-lg leading-relaxed font-barlow">
                <p className="border-l-2 border-[#0ae2b1] pl-8">
                  O <strong>NINNA Hub</strong> é um hub de inovação que conecta empresas, startups, investidores e instituições estratégicas para impulsionar a transformação dos negócios por meio da inovação aberta, da tecnologia e do empreendedorismo.
                </p>
                <p className="pl-8 text-white/70">
                Com sede em Fortaleza, atuamos como um ambiente de colaboração que aproxima desafios corporativos de soluções inovadoras, promovendo programas, conexões e iniciativas voltadas à geração de valor, competitividade e crescimento sustentável para organizações de diferentes setores.
                </p>
                <p className="pl-8 text-white/70">
                Reconhecido como uma das principais referências em inovação do Nordeste, o NINNA Hub fortalece o ecossistema regional ao acelerar a adoção de novas tecnologias, fomentar a cultura de inovação e criar oportunidades que geram impacto econômico e social.
                </p>

                {/* <div className="p-8 rounded-[30px] bg-white/[0.03] border border-white/10 mt-12 group hover:border-[#0ae2b1]/30 hover:bg-white/[0.05] transition-all duration-500">
                  <h4 className="text-[10px] font-black text-[#0ae2b1] uppercase tracking-widest mb-3  flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#0ae2b1]" /> Impacto Social
                  </h4>
                  <p className="text-sm text-white/80  font-barlow">
                    Orgulhosamente apoiamos o projeto social <strong>Amontada Valley</strong>, uma iniciativa pioneira e transformadora que leva capacitação tecnológica de qualidade e excelentes oportunidades profissionais para o interior do Ceará, provando que a inovação de impacto não possui barreiras geográficas.
                  </p>
                </div> */}

              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="p-4 relative z-10 rotate-3 hover:rotate-0 transition-all duration-700 rounded-[40px] overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-2xl">
                <img 
                  src="/Fotos do Time NINNA/Time_NINNA.webp" 
                  alt="NINNA Hub" 
                  className="rounded-[30px] w-full h-auto "
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute top-12 -right-12 w-48 h-48 bg-brand-teal/10 blur-3xl rounded-full -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-gray-50 border-y border-gray-100" id="nossos-valores-section">
      {/* Subtle decorative shadows */}
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-brand-teal/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-brand-green/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24 space-y-4">
          <span className="text-brand-teal font-black uppercase text-[10px] tracking-[0.3em] bg-brand-teal/5 border border-brand-teal/10 px-4 py-1.5 rounded-full inline-block">Nossos Pilares</span>
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 uppercase tracking-wide ">
            NOSSOS <span className="text-brand-teal underline decoration-gray-200">VALORES</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-barlow text-lg">
            O que nos guia todos os dias na busca por resultados extraordinários e impacto real no ecossistema.
          </p>
          <div className="h-[2px] w-20 bg-brand-teal mx-auto mt-4" />
        </div>

        {/* Grid Layout — cards verticais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="flex flex-col items-start gap-4 p-6 md:p-8 bg-white rounded-[28px] border-t-4 border-t-brand-teal border border-gray-150 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden cursor-pointer h-full"
            >
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-teal/[0.02] rounded-full blur-xl pointer-events-none" />

              {/* Icon */}
              <div className="relative shrink-0 w-fit">
                <div className="absolute inset-0 bg-brand-teal/10 blur-xl rounded-full scale-125 group-hover:scale-130 transition-transform duration-500" />
                <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 bg-brand-teal/5 border border-brand-teal/10 rounded-2xl flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all duration-500 shrink-0">
                  {value.icon}
                </div>
              </div>

              {/* Label + Text */}
              <div className="relative z-10">
                <div className="text-[10px] font-black text-brand-teal uppercase tracking-[0.25em] mb-1">
                  VALOR {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-wide leading-tight group-hover:text-brand-teal transition-colors">
                  {value.title}
                </h3>
                <p className="text-gray-500 font-barlow text-sm leading-relaxed mt-2">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

      {/* Pillars Section Refined for "Sobre" */}
      <section className="py-32 bg-[#050911] relative overflow-hidden border-t border-b border-white/5 text-white" id="onde-acontece-section">
        {/* Subtle decorative glows */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-teal/5 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-green/5 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/[0.03] backdrop-blur-md p-12 md:p-24 relative overflow-hidden border border-white/10 shadow-2xl rounded-[60px]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-teal/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <div className="inline-block px-4 py-1 rounded-full bg-brand-teal/10 text-[#0ae2b1] text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-[#0ae2b1]/20">
                  Nossa Base
                </div>
                <h2 className="text-4xl md:text-6xl font-black mb-10 text-white uppercase tracking-wide leading-none ">ONDE A <br /><span className="text-[#0ae2b1] underline decoration-white/20">MÁGICA</span> ACONTECE</h2>
                
                <div className="space-y-10 mb-12">
                  <div className="flex items-center space-x-6 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#0ae2b1] group-hover:bg-[#0ae2b1] group-hover:text-black transition-all">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-white/40 uppercase tracking-widest block mb-1">Localização Principal</span>
                      <span className="text-xl text-white font-bold">Av. Dom Manuel, 1020 - Centro, Fortaleza - CE</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#0ae2b1] group-hover:bg-[#0ae2b1] group-hover:text-black transition-all">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-white/40 uppercase tracking-widest block mb-1">Alcance Regional</span>
                      <span className="text-xl text-white font-bold">Conexões Globais</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-white/70 text-lg leading-relaxed mb-10 font-barlow max-w-md">
                  Nosso espaço físico é projetado para fomentar a criatividade e o networking de alto impacto. Venha conhecer o futuro da inovação.
                </p>
                
                <a 
                  href="https://wa.me/558532114201?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20o%20Audit%C3%B3rio%20Premium%20do%20NINNA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0ae2b1] text-black hover:bg-[#0ae2b1]/90 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center group shadow-lg shadow-[#0ae2b1]/20 transition-all cursor-pointer inline-flex"
                >
                  Agendar Visita 
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </a>
              </div>

              <div className="relative">
                <div className="h-[500px] rounded-[40px] overflow-hidden border border-white/10 relative z-10 shadow-2xl">
                  <img 
                    src="/Imagens_espaco/Faixada2.webp" 
                    alt="Espaço NINNA Hub" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-teal/10 blur-3xl rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Work Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-100 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="inline-block px-4 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                Responsabilidade Social
              </div>
              <h2 className="text-5xl md:text-7xl font-black mb-10 text-gray-900 uppercase tracking-wide leading-[0.9] ">
                INOVAÇÃO QUE <br /><span className="text-brand-teal">TRANSFORMA VIDAS</span>
              </h2>
              <p className="text-xl text-gray-500 font-medium leading-relaxed mb-12">
                O NINNA Hub acredita que a tecnologia e a inovação devem ser ferramentas de inclusão social e desenvolvimento regional. Nosso compromisso vai além das paredes do Hub, alcançando comunidades e gerando oportunidades reais.
              </p>

              <div className="p-10 bg-gray-50 border border-gray-100 rounded-[40px] relative group hover:bg-brand-teal/[0.02] transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-brand-teal text-white rounded-2xl shadow-lg shadow-brand-teal/20">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-wide ">Amontada Valley</h3>
                </div>
                <p className="text-gray-600 font-medium leading-relaxed ">
                  Nosso principal braço social. O Amontada Valley é um ecossistema de inovação social focado em transformar o interior do Ceará através da educação tecnológica, empreendedorismo e economia criativa.
                </p>
                <a
                  href="https://www.amontadavalley.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 flex items-center text-[10px] font-black uppercase tracking-widest text-brand-teal group-hover:translate-x-2 transition-transform cursor-pointer"
                >
                  Conhecer Iniciativa <ArrowRight className="ml-3 w-4 h-4" />
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-6 scale-90 md:scale-100 origin-center">
                <div className="space-y-6 pt-12">
                  <div className="rounded-[30px] overflow-hidden border border-gray-100 shadow-xl h-64">
                    <img 
                      src="/Imagens_espaco/AmontadaValley_1.png" 
                      alt="Social Impact 1" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="bg-brand-teal p-8 rounded-[30px] text-white shadow-xl shadow-brand-teal/20">
                    <div className="text-4xl font-black mb-2  tracking-wide">+500</div>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Jovens Impactados</div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-gray-900 p-8 rounded-[30px] text-white shadow-xl">
                    <div className="text-4xl font-black mb-2  tracking-wide">10+</div>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Cidades Atendidas</div>
                  </div>
                  <div className="rounded-[30px] overflow-hidden border border-gray-100 shadow-xl h-[320px]">
                    <img 
                      src="/Imagens_espaco/AmontadaValley_2.png" 
                      alt="Social Impact 2" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-teal/10 blur-[100px] rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 bg-[#050911] relative overflow-hidden border-t border-b border-white/5 text-white" id="team-section-dark">
        {/* Subtle decorative background glows */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-teal/5 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-green/5 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-wide text-white ">TIME <span className="text-[#0ae2b1] underline decoration-white/20">NINNA</span></h2>
            <p className="text-white/60 max-w-2xl mx-auto font-barlow text-lg  uppercase tracking-widest">Gente que acredita e faz acontecer.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
            {loadingEquipe ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white/[0.03] h-96 w-full animate-pulse border border-white/10 rounded-[40px]" />
              ))
            ) : (
              equipe.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="relative h-[380px] rounded-[40px] overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-md transition-all duration-700 group-hover:translate-y-[-10px] shadow-xl hover:shadow-2xl">
                    <img 
                      src={member.foto || "https://picsum.photos/seed/profile/400/500"} 
                      alt={member.nome}
                      className="w-full h-full object-cover  group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/15 to-transparent opacity-70 group-hover:opacity-55 transition-opacity" />
                    
                    <div className="absolute bottom-16 left-10 right-10 z-10">
                      <h4 className="text-3x1 font-black text-white uppercase tracking-wide leading-none mb-1 font-sans">
                        {member.nome}
                      </h4>
                      <p className="text-[10px] font-black text-[#0ae2b1] uppercase tracking-[0.2em]">
                        {member.cargo}
                      </p>

                      {member.linkedin && (
                        <a 
                          href={member.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="absolute top-full left-0 mt-4 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-teal text-white hover:bg-white hover:text-brand-teal transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-brand-teal/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sobre;
