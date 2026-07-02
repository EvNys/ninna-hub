import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  ChevronDown, 
  CheckCircle2, 
  MapPin, 
  Linkedin, 
  Heart, 
  Award, 
  Zap, 
  Calendar, 
  MessageSquare, 
  ArrowRight,
  ShieldCheck,
  Send,
  Loader2,
  Lock
} from 'lucide-react';
import { MentorApplication } from '../types';
import NinnaHubLogo from './NinnaLogo';
import NinnaTriangles from './NinnaTriangles';

interface LandingPageProps {
  onAddApplication: (application: Omit<MentorApplication, 'id' | 'status' | 'observacoes' | 'dataEnvio'>) => void;
  onOpenLogin: () => void;
}

export default function LandingPage({ onAddApplication, onOpenLogin }: LandingPageProps) {
  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    cidade: '',
    linkedin: '',
    area: '',
    indicacao: '',
    motivacao: '',
    regulamento: false
  });

  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.regulamento) {
      alert('Você precisa aceitar os termos do Regulamento para prosseguir.');
      return;
    }
    setFormIsSubmitting(true);

    // Simulate network submission delay
    setTimeout(() => {
      onAddApplication({
        nome: formData.nome,
        email: formData.email,
        whatsapp: formData.whatsapp,
        cidade: formData.cidade,
        linkedin: formData.linkedin,
        area: formData.area,
        indicacao: formData.indicacao,
        motivacao: formData.motivacao
      });
      setFormIsSubmitting(false);
      setFormSuccess(true);
      // Reset form
      setFormData({
        nome: '',
        email: '',
        whatsapp: '',
        cidade: '',
        linkedin: '',
        area: '',
        indicacao: '',
        motivacao: '',
        regulamento: false
      });
    }, 1200);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqData = [
    {
      q: "Preciso pagar algo para participar?",
      a: "Não. O Programa de Mentores é uma atividade voluntária sob a Lei nº 9.608/1998. Toda a formação em Mentoria de Negócios Inovadores (avaliada em R$ 3.000) é fornecida 100% gratuitamente para os mentores selecionados pela nossa curadoria."
    },
    {
      q: "Qual é a disponibilidade mínima exigida?",
      a: "O mentor deve ter disponibilidade mínima de apenas 4 horas mensais para realizar sessões de mentorias agendadas com as startups do ecossistema e se comprometer a responder e atender entre 50% e 80% dos chamados recebidos."
    },
    {
      q: "Quanto tempo tenho para concluir a formação?",
      a: "Você terá até 12 meses, contados a partir de sua admissão oficial no programa, para finalizar todos os 8 módulos virtuais e complementares da nossa trilha obrigatória. Após a conclusão, você receberá a Certificação Oficial."
    },
    {
      q: "Posso vender meus serviços profissionais durante as mentorias?",
      a: "Não. É expressamente proibido utilizar o espaço institucional do NINNA Hub para prospecção ativa de vendas ou oferta comercial direta de seus serviços. Caso surja interesse mútuo por parte da startup de modo orgânico no futuro, a relação contratual subsequente deverá ser firmada externamente e de modo totalmente independente do Hub."
    },
    {
      q: "O que é o sistema Mentor-to-Mentor (M2M)?",
      a: "M2M (Mentor-to-Mentor) é um diferencial exclusivo do NINNA Hub. Além de ajudar startups inovadoras, você terá acesso à intranet de mentores onde poderá agendar mentorias exclusivas com outros mentores da rede para trocar percepções ou aprimorar competências técnicas em que eles são referência. É um ecossistema completo onde todos ensinam e todos evoluem."
    }
  ];

  const categories = [
    { value: 'inovacao', label: 'Inovação & Tecnologia' },
    { value: 'negocios', label: 'Negócios & Estratégia' },
    { value: 'financas', label: 'Finanças & Venture Capital' },
    { value: 'marketing', label: 'Marketing & Growth' },
    { value: 'rh', label: 'Pessoas & Cultura' },
    { value: 'juridico', label: 'Jurídico & Regulatório' },
    { value: 'operacoes', label: 'Operações & Supply Chain' },
    { value: 'outro', label: 'Outra categoria' }
  ];

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-[#E2E8F0] selection:bg-[#31c891] selection:text-white font-barlow relative overflow-x-hidden antialiased">
      
      {/* Decorative Brand Triangles Signatures in Key Corners */}
      <NinnaTriangles position="top-right" opacity={0.85} size="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px]" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A2E]/90 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Real Logo Component according to guidelines */}
            <NinnaHubLogo light={true} scale={1.1} />
            
            <span className="text-[10px] bg-[#31c891]/10 text-[#31c891] border border-[#31c891]/20 px-2.5 py-0.5 rounded-full font-sans font-bold uppercase tracking-widest hidden md:inline-block">
              Mentores 2026
            </span>
          </div>
          
          <div className="flex items-center gap-4 font-sans">
            <button 
              onClick={onOpenLogin}
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/5"
              id="btn-portal-coordenador"
            >
              <Lock className="w-3.5 h-3.5 text-[#31c891]" />
              <span>Painel de Avaliação</span>
            </button>
            <a 
              href="#form" 
              className="bg-[#1A237E] hover:bg-[#1565C0] text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl border border-[#31c891]/20 hover:border-[#31c891]/40 shadow-[0_4px_24px_rgba(26,35,126,0.3)] transition transform hover:-translate-y-0.5 hidden sm:inline-flex"
              id="nav-apply-btn"
            >
              Quero ser Mentor
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 border border-[#31c891]/30 bg-[#31c891]/10 text-[#31c891] font-sans font-extrabold tracking-[0.12em] text-[10px] uppercase px-3.5 py-1.5 rounded-full">
                Ciclo 2026 — Inscrições de Candidatos Abertas
              </div>
              
              {/* Ousado Rule: Big typography, Barlow Condensed Black 900 */}
              <h1 className="text-5xl sm:text-7xl font-barlow-cond font-black uppercase text-white leading-[0.95] tracking-wide">
                SEJA MENTOR <br />
                <span className="text-[#31c891]">
                  NINNA HUB
                </span>
              </h1>
              
              <p className="text-slate-350 text-normal sm:text-lg leading-relaxed max-w-2xl font-barlow">
                Você é líder, cientista, empresário de tecnologia ou especialista consagrado? Organize seu conhecimento, compartilhe sua trajetória prática e guie startups promissoras do Ceará e do Brasil. 
                Faça parte de uma <strong className="text-white font-semibold">rede de aprendizado mútuo e trocas de alto impacto</strong> com outros mentores de ponta.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 font-sans">
                <a 
                  href="#form"
                  className="bg-gradient-to-r from-[#1A237E] to-[#1565C0] hover:scale-[1.02] text-white font-bold text-center px-8 py-4 rounded-xl shadow-xl shadow-[#1A237E]/20 hover:shadow-[#1565C0]/35 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group text-xs uppercase tracking-wider border border-white/5 active:scale-95"
                >
                  <span>Inscreva-se Gratuitamente</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a 
                  href="#benefits"
                  className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-center px-8 py-4 rounded-xl transition text-xs uppercase tracking-wider"
                >
                  Conhecer os Benefícios
                </a>
              </div>
            </div>

            {/* Right Illustrative Card inside brand compliance dark container */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md bg-gradient-to-b from-[#111111] to-[#1A1A2E] border border-white/10 rounded-2xl p-6 sm:p-8 relative shadow-2xl overflow-hidden"
              >
                {/* Decorative sub-triangle inside card element */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#31c891]/10 to-transparent blur-xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-6">
                  <div className="flex items-center gap-2 font-sans">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#31c891] animate-ping"></span>
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Processo de Admissão</span>
                  </div>
                  <span className="text-[9px] font-bold px-2.5 py-1 bg-[#31c891]/15 text-[#31c891] border border-[#31c891]/25 rounded-lg uppercase tracking-wider font-sans">
                    Ciclo Ativo
                  </span>
                </div>

                <div className="space-y-4 font-barlow">
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-start gap-4 hover:bg-white/[0.04] transition">
                    <div className="p-2.5 bg-[#31c891]/10 text-[#31c891] rounded-lg shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">Formação de Alto Nível</h4>
                      <p className="text-xs text-slate-400 mt-1">Trilha certificada gratuita avaliada em cerca de R$ 3.000 para os aprovados.</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-start gap-4 hover:bg-white/[0.04] transition">
                    <div className="p-2.5 bg-[#31c891]/10 text-[#31c891] rounded-lg shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">Rede Integrada M2M</h4>
                      <p className="text-xs text-slate-400 mt-1">Conexão direta com outros executivos e troca de expertises na área.</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-start gap-4 hover:bg-white/[0.04] transition">
                    <div className="p-2.5 bg-[#31c891]/10 text-[#31c891] rounded-lg shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">Agenda Flexível</h4>
                      <p className="text-xs text-slate-400 mt-1">Apenas 4 horas mensais exigidas para reuniões remotas com as startups.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-sans">
                  <span>Inscrições via formulário abaixo</span>
                  <span className="text-[#31c891] font-bold flex items-center gap-1 uppercase tracking-wide">
                    Portfólio 2026
                  </span>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Program Summary Statistics */}
      <section className="py-12 bg-[#111111]/80 border-y border-white/5" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/5">
            <div className="text-center p-4">
              <p className="text-4xl font-extrabold text-[#31c891] font-barlow">8</p>
              <p className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-wider font-sans">Módulos de Formação</p>
            </div>
            <div className="text-center pt-8 md:pt-4 p-4">
              <p className="text-4xl font-extrabold text-[#31c891] font-barlow">4h</p>
              <p className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-wider font-sans">Mínimo Mensal Flexível</p>
            </div>
            <div className="text-center pt-8 md:pt-4 p-4">
              <p className="text-4xl font-extrabold text-[#31c891] font-barlow">12 meses</p>
              <p className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-wider font-sans">Prazo para Certificação</p>
            </div>
            <div className="text-center pt-8 md:pt-4 p-4">
              <p className="text-4xl font-extrabold text-[#31c891] font-barlow">M2M</p>
              <p className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-wider font-sans">Desenvolvimento Inteligente</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 relative bg-[#1A1A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-[#31c891] font-semibold uppercase tracking-[0.15em] text-xs bg-[#31c891]/10 rounded-full px-3.5 py-1 border border-[#31c891]/20 font-sans">
                Pilar NINNA Hub
              </span>
              
              <h2 className="text-3xl sm:text-5xl font-barlow-cond font-bold text-white uppercase tracking-wide leading-tight">
                Liderança Ativa que Constrói o Futuro de Fortaleza para o Mundo
              </h2>
              
              <p className="text-slate-350 leading-relaxed font-barlow text-sm sm:text-base">
                O programa de mentoria é planejado para quem deseja compartilhar sua sabedoria mercadológica e estrutural de maneira coordenada. Como mentor voluntário do NINNA Hub (sob a diretriz legal da Lei de Voluntariado nº 9.608/1998), seu tempo será focado das demandas de tração operacional, tecnologia e governança estratégica.
              </p>
              <p className="text-slate-355 leading-relaxed font-barlow text-sm sm:text-base">
                Aqui investimos em quem ajuda: oferecemos uma jornada educacional moderna em parceria com formadores de renome, além de incluí-lo imediatamente na rede M2M interligada de CEOs, investidores anjos e diretores inovadores.
              </p>
              
              <div className="pt-4 flex items-center gap-4 font-sans">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-[#1A1A2E] bg-[#1A237E] flex items-center justify-center font-bold text-xs text-white">CE</div>
                  <div className="w-10 h-10 rounded-full border-2 border-[#1A1A2E] bg-[#31c891] flex items-center justify-center font-bold text-xs text-white">SP</div>
                  <div className="w-10 h-10 rounded-full border-2 border-[#1A1A2E] bg-[#E63946] flex items-center justify-center font-bold text-xs text-white">SC</div>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Mentores integrados de diversas regiões e setores estratégicos.
                </p>
              </div>
            </div>

            {/* Visual Box mapping timeline steps */}
            <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 sm:p-8 relative">
              <h3 className="text-xl font-barlow-cond font-bold uppercase tracking-wider text-white mb-6">Trilha de Formação Técnica</h3>
              <div className="space-y-4">
                {[
                  { id: '01', title: 'Ecossistema de Inovação & Startups', desc: 'Introdução global ao framework de hubs inovadores.' },
                  { id: '02', title: 'Fases das Startups & Tração', desc: 'Identifique os ritmos e gargalos de aceleração.' },
                  { id: '03', title: 'Escuta Ativa & Diagnósticos na Prática', desc: 'Formulários, feedbacks precisos e relatórios.' },
                  { id: '04', title: 'Modelos de Negócios & PMF', desc: 'Entregar valor recorrente com frameworks validados.' },
                  { id: '05', title: 'Inteligência Artificial & Estratégia Digital', desc: 'Adaptação de prompts, data e eficiência.' },
                  { id: '06', title: 'Venture Capital, Valuation & Captação', desc: 'Auxilie startups a preparar pitch-deck e rodadas.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start font-barlow">
                    <span className="text-[#31c891] font-black text-xs p-1.5 px-2 bg-[#31c891]/10 rounded-lg font-mono leading-none">
                      {item.id}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Benefits Details Section */}
      <section className="py-20 bg-[#111111]/30 border-t border-white/5" id="benefits">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-[#31c891] font-bold uppercase tracking-[0.15em] text-xs pointer-events-none">Vantagens de se Associar</span>
          <h2 className="text-3xl sm:text-5xl font-barlow-cond font-bold text-white uppercase tracking-wide">
            Uma relação de benefício integral
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-barlow">
            Ao se cadastrar você não atua apenas como conselheiro; você colhe prestígio e recursos de desenvolvimento pessoal.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 text-left font-barlow">
            
            <div className="p-6 bg-[#111111] border border-white/5 rounded-xl hover:border-[#31c891]/30 transition group duration-350">
              <div className="w-10 h-10 bg-[#31c891]/10 rounded-lg flex items-center justify-center text-[#31c891] mb-4 group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Formação Gratuita</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Os mentores admitidos são imediatamente matriculados em nossa trilha certificada com custo de mercado de R$ 3.000,00 sem custo pessoal associado.
              </p>
              <span className="inline-block text-[9px] bg-[#31c891]/10 text-[#31c891] border border-[#31c891]/20 rounded-md px-2 py-0.5 mt-4 font-bold uppercase tracking-wider font-sans">
                100% Gratuito
              </span>
            </div>

            <div className="p-6 bg-[#111111] border border-white/5 rounded-xl hover:border-[#31c891]/30 transition group duration-350">
              <div className="w-10 h-10 bg-[#31c891]/10 rounded-lg flex items-center justify-center text-[#31c891] mb-4 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Conexão M2M Exclusiva</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tenha o privilégio de receber orientações focadas em seus próprios gargalos operacionais agendando sessões diretas com outros investidores e peritos da banca.
              </p>
              <span className="inline-block text-[9px] bg-[#31c891]/15 text-[#31c891] border border-[#31c891]/25 rounded-md px-2 py-0.5 mt-4 font-bold uppercase tracking-wider font-sans">
                M2M — Mentor-To-Mentor
              </span>
            </div>

            <div className="p-6 bg-[#111111] border border-white/5 rounded-xl hover:border-[#31c891]/30 transition group duration-350">
              <div className="w-10 h-10 bg-[#31c891]/10 rounded-lg flex items-center justify-center text-[#31c891] mb-4 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Portfólio Imediato</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aprovada a sua inscrição pela nossa coordenação de avaliação, seu perfil é listado em nosso portfólio para pareamento inteligente direto com founders do Hub.
              </p>
              <span className="inline-block text-[9px] bg-[#31c891]/15 text-[#31c891] border border-[#31c891]/25 rounded-md px-2 py-0.5 mt-4 font-bold uppercase tracking-wider font-sans">
                Inclusão Direta
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-16 bg-gradient-to-b from-[#111111]/30 to-[#1A1A2E] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <span className="text-[#31c891] font-bold uppercase tracking-widest text-xs font-sans">Compromisso Ético</span>
            <h2 className="text-2xl sm:text-4xl font-barlow-cond font-bold uppercase text-white">Qual a nossa expectativa mútua?</h2>
            <p className="text-slate-400 text-sm font-barlow">
              Trabalhamos sobre uma governança séria com regras bem estipuladas para garantir a entrega de extremo valor para os fundadores de startups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 font-barlow">
            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl text-center hover:bg-white/[0.04] transition">
              <span className="text-4xl text-[#31c891] font-black font-barlow">4h</span>
              <h4 className="text-sm font-bold text-slate-200 mt-2">Disponibilidade Mensal</h4>
              <p className="text-xs text-slate-400 mt-1">Sessões individuais ou workshops de grupo previamente acordados.</p>
            </div>
            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl text-center hover:bg-white/[0.04] transition">
              <span className="text-4xl text-[#31c891] font-black font-barlow">50%+</span>
              <h4 className="text-sm font-bold text-slate-200 mt-2">Taxa de Resposta</h4>
              <p className="text-xs text-slate-400 mt-1">Compromisso em responder solicitações de mentoria alinhadas ao seu perfil.</p>
            </div>
            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl text-center hover:bg-white/[0.04] transition">
              <span className="text-4xl text-[#31c891] font-black font-barlow">12m</span>
              <h4 className="text-sm font-bold text-slate-200 mt-2">Conclusão dos Módulos</h4>
              <p className="text-xs text-slate-400 mt-1">Conclusão de toda a trilha no período máximo de 1 ano letivo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Candidate Form Section */}
      <section className="py-20 relative" id="form">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-10">
            <span className="text-[#31c891] font-bold uppercase tracking-[0.14em] text-xs font-sans">Inscrição de Novos Conselheiros</span>
            <h2 className="text-3xl sm:text-5xl font-barlow-cond font-bold text-white uppercase tracking-wide">Postule Sua Candidatura</h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto font-barlow">
              Preencha os campos abaixo com precisão. Nossos gestores avaliarão suas informações e concederão a validação de aptidão para admissão.
            </p>
          </div>

          <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-[#31c891]/5 to-transparent blur-2xl pointer-events-none" />

            {formSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6 font-barlow"
              >
                <div className="w-16 h-16 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Inscrição Recebida!</h3>
                  <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                    Agradecemos seu interesse em integrar a rede do NINNA Hub. Nossos coordenadores foram notificados e realizarão a análise do seu LinkedIn e motivação.
                  </p>
                </div>
                <div className="p-4 bg-[#31c891]/10 text-[#31c891] rounded-xl text-xs inline-block border border-[#31c891]/20 font-medium font-barlow">
                  Um e-mail de confirmação e as orientações iniciais chegarão brevemente.
                </div>
                <div className="pt-4 font-sans">
                  <button 
                    onClick={() => setFormSuccess(false)}
                    className="text-[#31c891] font-bold text-xs hover:underline uppercase tracking-wider"
                  >
                    Enviar outra candidatura
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 font-sans">
                
                {/* Visual Banner */}
                <div className="p-4 bg-[#1A237E]/25 text-slate-250 rounded-xl text-xs border border-[#1A237E]/40 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-[#31c891]" />
                  <div>
                    <h5 className="font-bold text-white font-barlow text-sm">Política de Privacidade & Termo Voluntário</h5>
                    <p className="text-slate-400 mt-1 font-barlow leading-relaxed">Ao submeter o formulário abaixo, as informações compartilhadas estarão salvas no Painel de Avaliação de Mentores para que possamos validar seu currículo e deferir seu credenciamento.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-350 uppercase tracking-wider">
                      Nome Completo <span className="text-[#E63946]">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      required
                      placeholder="Ex: Dr. Carlos Carlos"
                      className="w-full bg-[#1A1A2E] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#31c891] focus:ring-1 focus:ring-[#31c891]/20 font-barlow"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-350 uppercase tracking-wider">
                      E-mail Corporativo ou Pessoal <span className="text-[#E63946]">*</span>
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Ex: carlos@empresa.com.br"
                      className="w-full bg-[#1A1A2E] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#31c891] focus:ring-1 focus:ring-[#31c891]/20 font-barlow"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Whatsapp */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-350 uppercase tracking-wider">
                      WhatsApp com DDD <span className="text-[#E63946]">*</span>
                    </label>
                    <input 
                      type="tel" 
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      required
                      placeholder="Ex: (85) 99123-4567"
                      className="w-full bg-[#1A1A2E] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#31c891] focus:ring-1 focus:ring-[#31c891]/20 font-barlow"
                    />
                  </div>

                  {/* Cidade */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-350 uppercase tracking-wider">
                      Cidade / Estado de Residência <span className="text-[#E63946]">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleInputChange}
                      required
                      placeholder="Ex: Fortaleza, CE"
                      className="w-full bg-[#1A1A2E] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#31c891] focus:ring-1 focus:ring-[#31c891]/20 font-barlow"
                    />
                  </div>
                </div>

                {/* LinkedIn URL */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-350 uppercase tracking-wider flex items-center gap-1.5">
                    <Linkedin className="w-3.5 h-3.5 text-[#31c891]" />
                    <span>Link do Perfil no LinkedIn</span>
                  </label>
                  <input 
                    type="url" 
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/seu-perfil-exemplo"
                    className="w-full bg-[#1A1A2E] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#31c891] focus:ring-1 focus:ring-[#31c891]/20 font-barlow"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Area de Atuacao */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-350 uppercase tracking-wider">
                      Área Predominante de Mentoria <span className="text-[#E63946]">*</span>
                    </label>
                    <select 
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#1A1A2E] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#31c891] focus:ring-1 focus:ring-[#31c891]/20 font-barlow"
                    >
                      <option value="">Selecione sua especialidade</option>
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Como Conheceu */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-350 uppercase tracking-wider">
                      Como conheceu nosso Hub?
                    </label>
                    <input 
                      type="text" 
                      name="indicacao"
                      value={formData.indicacao}
                      onChange={handleInputChange}
                      placeholder="Ex: Evento, Rede Social, Indicação"
                      className="w-full bg-[#1A1A2E] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#31c891] focus:ring-1 focus:ring-[#31c891]/20 font-barlow"
                    />
                  </div>
                </div>

                {/* Motivação */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-350 uppercase tracking-wider">
                    Conte brevemente por que gostaria de orientar nossas startups
                  </label>
                  <textarea 
                    name="motivacao"
                    value={formData.motivacao}
                    onChange={handleInputChange}
                    placeholder="Quais vivências e conselhos estratégicos você sente que trarão maior impacto imediato aos fundadores e negócios em aceleração..."
                    className="w-full h-32 bg-[#1A1A2E] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#31c891] focus:ring-1 focus:ring-[#31c891]/20 resize-none font-barlow"
                  ></textarea>
                </div>

                {/* Regulamento Checkbox */}
                <div className="flex items-start gap-3 bg-[#1A1A2E] px-4 py-3.5 border border-white/10 rounded-lg">
                  <input 
                    type="checkbox" 
                    id="checkbox-regulamento"
                    name="regulamento"
                    checked={formData.regulamento}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-4.5 h-4.5 accent-[#31c891] cursor-pointer"
                  />
                  <label htmlFor="checkbox-regulamento" className="text-xs text-slate-400 select-none cursor-pointer leading-relaxed font-barlow">
                    Declaro que li e compreendo integralmente as condições gerais do <strong className="text-slate-200">Regulamento Relativo ao Programa de Mentores Voluntários</strong> do NINNA Hub, reconhecendo a natureza honorífica e de voluntariado de acordo com as leis federais aplicáveis (Lei nº 9.608/1998). <span className="text-[#E63946] font-bold">*</span>
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={formIsSubmitting}
                  className="w-full bg-gradient-to-r from-[#1A237E] to-[#1565C0] hover:scale-[1.01] active:scale-[0.99] transition duration-300 text-white font-extrabold uppercase tracking-widest text-xs sm:text-sm py-4 rounded-xl flex items-center justify-center gap-2.5 disabled:opacity-50 font-sans border border-white/10"
                >
                  {formIsSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-[#31c891]" />
                      <span>Validando cadastramento...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#31c891]" />
                      <span>Enviar Minha Candidatura</span>
                    </>
                  )}
                </button>

              </form>
            )}

          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section className="py-20 bg-[#111111]/40 border-t border-white/5 relative z-10" id="faq">
        <NinnaTriangles position="bottom-left" opacity={0.6} size="w-[280px] h-[280px] sm:w-[400px] sm:h-[400px]" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-4 mb-10">
            <span className="text-[#31c891] font-bold uppercase tracking-[0.15em] text-xs font-sans">Dúvidas Frequentes</span>
            <h2 className="text-3xl sm:text-5xl font-barlow-cond font-bold text-white uppercase tracking-wide">Central de Respostas FAQ</h2>
          </div>

          <div className="space-y-4 font-barlow">
            {faqData.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-bold text-slate-200 text-sm sm:text-base pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#31c891] shrink-0 transition-transform duration-300 ${openFaq === idx ? 'transform rotate-180' : ''}`} />
                </button>
                
                {openFaq === idx && (
                  <div className="px-6 pb-5 pt-1 text-slate-400 text-xs sm:text-sm border-t border-white/5 leading-relaxed font-barlow">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A2E] border-t border-white/5 py-12 text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <NinnaHubLogo light={true} scale={0.9} />
            <span className="text-xs text-slate-700 font-sans">|</span>
            <span className="text-xs text-slate-400 font-sans">Hub de Inovação em Novos Negócios Aplicados</span>
          </div>

          <p className="text-xs text-slate-650 font-sans">
            &copy; 1998 - 2026 NINNA Hub. Desenvolvido para fomento voluntário. Todos os direitos reservados.
          </p>

          <div className="flex gap-4 text-xs text-slate-400 font-sans">
            <a href="https://ninnahub.com.br" target="_blank" rel="noreferrer" className="hover:text-[#31c891] transition">Site Principal</a>
            <a href="https://www.instagram.com/ninna.hub/" target="_blank" rel="noreferrer" className="hover:text-[#31c891] transition">Instagram</a>
            <a href="https://www.linkedin.com/company/ninnahub" target="_blank" rel="noreferrer" className="hover:text-[#31c891] transition">LinkedIn</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
