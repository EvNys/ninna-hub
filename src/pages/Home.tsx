import { motion, AnimatePresence } from "motion/react";
import {
  Rocket,
  Users,
  Globe,
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
  Award,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";
import { db } from "../lib/firebase";
// Lista de parceiros de fallback fica em src/data/parceiros-fallback.ts.
import { PARCEIROS_FALLBACK } from "../data/parceiros-fallback";

const getAwardDescription = (
  titulo: string,
  organizacao: string,
  ano: string,
) => {
  const normTitle = titulo.toLowerCase();
  if (
    normTitle.includes("hub") ||
    normTitle.includes("referência") ||
    normTitle.includes("referencia")
  ) {
    if (ano === "2026") {
      return "Consolidado como a principal referência regional em conexões estratégicas, viabilizando o contato direto entre as corporações líderes do mercado e as startups de tecnologia mais promissoras.";
    }
    if (ano === "2025") {
      return "Reconhecimento pela excelência no fomento e consolidação do ecossistema de inovação, estruturando conexões que aceleram a transformação tecnológica e geram negócios expressivos.";
    }
    return `Indicador de maturidade e impacto na facilitação de negócios no Ceará, integrando com excelência soluções corporativas e novos empreendimentos em ${ano}.`;
  }
  if (normTitle.includes("destaque") || normTitle.includes("fomento")) {
    return "Chancela de prestígio por estruturar dinâmicas inovadoras e atuar de forma decisiva na capacitação e visibilidade de novos produtos e serviços digitais.";
  }
  if (normTitle.includes("melhor") || normTitle.includes("hub")) {
    return "Eleito de forma unânime pelas startups parceiras como o melhor ambiente de coworking e conexão estratégica do Nordeste brasileiro.";
  }
  if (
    normTitle.includes("inovação") ||
    normTitle.includes("aberta") ||
    normTitle.includes("inovacao")
  ) {
    return "Chancela especial concedida para as metodologias singulares do Hub na facilitação de provas de conceito e novos canais de faturamento entre indústrias e tecnologias ágeis.";
  }
  return `Conquista histórica que atesta nossos resultados práticos de inovação aberta, facilitação de negócios e cultura de excelência promovida no ano de ${ano} em conjunto com a ${organizacao}.`;
};

const Home = () => {
  const [kpis, setKpis] = useState<any>(null);
  const [parceiros, setParceiros] = useState<any[]>([]);
  const [awards, setAwards] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kpiDoc = await getDoc(doc(db, "kpis", "main"));
        if (kpiDoc.exists()) {
          setKpis(kpiDoc.data());
        }

        const parceirosQuery = query(
          collection(db, "parceiros"),
          where("status", "==", "ativo"),
        );
        const parceirosSnap = await getDocs(parceirosQuery);
        const dbParceiros = parceirosSnap.docs.map((doc) => {
          const data = doc.data();
          let logoUrl = data.logo;
          // Update/force correct local path for IGC / UECE logo
          if (
            (data.nome && data.nome.toLowerCase().includes("igc")) ||
            (data.logo && data.logo.toLowerCase().includes("igc"))
          ) {
            logoUrl = "../Imagens_NINNA/IGCLogo.png";
          } else if (
            (data.nome && data.nome.toLowerCase().includes("uece")) ||
            (data.logo && data.logo.toLowerCase().includes("uece"))
          ) {
            logoUrl = "../Imagens_NINNA/Uece.png";
          }
          return { id: doc.id, ...data, logo: logoUrl } as any;
        });

        // Fail-safe backup list with local high-contrast paths
        const backupParceiros = PARCEIROS_FALLBACK;

        // Combine DB models & static local overrides safely
        const combined = [...dbParceiros] as any[];
        backupParceiros.forEach((backup) => {
          const matchedIndex = combined.findIndex((c) => {
            const nameLower = c.nome?.toLowerCase() || "";
            const backupLower = backup.nome.toLowerCase();
            if (backupLower === "uece" || backupLower.includes("uece")) {
              return (
                nameLower.includes("uece") ||
                nameLower.includes("universidade estadual")
              );
            }
            if (backupLower.includes("gestão") || backupLower === "igc") {
              return (
                nameLower.includes("igc") ||
                nameLower.includes("gestão e cidadania") ||
                nameLower.includes("gestao e cidadania")
              );
            }
            return nameLower === backupLower;
          });

          if (matchedIndex === -1) {
            combined.push(backup);
          } else {
            // override the logo if found to make sure the paths are pristine
            combined[matchedIndex].logo = backup.logo;
          }
        });

        // Sanitize & Deduplicate:
        // 1. Remove Any duplicate card or card whose exact name is "IGC"
        // 2. Ensure UECE branding logo handles are fully resolved
        const finalPartners: any[] = [];
        const seen = new Set<string>();

        combined.forEach((partner) => {
          const nameLower = partner.nome?.toLowerCase() || "";

          let groupKey = nameLower;
          if (
            nameLower.includes("uece") ||
            nameLower.includes("universidade estadual")
          ) {
            groupKey = "uece";
            partner.nome = "UECE";
            partner.logo = "../Imagens_NINNA/Uece.png";
          } else if (
            nameLower.includes("igc") ||
            nameLower.includes("gestão e cidadania") ||
            nameLower.includes("gestao e cidadania")
          ) {
            groupKey = "igc";
            partner.nome = "Instituto de Gestão e Cidadania";
            partner.logo = "../Imagens_NINNA/IGCLogo.png";
          }

          // Strict filter out card if name is literally "IGC" as requested
          if (partner.nome === "IGC") {
            return;
          }

          if (!seen.has(groupKey)) {
            seen.add(groupKey);
            finalPartners.push(partner);
          }
        });

        setParceiros(finalPartners);

        const awardsQuery = query(
          collection(db, "premiacoes"),
          where("status", "==", "ativo"),
        );
        const awardsSnap = await getDocs(awardsQuery);
        setAwards(
          awardsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
      } catch (error) {
        console.error("Error fetching home data:", error);
        // Fallback array on error to keep UI highly populated
        const backupParceiros = PARCEIROS_FALLBACK;
        setParceiros(backupParceiros);
      }
    };

    fetchData();
  }, []);

  const pillars = [
    {
      title: "Empresas",
      description:
        "Apoiamos empresas na construção de estratégias de inovação, conectando desafios reais às melhores soluções do ecossistema por meio de programas, conexões e experiências que geram resultados.",
      icon: <Target className="w-12 h-12" />,
      link: "/Empresas",
    },
    {
      title: "Startups",
      description:
        "Conectamos startups a oportunidades de mercado, mentorias, grandes empresas, investidores e programas que impulsionam seu desenvolvimento e ampliam seu potencial de crescimento.",
      icon: <Rocket className="w-12 h-12" />,
      link: "/startups",
    },
    {
      title: "Ecossistema",
      description:
        "Promovemos encontros, eventos, networking e experiências que aproximam empreendedores, executivos, universidades e investidores para fortalecer a cultura de inovação e gerar novas oportunidades de negócio.",
      icon: <Globe className="w-12 h-12" />,
      link: "/Ecossistema",
    },
  ];

  const TESTIMONIALS = [
    {
      id: 1,
      nome: "Tiago Amarante",
      cargo: "CEO e Fundador",
      empresa: "SURI",
      texto:
        "O Ninna é um local de muitas trocas, onde existem grandes empresas que podem impulsionar as startups. A Suri estava procurando exatamente esse tipo de local que pudesse impulsionar dentro das ideias do que a gente já vinha trabalhando.",
      avatar: "Fotos do Time NINNA/TiagoAmarante.webp",
    },
    {
      id: 2,
      nome: "Lucas Melo",
      cargo: "Fundador e Diretor Médico",
      empresa: "Straloo",
      texto:
        "O que me chamou a atenção foram os eventos. Sempre tem alguns eventos legais que a gente acaba participando. Teve uma palestra do Deusmar que foi bem bacana, super aberto falando de tudo, foi bem legal.",
      avatar: "Fotos do Time NINNA/LucasMelo.webp",
    },
    {
      id: 3,
      nome: "Paulo Pelaez",
      cargo: "Fundador",
      empresa: "Lovel",
      texto:
        "Conheci o NINNA através de um evento de inovação e o espaço me atraiu muito. O grande diferencial é estar em contato com quem está na mesma jornada que você.",
      avatar: "Fotos do Time NINNA/PauloPelaez.webp",
    },
  ];

  return (
    <div className="overflow-hidden bg-[#fafafa]">
      <meta
        name="description"
        content="Landing page do NINNA Hub, o espaço de inovação e conexão entre startups, empresas e profissionais."
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 pb-32 overflow-hidden">
        {/* Invading Shapes */}

        <div className="absolute inset-0 z-0">
          <img
            src="/Imagens_NINNA/CONECTAR CRESCER RESULTAR (1).png"
            alt="Hub Atmosphere"
            className="w-full h-full object-cover scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="w-full h-full object-cover grayscale scale-110" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-brand-teal/5 border border-brand-teal/10 mb-10 backdrop-blur-sm"
            >
              <div className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-teal">
                Inovação se dá pelo resultado
              </span>
            </motion.div>

            <h1 className="text-7xl md:text-[80px] font-black tracking-wide leading-[1.00] mb-8 text-[#F5F5F5]">
              CONECTANDO PESSOAS
              <br className="mb-6" />
              <span className="gradient-text">NEGÓCIOS E</span>{" "}
              <span className="inline-block px-6 py-2 md:px-5 md:py-4 bg-gradient-to-r from-brand-teal to-brand-green text-white rounded-3xl md:rounded-[48px] shadow-xl shadow-brand-teal/20 transform hover:scale-[1.02] transition-transform duration-300 align-middle">
                INOVAÇÃO
              </span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
              <p className="text-xl text-[#F5F5F5] leading-relaxed border-l-2 border-brand-teal pl-8 md:col-span-2 font-medium">
                No NINNA Hub, startups, empresas, investidores e instituições
                encontram o ambiente ideal para colaborar, desenvolver soluções
                e construir o futuro da inovação.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 pt-7 sm:space-y-0 sm:space-x-6">
              <Link
                to="/startups"
                className="btn-primary flex items-center justify-center h-16 px-10 text-lg shadow-lg shadow-brand-teal/20"
              >
                Fazer Parte <ArrowRight className="ml-2 w-6 h-6" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pillars & Hub Reference Unified Section */}
      <section
        className="py-32 bg-[#1a1a2e] relative overflow-hidden text-white"
        id="nossas-frentes-section"
      >
        {/* Background Image with Dark Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2000"
            alt="Frentes Background"
            className="w-full h-full object-cover opacity-10 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] via-brand-darker/95 to-[#0a0e17] z-10" />
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#fafafa] to-transparent pointer-events-none z-10 opacity-5" />
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-brand-teal/10 blur-[130px] rounded-full z-15" />
          <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-brand-green/10 blur-[130px] rounded-full z-15" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          {/* Part 1: O Maior Hub de Inovação do Nordeste */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                Referência em Inovação
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 uppercase tracking-wide leading-[1]">
                O HUB QUE CONECTA <br />
                <span className="text-brand-teal">INOVAÇÃO A RESULTADOS</span>
              </h2>
              <p className="text-white/60 text-xl font-medium leading-relaxed max-w-xl">
                O NINNA Hub conecta grandes empresas, startups, investidores,
                universidades e lideranças para transformar desafios em
                oportunidades de negócio. Somos um ambiente onde conexões geram
                inovação, crescimento e impacto para todo o ecossistema.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-[40px] overflow-hidden border border-white/10 shadow-2xl relative group">
                <video
                  src="../Imagens_NINNA/Ninna-Hub-Apresentacao.mp4"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  autoPlay
                  loop
                  muted
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/80 to-transparent" />
              </div>
            </motion.div>
          </div>

          {/* Minimal Elegant Divider */}
          <div className="w-full h-[1px] bg-white/10 my-24" />

          {/* Part 2: Nossas Frentes */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <div className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-[10px] font-black uppercase tracking-wider mb-4">
                Nossas Frentes
              </div>
              <h2 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-wide">
                UM ECOSSISTEMA.{" "}
                <span className="gradient-text font-black">
                  MÚLTIPLAS FORMAS DE GERAR IMPACTO
                </span>
              </h2>
              <p className="text-white/60 text-xl leading-relaxed font-barlow">
                Criamos conexões estratégicas entre empresas, startups e
                comunidade para acelerar a inovação aberta, desenvolver novos
                negócios e fortalecer o ecossistema de inovação do Nordeste.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 tracking-wider md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => {
              // Custom details for each card to make them extremely striking and differentiated
              const customDetails = [
                {
                  badge: "Corporate",
                  borderGlow:
                    "group-hover:border-brand-teal/50 hover:shadow-brand-teal/15",
                  gradientLine: "from-brand-teal to-[#0ae2b1]",
                  number: "01",
                  tagline: "Inovação Aberta & Conectividade",
                },
                {
                  badge: "Aceleração",
                  borderGlow:
                    "group-hover:border-[#0ae2b1]/50 hover:shadow-[#0ae2b1]/15",
                  gradientLine: "from-[#0ae2b1] to-brand-green",
                  number: "02",
                  tagline: "Tração & Fomento Expresso",
                },
                {
                  badge: "Comunidade",
                  borderGlow:
                    "group-hover:border-brand-green/50 hover:shadow-brand-green/15",
                  gradientLine: "from-brand-green to-brand-teal",
                  number: "03",
                  tagline: "Espaços & Eventos Premium",
                },
              ][index];

              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`bg-white/[0.03] backdrop-blur-md border border-white/10 p-12 group hover:bg-white/[0.06] transition-all duration-500 relative overflow-hidden h-full flex flex-col justify-between rounded-[48px] shadow-2xl ${customDetails.borderGlow}`}
                  id={`pillar-card-frente-${index}`}
                >
                  {/* Decorative Gradient Line on top */}
                  <div
                    className={`absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r ${customDetails.gradientLine} transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500`}
                  />

                  {/* Watermark Number */}
                  <div className="absolute right-8 top-6 select-none pointer-events-none text-white/[0.02] font-black text-8xl tracking-wide group-hover:text-white/[0.04] transition-colors duration-500">
                    {customDetails.number}
                  </div>

                  <div>
                    {/* Header: Icon & Badge */}
                    <div className="flex items-center justify-between mb-10">
                      <div className="w-16 h-16 rounded-3xl bg-brand-teal/5 border border-brand-teal/10 flex items-center justify-center text-brand-teal group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg shadow-brand-teal/5">
                        {pillar.icon}
                      </div>
                      <span className="text-[8px] font-black tracking-[0.2em] text-brand-teal bg-brand-teal/10 border border-brand-teal/25 px-2.5 py-1 rounded-full uppercase">
                        {customDetails.badge}
                      </span>
                    </div>

                    {/* Tagline */}
                    <span className="block text-[9px] font-black tracking-widest text-[#0ae2b1] uppercase mb-2">
                      {customDetails.tagline}
                    </span>

                    {/* Title */}
                    <h3 className="text-3xl font-black mb-6 uppercase tracking-wide text-white group-hover:text-brand-teal transition-colors">
                      {pillar.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/50 mb-12 leading-relaxed text-base font-barlow group-hover:text-white/70 transition-colors">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Call to action */}
                  <Link
                    to={pillar.link}
                    className="inline-flex items-center text-[#0ae2b1] font-black text-xs tracking-[0.2em] uppercase group-hover:underline mt-auto cursor-pointer"
                  >
                    Explorar Frente
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>

                  {/* Faint Abstract Aura in background on hover */}
                  <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-brand-teal/5 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Números do NINNA */}
      <section
        className="py-32 bg-[#fafafa] relative overflow-hidden border-y border-gray-100"
        id="numeros-do-ninna"
      >
        {/* Subtle Decorative background glows */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-brand-teal/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-12 right-12 w-[400px] h-[400px] bg-brand-green/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-gray-900">
          {/* Grid principal: imagem à esquerda (altura total) + título e KPIs à direita */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Coluna Esquerda - Imagem (fica ao lado do título + cards) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[5/5] w-full rounded-[40px] overflow-hidden bg-gray-200 border border-gray-100 shadow-lg">
                <img
                  src="../Imagens_NINNA/eco-scaled.jpg"
                  alt="NINNA"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Coluna Direita - Título + Grade de KPIs */}
            <div>
              {/* Título fica apenas em cima dos cards, não centralizado no topo da seção */}
              <div className="mb-12 space-y-4">
                <div className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/5 border border-brand-teal/10 text-brand-teal text-[10px] font-black uppercase tracking-[0.3em]">
                  Números
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-wide">
                  O IMPACTO DO <br />
                  <span className="text-brand-teal">NINNA HUB</span>
                </h2>
                <p className="text-gray-500 font-barlow text-lg leading-relaxed">
                  Mais do que indicadores, estes números representam empresas
                  transformadas, startups fortalecidas e conexões que geraram
                  novos negócios para o ecossistema.
                </p>
                <div className="h-[2px] w-20 bg-brand-teal mt-4" />
              </div>

              <div className="grid grid-cols-2 gap-8">
                {/* KPI 1 - Eventos Realizados */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white border border-gray-100 p-10 rounded-[40px] shadow-lg hover:shadow-2xl hover:border-brand-teal/20 transition-all duration-500 group flex flex-col items-center text-center gap-4"
                  id="marco-kpi-1"
                >
                  <div className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-900 tabular-nums">
                    {kpis?.kpi1_value || "100"}
                  </div>
                  <div className="w-10 h-[2px] bg-brand-teal/30 rounded-full" />
                  <div className="text-brand-teal uppercase text-[9px] sm:text-[10px] font-black tracking-[0.2em]">
                    {kpis?.kpi1_label || "Eventos Realizados"}
                  </div>
                </motion.div>

                {/* KPI 2 - Conexões com Negócios */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white border border-gray-100 p-10 rounded-[40px] shadow-lg hover:shadow-2xl hover:border-brand-teal/20 transition-all duration-500 group flex flex-col items-center text-center gap-4"
                  id="marco-kpi-2"
                >
                  <div className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-900 tabular-nums">
                    {kpis?.kpi2_value || "200"}
                  </div>
                  <div className="w-10 h-[2px] bg-brand-teal/30 rounded-full" />
                  <div className="text-brand-teal uppercase text-[9px] sm:text-[10px] font-black tracking-[0.2em]">
                    {kpis?.kpi2_label || "Conexões com Negócios"}
                  </div>
                </motion.div>

                {/* KPI 3 - Negócios em Milhões */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-white border border-gray-100 p-10 rounded-[40px] shadow-lg hover:shadow-2xl hover:border-brand-teal/20 transition-all duration-500 group flex flex-col items-center text-center gap-4"
                  id="marco-kpi-3"
                >
                  <div className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-900 tabular-nums">
                    {kpis?.kpi3_value || "35"}
                  </div>
                  <div className="w-10 h-[2px] bg-brand-teal/30 rounded-full" />
                  <div className="text-brand-teal uppercase text-[9px] sm:text-[10px] font-black tracking-[0.2em]">
                    {kpis?.kpi3_label || "Em Negócios Gerados"}
                  </div>
                </motion.div>

                {/* KPI 4 - Startups Impactadas */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white border border-gray-100 p-10 rounded-[40px] shadow-lg hover:shadow-2xl hover:border-brand-teal/20 transition-all duration-500 group flex flex-col items-center text-center gap-4"
                  id="marco-kpi-4"
                >
                  <div className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-900 tabular-nums">
                    {kpis?.kpi4_value || "1400"}
                  </div>
                  <div className="w-10 h-[2px] bg-brand-teal/30 rounded-full" />
                  <div className="text-brand-teal uppercase text-[9px] sm:text-[10px] font-black tracking-[0.2em]">
                    {kpis?.kpi4_label || "Startups Impactadas"}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*Antigo Awards Section */}
      <section
        className="py-32 bg-[#050911] relative overflow-hidden border-t border-gray-100"
        id="premiacoes-section"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-teal/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-brand-teal/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-brand-green/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24 space-y-4">
            <span className="text-brand-teal font-black uppercase text-[10px] tracking-[0.3em] bg-brand-teal/5 border border-brand-teal/10 px-4 py-1.5 rounded-full inline-block">
              Reconhecimento & Impacto
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-wide">
              NOSSAS <span className="text-brand-teal">CONQUISTAS</span>
            </h2>
            <p className="text-gray-500 font-barlow text-lg max-w-2xl mx-auto">
              O trabalho desenvolvido pelo NINNA Hub é reconhecido nacionalmente
              por fortalecer o ecossistema de inovação, impulsionar a inovação
              aberta e criar conexões que transformam organizações e pessoas.
            </p>
            <div className="h-[2px] w-20 bg-brand-teal mx-auto mt-4" />
          </div>

          {(() => {
            // Fallback default list (mesmo conteúdo original)
            const defaultAwards = [
              {
                id: "aw-default-1",
                titulo: "Hub Referência",
                ano: "2026",
                organizacao: "Prêmio Nordeste Inovação",
                imagem: "",
              },
              {
                id: "aw-default-2",
                titulo: "Hub Referência",
                ano: "2025",
                organizacao: "Startup Awards Brasil",
                imagem: "",
              },
              {
                id: "aw-default-3",
                titulo: "Melhor Hub de Inovação",
                ano: "2024",
                organizacao: "Associação Cearense de Startups",
                imagem: "",
              },
              {
                id: "aw-default-4",
                titulo: "Inovação Aberta",
                ano: "2023",
                organizacao: "Prêmio Eco Inovar",
                imagem: "",
              },
            ];

            const baseList = awards.length > 0 ? awards : defaultAwards;

            // Ordena por ano, do maior para o menor
            const sortedAwards = [...baseList].sort(
              (a, b) => parseInt(b.ano, 10) - parseInt(a.ano, 10),
            );

            // Quebra a lista em grupos de 5 (uma timeline por grupo)
            const ITEMS_PER_ROW = 4;
            const rows = [];
            for (let i = 0; i < sortedAwards.length; i += ITEMS_PER_ROW) {
              rows.push(sortedAwards.slice(i, i + ITEMS_PER_ROW));
            }

            const renderRow = (list: any[]) => (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-4 relative">
                {/* Horizontal Line Connector for Desktop */}
                <div className="hidden lg:block absolute top-[4.5rem] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-brand-teal/20 via-[#0ae2b1] to-brand-green/20 z-0" />

                {list.map((award, idx) => (
                  <motion.div
                    key={award.id || idx}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15, duration: 0.5 }}
                    className="relative z-10 flex flex-col items-center text-center px-4 group"
                  >
                    {/* Icon / Image badge */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-brand-teal/10 blur-xl rounded-full scale-125 group-hover:scale-130 transition-transform duration-500" />
                      {award.imagem ? (
                        <img
                          src={award.imagem}
                          alt={award.titulo}
                          className="relative z-10 w-20 h-20 object-contain bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[28px] shadow-lg p-3 group-hover:border-[#0ae2b1]/40 group-hover:scale-110 transition-all duration-300"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="relative z-10 w-20 h-20 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[28px] shadow-lg flex items-center justify-center group-hover:border-[#0ae2b1]/40 group-hover:scale-110 transition-all duration-300">
                          <Award className="w-8 h-8 text-[#0ae2b1]" />
                        </div>
                      )}

                      {/* Destaque Badge (estrela) */}
                      {(award.destaque === true ||
                        award.destaque === "true") && (
                        <div className="absolute -top-2 -left-2 z-20 w-7 h-7 bg-yellow-400 text-gray-950 rounded-full flex items-center justify-center shadow-lg border-2 border-[#050911]">
                          <Star className="w-3.5 h-3.5 fill-gray-950" />
                        </div>
                      )}

                      {/* Year Badge */}
                      <div className="absolute -top-2 -right-2 z-20 px-2.5 h-7 bg-[#0ae2b1] text-gray-950 text-[11px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-[#050911]">
                        {award.ano}
                      </div>
                    </div>

                    {/* Info */}
                    <h3 className="text-xl font-black text-white uppercase tracking-wide mb-2 group-hover:text-[#0ae2b1] transition-colors">
                      {award.titulo}
                    </h3>
                    <p className="text-sm text-white/50 font-barlow leading-relaxed max-w-[200px] lg:max-w-none group-hover:text-white/70 transition-colors">
                      {award.organizacao}
                    </p>

                    {/* Mobile Connector Arrow */}
                    {idx < list.length - 1 && (
                      <div className="block lg:hidden my-4 text-[#0ae2b1]/60 animate-pulse text-lg font-black font-mono">
                        ↓
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            );

            return (
              <>
                {rows.map((row, rowIdx) => (
                  <div key={rowIdx} className={rowIdx > 0 ? "mt-16" : ""}>
                    {renderRow(row)}
                  </div>
                ))}
              </>
            );
          })()}
        </div>
      </section>

      {/* Innovation Reference Section */}

      {/* Partners Section */}
      <section className="py-32 bg-[#fafafa] overflow-hidden border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3
              id="empresas-parceiras-titulo"
              className="text-gray-400 uppercase text-[20px] font-black tracking-[0.3em] mb-4"
            >
              instituições que acreditam no NINNA
            </h3>
            <div className="h-[2px] w-12 bg-brand-teal mx-auto" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {parceiros.length > 0
              ? parceiros.map((p, index) => (
                  <motion.div
                    key={p.id || index}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: Math.min(index * 0.05, 0.3),
                    }}
                    viewport={{ once: true }}
                    className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-md hover:shadow-xl hover:border-brand-teal/20 transition-all duration-300 hover:scale-[1.02] min-h-[110px] group"
                    id={`partner-card-${p.id || index}`}
                  >
                    {p.logo ? (
                      <div className="h-16 w-full flex items-center justify-center">
                        <img
                          src={p.logo}
                          alt={p.nome}
                          className="max-h-full max-w-[85%] object-contain filter scale-95 group-hover:scale-100"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-3xl mb-2">🏢</span>
                        <span className="font-extrabold text-[#1a1a1a] text-[10px] uppercase tracking-wider block">
                          {p.nome}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))
              : Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[110px] animate-pulse"
                      id={`partner-skeleton-${i}`}
                    >
                      <div className="h-10 w-24 bg-gray-200 rounded-lg" />
                    </div>
                  ))}

            <div className="col-span-full mt-20">
              {/* Header */}
              <div className="text-center mb-12">
                <span className="text-brand-teal font-black uppercase text-[10px] tracking-[0.3em] bg-brand-teal/5 border border-brand-teal/10 px-4 py-1.5 rounded-full inline-block mb-4">
                  O que dizem sobre nós
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-wide">
                  QUEM ACREDITA <span className="text-brand-teal">FALA</span>
                </h2>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TESTIMONIALS.map((t, index) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-md hover:shadow-xl hover:border-brand-teal/20 transition-all duration-300 flex flex-col gap-4"
                  >
                    <span className="text-brand-teal text-4xl font-black leading-none select-none">
                      "
                    </span>
                    <p className="text-gray-600 font-medium text-base leading-relaxed flex-1">
                      {t.texto}
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      {t.avatar ? (
                        <img
                          src={t.avatar}
                          alt={t.nome}
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal font-black text-sm shrink-0">
                          {t.nome.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-black text-gray-900 text-sm">
                          {t.nome}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {t.cargo} · {t.empresa}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-36 relative bg-[#050911] overflow-hidden text-white border-t border-white/5"
        id="pronto-para-inovar-cta"
      >
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2000"
            alt="Prontos Para Inovar Background"
            className="w-full h-full object-cover opacity-15 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050911] via-[#050911]/90 to-[#021f1e]/85 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050911]/60 to-[#050911] z-10" />

          {/* Subtle light blobs */}
          <div className="absolute -top-1/4 -left-1/4 w-[500px] h-[500px] bg-brand-teal/15 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-brand-green/10 blur-[150px] rounded-full pointer-events-none" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Tag / Badge */}
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-[10px] font-black uppercase tracking-[0.3em]">
              Sua Jornada Começa Aqui
            </div>

            {/* Beautiful Heading */}
            <h2 className="text-5xl md:text-6xl font-black mb-8 uppercase tracking-wide leading-[0.9] text-white">
              FAÇA PARTE DO <br /> FUTURO DA&nbsp;
              <span className="gradient-text font-black">INOVAÇÃO</span>
            </h2>

            {/* Description */}
            <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto font-regular leading-relaxed">
              Seja para acelerar uma startup, transformar sua empresa ou ampliar
              sua rede de conexões, o NINNA Hub é o ambiente certo para inovar
              com propósito, colaboração e resultados.
            </p>

            {/* Call to Actions with high design finish */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-4">
              <Link
                to="/startups"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-[#0ae2b1] hover:bg-brand-teal text-gray-950 font-black uppercase text-[11px] tracking-widest hover:scale-105 active:scale-95 shadow-xl shadow-[#0ae2b1]/20 transition-all text-center"
              >
                Quero acelerar minha Startup
              </Link>
              <Link
                to="/empresas"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white hover:bg-white/95 text-gray-950 font-black uppercase text-[11px] tracking-widest hover:scale-105 active:scale-95 shadow-xl shadow-white/5 transition-all text-center"
              >
                Quero inovar minha Empresa
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
