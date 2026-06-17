import { useState, useRef, useEffect } from "react";
import { SearchCheck, Wrench, Rocket, Sprout, Handshake, ChevronUp } from "lucide-react";

const NAV_ITEMS = [
  { id: "bloco1", icon: SearchCheck, label: "Quero clareza onde estou",          aria: "Diagnóstico" },
  { id: "bloco2", icon: Wrench,      label: "Quero estruturar minha inovação",   aria: "Estruturar"  },
  { id: "bloco3", icon: Rocket,      label: "Quero executar com parceiros",      aria: "Executar"    },
  { id: "bloco4", icon: Sprout,      label: "Quero ativar minha cultura",        aria: "Cultura"     },
  { id: "bloco5", icon: Handshake,   label: "Quero me conectar ao ecossistema", aria: "Ecossistema" },
];

const BLOCOS = [
  {
    id: "bloco1",
    title: "Diagnosticar para Decidir",
    subtitle: "Para quem quer clareza antes de agir",
    accent: "#00D4D4",
    cta: "Comece com um diagnóstico →",
    description: "Antes de inovar, é preciso saber onde você está. Nossos diagnósticos combinam metodologias globais com uma leitura precisa da realidade da sua empresa — entregando clareza, prioridades e um ponto de partida sólido para qualquer jornada de transformação.",
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
    cta: "Monte sua estratégia →",
    description: "Ter vontade de inovar não é suficiente — é preciso estrutura. Ajudamos sua empresa a construir os processos, governança e estratégias que transformam iniciativas isoladas em um sistema de inovação contínuo e escalável.",
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
    cta: "Encontre sua solução →",
    description: "Identificar a tecnologia certa e os parceiros ideais faz toda a diferença na execução. Conectamos sua empresa às melhores soluções do mercado e gerenciamos o processo de validação e aceleração de ponta a ponta.",
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
    cta: "Engaje seu time →",
    description: "Inovação começa nas pessoas. Desenvolvemos programas que transformam colaboradores em agentes de mudança — engajando times, formando líderes e criando uma cultura onde novas ideias encontram espaço para crescer.",
    cases: [
      { company: "Empresa G", result: "Formou 120 embaixadores de inovação espalhados por 8 unidades de negócio em 6 meses." },
      { company: "Empresa H", result: "Hackathon corporativo gerou 3 projetos que viraram iniciativas oficiais da empresa." },
    ],
    cards: [ { title: "Programa de Embaixadores",            desc: "Forme líderes internos que disseminam a cultura de inovação de dentro para fora da organização." },
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
    cta: "Faça parte do ecossistema →",
    description: "As melhores oportunidades surgem das conexões certas. Facilitamos o acesso ao ecossistema de inovação — aproximando sua empresa de startups, líderes, investidores e parceiros estratégicos que aceleram resultados reais.",
    cases: [
      { company: "Empresa I", result: "Participou do LICOR e fechou parceria estratégica com outra corporação no mesmo evento." },
      { company: "Empresa J", result: "Imersão técnica no Vale do Silício redefiniu o roadmap de tecnologia para os próximos 3 anos." },
    ],
    cards: [ { title: "LICOR",                              desc: "Encontro exclusivo de líderes de inovação corporativa para troca de experiências e geração de oportunidades." },
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
  .bloco-content.open  { max-height: 3000px; opacity: 1; }
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
          <p style={{
            fontSize: "15px",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.75,
            maxWidth: "680px",
            margin: "0 0 48px",
          }}>
            {bloco.description}
          </p>

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

          {/* cases */}
          <div style={{ marginTop: "68px", marginBottom: "24px" }}>
            <p style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              marginBottom: "16px",
            }}>
              Cases
            </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
            {bloco.cases.map((c, i) => (
              <div key={i} style={{
                  background: bloco.accent + "0D",
                  border: `1px solid ${bloco.accent}30`,
                  borderRadius: "10px",
                  padding: "20px 24px",
                }}>
                  <p style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: 700, color: bloco.accent }}>
                    {c.company}
                  </p>
                  <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                    {c.result}
                  </p>
                </div>
              ))}
            </div>
          </div>

         

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
      {/* ── HEADER ── */}
      <div
        style={{
          background: "linear-gradient(180deg, #0d1221 0%, #0B0E1A 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "80px 0 70px",
          textAlign: "center",
        }}
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
          <h1
            style={{
              margin: "0 0 24px",
              fontSize: "clamp(40px, 8vw, 72px)",
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
            }}
          >
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
              fontSize: "17px",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.7,
              maxWidth: "560px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Soluções sob medida para transformar inovação e dados em resultado real.
          </p>
          <button
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
          </button>
        </div>
      </div>

      {/* ── NAVIGATOR — O que você quer alcançar? ── */}
      <div
        ref={navRef}
        style={{
          background: "#0f1422",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
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
              color: "rgba(255,255,255,0.35)",
              marginBottom: "24px",
            }}
          >
            O que você quer alcançar?
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
                    background: isActive ? "#00D4D4" : "#141827",
                    border: `1px solid ${isActive ? "#00D4D4" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: "12px",
                    padding: "20px 16px",
                    color: isActive ? "#0B0E1A" : "#fff",
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
                      e.currentTarget.style.background = "#1c2338";
                      e.currentTarget.style.borderColor = "#00D4D4";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = "#141827";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  <Icon size={22} aria-hidden="true" />
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
          <button
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
          </button>
        </div>
      </div>
    </div>
  );
}