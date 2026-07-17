import { useState, useRef, useEffect } from "react";
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { SearchCheck,
    Wrench,
    Rocket,
    Sprout,
    Handshake,
    ChevronUp,
    Building2,
    MessageSquare,
    ArrowRight,
    Target,
    TrendingUp,
    Cpu, 
    Zap } from "lucide-react";

const NAV_ITEMS = [
  { id: "bloco1", icon: SearchCheck, label: "Quero clareza onde estou",          aria: "Diagnóstico" },
  { id: "bloco2", icon: Wrench,      label: "Quero estruturar minha inovação",   aria: "Estruturar"  },
  { id: "bloco3", icon: Rocket,      label: "Quero executar com parceiros",      aria: "Executar"    },
  { id: "bloco4", icon: Sprout,      label: "Quero ativar minha cultura",        aria: "Cultura"     },
  { id: "bloco5", icon: Handshake,   label: "Quero me conectar ao ecossistema",  aria: "Ecossistema" },
];

const BLOCOS = [
  {
    id: "bloco1",
    title: "Diagnosticar para Decidir",
    subtitle: "Para quem quer clareza antes de agir",
    accent: "#00D4D4",
    image: "",
    cta: "Comece com um diagnóstico →",
    description: "Antes de inovar, é preciso saber onde você está. Nossos diagnósticos combinam metodologias globais com uma leitura precisa da realidade da sua empresa — entregando clareza, prioridades e um ponto de partida sólido para qualquer jornada de transformação.",
    empresas: [
      { nome: "Empresa A", logo: "/Imagens_NINNA/l'auto.png" },
      { nome: "Empresa B", logo: "/Imagens_NINNA/Extrafarma.png" },
      { nome: "Empresa C", logo: null }, // sem logo, exibe só o nome
    ],
    cases: [
      { company: "Empresa A", result: "Identificou gaps críticos de maturidade e reduziu o tempo de decisão estratégica em 40%." },
      { company: "Empresa B", result: "Mapeou barreiras culturais invisíveis que travavam projetos de inovação há 2 anos." },
    ],
    cards: [ { title: "Diagnóstico de Maturidade em Inovação",  desc: "Metodologia ISO + McKinsey + H1/H2/H3 para mapear onde sua empresa está na jornada da inovação." },
      { title: "Diagnóstico de Perfil de Uso de Dados",  desc: "4 dimensões: Ler, Trabalhar, Raciocinar e Comunicar — entenda como sua organização usa dados hoje." },
      { title: "Diagnóstico de Cultura e Inovação",      desc: "ISO 56000 + barreiras culturais. Identifique os bloqueios reais que impedem a inovação de acontecer." },
      { title: "Diagnóstico de Transformação Digital",   desc: "Avalie o grau de digitalização dos processos e a prontidão da sua empresa para a transformação." },
      { title: "Análise de Cenários Futuros",            desc: "Roadmaps tecnológicos e tendências para antecipar movimentos e tomar decisões estratégicas com mais segurança." }, ],
  },
  {
    id: "bloco2",
    title: "Estruturar para Escalar",
    subtitle: "Para quem já sabe onde está e quer organizar a jornada",
    accent: "#00E676",
    image: "",
    cta: "Monte sua estratégia →",
    description: "Ter vontade de inovar não é suficiente — é preciso estrutura. Ajudamos sua empresa a construir os processos, governança e estratégias que transformam iniciativas isoladas em um sistema de inovação contínuo e escalável.",
    empresas: [
      { nome: "Empresa A", logo: "/Imagens_NINNA/logo-a.png" },
      { nome: "Empresa B", logo: "/Imagens_NINNA/logo-b.png" },
      { nome: "Empresa C", logo: null }, // sem logo, exibe só o nome
    ],
    cases: [
      { company: "Empresa C", result: "Implantou funil de inovação e gerou pipeline de 30 projetos qualificados no primeiro trimestre." },
      { company: "Empresa D", result: "Estruturou comitê de inovação com KPIs claros, conectando estratégia ao dia a dia dos times." },
    ],
    cards: [ { title: "Mapeamento da Jornada do Cliente Inovador", desc: "Identifica dores e oportunidades ao longo da jornada, propondo soluções alinhadas à realidade do negócio." },
      { title: "Construção de Estratégias Inovadoras",      desc: "Planejamento estratégico sob medida para posicionar a inovação como vantagem competitiva real." },
      { title: "Implantação de Funil de Inovação",          desc: "Pipeline estruturado de ideias e projetos — do desafio à solução escalada, com critérios claros de seleção." },
      { title: "Sistema de Gestão da Inovação",             desc: "Governança, KPIs, comitês e métricas para sustentar e acelerar a inovação no longo prazo." },
 ],
  },
  {
    id: "bloco3",
    title: "Executar com Tecnologia e Parceiros",
    subtitle: "Para quem quer colocar a mão na massa com parceiros e tecnologia",
    accent: "#7C6FF7",
    image: "",
    cta: "Encontre sua solução →",
    description: "Identificar a tecnologia certa e os parceiros ideais faz toda a diferença na execução. Conectamos sua empresa às melhores soluções do mercado e gerenciamos o processo de validação e aceleração de ponta a ponta.",
    empresas: [
      { nome: "Empresa A", logo: "/Imagens_NINNA/logo-a.png" },
      { nome: "Empresa B", logo: "/Imagens_NINNA/logo-b.png" },
      { nome: "Empresa C", logo: null }, // sem logo, exibe só o nome
    ],
    cases: [
      { company: "Empresa E", result: "Conduziu PoC com 3 startups simultaneamente e implementou solução em produção em 90 dias." },
      { company: "Empresa F", result: "Recebeu 80+ inscrições qualificadas em chamada de startups focada em logística." },
    ],
    cards: [ { title: "Hunting de Soluções Tecnológicas",   desc: "Curadoria ativa de tecnologias e fornecedores alinhados ao desafio específico da sua empresa." },
      { title: "Gestão de Prova de Conceito (PoC)",  desc: "Estruturação, execução e avaliação de PoCs para validar soluções antes de escalar investimentos." },
      { title: "Aceleração Corporativa de Soluções", desc: "Programa intensivo para co-criar e acelerar soluções entre sua empresa e startups selecionadas." },
      { title: "Programa de Chamadas de Startups",   desc: "Atração qualificada de startups para responder a desafios reais do seu negócio com método e critério." },
      { title: "Programa de Inovação Aberta",        desc: "Metodologia proprietária de conexão com startups para criar valor mútuo e acelerar resultados." }, ],
  },
  {
    id: "bloco4",
    title: "Ativar Cultura e Pessoas",
    subtitle: "Para quem quer engajar times e criar cultura de inovação",
    accent: "#FF6B6B",
    image: "",
    cta: "Engaje seu time →",
    description: "Inovação começa nas pessoas. Desenvolvemos programas que transformam colaboradores em agentes de mudança — engajando times, formando líderes e criando uma cultura onde novas ideias encontram espaço para crescer.",
   empresas: [
      { nome: "Empresa A", logo: "/Imagens_NINNA/logo-a.png" },
      { nome: "Empresa B", logo: "/Imagens_NINNA/logo-b.png" },
      { nome: "Empresa C", logo: null }, // sem logo, exibe só o nome
    ],
    cases: [
      { company: "Empresa G", result: "Formou 120 embaixadores de inovação espalhados por 8 unidades de negócio em 6 meses." },
      { company: "Empresa H", result: "Hackathon corporativo gerou 3 projetos que viraram iniciativas oficiais da empresa." },
    ],
    cards: [ { title: "Programa de Embaixadores",     desc: "Forme líderes internos que disseminam a cultura de inovação de dentro para fora da organização." },
      { title: "Programa de Mentores",                desc: "Conecte talentos internos com mentores especializados para acelerar o desenvolvimento em inovação." },
      { title: "Hackathons Corporativos",             desc: "Eventos de alta energia para resolver desafios reais do negócio com equipes multidisciplinares." },
      { title: "Programa de Ideias",                  desc: "Canal estruturado para capturar, avaliar e premiar as melhores ideias de toda a organização." },
      { title: "Formação Executiva em Inovação",      desc: "Trilhas práticas para líderes que precisam tomar decisões mais ágeis e orientadas à inovação." },
      { title: "Formação em Transformação Digital",   desc: "Capacitação estruturada para preparar gestores e times para operar no ambiente digital." },
      { title: "Workshops Estratégicos para Lideranças", desc: "Sessões de imersão para alinhar visão, prioridades e metodologia com alta liderança." },
      { title: "Trilhas Customizadas para Times",     desc: "Jornadas de aprendizado adaptadas ao contexto, maturidade e objetivos de cada equipe." }, ],
  },
  {
    id: "bloco5",
    title: "Conectar ao Ecossistema",
    subtitle: "Para quem quer fazer parte de algo maior e se conectar com pares",
    accent: "#FFB800",
    image: "",
    cta: "Faça parte do ecossistema →",
    description: "As melhores oportunidades surgem das conexões certas. Facilitamos o acesso ao ecossistema de inovação — aproximando sua empresa de startups, líderes, investidores e parceiros estratégicos que aceleram resultados reais.",
   empresas: [
      { nome: "Empresa A", logo: "/Imagens_NINNA/logo-a.png" },
      { nome: "Empresa B", logo: "/Imagens_NINNA/logo-b.png" },
      { nome: "Empresa C", logo: null }, // sem logo, exibe só o nome
    ],
    cases: [
      { company: "Empresa I", result: "Participou do LICOR e fechou parceria estratégica com outra corporação no mesmo evento." },
      { company: "Empresa J", result: "Imersão técnica no Vale do Silício redefiniu o roadmap de tecnologia para os próximos 3 anos." },
    ],
    cards: [ { title: "LICOR",                        desc: "Encontro exclusivo de líderes de inovação corporativa para troca de experiências e geração de oportunidades." },
      { title: "Conexão com Ecossistema",             desc: "Curadoria de conexões relevantes com startups, aceleradoras, investidores e parceiros estratégicos." },
      { title: "Eventos para Comunidade de Inovação", desc: "Agenda de eventos abertos e fechados para fortalecer sua presença e influência no ecossistema." },
      { title: "Imersões Técnicas",                   desc: "Visitas e imersões em hubs de inovação, universidades e centros de tecnologia de referência." },
      { title: "Eventos de Conexões Estratégicas",    desc: "Encontros customizados para gerar negócios, parcerias e colaborações de alto impacto entre empresas." }, ],
  },
];

