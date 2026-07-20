import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { collection, getDocs, query, where, orderBy, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Users, 
  Monitor, 
  Coffee, 
  Laptop, 
  Sparkles, 
  Building2, 
  Send, 
  Check, 
  X, 
  FileText 
} from 'lucide-react';
import { toast } from 'sonner';

const Eventos = () => {
  const [eventos, setEventos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'booking' | 'sponsor'>('booking');
  const [selectedSpace, setSelectedSpace] = useState('Auditório');

  // Input states
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    empresa: '',
    telefone: '',
    mensagem: '',
    tipoPatrocinio: 'Patrocínio de Agenda Anual'
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
useEffect(() => {
  const action = searchParams.get('action');
  if (action === 'sponsor') {
    openSponsorModal();
    setSearchParams({}, { replace: true });
  }
}, [searchParams]);

useEffect(() => {
  const fetchEventos = async () => {
    try {
      const q = query(
        collection(db, 'eventos'), 
        where('status', '==', 'ativo'),
        orderBy('data', 'asc')
      );
      const querySnapshot = await getDocs(q);
      setEventos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Erro ao buscar eventos dinâmicos:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchEventos();
}, []);

const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};

const openSponsorModal = () => {
  setSubmitSuccess(false);
  setIsModalOpen(true);
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  try {
    // Persist sponsor lead to Firestore!
    await addDoc(collection(db, 'leads_eventos'), {
      nome: formData.nome,
      email: formData.email,
      empresa: formData.empresa,
      telefone: formData.telefone,
      mensagem: formData.mensagem,
      tipoPatrocinio: formData.tipoPatrocinio,
      tipoInteresse: 'sponsor',
      createdAt: new Date().toISOString()
    });

    setSubmitSuccess(true);
    toast.success('Seu interesse de patrocínio foi registrado!');
  } catch (error: any) {
    console.error("Erro salvando lead de patrocínio:", error);
    toast.error('Ocorreu um erro ao registrar sua solicitação. Tente novamente.');
  } finally {
    setSubmitting(false);
  }
};

  // Static list of prominent past clients/hosts for authority building
  const parceirosEventos = [
    { name: 'Unimed Fortaleza', logo: '/Imagens_NINNA/Unimed.png' },
    { name: 'M. Dias Branco', logo: '/Imagens_NINNA/M-Dias-Branco.png' },
    { name: 'Sebrae Ceará', logo: '/Imagens_NINNA/Sebrae-PNG.png' },
    { name: 'Cagece', logo: '/Imagens_NINNA/Cagece.png' },
    { name: 'Banco do Nordeste', logo: '/Imagens_NINNA/BancoNordeste.png' },
    { name: 'Pague Menos', logo: '/Imagens_NINNA/PagueMenos.png' },
    { name: 'Fecomércio CE', logo: '/Imagens_NINNA/fecomercio-ce.png' },
    { name: 'Extrafarma', logo: '/Imagens_NINNA/Extrafarma.png' },
    { name: 'Grupo Edson Queiroz', logo: '/Imagens_NINNA/GrupoEdsonQueiroz.png' },
    { name: 'Grupo Camed', logo: '/Imagens_NINNA/Grupo_Camed.png' },
    { name: 'Hapvida', logo: '/Imagens_NINNA/Hapvida.png' },
    { name: 'IGC', logo: '/Imagens_NINNA/IGCLogo.png' },
    { name: 'Makro', logo: '/Imagens_NINNA/Makro.png' },
    { name: 'Pax', logo: '/Imagens_NINNA/Pax.png' },
    { name: 'Solar Coca-Cola', logo: '/Imagens_NINNA/Solar_CocaCola.png' },
    { name: 'SulAmérica', logo: '/Imagens_NINNA/SulAmerica.png' },
    { name: 'L\'auto', logo: "/Imagens_NINNA/l'auto.png" },
    { name: 'Grupo Fortes', logo: '/Imagens_NINNA/grupo_fortes.png' }
  ];

  // Backup ecosystem events if Firestore collection is empty, guaranteeing an incredibly populated and gorgeous section
  const backupEcosystemEvents = [
    {
      id: 'backup_1',
      nome: 'NINNA Connection Day: Startups & Corporates',
      descricao: 'O maior fórum de conexões estratégicas de Fortaleza. Pitch sessions de startups pré-selecionadas com diretores de inovação corporativa de grandes marcas regionais.',
      data: '2026-06-18',
      horario: '14:00 às 18:00',
      local: 'Auditório Principal NINNA',
      linkInscricao: 'https://wa.me/5585989844779',
      destaque: true,
      imagem: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'backup_2',
      nome: 'Workshop: Inteligência Artificial no Corporate Venture Capital',
      descricao: 'Painel interativo focado na implementação prática de ferramentas preditivas e LLMs para avaliação de teses tecnológicas em portfólios corporativos.',
      data: '2026-07-02',
      horario: '09:00 às 11:30',
      local: 'Sala Pregão NINNA',
      linkInscricao: 'https://wa.me/5585989844779',
      destaque: false,
      imagem: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600'
    }
  ];

  const listToRender = eventos.length > 0 ? eventos : backupEcosystemEvents;

  return (
    <div className=" bg-[#fafafa] min-h-screen">
      <meta name="description" content="Conheça o Ecossistema NINNA e veja como as startups, empresas e nossa equipe interajem entre si" />

      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32 border-b border-gray-100">
        <div className="absolute top-1/2 left-0 w-32 h-[400px] bg-brand-teal/5 -translate-y-1/2 -skew-x-12 z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/5 blur-[120px] rounded-full -mr-40 -mt-40 z-10 pointer-events-none" />
        
        {/* Low opacity background image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#fafafa]/85 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=2000" 
            alt="Event Atmosphere" 
            className="w-full h-full object-cover grayscale scale-110 opacity-70"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#fafafa] to-transparent z-20" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              Conexão, Inovação e Negócios
            </div>
            <h1 className="text-5xl md:text-[90px] font-black mb-8 uppercase tracking-wide leading-[0.85] text-gray-900 ">
              O NOSSO <br /><span className="gradient-text">ECOSSISTEMA</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed border-t border-gray-100 pt-8 mt-8 font-medium">
              O NINNA Hub é o ponto de encontro de startups, corporações de vanguarda e mentes brilhantes. Projetamos marcas e catalisamos conexões de alto impacto com eventos que trazem transformação real ao mercado.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <a 
                href="https://wa.me/558532114201?text=Ol%C3%A1%2C+gostaria+de+realizar+um+evento+no+NINNA."
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-brand-teal text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-xl shadow-brand-teal/20 hover:bg-brand-teal/90 hover:scale-[1.02] transition-all cursor-pointer"
              >
                Quero Realizar meu Evento no NINNA
              </a>
              <button
                 onClick={openSponsorModal}
                 className="px-8 py-4 bg-gray-900 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-gray-800 hover:scale-[1.02] transition-all cursor-pointer"
              >
                Patrocinar um Evento
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Narrative Section: Ecosystem Connectivity Support */}
      <section className="py-24 bg-gray-950 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[10px] font-black text-brand-teal uppercase tracking-[0.4em]">Palco das Conexões</span>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide  leading-none">
                ECOSSISTEMAS QUE <span className="gradient-text">GERAM</span> IMPACTO
              </h2>
              <p className="text-white/60 text-lg leading-relaxed font-barlow">
                No NINNA, nós não cedemos apenas espaço físico. Nós apoiaremos a sua marca na ponte com o ecossistema tecnológico, ajudando na atração de startups, corporações e decisores do mercado local.
              </p>
              <p className="text-white/60 text-lg leading-relaxed font-barlow">
                Conecte-se com nosso hub e usufrua de uma comunidade vibrante ativa de mentores, investidores, líderes institucionais e parceiros estratégicos.
              </p>
              <div className="pt-6 font-inter">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-6 h-6 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-white/85 text-sm">Geração espontânea de networking qualificado</span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-6 h-6 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-white/85 text-sm">Aproximação direta com ideias disruptivas do ecossistema</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-white/85 text-sm">Posicionamento como embaixador de inovação regional</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-8 bg-white/[0.03] backdrop-blur-md rounded-[30px] border border-white/10 space-y-4">
                <Sparkles className="w-10 h-10 text-brand-teal" />
                <h3 className="text-xl font-black  uppercase text-white">Transformação</h3>
                <p className="text-white/50 text-sm font-barlow leading-relaxed">
                  Espaço favorável para compartilhar descobertas, cases corporativos e estratégias práticas de mercado.
                </p>
              </div>

              <div className="p-8 bg-white/[0.03] backdrop-blur-md rounded-[30px] border border-white/10 space-y-4 sm:translate-y-6">
                <Users className="w-10 h-10 text-brand-teal" />
                <h3 className="text-xl font-black  uppercase text-white">Conexões</h3>
                <p className="text-white/50 text-sm font-barlow leading-relaxed">
                  Proximidade direta com mais de 100 startups em tecnologia e dezenas de corporações parceiras de inovação aberta.
                </p>
              </div>

              <div className="p-8 bg-white/[0.03] backdrop-blur-md rounded-[30px] border border-white/10 space-y-4">
                <Building2 className="w-10 h-10 text-brand-teal" />
                <h3 className="text-xl font-black  uppercase text-white">Oportunidades</h3>
                <p className="text-white/50 text-sm font-barlow leading-relaxed">
                  Um ambiente preparado para grandes conexões: equipamentos audiovisuais de ponta, internet dedicada corporativa de alto desempenho e equipe de suporte operacional local.
                </p>
              </div>

              <div className="p-8 bg-white/[0.03] backdrop-blur-md rounded-[30px] border border-white/10 space-y-4 sm:translate-y-6">
                <Laptop className="w-10 h-10 text-brand-teal" />
                <h3 className="text-xl font-black  uppercase text-white">Eventos</h3>
                <p className="text-white/50 text-sm font-barlow leading-relaxed">
                  Ambiente acolhedor e dinâmico, focado na cultura ágil de feedback, cocriação e colaboração.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expanded & Highly Prominent Action Section */}
      <section className="py-20 bg-gray-950 border-t border-b border-white/10 relative">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-brand-teal/5 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-brand-green/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Oportunidades Card */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="p-8 md:p-12 bg-white/[0.03] backdrop-blur-md rounded-[40px] border border-white/10 flex flex-col justify-between items-start space-y-8 hover:border-brand-teal/30 hover:shadow-2xl hover:shadow-brand-teal/5 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-teal/10 transition-colors" />
              <div className="space-y-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                  <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-teal">Ecossistema Ativo</span>
                  <h3 className="text-3xl font-black text-white uppercase tracking-wide  leading-none">Conhecer Oportunidades</h3>
                  <p className="text-white/60 font-barlow text-sm sm:text-base leading-relaxed">
                    Aproximação direta com o mercado inovador cearense. Explore projetos abertos, vagas em tecnologia, desafios de inovação corporativa e programas dedicados a acelerar marcas.
                  </p>
                </div>
              </div>
              <Link
                to="/oportunidades"
                className="w-full text-center justify-center px-8 py-5 bg-gradient-to-r from-brand-teal to-brand-green text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-teal/25 transition-all flex items-center gap-2.5 cursor-pointer shadow-lg shadow-brand-teal/15"
              >
                Conhecer Oportunidades <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Agenda Card */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="p-8 md:p-12 bg-white/[0.03] backdrop-blur-md rounded-[40px] border border-white/10 flex flex-col justify-between items-start space-y-8 hover:border-brand-teal/30 hover:shadow-2xl hover:shadow-brand-teal/5 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-green/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-green/10 transition-colors" />
              <div className="space-y-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                  <Calendar className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-teal">Programações Oficiais</span>
                  <h3 className="text-3xl font-black text-white uppercase tracking-wide  leading-none">Ver Agenda de Eventos</h3>
                  <p className="text-white/60 font-barlow text-sm sm:text-base leading-relaxed">
                    Participe de sessões de networking e treinamentos enriquecedores e happy hours. Fique por dentro de todos os encontros de startups e palestras promovidas no hub.
                  </p>
                </div>
              </div>
              <Link
                to="/agenda"
                className="w-full text-center justify-center px-8 py-5 bg-white text-gray-950 hover:bg-white/90 font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl transition-all flex items-center gap-2.5 hover:scale-[1.02] hover:shadow-xl hover:shadow-white/25 cursor-pointer shadow-lg shadow-white/15"
              >
                <Calendar className="w-4 h-4 text-brand-teal shrink-0 animate-pulse" /> Ver Agenda de Eventos
               </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Proprietary NINNA Events Section with Zig-zag layout */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative ambient elements */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-brand-teal/5 blur-3xl rounded-full" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-brand-green/5 blur-3xl rounded-full translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="text-center mb-24">
            <span className="text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] mb-4 block">Nossos Selos Oficiais</span>
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-wide ">EVENTOS PROPRIETÁRIOS DO <span className="gradient-text">NINNA</span></h3>
            <p className="text-gray-500 max-w-xl mx-auto font-medium mt-4">
              Formatos exclusivos criados e promovidos pelo NINNA para catalisar conexões valiosas, desenvolver capacitações e aproximar marcas inovadoras do mercado.
            </p>
          </div>

          {/* Zig-Zag Event Cards stack */}
          <div className="space-y-32">
            
            {/* 1. NINNA Connection */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              <div className="order-2 lg:order-1 lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-[9px] font-black uppercase tracking-widest border border-brand-teal/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
                  Conexão Corporativa
                </div>
                <h4 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-wide  leading-none">
                  NINNA Connection
                </h4>
                <p className="text-gray-500 font-medium text-base md:text-lg leading-relaxed">
                  O ponto de encontro definitivo entre grandes corporações e as melhores startups em ascensão. Com sessões focadas de pitches e dinâmicas de conexão assistidas, apresentamos as soluções mais disruptivas do mercado estadual aos decisores, diretores e patrocinadores estratégicos.
                </p>
                <ul className="space-y-3 pt-2">
                  <li className="flex items-center gap-3 text-sm text-gray-600 font-inter">
                    <div className="w-5 h-5 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Pitching qualificado de startups em tração</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600 font-inter">
                    <div className="w-5 h-5 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Comitivas de inovação corporativa presencial</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600 font-inter">
                    <div className="w-5 h-5 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Agendas comerciais e matchings qualificados</span>
                  </li>
                  <div className="pt-2">
                        <a
                        href="https://ninna-connect-hub.lovable.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-teal text-white text-sm font-black uppercase tracking-widest hover:bg-brand-teal/90 hover:gap-3 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Saiba mais
                        <ArrowRight className="w-4 h-4" />
                      </a>
                  </div>
                </ul>
              </div>
              <div className="order-1 lg:order-2 lg:col-span-6">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-brand-teal to-brand-green opacity-20 blur-2xl rounded-[44px] group-hover:opacity-30 transition-opacity duration-500" />
                  <div className="relative rounded-[40px] overflow-hidden border border-gray-100 shadow-2xl h-[340px] md:h-[420px] bg-gray-50">
                    <img 
                      src="/Imagens_espaco/pregao_evento.jpeg" 
                      alt="NINNA Connection Event" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Terceiro Tempo */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              <div className="order-1 lg:col-span-6">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-brand-teal/15 to-brand-green/15 opacity-20 blur-2xl rounded-[44px] group-hover:opacity-30 transition-opacity duration-500" />
                  <div className="relative rounded-[40px] overflow-hidden border border-gray-100 shadow-2xl h-[340px] md:h-[420px] bg-gray-50">
                    <img 
                      src="/Imagens_espaco/Auditorio_evento.jpg" 
                      alt="Terceiro Tempo Event" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
              <div className="order-2 lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-green/10 text-brand-green text-[9px] font-black uppercase tracking-widest border border-brand-green/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                  Ecossistema Informal
                </div>
                <h4 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-wide  leading-none">
                  Terceiro Tempo
                </h4>
                <p className="text-gray-500 font-medium text-base md:text-lg leading-relaxed">
                  O happy hour indispensável pós-trabalho que une a melhor comunidade de negócios cearense. Reunimos fundadores, gestores, conselheiros e investidores em bate-papos acolhedores e descontraídos para trocar aprendizados, debater novas teses de mercado e celebrar novas parcerias comerciais sustentáveis.
                </p>
                <ul className="space-y-3 pt-2">
                  <li className="flex items-center gap-3 text-sm text-gray-600 font-inter">
                    <div className="w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Networking de alta proximidade sem burocracias</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600 font-inter">
                    <div className="w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Partilha espontânea de insights e lições práticas</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600 font-inter">
                    <div className="w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Ambiente festivo propício para conectar e relaxar</span>
                  </li>
                  <a
                        href="https://ninnaterceirotempo.lovable.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-teal text-white text-sm font-black uppercase tracking-widest hover:bg-brand-teal/90 hover:gap-3 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Saiba mais
                        <ArrowRight className="w-4 h-4" />
                      </a>
                </ul>
              </div>
            </div>

            {/* 3. Hub Session */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              <div className="order-2 lg:order-1 lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-brand-teal/10 to-brand-green/10 text-brand-teal text-[9px] font-black uppercase tracking-widest border border-brand-teal/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
                  Mentoria & Educação
                </div>
                <h4 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-wide  leading-none">
                  Hub Session
                </h4>
                <p className="text-gray-500 font-medium text-base md:text-lg leading-relaxed">
                  Sessões de mentoria coletiva e masterclasses altamente técnicas. Formatos desenhados para que especialistas sêniores, diretores de tecnologia e empresários voluntários de renome ofereçam deep-dives práticos direcionados à superação de desafios técnicos operacionais, produto e capital de risco.
                </p>
                <ul className="space-y-3 pt-2">
                  <li className="flex items-center gap-3 text-sm text-gray-600 font-inter">
                    <div className="w-5 h-5 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Encontros intensificados em grupos pequenos e focados</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600 font-inter">
                    <div className="w-5 h-5 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Workshops focados puramente em soluções reais</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600 font-inter">
                    <div className="w-5 h-5 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Garantia de material exclusivo de apoio prático</span>
                  </li>
                </ul>
              </div>
              <div className="order-1 lg:order-2 lg:col-span-6">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-brand-teal to-brand-green opacity-20 blur-2xl rounded-[44px] group-hover:opacity-30 transition-opacity duration-500" />
                  <div className="relative rounded-[40px] overflow-hidden border border-gray-100 shadow-2xl h-[340px] md:h-[420px] bg-gray-50">
                    <img 
                      src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200" 
                      alt="Hub Session Workshop" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Licor */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              <div className="order-1 lg:col-span-6">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-brand-teal/15 to-brand-green/15 opacity-20 blur-2xl rounded-[44px] group-hover:opacity-30 transition-opacity duration-500" />
                  <div className="relative rounded-[40px] overflow-hidden border border-gray-100 shadow-2xl h-[340px] md:h-[420px] bg-gray-50">
                    <img 
                      src="Imagens_espaco/Li.cor.JPEG" 
                      alt="Licor Institucional Event" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
              <div className="order-2 lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-green/10 text-brand-green text-[9px] font-black uppercase tracking-widest border border-brand-green/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                  Institucional & Ecossistema
                </div>
                <h4 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-wide  leading-none">
                  L.I.Cor
                </h4>
                <p className="text-gray-500 font-medium text-base md:text-lg leading-relaxed">
                  Painéis e encontros institucionais estratégicos voltados para o fomento tecnológico regional e diálogo com o poder público. O NINNA atua como embaixador integrando a academia, indústrias setoriais de destaque e órgãos fomentadores para cocriar leis, infraestrutura, capitais de risco e caminhos de inovação produtiva regional.
                </p>
                <ul className="space-y-3 pt-2">
                  <li className="flex items-center gap-3 text-sm text-gray-600 font-inter">
                    <div className="w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Integração entre Estado, Universidades e Empresas</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600 font-inter">
                    <div className="w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Planejamento de atração de capital estratégico</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600 font-inter">
                    <div className="w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Lançamentos institucionais de alta repercussão cearense</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Spaces Section & Photos: Auditório e Sala Pregão */}
      <section className="py-24 bg-gray-950 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] mb-4">Estrutura de Alto Nível</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide ">NOSSOS <span className="gradient-text">ESPAÇOS</span></h3>
            <p className="text-white/60 max-w-xl mx-auto font-barlow mt-4">
              Equipados com o melhor em tecnologia para garantir que seu treinamento, convenção ou pitch day seja impecável.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Auditório Space details & Photo */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-white/[0.03] backdrop-blur-md rounded-[40px] overflow-hidden border border-white/10 shadow-2xl flex flex-col h-full"
            >
              <div className="h-72 w-full relative overflow-hidden bg-gray-900">
                <img 
                  src="/Imagens_espaco/auditorio-vazio.jpg" 
                  alt="Auditório NINNA Hub" 
                  className="w-full h-full object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 right-6 bg-brand-teal text-white font-black uppercase text-[9px] tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  Espaço Premium
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-2xl font-black text-white uppercase tracking-wide ">AUDITÓRIO NINNA</h4>
                    <span className="text-[10px] font-black text-brand-teal uppercase tracking-widest bg-brand-teal/5 px-4 py-2 rounded-xl border border-brand-teal/10">Capacidade: 94 Pessoas</span>
                  </div>
                  <p className="text-white/60 font-barlow leading-relaxed mb-6">
                    O palco principal de nossos maiores anúncios. O Auditório do NINNA é ideal para grandes palestras, eventos híbridos, lançamentos corporativos de novos produtos, conferências de investidores e painéis de lideranças nacionais.
                  </p>
                  
                  <div className="border-t border-white/10 pt-6 space-y-4">
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block">ESTRUTURA COMPLETA:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-white/70 font-barlow">
                        <Check className="w-4 h-4 text-brand-teal shrink-0" />
                        <span>Equipamentos de Audiovisual</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70 font-barlow">
                        <Check className="w-4 h-4 text-brand-teal shrink-0" />
                        <span>1 Tela de Projeção</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70 font-barlow">
                        <Check className="w-4 h-4 text-brand-teal shrink-0" />
                        <span>1 Projetor</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70 font-barlow">
                        <Check className="w-4 h-4 text-brand-teal shrink-0" />
                        <span>2 Microfones sem fio</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70 font-barlow">
                        <Check className="w-4 h-4 text-brand-teal shrink-0" />
                        <span>Caixas de Som</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70 font-barlow">
                        <Check className="w-4 h-4 text-brand-teal shrink-0" />
                        <span>Passador de Slides</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70 font-barlow">
                        <Check className="w-4 h-4 text-brand-teal shrink-0" />
                        <span>Internet Wi-Fi</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70 font-barlow">
                        <Check className="w-4 h-4 text-brand-teal shrink-0" />
                        <span>Água e Café</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sala Pregão Space details & Photo */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-white/[0.03] backdrop-blur-md rounded-[40px] overflow-hidden border border-white/10 shadow-2xl flex flex-col h-full"
            >
              <div className="h-72 w-full relative overflow-hidden bg-gray-900">
                <img 
                  src="/Imagens_espaco/Pregao-vazio.jpg" 
                  alt="Espaço Pregão NINNA Hub" 
                  className="w-full h-full object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 right-6 bg-brand-teal text-white font-black uppercase text-[9px] tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  Multiúso Ágil
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-2xl font-black text-white uppercase tracking-wide ">ESPAÇO PREGÃO</h4>
                    <span className="text-[10px] font-black text-brand-teal uppercase tracking-widest bg-brand-teal/5 px-4 py-2 rounded-xl border border-brand-teal/10">Capacidade: 30 Pessoas</span>
                  </div>
                  <p className="text-white/60 font-barlow leading-relaxed mb-6">
                    Um ambiente dinâmico focado em metodologias ágeis de cocriação, workshops focados em desenvolvimento e hackathons empresariais. Projetado com layout modular que se adapta instantaneamente às dinâmicas de equipes.
                  </p>
                  
                  <div className="border-t border-white/10 pt-6 space-y-4">
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block">ESTRUTURA COMPLETA:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-white/70 font-barlow">
                        <Check className="w-4 h-4 text-brand-teal shrink-0" />
                        <span>TV Móvel de 65"</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70 font-barlow">
                        <Check className="w-4 h-4 text-brand-teal shrink-0" />
                        <span>Disposição Adaptável</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70 font-barlow">
                        <Check className="w-4 h-4 text-brand-teal shrink-0" />
                        <span>Material para Brainstorming</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70 font-barlow">
                        <Check className="w-4 h-4 text-brand-teal shrink-0" />
                        <span>Mesa para Coffee</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70 font-barlow">
                        <Check className="w-4 h-4 text-brand-teal shrink-0" />
                        <span>Internet Wi-Fi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sala Oval Space details & Photo */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-white/[0.03] backdrop-blur-md rounded-[40px] overflow-hidden border border-white/10 shadow-2xl flex flex-col h-full"
            >
              <div className="h-72 w-full relative overflow-hidden bg-gray-900">
                <img 
                  src="/Imagens_espaco/Sala-oval.jpeg" 
                  alt="Sala Oval NINNA Hub" 
                  className="w-full h-full object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 right-6 bg-brand-teal text-white font-black uppercase text-[9px] tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  Reunião Executiva
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-2xl font-black text-white uppercase tracking-wide ">SALA OVAL</h4>
                    <span className="text-[10px] font-black text-brand-teal uppercase tracking-widest bg-brand-teal/5 px-4 py-2 rounded-xl border border-brand-teal/10">Capacidade: 12 a 20 Pessoas</span>
                  </div>
                  <p className="text-white/60 font-barlow leading-relaxed mb-6">
                    Um ambiente sofisticado e reservado, projetado para encontros bilaterais, reuniões de conselho de alta liderança, comitês executivos e apresentações exclusivas para investidores de alta notoriedade.
                  </p>
                  
                  <div className="border-t border-white/10 pt-6 space-y-4">
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block">ESTRUTURA COMPLETA:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-white/70 font-barlow">
                        <Check className="w-4 h-4 text-brand-teal shrink-0" />
                        <span>TV de 65"</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70 font-barlow">
                        <Check className="w-4 h-4 text-brand-teal shrink-0" />
                        <span>Câmera para Videoconferência</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70 font-barlow">
                        <Check className="w-4 h-4 text-brand-teal shrink-0" />
                        <span>Material para Brainstorming</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70 font-barlow">
                        <Check className="w-4 h-4 text-brand-teal shrink-0" />
                        <span>Mesa para Coffee</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70 font-barlow">
                        <Check className="w-4 h-4 text-brand-teal shrink-0" />
                        <span>Internet Wi-Fi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sala Sprint Space details & Photo */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-white/[0.03] backdrop-blur-md rounded-[40px] overflow-hidden border border-white/10 shadow-2xl flex flex-col h-full"
            >
              <div className="h-72 w-full relative overflow-hidden bg-gray-900">
                <img 
                  src="/Imagens_espaco/sala_sprint.png" 
                  alt="Sala Sprint NINNA Hub" 
                  className="w-full h-full object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 right-6 bg-brand-teal text-white font-black uppercase text-[9px] tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  Ideação & Agilidade
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-2xl font-black text-white uppercase tracking-wide ">SALA SPRINT</h4>
                    <span className="text-[10px] font-black text-brand-teal uppercase tracking-widest bg-brand-teal/5 px-4 py-2 rounded-xl border border-brand-teal/10">Capacidade: 8 a 10 Pessoas</span>
                  </div>
                  <p className="text-white/60 font-barlow leading-relaxed mb-6">
                    O espaço perfeito para desbloquear a criatividade e impulsionar projetos ágeis. Ideal para sessões de cocriação, workshops focados em inovação rápida, design thinking e sprints acelerados de produto.
                  </p>
                  
                  <div className="border-t border-white/10 pt-6 space-y-4">
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block">ESTRUTURA COMPLETA:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-white/70 font-barlow">
                        <Check className="w-4 h-4 text-brand-teal shrink-0" />
                        <span>TV Móvel de 65"</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70 font-barlow">
                        <Check className="w-4 h-4 text-brand-teal shrink-0" />
                        <span>Mesa de Apoio</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70 font-barlow">
                        <Check className="w-4 h-4 text-brand-teal shrink-0" />
                        <span>Material para Brainstorming</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70 font-barlow">
                        <Check className="w-4 h-4 text-brand-teal shrink-0" />
                        <span>Internet Wi-Fi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Corporations/Clients Section (Empresas que já realizaram no NINNA) */}
      <section className="py-20 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">RECONHECIMENTO & AUTORIDADE</h4>
            <h5 className="text-xl font-black text-gray-900 uppercase tracking-wide mt-2">EMPRESAS QUE REALIZAM EVENTOS NO NINNA</h5>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {parceirosEventos.map((parceiro, i) => (
              <div 
                key={i} 
                className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-md hover:shadow-lg transition-transform hover:scale-[1.02] duration-300 min-h-[110px]"
              >
                {parceiro.logo.startsWith('/') ? (
                  <div className="h-16 w-full flex items-center justify-center">
                    <img 
                      src={parceiro.logo} 
                      alt={parceiro.name} 
                      className="max-h-full max-w-[85%] object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-3xl mb-2 block">{parceiro.logo}</span>
                    <span className="font-extrabold text-[#1a1a1a] text-[10px] uppercase tracking-wider block">{parceiro.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Booking Call-to-Action - Highly Prominent Dedicated Premium Section */}
      <section className="py-24 bg-gray-950 text-white relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-brand-teal/15 blur-3xl rounded-full -translate-y-1/2 pointer-events-none" />
        <div className="absolute -bottom-1/4 -right-1/12 w-[400px] h-[400px] bg-brand-teal/10 blur-3xl rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Title and strategic description */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-[10px] font-black uppercase tracking-[0.3em] border border-brand-teal/20">
                Hub de Grande Impacto
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-wide uppercase  leading-[0.95]">
                QUERO REALIZAR MEU <span className="gradient-text">EVENTO</span> NO NINNA
              </h2>
              <div className="h-1.5 w-24 bg-gradient-to-r from-brand-teal to-transparent rounded-full" />
              <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-2xl">
                Preencha os dados e configure o seu evento com o suporte direto das nossas lideranças tecnológicas. Oferecemos opções personalizadas de espaços, equipamentos de ponta e curadoria dedicada de público corporativo para garantir o sucesso total da sua iniciativa.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center shrink-0 border border-brand-teal/20">
                    <Users className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-extrabold uppercase text-xs tracking-wider text-white">CURADORIA CORPORATIVA</h4>
                    <p className="text-xs text-gray-500 font-medium mt-1">Conexão qualificada com startups, investidores e decisores.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center shrink-0 border border-brand-teal/20">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold uppercase text-xs tracking-wider text-white">TECNOLOGIA INTEGRADA</h4>
                    <p className="text-xs text-gray-500 font-medium mt-1">Sonorização array, displays touch magnéticos e projeção a laser.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: High-intensity glass card with prominent action */}
            <div className="lg:col-span-5">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 border border-white/10 rounded-[40px] p-10 md:p-12 shadow-2xl backdrop-blur-md relative overflow-hidden flex flex-col justify-between h-full text-center lg:text-left"
              >
                <div className="space-y-4 mb-8">
                  <span className="text-[9px] font-black text-brand-teal uppercase tracking-widest block">PROPOSTA COMERCIAL</span>
                  <h3 className="text-2xl font-black uppercase text-white tracking-wide ">PRONTO PARA CONECTAR?</h3>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed">
                    Nossa equipe comercial desenhará um formato sob medida para o seu orçamento e objetivos estratégicos de marca.
                  </p>
                </div>

                <div className="space-y-4">
                  <button 
                    className="w-full text-center py-5 bg-brand-teal text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl shadow-xl shadow-brand-teal/25 hover:bg-white hover:text-gray-950 transition-all cursor-pointer transform hover:-translate-y-0.5"
                  >
                    Solicitar Proposta Agora
                  </button>
                  <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest text-center">
                    Resposta oficial em até 24 Horas Úteis
                  </p>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Sponsoring Section (Patrocínio de Eventos) */}
      <section className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-teal to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#fafafa] rounded-[50px] p-12 md:p-20 border border-gray-100 shadow-xl relative overflow-hidden">
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-brand-teal/5 blur-3xl rounded-full translate-x-1/3 -translate-y-1/2" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-[9px] font-black uppercase tracking-[0.2em]">
                  Impulsione o Ecossistema
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-wide  leading-none">
                  SEJA UM <span className="gradient-text">PATROCINADOR</span>
                </h3>
                <p className="text-gray-500 font-medium text-lg leading-relaxed">
                  Ao patrocinar nossos eventos no NINNA Hub, sua marca ganha destaque em frente a um ecossistema seletivo de líderes, diretores de inovação e startups de alta tração tecnológica. Oferecemos pacotes integrados que combinam exposição visual, inserções de palco, keynote slots e geração assistida de leads de inovação.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-6 bg-white border border-gray-100 rounded-2xl">
                    <h5 className="font-black uppercase text-sm text-gray-900  mb-2">Visibilidade Exclusiva</h5>
                    <p className="text-gray-500 text-xs font-barlow">Exposição em banners físicos, mídias digitais e painéis de palestras.</p>
                  </div>
                  <div className="p-6 bg-white border border-gray-100 rounded-2xl">
                    <h5 className="font-black uppercase text-sm text-gray-900  mb-2">Pitch e Networking</h5>
                    <p className="text-gray-500 text-xs font-barlow">Slots dedicados para pitch e lista exclusiva de leads cadastrados.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 text-center lg:text-left bg-white p-10 rounded-[35px] border border-gray-100 shadow-xl space-y-8">
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">OPORTUNIDADES DE PARCERIA</span>
                  <h4 className="text-xl font-black text-gray-900 uppercase tracking-wide ">AGENDA COMUNIDADE CO-CREATE</h4>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    Ajude-nos a apoiar o desenvolvimento do ecossistema e posicione a sua marca no topo da pirâmide de inovação regional cearense.
                  </p>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={openSponsorModal}
                    className="w-full text-center py-5 bg-brand-teal text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-xl shadow-brand-teal/20 hover:bg-brand-teal/90 transition-all cursor-pointer"
                  >
                    Ver Pacotes de Patrocínio
                  </button>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest  text-center">
                    Ou agende uma reunião com nossa secretaria corporativa
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Flowing Lead Intake Dialog / Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-gray-900/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              {submitSuccess ? (
                <div className="text-center py-12 space-y-6">
                  <div className="w-20 h-20 bg-brand-teal/10 text-brand-teal rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-wide  text-gray-950">SOLICITAÇÃO RECEBIDA!</h3>
                  <p className="text-gray-500 font-medium max-w-sm mx-auto">
                    Nossa equipe de curadoria do ecossistema entrará em contato comercial dentro de até 24 horas úteis para alinhar os detalhes operacionais.
                  </p>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="mt-8 px-10 py-4 bg-gray-900 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-brand-teal transition-all cursor-pointer"
                  >
                    Fechar Mensagem
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <span className="text-[10px] font-black text-brand-teal uppercase tracking-[0.3em] block">Inscrição de Interesse</span>
                  <h3 className="text-3xl font-black uppercase tracking-wide  text-gray-950">
                    {modalType === 'booking' ? 'Quero Realizar meu Evento' : 'Seja um Patrocinador'}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">
                    {modalType === 'booking' 
                      ? 'Preencha detalhadamente a proposta para que possamos oferecer o melhor suporte de conexões de ecossistema.' 
                      : 'Posicione a marca em frente a startups, decisores e líderes de mercado cearense.'}
                  </p>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-left">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Seu Nome Integral</label>
                    <input 
                      type="text" 
                      name="nome" 
                      required 
                      value={formData.nome} 
                      onChange={handleFormChange}
                      placeholder="Nome Sobrenome" 
                      className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 focus:outline-none focus:border-brand-teal text-sm shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">E-mail Corporativo</label>
                      <input 
                        type="email" 
                        name="email" 
                        required 
                        value={formData.email} 
                        onChange={handleFormChange}
                        placeholder="nome@empresa.com" 
                        className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 focus:outline-none focus:border-brand-teal text-sm shadow-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Telefone / WhatsApp</label>
                      <input 
                        type="tel" 
                        name="telefone" 
                        required 
                        value={formData.telefone} 
                        onChange={handleFormChange}
                        placeholder="(85) 99999-9999" 
                        className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 focus:outline-none focus:border-brand-teal text-sm shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Nome da Empresa ou Startup</label>
                    <input 
                      type="text" 
                      name="empresa" 
                      required 
                      value={formData.empresa} 
                      onChange={handleFormChange}
                      placeholder="Nome Corporativo" 
                      className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 focus:outline-none focus:border-brand-teal text-sm shadow-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Categoria de Patrocínio Desejada</label>
                    <select 
                      name="tipoPatrocinio" 
                      value={formData.tipoPatrocinio} 
                      onChange={handleFormChange}
                      className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 focus:outline-none focus:border-brand-teal text-sm shadow-sm"
                    >
                      <option value="Patrocínio de Agenda Anual">Parceiro Estratégico Anual</option>
                      <option value="Cotas para Evento Exclusivo">Cota de Apoio a Evento Exclusivo</option>
                      <option value="Apoio de Happy Hour / Coffee">Apoiador Happy Hour & Networking</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Ideia Preliminar ou Observações</label>
                    <textarea 
                      name="mensagem" 
                      value={formData.mensagem} 
                      onChange={handleFormChange}
                      rows={3}
                      placeholder="Escreva brevemente o tema ou tópicos que gostaria de abordar."
                      className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 focus:outline-none focus:border-brand-teal text-sm shadow-sm"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full mt-4 py-5 bg-brand-teal text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-brand-teal/90 shadow-xl shadow-brand-teal/15 transition-all text-center disabled:opacity-55 cursor-pointer"
                  >
                    {submitting ? 'Registrando Solicitação...' : 'Confirmar Envio e Contatar'}
                  </button>
                </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Eventos;
