import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Rocket, 
  Handshake, 
  Users, 
  Compass, 
  Trophy, 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert,
  HeartPlus,
  Linkedin,
  MessageSquare,
  Target,
  TrendingUp,
  Cpu,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Ninna4Startups = () => {
  const [mentores, setMentores] = useState<any[]>([]);
  const [beneficios, setBeneficios] = useState<any[]>([]);
  const [loadingMentores, setLoadingMentores] = useState(true);
  const [loadingBeneficios, setLoadingBeneficios] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Mentores
        const mQ = query(
          collection(db, 'mentores'), 
          where('status', '==', 'ativo'),
          orderBy('ordem', 'asc')
        );
        const mSnapshot = await getDocs(mQ);
        setMentores(mSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoadingMentores(false);

        // Fetch Beneficios
        const bQ = query(
          collection(db, 'beneficios'), 
          where('status', '==', 'ativo'),
          orderBy('ordem', 'asc')
        );
        const bSnapshot = await getDocs(bQ);
        setBeneficios(bSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoadingBeneficios(false);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  const pilares = [
    {
      icon: Handshake,
      title: "Conexões com o Mercado",
      desc: "Pontes de negócios diretas e parcerias estruturadas com grandes empresas e corporações líderes do mercado para viabilizar pilotos, validações e os primeiros grandes contratos comerciais (B2B)."
    },
    {
      icon: Users,
      title: "Apoio de uma Rede de Mentores",
      desc: "Mentoria de verdade focada em dores do dia a dia. Conexão direta com fundadores, executivos e especialistas consolidados que ajudam a desenhar caminhos rápidos para ultrapassar gargalos operacionais."
    },
    {
      icon: Compass,
      title: "Posicionamento da Empresa",
      desc: "Ajudamos no refinamento de marca, marketing estratégico, go-to-market e posicionamento institucional. Destaque-se na sua indústria com a chancela de credibilidade do NINNA Hub."
    },
    {
      icon: Trophy,
      title: "Apoio a Premiações",
      desc: "Curadoria e preparo de candidaturas para listas de destaque nacional, rankings setoriais e premiações renomadas no cenário tech. Colocamos sua startup sob os holofotes do mercado."
    },
    {
      icon: Coins,
      title: "Acesso a Fundo e Investimentos",
      desc: "Proximidade contínua com redes de investidores anjo qualificados, syndicates e fundos de venture capital parceiros. Orientação técnica no pitch deck e modelagem para rodadas pre-seed e seed."
    }
  ];

  return (
    <div className="pb-32 bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32 bg-brand-darker">
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
              <div className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-brand-teal/20">
                Iniciativa Exclusiva
              </div>
              <h1 className="text-5xl md:text-8xl font-black mb-8 uppercase tracking-tighter leading-none text-white ">
                NINNA <span className="text-brand-teal">4 STARTUPS</span>
              </h1>
              <p className="text-xl text-gray-400 mb-12 font-medium leading-relaxed max-w-3xl mx-auto">
                Dedicado a apoiar os negócios inovadores a superarem seus períodos mais desafiadores, impulsionando sua jornada comercial e de captação para evitar que excelentes ideias se percam cedo demais.
              </p>

              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  to="/empresas"
                  className="bg-brand-teal hover:bg-brand-teal/90 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-brand-teal/20 flex items-center gap-3"
                >
                  Faça Parte do NINNA <Rocket className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Death Valley & Challenge Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            <div className="lg:col-span-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-red-200">
                O Grande Desafio
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter  leading-none mb-6">
                VENCENDO O <br />
                <span className="text-red-600">VALE DA MORTE</span>
              </h2>
              <p className="text-gray-500 font-medium text-lg leading-relaxed mb-6">
                Muitas das melhores ideias e soluções morrem cedo demais. A fase inicial e o caminho até a maturação comercial são cheios de incertezas, falta de capital, processos burocráticos lentos e ciclos infinitos de vendas B2B.
              </p>
              <p className="text-gray-500 font-medium text-lg leading-relaxed">
                O programa <span className="font-extrabold text-brand-darker">NINNA 4 Startups</span> foi desenhado especificamente para atuar como um escudo estratégico durante essa etapa mais difícil. Protegemos e aceleramos a tração da sua empresa com as forças motrizes que fazem de fato a diferença.
              </p>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-100 p-8 rounded-[32px] shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-6">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight  mb-2">90% das Startups</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  Enfrentam dificuldades severas de tração comercial e estagnação financeira nos primeiros 2 anos.
                </p>
              </div>

              <div className="bg-white border border-gray-100 p-8 rounded-[32px] shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center mb-6">
                  <HeartPlus className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight  mb-2">Sobrevivência Ativa</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  A nossa intervenção e apoio contínuo dão fôlego e velocidade às conexões e validação das soluções.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Numbers Section */}
      <section className="py-24 bg-brand-darker relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-teal blur-[120px] rounded-full pointer-events-none" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 space-y-4 max-w-3xl mx-auto" id="ninna4startups-numbers-title">
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-[10px] font-black uppercase tracking-[0.3em]">
              Resultados Práticos
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter ">
              NOSSOS NÚMEROS NO <span className="text-brand-teal">ECOSSISTEMA</span>
            </h2>
            <p className="text-gray-400 font-semibold text-base leading-relaxed">
              Evidências reais do nosso compromisso de viabilizar conexões, atrair investimentos e impulsionar caminhos de sucesso.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-sm hover:border-brand-teal/30 hover:bg-white/[0.07] transition-all duration-300"
            >
              <span className="block text-6xl md:text-7xl font-black text-brand-teal tracking-tighter  mb-4">
                +500
              </span>
              <h3 className="text-lg font-black text-white uppercase tracking-tight  mb-2">
                Conexões com Mercado
              </h3>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                Pontes comerciais de alto impacto abertas diretamente com grandes corporações e líderes de mercado.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-sm hover:border-brand-teal/30 hover:bg-white/[0.07] transition-all duration-300"
            >
              <span className="block text-6xl md:text-7xl font-black text-brand-teal tracking-tighter  mb-4">
                +3 Milhões
              </span>
              <h3 className="text-lg font-black text-white uppercase tracking-tight  mb-2">
                Em Investimentos
              </h3>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                Recursos financeiros relevantes captados e estruturados nos últimos 2 anos de atuação direta.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -8 }}
              className="bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-sm hover:border-brand-teal/30 hover:bg-white/[0.07] transition-all duration-300"
            >
              <span className="block text-6xl md:text-7xl font-black text-brand-teal tracking-tighter  mb-4">
                3
              </span>
              <h3 className="text-lg font-black text-white uppercase tracking-tight  mb-2">
                Startups Top 3 Nacionais
              </h3>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                Soluções aceleradas pelo NINNA chanceladas e posicionadas no pódio das metodologias e premiações nacionais mais exigentes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Pillars of Support (Como atuar) */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-teal/5 blur-[160px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-brand-teal/20">
              Pilares de Atuação
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter ">
              COMO APOIAMOS <span className="gradient-text">SUA STARTUP</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium mt-4">
              Dividimos nossa atuação em 5 pilares fundamentais, agindo diretamente nos pontos onde o ecossistema é mais exigente e vital para o crescimento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pilares.map((pilar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="group p-8 bg-[#fafafa] border border-gray-100 rounded-[40px] hover:bg-white hover:border-brand-teal/20 hover:shadow-2xl hover:shadow-brand-teal/5 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-brand-teal/10 rounded-2xl flex items-center justify-center shrink-0 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <pilar.icon className="text-brand-teal w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-tight ">
                  {pilar.title}
                </h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  {pilar.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentoring Section */}
      <section id="mentorias" className="py-32 bg-gray-950 text-white relative overflow-hidden">
        {/* Background Image with 60% opacity and dark overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000" 
            alt="Programa de Mentorias" 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-gray-950/60" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mb-20">
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/15 text-brand-teal text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-brand-teal/30">
              Experiência Compartilhada
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter  leading-none mb-6">
              PROGRAMA DE <br />
              <span className="gradient-text">MENTORIAS</span>
            </h2>
            <p className="text-gray-300 font-medium text-lg md:text-xl leading-relaxed max-w-2xl">
              Aprenda com quem já construiu e escalou grandes negócios no Brasil e no mundo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loadingMentores ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-[40px]" />
              ))
            ) : (
              mentores.map((mentor, i) => (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                  className="group relative aspect-[3/4] overflow-hidden rounded-[40px] bg-gray-900 border border-white/10 shadow-lg hover:shadow-2xl hover:shadow-brand-teal/20 transition-all duration-300 cursor-pointer"
                >
                  <img 
                    src={mentor.foto} 
                    alt={mentor.nome} 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent flex flex-col justify-end p-8">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter  mb-1">{mentor.nome}</h3>
                    <p className="text-brand-teal text-[10px] font-black uppercase tracking-widest mb-1">{mentor.cargo}</p>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6">{mentor.empresa}</p>
                    
                    {mentor.linkedin && (
                      <a 
                        href={mentor.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white/10 hover:bg-brand-teal rounded-xl flex items-center justify-center transition-all backdrop-blur-sm"
                      >
                        <Linkedin className="text-white w-5 h-5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-brand-teal/20">
              Vantagens Exclusivas
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 uppercase tracking-tighter  leading-none mb-8">
              CLUBE DE <span className="gradient-text">BENEFÍCIOS</span>
            </h2>
            <p className="text-gray-500 font-medium text-xl max-w-2xl mx-auto">
              Temos parcerias estratégicas com as ferramentas que sua startup precisa para crescer com custo reduzido.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {loadingBeneficios ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-gray-50 animate-pulse rounded-3xl" />
              ))
            ) : (
              beneficios.map((beneficio, i) => {
                const isAsaas = beneficio.nomeEmpresa?.toLowerCase() === 'asaas' || beneficio.logo?.toLowerCase().includes('asaas');
                const logoSrc = isAsaas ? '/Imagens_NINNA/Asaas.png' : beneficio.logo;
                const imgClass = isAsaas 
                  ? "max-h-[64px] w-auto max-w-[90%] object-contain scale-110 transition-transform group-hover:scale-125" 
                  : "max-h-12 w-auto object-contain transition-transform group-hover:scale-110";

                return (
                  <motion.div
                    key={beneficio.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white border border-gray-100 p-6 rounded-3xl flex items-center justify-center grayscale hover:grayscale-0 hover:shadow-xl transition-all group relative overflow-hidden h-32"
                  >
                    <img 
                      src={logoSrc} 
                      alt={beneficio.nomeEmpresa} 
                      className={imgClass}
                      referrerPolicy="no-referrer"
                    />
                    {/* Tooltip on hover */}
                    <div className="absolute inset-0 bg-brand-teal/95 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                      <span className="text-white font-black uppercase text-[10px] tracking-tighter leading-none">{beneficio.nomeEmpresa}</span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
          
          <div className="mt-20 p-12 rounded-[40px] bg-brand-dark overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter  mb-4">Sua empresa quer oferecer benefícios?</h3>
                <p className="text-gray-400 font-medium">Junte-se ao nosso ecossistema e conecte sua solução com centenas de startups inovadoras.</p>
              </div>
              <Link 
                to="/empresas"
                className="bg-brand-teal hover:bg-brand-teal/90 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-brand-teal/20"
              >
                Seja um Parceiro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cases Section */}
      <section className="py-32 bg-[#fafafa] relative overflow-hidden border-t border-gray-100">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-teal/5 blur-[140px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-brand-teal/20">
              Tração e Resultados Reais
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter ">
              NINNA <span className="gradient-text">CASES</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium mt-4">
              Histórias reais de startups que aceleraram com inovação aberta, conexão corporativa e captação planejada de fomento no NINNA Hub.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            
            {/* Case 1: Pague Menos + Suri.ai */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white border border-gray-150 rounded-[48px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Pague Menos Logo */}
                      <div className="w-16 h-16 bg-red-500/[0.03] border border-red-100 rounded-2xl flex items-center justify-center p-3 shadow-sm shrink-0">
                        <img 
                          src="/Imagens_NINNA/PagueMenos.png" 
                          alt="Pague Menos logo" 
                          className="max-h-full max-w-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="text-gray-400 font-black text-xl">+</div>
                      {/* Suri Logo Visual representation */}
                      <div className="w-16 h-16 bg-brand-teal/5 border border-brand-teal/10 rounded-2xl flex flex-col items-center justify-center p-2 shadow-sm shrink-0">
                        <MessageSquare className="w-5 h-5 text-brand-teal mb-0.5" />
                        <span className="text-[8px] font-black text-brand-teal tracking-widest uppercase">SURI.AI</span>
                      </div>
                    </div>
                    <span className="text-[8px] font-black tracking-widest text-red-500 bg-red-50 px-2.5 py-1 rounded-full border border-red-100 uppercase">
                      Inovação Aberta
                    </span>
                  </div>
                </div>

                <div className="p-8 md:p-10">
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter  leading-none mb-4">
                    Aceleração de Atendimento com IA Conversacional
                  </h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8">
                    Como uma das maiores redes de varejo farmacêutico do Brasil se uniu à Suri.ai para digitalizar e otimizar canais de atendimento e engajamento via WhatsApp nacionalmente.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded bg-red-50 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Target className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase text-gray-800 tracking-wide">O Desafio</h4>
                        <p className="text-xs text-gray-500 font-medium">Atender com agilidade milhares de dúvidas cotidianas sobre lojas de forma escalável.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded bg-brand-teal/10 text-brand-teal flex items-center justify-center shrink-0 mt-0.5">
                        <Rocket className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase text-gray-800 tracking-wide">A Solução</h4>
                        <p className="text-xs text-gray-500 font-medium">Integração do motor de inteligência artificial da Suri.ai na conta oficial do WhatsApp.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics block */}
              <div className="p-8 bg-gray-50 border-t border-gray-100 rounded-b-[48px] grid grid-cols-3 gap-4 text-center">
                <div>
                  <span className="block text-2xl font-black text-brand-teal tracking-tighter ">+80%</span>
                  <span className="text-[8px] font-black uppercase text-gray-400 tracking-wider">Altas de Automação</span>
                </div>
                <div className="border-l border-r border-gray-200">
                  <span className="block text-2xl font-black text-gray-900 tracking-tighter ">24/7</span>
                  <span className="text-[8px] font-black uppercase text-gray-400 tracking-wider">Disponibilidade</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-brand-teal tracking-tighter ">-70%</span>
                  <span className="text-[8px] font-black uppercase text-gray-400 tracking-wider">Tempo Espera</span>
                </div>
              </div>
            </motion.div>

            {/* Case 2: MOLD IAX */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white border border-gray-150 rounded-[48px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Mold Iax Logo / Visual rep */}
                      <div className="w-16 h-16 bg-purple-500/[0.04] border border-purple-100 rounded-2xl flex flex-col items-center justify-center p-2 shadow-sm shrink-0">
                        <Cpu className="w-5 h-5 text-purple-500 mb-0.5" />
                        <span className="text-[8px] font-black text-purple-500 tracking-widest uppercase text-center leading-none">MOLD IAX</span>
                      </div>
                      <div className="text-gray-400 font-black text-xl">+</div>
                      {/* NINNA Indicator */}
                      <div className="w-16 h-16 bg-brand-teal/5 border border-brand-teal/10 rounded-2xl flex flex-col items-center justify-center p-2 shadow-sm shrink-0">
                        <Sparkles className="w-5 h-5 text-brand-teal mb-0.5" />
                        <span className="text-[8px] font-black text-brand-teal tracking-widest uppercase">NINNA</span>
                      </div>
                    </div>
                    <span className="text-[8px] font-black tracking-widest text-[#9333ea] bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100 uppercase">
                      Fomento & Captação
                    </span>
                  </div>
                </div>

                <div className="p-8 md:p-10">
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter  leading-none mb-4">
                    Acesso Expresso a Recursos Estaduais e Federais
                  </h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8">
                    Como a startup do ecossistema estruturada de fomento conseguiu acesso a recursos de inovação acelerado com fôlego e curadoria consultiva pelo time do NINNA Hub.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Target className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase text-gray-800 tracking-wide">O Desafio</h4>
                        <p className="text-xs text-gray-500 font-medium">Equipes pequenas sem tempo para burocracias de fomento contínuo e submissões densas.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded bg-brand-teal/10 text-brand-teal flex items-center justify-center shrink-0 mt-0.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase text-gray-800 tracking-wide">A Solução</h4>
                        <p className="text-xs text-gray-500 font-medium">Mapeamento expresso e curadoria de editais efetuada em menos de 1 mês de aceleração integrada no hub.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics block */}
              <div className="p-8 bg-gray-50 border-t border-gray-100 rounded-b-[48px] grid grid-cols-3 gap-4 text-center">
                <div>
                  <span className="block text-2xl font-black text-[#9333ea] tracking-tighter ">R$ 800K</span>
                  <span className="text-[8px] font-black uppercase text-gray-400 tracking-wider">Em Recursos</span>
                </div>
                <div className="border-l border-r border-gray-200">
                  <span className="block text-2xl font-black text-gray-900 tracking-tighter ">&lt; 1 mês</span>
                  <span className="text-[8px] font-black uppercase text-gray-400 tracking-wider font-medium">Estudo e Acesso</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-brand-teal tracking-tighter ">Dezenas</span>
                  <span className="text-[8px] font-black uppercase text-gray-400 tracking-wider">De Linhas Hub</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="py-24 bg-brand-darker relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-teal/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-brand-teal/20">
            Chegou a Sua Hora
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter  leading-none mb-6">
            NÃO DEIXE SUA IDEIA <br />
            <span className="text-brand-teal">SE PERDER NO CAMINHO</span>
          </h2>
          <p className="text-gray-300 font-medium text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Junte-se a dezenas de empreendedores que já utilizam o NINNA Hub para catalisar o desenvolvimento de suas soluções. Estamos focados em caminhar junto com você.
          </p>

          <Link
            to="/empresas"
            className="inline-flex items-center gap-3 bg-brand-teal hover:bg-brand-teal/90 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-brand-teal/30 hover:scale-[1.03] active:scale-95"
          >
            Faça parte do NINNA Hub! <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Ninna4Startups;
