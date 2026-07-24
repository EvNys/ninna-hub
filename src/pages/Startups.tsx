import { motion } from 'motion/react';
import { 
  Rocket, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  CheckCircle2, 
  Zap,
  Target,
  ClipboardList,
  MessageSquare,
  Scale,
  Handshake,
  TrendingUp,
  Cpu,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
// Lista da vitrine fica em src/data/startups-fallback.ts (editável sem mexer no código).
import { NINNA_STARTUPS } from '../data/startups-fallback';
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase"; 
interface Startup {
  id: string;
  nome: string;
  logo: string;
  site: string;
}

export default function PortfolioStartupsShowcase() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const q = query(
          collection(db, "startups"),
          where("statusVitrine", "==", "ativo"),
          orderBy("updatedAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        setStartups(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Startup[]
        );
      } catch (error) {
        console.error("Erro ao buscar startups do Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, []);

  return (
    <div>
      <meta name="description" content="Página das startups do NINNA Hub, apresentando as Startups que se beneficiam do ecossistema de inovação." />
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32 bg-[#1A1A2E]">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#00bcd4,transparent_70%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block px-4 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-[10px] font-inter font-black uppercase tracking-[0.3em] mb-8 border border-brand-teal/20">
                NINNA 4 Startups
              </div>
              <h1 className="text-5xl md:text-8xl font-barlowCondensed-Black font-black mb-8 uppercase tracking-wide leading-none text-white ">
                ONDE STARTUPS GERAM <br />
                <span className="text-brand-teal">NEGÓCIOS</span>
              </h1>
              <p className="text-xl text-gray-400 mb-12 font-barlow font-medium leading-relaxed">
                Mais do que um hub de inovação, somos um ambiente que cria conexões entre empreendedores, grandes empresas e investidores para acelerar a geração de oportunidades e fortalecer o ecossistema.
              </p>

              <div className="flex flex-wrap justify-center gap-6">
                <Link 
                  to="/startups/portfolio"
                  className="bg-brand-teal hover:bg-brand-teal/90 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-brand-teal/20 flex items-center gap-3"
                >
                  Conheça o Portfólio <Rocket className="w-5 h-5" />
                </Link>
                <Link 
                  to="/startups/ninna-4-startups"
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center gap-3"
                >
                  NINNA 4 Startups <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features / Pillars Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-brand-teal/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start justify-between mb-20 gap-12">
            <div className="max-w-xl">
              <div className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-brand-teal/20">
                Nosso Modo de Atuar
              </div>
              <h2 className="text-4xl md:text-6xl font-barlowCondensed-Black font-black text-gray-900 uppercase tracking-wide leading-none">
                COMO APOIAMOS STARTUPS MAIS<br /> DO QUE UM HUB, <br/>
                <span className="gradient-text"> UM ECOSSISTEMA DE OPORTUNIDADES</span>
              </h2>
            </div>
            <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-xl lg:mt-6">
              Cada startup enfrenta desafios diferentes, em momentos diferentes, com necessidades que mudam a cada etapa do seu crescimento. Por isso, não acreditamos em soluções únicas ou fórmulas prontas.
              Atuamos como um hub de conexões, aproximando empreendedores das pessoas certas, das organizações certas e das oportunidades certas, aquelas que realmente fazem a diferença em cada fase do negócio.
              Conectamos quem empreende a mentores, investidores, parceiros estratégicos e uma rede de contatos que acelera a geração de negócios, abre portas e fortalece o crescimento sustentável de cada startup que passa por aqui.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Handshake,
                title: "Conexões com Grandes Empresas",
                desc: "Aproximamos startups de organizações que buscam inovação para desenvolver pilotos, validar soluções e criar novas oportunidades comerciais.",
              },
              {
                icon: Users,
                title: "Mentoria e Especialistas",
                desc: "Nossa rede reúne empreendedores, executivos e especialistas que compartilham experiências práticas para apoiar decisões estratégicas e o desenvolvimento do negócio.",
              },
              {
                icon: Target,
                title: "Desenvolvimento do Negócio",
                desc: "Promovemos iniciativas, programas e acompanhamentos que ajudam startups a estruturar estratégias, fortalecer sua operação e ampliar sua presença no mercado.",
              },
              {
                icon: TrendingUp,
                title: "Investimento e Fomento",
                desc: "Conectamos startups a editais, investidores, programas de incentivo e oportunidades de financiamento para apoiar seu crescimento.",
              },
            ].map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="group relative p-10 bg-[#fafafa] border border-gray-100 rounded-[48px] hover:bg-white hover:border-brand-teal/20 hover:shadow-2xl hover:shadow-brand-teal/5 transition-all duration-300"
              >
                <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start">
                  <div className="w-16 h-16 bg-brand-teal/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <pillar.icon className="text-brand-teal w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-3 uppercase tracking-wide ">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Onboarding Pipeline Section */}
      <section className="py-32 bg-[#050911] relative overflow-hidden border-t border-b border-white/5 text-white" id="onboarding-pipeline-section">
        {/* Background Image with Dark Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000" 
            alt="Startup Flow Background" 
            className="w-full h-full object-cover opacity-10 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17] via-[#050911]/95 to-[#0a0e17] z-10" />
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-brand-teal/10 blur-[130px] rounded-full z-15" />
          <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-brand-green/10 blur-[130px] rounded-full z-15" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/10 text-[#0ae2b1] text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-[#0ae2b1]/20">
              Jornada para o sucesso
            </div>
            <h2 className="text-4xl md:text-6xl font-barlowCondensed-Black font-black text-white uppercase tracking-wide ">
              PASSO A PASSO PARA SE TORNAR UMA <br/> <span className="gradient-text font-black">STARTUP NINNA</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto font-barlow mt-4">
              Uma jornada transparente e estruturada para integrar sua startup ao ecossistema de inovação mais dinâmico da região.
            </p>
          </div>
 
          {/* Steps Timeline Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4 relative">
            {/* Horizontal Line Connector for Desktop */}
            <div className="hidden lg:block absolute top-[4.5rem] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-brand-teal/20 via-[#0ae2b1] to-brand-green/20 z-0" />
 
            {[
              {
                step: "01",
                title: "Inscrição",
                desc: "A startup se candidata inserindo suas informações no programa através do nosso portal.",
                icon: ClipboardList,
              },
              {
                step: "02",
                title: "Avaliação & Entrevista",
                desc: "Nossa equipe realiza a avaliação inicial e em seguida agenda uma entrevista de fit estratégico.",
                icon: MessageSquare,
              },
              {
                step: "03",
                title: "Conselho do NINNA",
                desc: "Após a entrevista bem-sucedida, a startup passa pela avaliação do conselho estratégico do NINNA.",
                icon: Users,
              },
              {
                step: "04",
                title: "Aprovação Jurídica",
                desc: "Sendo aprovada pelo conselho, a startup segue para a formalização e aprovação jurídica.",
                icon: Scale,
              },
              {
                step: "05",
                title: "Boas-Vindas!",
                desc: "Por fim, a startup é recebida de braços abertos pelo time e mentores do NINNA.",
                icon: Handshake,
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                className="relative z-10 flex flex-col items-center text-center px-4 group"
              >
                {/* Step badge & icon */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[28px] shadow-lg flex items-center justify-center group-hover:border-[#0ae2b1]/40 group-hover:scale-110 transition-all duration-300">
                    <item.icon className="w-8 h-8 text-[#0ae2b1]" />
                  </div>
                  
                  {/* Step Number Bubble */}
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#0ae2b1] text-gray-950 text-[11px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-[#050911]">
                    {item.step}
                  </div>
                </div>
 
                {/* Info */}
                <h3 className="text-xl font-black text-white uppercase tracking-wide  mb-2 group-hover:text-[#0ae2b1] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-white/50 font-barlow leading-relaxed max-w-[200px] lg:max-w-none group-hover:text-white/70 transition-colors">
                  {item.desc}
                </p>
                
                {/* Mobile Connector Arrow */}
                {idx < 4 && (
                  <div className="block lg:hidden my-4 text-[#0ae2b1]/60 animate-pulse text-lg font-black font-mono">
                    ↓
                  </div>
                )}
              </motion.div>
            ))}
          </div>
           <div className="flex justify-center mt-20 relative z-20">
            <Link
              to="/startups/ninna-4-startups"
              className="inline-flex items-center gap-2 px-10 py-4 bg-[#0ae2b1] text-gray-950 font-black uppercase tracking-wide text-sm rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(10,226,177,0.4)] transition-all duration-300"
            >
              Faça parte do NINNA
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Startups Showcase */}
      <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-teal/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-brand-teal/20">
            Membros do Ecossistema
          </div>
          <h2 className="text-4xl md:text-6xl font-barlowCondensed-Black font-black text-gray-900 uppercase tracking-wide">
            <span className="gradient-text">STARTUPS</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium mt-4">
            Conheça algumas das startups que fazem parte do ecossistema NINNA e
            desenvolvem soluções inovadoras para diferentes setores da economia.
          </p>
        </div>

        {/* Estado de carregamento */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse aspect-video bg-gray-100 rounded-[32px]"
              />
            ))}
          </div>
        )}

        {/* Grid de logos */}
        {!loading && startups.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {startups.map((startup, idx) => (
              <motion.a
                key={startup.id}
                href={startup.site}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (idx % 6) * 0.08, duration: 0.4 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative flex flex-col justify-between items-center p-5 bg-[#fafafa] border border-gray-100 rounded-[32px] hover:bg-brand-teal hover:border-brand-teal/20 hover:shadow-xl hover:shadow-brand-teal/5 transition-all duration-300 cursor-pointer text-current no-underline"
              >
                <div className="w-full aspect-video flex items-center justify-center mb-3 overflow-hidden rounded-2xl bg-white p-3 border border-gray-50 transition-colors group-hover:border-gray-100 flex-shrink-0">
                  <img
                    src={startup.logo}
                    alt={`${startup.nome} logo`}
                    className="max-h-12 max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                      const parent = (e.target as HTMLElement).parentElement;
                      if (parent) {
                        const fallback = parent.querySelector(".logo-fallback");
                        if (fallback) fallback.classList.remove("hidden");
                      }
                    }}
                  />
                  <div className="logo-fallback hidden font-black text-xs text-gray-400 font-mono tracking-wide uppercase text-center">
                    {startup.nome}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        {/* Botão para o portfólio completo */}
        {!loading && startups.length > 0 && (
          <div className="flex justify-center mt-10">
            
            <a
              href="/Startups/Portfolio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-teal text-white font-medium hover:bg-brand-teal/90 hover:shadow-lg hover:shadow-brand-teal/20 transition-all duration-300"
            >
              Ver portfólio completo
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
            </a>
          </div>
        )}

        {/* Estado vazio */}
        {!loading && startups.length === 0 && (
          <p className="text-center text-gray-400 font-medium">
            Nenhuma startup ativa encontrada no momento.
          </p>
        )}
      </div>
    </section>

      {/* Cases de Sucesso (NINNA Cases) */}
      <section className="py-32 bg-[#050911] relative overflow-hidden border-t border-b border-white/5 text-white" id="ninna-cases-section">
        {/* Dark Background Overlay details */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-teal/5 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-green/5 blur-[140px] rounded-full pointer-events-none" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/10 text-[#0ae2b1] text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-[#0ae2b1]/20">
              CASES
            </div>
            <h2 className="text-4xl md:text-6xl font-barlowCondensed-Black font-black text-white uppercase tracking-wide ">
              CONEXÕES QUE GERAM <span className="gradient-text font-black">NEGÓCIOS</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto font-barlow mt-4">
              O maior diferencial do NINNA é conectar startups às oportunidades certas. Conheça histórias em que essas conexões se transformaram em inovação aberta, novos negócios e resultados concretos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Case 1: Pague Menos + Suri.ai */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[48px] overflow-hidden shadow-2xl hover:border-brand-teal/30 transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                {/* Header inside Card */}
                <div className="p-8 border-b border-white/10 bg-gradient-to-r from-white/[0.02] to-transparent">
                  <div className="flex items-center justify-between gap-4">
                    {/* Logos & Connection */}
                    <div className="flex items-center gap-4">
                      {/* Corporativa Logo */}
                      <div className="w-16 h-16 bg-red-500/[0.03] border border-red-500/20 rounded-2xl flex items-center justify-center p-3 shadow-sm bg-white shrink-0">
                        <img 
                          src="/Imagens_NINNA/PagueMenos.png" 
                          alt="Pague Menos logo" 
                          className="max-h-full max-w-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      {/* Plus sign divider */}
                      <div className="text-white/40 font-black text-xl">+</div>
                      {/* Startup representation */}
                      <img 
                        src="/Startups/suri-cbm-logo-blue.png" 
                        alt="Suri.ai logo"
                        className="max-h-16 max-w-16 object-contain"
                        referrerPolicy="no-referrer"
                        />
                  </div>

                    <span className="inline-block text-[8px] font-black tracking-widest text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full border border-red-400/20 uppercase">
                      Conexão Corporativa
                    </span>
                  </div>
                </div>

                {/* Core Content */}
                <div className="p-8 md:p-10">
                  <h3 className="text-2xl font-black text-white uppercase tracking-wide  leading-none mb-4 group-hover:text-brand-teal transition-colors">
                    Aceleração de Atendimento com IA Conversacional
                  </h3>
                  <p className="text-white/60 font-barlow text-sm leading-relaxed mb-8">
                    Como uma das maiores redes de varejo farmacêutico do Brasil se uniu à Suri.ai, startup de inteligência artificial do ecossistema NINNA, para digitalizar e otimizar canais de atendimento e engajamento via WhatsApp nacionalmente.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Target className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black font-inter uppercase text-white tracking-widest">O Desafio</h4>
                        <p className="text-xs text-white/50 font-barlow leading-relaxed">Atender com agilidade milhares de dúvidas cotidianas sobre lojas e entregas de forma escalável.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded bg-brand-teal/10 text-[#0ae2b1] flex items-center justify-center shrink-0 mt-0.5">
                        <Rocket className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black font-inter uppercase text-white tracking-widest">A Solução</h4>
                        <p className="text-xs text-white/50 font-barlow leading-relaxed">Integração do motor de inteligência conversacional da Suri.ai ao canal oficial de WhatsApp.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics Block */}
              <div className="p-8 bg-white/[0.015] border-t border-white/10 rounded-b-[48px] grid grid-cols-3 gap-4 text-center">
                <div>
                  <span className="block text-2xl font-black text-[#0ae2b1] tracking-wide ">+80%</span>
                  <span className="text-[8px] font-black uppercase text-white/40 tracking-wider">Média Automação</span>
                </div>
                <div className="border-l border-r border-white/10">
                  <span className="block text-2xl font-black text-white tracking-wide ">24/7</span>
                  <span className="text-[8px] font-black uppercase text-white/40 tracking-wider">Respostas Real</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-[#0ae2b1] tracking-wide ">-70%</span>
                  <span className="text-[8px] font-black uppercase text-white/40 tracking-wider">Tempo Espera</span>
                </div>
              </div>
            </motion.div>

            {/* Case 2: Mold IAX */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[48px] overflow-hidden shadow-2xl hover:border-brand-teal/30 transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                {/* Header inside Card */}
                <div className="p-8 border-b border-white/10 bg-gradient-to-r from-white/[0.02] to-transparent">
                  <div className="flex items-center justify-between gap-4">
                    {/* Logos & Connection */}
                    <div className="flex items-center gap-4">
                      {/* NINNA Logo */}
                      <div className="w-16 h-16 bg-brand-teal/5 border border-brand-teal/20 rounded-2xl flex flex-col items-center justify-center p-2 shadow-sm shrink-0">
                        <img 
                        src="/Imagens_NINNA/NINNA.png" 
                        alt="Suri.ai logo"
                        className="max-h-16 max-w-16 object-contain"
                        referrerPolicy="no-referrer"
                        />
                      </div>
                      {/* Plus sign divider */}
                      <div className="text-white/40 font-black text-xl">+</div>
                      {/* MOLD IAX Logo */}
                      <div className="w-16 h-16 bg-purple-500/[0.04] border border-purple-100 rounded-2xl flex flex-col items-center justify-center p-2 shadow-sm shrink-0 bg-white">
                        <img 
                        src="/Startups/MoldIax.png" 
                        alt="Suri.ai logo"
                        className="max-h-16 max-w-16 object-contain"
                        referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    <span className="inline-block text-[8px] font-black tracking-widest text-[#9333ea] bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20 uppercase">
                      Fomento & Captação
                    </span>
                  </div>
                </div>

                {/* Core Content */}
                <div className="p-8 md:p-10">
                  <h3 className="text-2xl font-black text-white uppercase tracking-wide  leading-none mb-4 group-hover:text-brand-teal transition-colors">
                    Acesso Expresso a Recursos Estaduais e Federais
                  </h3>
                  <p className="text-white/60 font-barlow text-sm leading-relaxed mb-8">
                    Como a startup do nosso ecossistema focada em inteligência de hardware e processos industriais obteve acesso a recursos de inovação acelerado com fôlego e curadoria consultiva pelo time do NINNA Hub.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Target className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black font-inter uppercase text-white tracking-widest">O Desafio</h4>
                        <p className="text-xs text-white/50 font-barlow leading-relaxed">Equipes pequenas de forte base técnica sem tempo para burocracia de fomento contínuo e submissões densas.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded bg-brand-teal/10 text-[#0ae2b1] flex items-center justify-center shrink-0 mt-0.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black font-inter uppercase text-white tracking-widest">A Solução</h4>
                        <p className="text-xs text-white/50 font-barlow leading-relaxed">Mapeamento expresso e curadoria de editais efetuada em menos de 1 mês de aceleração integrada no hub.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics Block */}
              <div className="p-8 bg-white/[0.015] border-t border-white/10 rounded-b-[48px] grid grid-cols-3 gap-4 text-center">
                <div>
                  <span className="block text-2xl font-black text-purple-400 tracking-wide ">R$ 800K</span>
                  <span className="text-[8px] font-black uppercase text-white/40 tracking-wider">Recursos</span>
                </div>
                <div className="border-l border-r border-white/10">
                  <span className="block text-2xl font-black text-white tracking-wide ">&lt; 1 mês</span>
                  <span className="text-[8px] font-black uppercase text-white/40 tracking-wider font-barlow">Estudo / Acesso</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-[#0ae2b1] tracking-wide ">100%</span>
                  <span className="text-[8px] font-black uppercase text-white/40 tracking-wider">Compliance</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Join NINNA Section (Replacing the previous CTA card) - converted to Light Background Section */}
      <section className="py-32 bg-white relative overflow-hidden border-b border-gray-100" id="why-join-ninna-light">
        {/* Subtle Decorative backgrounds */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-teal/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-green/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-gray-900">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Bold Header, pitch, and high-impact CTA button */}
            <div className="lg:col-span-12 xl:col-span-5 text-left">
              <div className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-brand-teal/20">
                POR QUE FAZER PARTE
              </div>
              <h2 className="text-5xl md:text-7xl font-barlowCondensed-Black font-black text-gray-900 uppercase tracking-wide  leading-none mb-8">
                POR QUE FAZER PARTE DO <br />
                <span className="text-brand-teal">NINNA?</span>
              </h2>
              <p className="text-gray-500 font-barlow text-lg leading-relaxed mb-12">
                Fazer parte do NINNA significa integrar um dos ecossistemas de inovação mais relevantes do Nordeste, ampliando sua rede de relacionamento, acesso ao mercado e oportunidades de crescimento.
              </p>
              
              <Link
                to="/startups/ninna-4-startups"
                className="inline-flex items-center gap-3 bg-brand-teal hover:bg-brand-teal/90 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-brand-teal/20 hover:scale-[1.03] active:scale-95 cursor-pointer"
              >
                faça parte do NINNA 4 STARTUPS! <Rocket className="w-5 h-5" />
              </Link>
            </div>

            {/* Right Column: Premium Interactive Feature Mesh displaying core reasons */}
            <div className="lg:col-span-12 xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  number: "01",
                  title: "Acesso ao Mercado",
                  desc: "Conectamos startups a grandes empresas para gerar pilotos, validar soluções e abrir novas oportunidades comerciais."
                },
                {
                  number: "02",
                  title: "Rede Estratégica",
                  desc: "Tenha acesso a uma comunidade formada por empreendedores, investidores, executivos, universidades e organizações que impulsionam inovação."
                },
                {
                  number: "03",
                  title: "Mentoria Especializada",
                  desc: "Conte com especialistas e líderes experientes para apoiar decisões estratégicas e o desenvolvimento do seu negócio."
                },
                {
                  number: "04",
                  title: "Benefícios Exclusivos",
                  desc: "Aproveite condições especiais em ferramentas, serviços, parceiros e iniciativas que fortalecem a operação da sua startup."
                },               
                {
                  number: "05",
                  title: "Ambiente de Conexões",
                  desc: "Participe de eventos, encontros e experiências que estimulam colaboração, networking e geração de negócios."
                },
                {
                  number: "06",
                  title: "Visibilidade para Crescer",
                  desc: "Amplie sua exposição dentro do ecossistema e esteja mais próximo de oportunidades com investidores, parceiros e grandes empresas."
                }
              ].map((reason, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="bg-[#fafafa] border border-gray-150 rounded-[32px] p-8 hover:bg-white hover:border-brand-teal/20 hover:shadow-2xl hover:shadow-brand-teal/5 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black font-mono tracking-widest text-[#00bcd4]/60 group-hover:text-brand-teal transition-colors duration-300">
                      RAZÃO {reason.number}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-brand-teal/10 flex items-center justify-center border border-brand-teal/20">
                      <CheckCircle2 className="w-4 h-4 text-brand-teal" />
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-wide  mb-3 group-hover:text-brand-teal transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-barlow leading-relaxed">
                    {reason.desc}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      <section className="py-32 bg-[#050911] relative overflow-hidden border-t border-b border-white/5 text-white" id="para-quem-section">
        {/* Background Image with Dark Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=2000" 
            alt="Startup Team Background" 
            className="w-full h-full object-cover opacity-10 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17] via-[#050911]/95 to-[#0a0e17] z-10" />
          <div className="absolute top-1/3 -left-20 w-96 h-96 bg-brand-teal/10 blur-[130px] rounded-full z-15" />
          <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-brand-green/10 blur-[130px] rounded-full z-15" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column - Title */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5"
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/10 text-[#0ae2b1] text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-[#0ae2b1]/20">
                Perfil Ideal
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-barlowCondensed-Black font-black text-white uppercase tracking-wide leading-[0.95]">
                PARA QUEM É O <span className="gradient-text font-black">NINNA?</span>
              </h2>
              <p className="text-white/60 font-barlow mt-6 text-lg leading-relaxed">
                O NINNA é o ambiente ideal para startups que desejam crescer por meio de conexões estratégicas e inovação colaborativa.
              </p>
              <p className="text-white/40 font-barlow mt-4 text-sm uppercase tracking-wider">
                O ecossistema é indicado para startups que:
              </p>
            </motion.div>

            {/* Right Column - Checklist */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {[
                "Empreendedores e negócios que estão mais estruturados.",
                "Possuem uma solução inovadora e buscam validar ou expandir sua atuação.",
                "Querem se conectar com grandes empresas e acessar oportunidades de inovação aberta.",
                "Buscam ampliar sua rede de relacionamento com investidores, especialistas e outros empreendedores.",
                "Desejam fortalecer sua estratégia de crescimento e desenvolvimento de negócios.",
                "Acreditam na colaboração como caminho para gerar impacto e crescer de forma sustentável.",
                "Startups com modelo de negócio escalável que buscam acelerar seu crescimento e dominar seu mercado.",
              ].map((text, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="group flex items-center gap-4 p-5 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl hover:border-[#0ae2b1]/40 hover:bg-white/[0.05] transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#0ae2b1]/10 border border-[#0ae2b1]/30 flex items-center justify-center group-hover:bg-[#0ae2b1] group-hover:scale-110 transition-all duration-300">
                    <CheckCircle className="w-5 h-5 text-[#0ae2b1] group-hover:text-gray-950 transition-colors" />
                  </div>
                  <p className="text-sm md:text-base text-white/70 font-barlow leading-relaxed group-hover:text-white transition-colors">
                    {text}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

    <section
      className="py-32 bg-[#f4faf9] relative overflow-hidden border-t border-gray-100"
      id="cta-final"
    >
      {/* Decorative backgrounds - mesma linguagem visual da seção anterior, em versão clara */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-brand-teal/10 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-green/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Grid sutil de fundo para reforçar a ideia de "rede de conexões" */}


      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-brand-teal/20">
            CONECTE-SE
          </div>

          <h2 className="text-5xl md:text-7xl font-barlowCondensed-Black font-black text-gray-900 uppercase tracking-wide leading-none mb-8">
            SUA PRÓXIMA GRANDE <br />
            <span className="text-brand-teal">CONEXÃO COMEÇA AQUI</span>
          </h2>

          <p className="text-gray-500 font-barlow text-lg leading-relaxed max-w-2xl mx-auto mb-12">
            Grandes oportunidades surgem quando as conexões certas acontecem.
            Faça parte do ecossistema NINNA e conecte sua startup a empresas,
            especialistas, investidores e parceiros que podem impulsionar o
            próximo capítulo da sua história.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/startups/ninna-4-startups"
              className="inline-flex items-center gap-3 bg-brand-teal hover:bg-brand-teal/90 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-brand-teal/20 hover:scale-[1.03] active:scale-95 cursor-pointer"
            >
              Quero fazer parte do NINNA <Rocket className="w-5 h-5" />
            </Link>

          {/* <a
            href="https://wa.me/558532114201?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20a%20equipe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-transparent hover:bg-gray-900/5 text-gray-900 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all border border-gray-300 hover:border-gray-900/40 hover:scale-[1.03] active:scale-95 cursor-pointer"
          >
            Falar com nossa equipe <MessageCircle className="w-5 h-5" />
          </a> */}
          </div>
        </motion.div>
      </div>
    </section>

    </div>
  );
};