// ── styles injetados no head uma vez ──────────────────────────────────────
const CSS = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .bloco-content {
    overflow: hidden;
    transition: max-height 0.5s cubic-bezier(0.4,0,0.2,1),
                opacity    0.4s ease;
  }
  .bloco-content.open  { max-height: 10000px; opacity: 1; }
  .bloco-content.closed { max-height: 0;     opacity: 0; }
  .bloco-content.open .cards-grid > * {
    animation: fadeSlideIn 0.35s ease both;
  }
`;

function Card({ title, desc, accent }) {
  return (
    
    <div
      style={{
        background: "#141827",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "12px",
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "border-color 0.2s, transform 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = accent + "60";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <meta name="description" content="Página de empresas do NINNA Hub, que apresenta os serviços do Hub e empresas que se beneficiam dele." />
      <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>
        {title}
      </h4>
      <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>
        {desc}
      </p>
      <button
        style={{
          marginTop: "auto",
          paddingTop: "14px",
          background: "none",
          border: "none",
          color: accent,
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: "pointer",
          textAlign: "left",
          padding: 0,
          fontFamily: "inherit",
        }}
      >
        Saiba mais →
      </button>
    </div>
  );
}

function BlocoSection({ bloco, isOpen, onClose }) {
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      {/* conteúdo expansível */}
      <div className={`bloco-content ${isOpen ? "open" : "closed"}`}>
        <div style={{ padding: "60px 0 40px" }}>
          {/* badge */}
          <span
            style={{
              display: "inline-block",
              background: bloco.accent + "18",
              border: `1px solid ${bloco.accent}40`,
              color: bloco.accent,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "5px 14px",
              borderRadius: "100px",
            }}
          >
            {bloco.subtitle}
          </span>

          {/* título */}
          <h2
            style={{
              margin: "14px 0 40px",
              fontSize: "clamp(26px, 4vw, 38px)",
              fontWeight: 900,
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ color: bloco.accent }}>{bloco.title.split(" ")[0]} </span>
            {bloco.title.split(" ").slice(1).join(" ")}
          </h2>

          {/* descrição do bloco */}
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "48px",
            marginBottom: "48px",
          }}>
          <p style={{
            fontSize: "15px",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.75,
            maxWidth: "680px",
            margin: "0 0 48px",
          }}>
            {bloco.description}
          </p>

          {bloco.image && (
              <img
                src={bloco.image}
                alt={bloco.title}
                style={{
                  width: "260px",
                  flexShrink: 0,
                  borderRadius: "12px",
                  objectFit: "cover",
                  opacity: 0.9,
                }}
              />
            )}
          </div>

          {/* cards */}
          <div
            className="cards-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "16px",
              marginBottom: "40px",
            }}
          >
            {bloco.cards.map((c, i) => (
              <Card key={i} {...c} accent={bloco.accent} />
            ))}
          </div>

          {/* empresas atendidas */}
          <section className="py-32 border-b rounded-3xl mb-10 border-gray-100 bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-wide">
                  empresas que acreditam no <span className="text-[#00c9a7] underline decoration-gray-200">NINNA</span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto font-medium">
                  Conheça as corporações que acreditam e investem no NINNA Hub como motor de transformação e inovação.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {!bloco.empresas || bloco.empresas.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">
                    Nenhum parceiro cadastrado no momento.
                  </div>
                ) : (
                  bloco.empresas.map((e, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      viewport={{ once: true }}
                      className="group relative h-48 bg-white border border-gray-100 rounded-3xl flex items-center justify-center p-8 hover:bg-gray-50 hover:border-[#00c9a7]/30 hover:shadow-xl transition-all overflow-hidden"
                    >
                      {e.logo ? (
                        <img
                          src={e.logo}
                          alt={e.nome}
                          className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 scale-90 group-hover:scale-100"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <Building2 className="w-10 h-10 text-gray-300 group-hover:text-[#00c9a7] transition-colors mb-2" />
                          <span className="font-extrabold text-[#1a1a1a] text-[10px] uppercase tracking-wider block text-center">
                            {e.nome}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </section>
        
          {/* cases */}
          <section className="py-32 bg-[#050911] relative overflow-hidden rounded-3xl mb-10 border-t border-b border-white/5 text-white" id="ninna-cases-section">
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
                <p className="text-white/60 max-w-2xl mx-auto font-semibold mt-4">
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
                          <div className="w-16 h-16 bg-brand-teal/5 border border-brand-teal/20 rounded-2xl flex flex-col items-center justify-center p-2 shadow-sm shrink-0">
                            <MessageSquare className="w-5 h-5 text-[#0ae2b1] mb-0.5" />
                            <span className="text-[8px] font-black text-[#0ae2b1] tracking-widest uppercase">SURI.AI</span>
                          </div>
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
                      <p className="text-white/60 font-semibold text-sm leading-relaxed mb-8">
                        Como uma das maiores redes de varejo farmacêutico do Brasil se uniu à Suri.ai, startup de inteligência artificial do ecossistema NINNA, para digitalizar e otimizar canais de atendimento e engajamento via WhatsApp nacionalmente.
                      </p>
    
                      <div className="space-y-4 mb-8">
                        <div className="flex gap-3">
                          <div className="w-6 h-6 rounded bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Target className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-black uppercase text-white tracking-wide">O Desafio</h4>
                            <p className="text-xs text-white/50 font-semibold leading-relaxed">Atender com agilidade milhares de dúvidas cotidianas sobre lojas e entregas de forma escalável.</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-6 h-6 rounded bg-brand-teal/10 text-[#0ae2b1] flex items-center justify-center shrink-0 mt-0.5">
                            <Rocket className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-black uppercase text-white tracking-wide">A Solução</h4>
                            <p className="text-xs text-white/50 font-semibold leading-relaxed">Integração do motor de inteligência conversacional da Suri.ai ao canal oficial de WhatsApp.</p>
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
                          {/* Startup Logo/Representation */}
                          <div className="w-16 h-16 bg-purple-500/[0.04] border border-purple-100 rounded-2xl flex flex-col items-center justify-center p-2 shadow-sm shrink-0 bg-white">
                            <Cpu className="w-5 h-5 text-purple-600 mb-0.5" />
                            <span className="text-[8px] font-black text-purple-600 tracking-widest uppercase text-center leading-none">MOLD IAX</span>
                          </div>
                          {/* Plus sign divider */}
                          <div className="text-white/40 font-black text-xl">+</div>
                          {/* NINNA Indicator */}
                          <div className="w-16 h-16 bg-brand-teal/5 border border-brand-teal/20 rounded-2xl flex flex-col items-center justify-center p-2 shadow-sm shrink-0">
                            <Zap className="w-5 h-5 text-[#0ae2b1] mb-0.5" />
                            <span className="text-[8px] font-black text-[#0ae2b1] tracking-widest uppercase">NINNA</span>
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
                      <p className="text-white/60 font-semibold text-sm leading-relaxed mb-8">
                        Como a startup do nosso ecossistema focada em inteligência de hardware e processos industriais obteve acesso a recursos de inovação acelerado com fôlego e curadoria consultiva pelo time do NINNA Hub.
                      </p>
    
                      <div className="space-y-4 mb-8">
                        <div className="flex gap-3">
                          <div className="w-6 h-6 rounded bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Target className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-black uppercase text-white tracking-wide">O Desafio</h4>
                            <p className="text-xs text-white/50 font-semibold leading-relaxed">Equipes pequenas de forte base técnica sem tempo para burocracia de fomento contínuo e submissões densas.</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-6 h-6 rounded bg-brand-teal/10 text-[#0ae2b1] flex items-center justify-center shrink-0 mt-0.5">
                            <TrendingUp className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-black uppercase text-white tracking-wide">A Solução</h4>
                            <p className="text-xs text-white/50 font-semibold leading-relaxed">Mapeamento expresso e curadoria de editais efetuada em menos de 1 mês de aceleração integrada no hub.</p>
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
                      <span className="text-[8px] font-black uppercase text-white/40 tracking-wider font-semibold">Estudo / Acesso</span>
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

          {/* CTA / Proposal */}
            <section className="py-32 border-b rounded-3xl mb-10 border-gray-100 bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-12 md:p-24 rounded-[60px] border border-gray-100 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[#00c9a7]/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                    <div>
                      <h3 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 uppercase tracking-wide leading-[1]">Por que ser uma <br /><span className="text-[#00c9a7]">Corporação?</span></h3>
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
       
          {/* CTA do bloco */}
          <button
            style={{
              background: bloco.accent,
              color: "#0B0E1A",
              border: "none",
              borderRadius: "8px",
              padding: "14px 28px",
              fontSize: "14px",
              fontWeight: 800,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "opacity 0.2s",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            {bloco.cta}
          </button>

          

          {/* botão voltar ao topo */}
          <div style={{ marginTop: "40px" }}>
            <button
              onClick={onClose}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.35)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "color 0.2s",
                fontFamily: "inherit",
                padding: 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#00D4D4")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
            >
              <ChevronUp size={16} />
              Voltar à visão geral
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicosPage() {
  const [blocoAtivo, setBlocoAtivo] = useState(null);
  const blocoRefs = useRef({});
  const navRef = useRef(null);

  // injeta CSS de transição uma vez
  useEffect(() => {
    if (document.getElementById("servicos-css")) return;
    const tag = document.createElement("style");
    tag.id = "servicos-css";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);

  // scroll suave ao abrir bloco
  useEffect(() => {
  if (!blocoAtivo) return;
  const timeout = setTimeout(() => {
    const el = blocoRefs.current[blocoAtivo];
    if (!el) return;
    const navHeight = navRef.current?.offsetHeight ?? 0;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top, behavior: "smooth" });
  }, 520);
  return () => clearTimeout(timeout);
}, [blocoAtivo]);

  const toggleBloco = (id) => {
    setBlocoAtivo(prev => (prev === id ? null : id));
  };

  const fecharEVoltar = () => {
    setBlocoAtivo(null);
    setTimeout(() => {
      navRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  return (
    <div
      style={{
        background: "#0B0E1A",
        minHeight: "100vh",
        fontFamily: "'Geist Variable', 'Geist', 'Inter', 'Helvetica Neue', Arial, sans-serif",
        color: "#fff",
      }}
    >
     
    {/* Hero Section */}
    <section className="relative min-h-screen flex items-center pt-20 pb-32 overflow-hidden">
      
      <div className="absolute inset-0 z-0">
        
        <img 
          src="/Imagens_NINNA/header_servicos.png" 
          alt="Hub Atmosphere" 
          className="w-full h-full object-cover scale-100"
          referrerPolicy="no-referrer"
        />
        <div className="w-full h-full object-cover grayscale scale-100" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl"
        >
          
          <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>
          <p
            style={{
              margin: "0 0 16px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#00D4D4",
            }}
          >
            Soluções &amp; Serviços
          </p>
          <h1 className="text-7xl md:text-[100px] font-black tracking-wide leading-[0.85] mb-15 text-[#F5F5F5]">
            NOSSOS{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #00D4D4, #00E676)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              SERVIÇOS
            </span>
          </h1>
          <p
            style={{
              margin: "0 0 40px",
              fontSize: "20px",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.7,
              maxWidth: "560px",
              marginLeft: "10px",
              marginRight: "auto",
            }}
          >
            Soluções sob medida para transformar inovação e dados em resultado real.
          </p>
          <a
          href="https://wa.me/558532114201?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20um%20especialista"
          target="_blank"
          rel="noopener noreferrer"
            style={{
              background: "linear-gradient(90deg, #00D4D4, #00E676)",
              color: "#0B0E1A",
              border: "none",
              borderRadius: "100px",
              padding: "16px 36px",
              fontSize: "14px",
              fontWeight: 800,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "opacity 0.2s",
              fontFamily: "inherit",
            }}
            
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            Fale com um especialista
          </a>
        </div>

               </motion.div>
             </div>
           </section>

      {/* ── NAVIGATOR — O que você quer alcançar? ── */}
      <div
        ref={navRef}
        style={{
          background: "linear-gradient(135deg, #0d1221 0%, #111827 100%)",
          borderBottom: "1px solid #1f2937",
          padding: "48px 0",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
          <p
            style={{
              textAlign: "center",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#6b7280",
              marginBottom: "24px",
            }}
          >
            O que você quer alcançar? <br/>
            Clique em uma das opções abaixo para conhecer o serviço ideal para a sua empresa.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = blocoAtivo === item.id;
              return (
                <button
                  key={item.id}
                  aria-label={item.aria}
                  aria-pressed={isActive}
                  onClick={() => toggleBloco(item.id)}
                  style={{
                    background: isActive ? "#00c9a7" : "rgba(255, 255, 255, 0.04)",
                    border: `1px solid ${isActive ? "#00c9a7" : "rgba(255, 255, 255, 0.08)"}`,
                    borderRadius: "12px",
                    padding: "20px 16px",
                    color: isActive ? "#0f1422" : "#e5e7eb",
                    fontSize: "13px",
                    fontWeight: 600,
                    lineHeight: 1.4,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.25s, border-color 0.25s, color 0.25s, transform 0.15s",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                      e.currentTarget.style.borderColor = "#00c9a7";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  <Icon size={22} aria-hidden="true" style={{ color: isActive ? "#0f1422" : "#00c9a7" }}/>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── BLOCOS (accordion) ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        {BLOCOS.map((bloco) => (
          <div
            key={bloco.id}
            ref={el => (blocoRefs.current[bloco.id] = el)}
          >
            <BlocoSection
              bloco={bloco}
              isOpen={blocoAtivo === bloco.id}
              onClose={fecharEVoltar}
            />
          </div>
        ))}
      </div>

      {/* ── CONVERSÃO FINAL ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #0d1221 0%, #111827 100%)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "100px 24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#00D4D4",
            marginBottom: "16px",
          }}
        >
          Ponto de partida
        </p>
        <h2
          style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            margin: "0 0 16px",
            lineHeight: 1.1,
          }}
        >
          NÃO SABE POR ONDE
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #00D4D4, #00E676)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            COMEÇAR?
          </span>
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "16px",
            lineHeight: 1.7,
            maxWidth: "460px",
            margin: "0 auto 48px",
          }}
        >
          Responda 2 perguntas rápidas e a gente recomenda o melhor caminho para a sua empresa.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          {/* abre bloco1 e scrolla até ele */}
          <button
            onClick={() => toggleBloco("bloco1")}
            style={{
              background: "linear-gradient(90deg, #00D4D4, #00E676)",
              color: "#0B0E1A",
              border: "none",
              borderRadius: "100px",
              padding: "16px 32px",
              fontSize: "14px",
              fontWeight: 800,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "opacity 0.2s",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            Quero um diagnóstico
          </button>
          <a
          href="https://wa.me/558532114201?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20um%20especialista"
          target="_blank"
          rel="noopener noreferrer"
            style={{
              background: "transparent",
              color: "#fff",
              border: "2px solid rgba(255,255,255,0.2)",
              borderRadius: "100px",
              padding: "16px 32px",
              fontSize: "14px",
              fontWeight: 800,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "border-color 0.2s",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
          >
            Quero falar com um expert
          </a>
        </div>
      </div>
    </div>
  );
}