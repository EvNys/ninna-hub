'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Target, 
  Award, 
  HelpCircle, 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  ChevronRight, 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  FileText,
  User,
  Heart,
  DownloadIcon,
  FileTextIcon
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'sonner';
import { title } from 'process';

export default function SejaUmMentor() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    cidade: '',
    pais: '',
    estado: '',
    areaMentoria: '',
    comoConheceu: '',
    motivoInscricao: '',
    cienteRegulamento: false
  });

  const areasMentoriaOptions = [
    'Tecnologia, Dev & Arquitetura de Software',
    'Vendas, Marketing & Growth',
    'Gestão, OKRs & Processos',
    'Financeiro, Métricas & Captação de Recursos',
    'Jurídico, Societário & LGPD',
    'Product Management, Design & UX',
    'Recursos Humanos, Cultura & Liderança',
    'Outros'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'telefone' ? formatarTelefone(value) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cienteRegulamento) {
      toast.error('Você precisa aceitar os termos do regulamento para continuar.');
      return;
    }

    setLoading(true);

    try {
      // Save data under the 'inscricoes_mentores' collection in Firestore
      await addDoc(collection(db, 'inscricoes_mentores'), {
        nome: formData.nome,
        telefone: formData.telefone,
        email: formData.email,
        cidade: formData.cidade,
        areaMentoria: formData.areaMentoria,
        comoConheceu: formData.comoConheceu,
        motivoInscricao: formData.motivoInscricao,
        cienteRegulamento: formData.cienteRegulamento,
        status: 'pendente',
        createdAt: serverTimestamp()
      });

      setSuccess(true);
      toast.success('Inscrição enviada com sucesso! Nossa equipe entrará em contato em breve.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Erro ao enviar inscrição:', error);
      toast.error('Erro ao enviar sua inscrição. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // custom offset for sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const benefits = [
    {
      title: 'Networking de Alto Impacto',
      description: 'Conecte-se e troque experiências diretamente com outros mentores, executivos, investidores e fundadores do ecossistema nacional.',
      icon: <Users className="w-8 h-8 text-[#8CC63F]" />
    },
    {
      title: 'Contato com Novas Tecnologias',
      description: 'Acompanhe de perto as ideias mais inovadoras, as tecnologias emergentes e os novos modelos de negócios escaláveis do mercado.',
      icon: <Sparkles className="w-8 h-8 text-[#8CC63F]" />
    },
    {
      title: 'Fomento e Impacto Real',
      description: 'Gere impacto real ao apoiar a criação e a consolidação de novas startups, fomentando inovação e gerando oportunidades regionais.',
      icon: <Target className="w-8 h-8 text-[#8CC63F]" />
    },
    {
      title: 'Destaque e Visibilidade do Perfil',
      description: 'Apareça como mentor referência nas páginas exclusivas do NINNA Hub, em publicações do ecossistema e eventos parceiros.',
      icon: <Award className="w-8 h-8 text-[#8CC63F]" />
    },
    {
      title: 'Aprimoramento de Liderança',
      description: 'Aconselhar fundadores em diferentes estágios ajuda a calibrar suas próprias capacidades de liderança, escuta e análise crítica.',
      icon: <Heart className="w-8 h-8 text-[#8CC63F]" />
    },
    {
      title: 'Encontros Exclusivos',
      description: 'Participe de jantares, meetups exclusivos de mentores, rituais de happy hour e receba convites especiais para eventos de inovação do Hub.',
      icon: <Clock className="w-8 h-8 text-[#8CC63F]" />
    }
  ];

  function formatarTelefone(valor: string) {
  const numeros = valor.replace(/\D/g, '').slice(0, 11)
  if (numeros.length <= 2) return `(${numeros}`
  if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`
}



  return (
    <div className="pb-32 bg-[#fafafa] min-h-screen font-sans">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32 bg-brand-darker">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#8CC63F,transparent_70%)]" />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#8CC63F]/10 text-[#8CC63F] rounded-full text-[11px] border border-[#8CC63F]/20 mb-6 uppercase tracking-widest"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: '3px' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Seja um Mentor</span>
          </motion.div>

          {/* Título Hero → Barlow Condensed Black, weight 900, uppercase, size 48–80px */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[48px] md:text-[72px] text-white uppercase leading-[1.0] mb-6"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, letterSpacing: '-0.5px' }}
          >
            Guie as startups do amanhã. <br className="hidden md:inline" />
            Compartilhe seu <span className="text-[#8CC63F]">Legado</span>.
          </motion.h1>

          {/* Subtítulo → Barlow Condensed Bold, weight 700, size 24–36px, leading 1.2 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-[20px] md:text-[28px] max-w-2xl mx-auto mb-10"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, lineHeight: 1.2 }}
          >
            O NINNA Hub é o epicentro da inovação corporativa e do fomento ao empreendedorismo.
            Como mentor, você será a peça fundamental para acelerar o crescimento de startups brilhantes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            {/* Labels/Tags → Barlow Condensed Semibold, weight 600, uppercase, tracking +2–4px, size 12–16px */}
            <button
              onClick={() => scrollToSection('formulario')}
              className="w-full sm:w-auto bg-[#8CC63F] hover:bg-[#8CC63F]/90 text-white rounded-2xl py-4 px-10 uppercase transition-all shadow-xl shadow-[#8CC63F]/20 text-[13px]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: '3px' }}
            >
              Quero ser mentor
            </button>

            <button
              onClick={() => window.open('public/docs/RegulamentoMentores.pdf', '_blank')}
              className="w-full sm:w-auto border border-gray-800 bg-transparent hover:bg-gray-900 text-white rounded-2xl py-4 px-10 uppercase transition-all text-[13px]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: '3px' }}
            >
              Leia o Regulamento
            </button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-[10px] font-black text-[#8CC63F] uppercase tracking-[0.25em] bg-[#8CC63F]/10 rounded-full px-3.5 py-1 border border-[#8CC63F]/20">
                Pilar NINNA Hub
              </span>
              
              <h2 className="text-3xl sm:text-5xl font-black text-gray-900 uppercase tracking-tighter  leading-tight">
                Liderança Ativa que Constrói o Futuro de Fortaleza para o Mundo
              </h2>
              
              <p className="text-gray-500 font-medium leading-relaxed text-sm sm:text-base">
                O programa de mentoria é planejado para quem deseja compartilhar sua sabedoria mercadológica e estrutural de maneira coordenada. Como mentor voluntário do NINNA Hub (sob a diretriz legal da Lei de Voluntariado nº 9.608/1998), seu tempo será focado das demandas de tração operacional, tecnologia e governança estratégica.
              </p>
              <p className="text-gray-500 font-medium leading-relaxed text-sm sm:text-base">
                Aqui investimos em quem ajuda: oferecemos uma jornada educacional moderna em parceria com formadores de renome, além de incluí-lo imediatamente na rede M2M interligada de CEOs, investidores anjos e diretores inovadores.
              </p>
              
              <div className="pt-4 flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-[#1A1A2E] flex items-center justify-center font-black text-xs text-white">CE</div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-[#8CC63F] flex items-center justify-center font-black text-xs text-white">SP</div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-[#E63946] flex items-center justify-center font-black text-xs text-white">SC</div>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  Mentores integrados de diversas regiões e setores estratégicos.
                </p>
              </div>
            </div>

            {/* Visual Box mapping timeline steps */}
            <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-6 sm:p-8 relative">
              <h3 className="text-xl font-barlow-cond font-bold uppercase tracking-wider text-white mb-6">Trilha de Formação Técnica</h3>
              <div className="space-y-4">
                {[
                  { id: '01', title: 'Papel do Mentor', desc: 'Compreenda a atuação estratégica do mentor, desenvolvendo escuta ativa, perguntas poderosas e geração de valor.' },
                  { id: '02', title: 'Relação Mentor x Empreendedor', desc: 'Construa relações de confiança com alinhamento de expectativas e acompanhamento de evolução.' },
                  { id: '03', title: 'Mentalidade Startup & Incerteza', desc: 'Entenda como startups validam hipóteses, aprendem rapidamente e crescem em cenários dinâmicos.' },
                  { id: '04', title: 'Diagnóstico Estratégico', desc: 'Identifique maturidade, gargalos e oportunidades para orientar decisões e acelerar resultados.' },
                  { id: '05', title: "Validações e Decisões Baseadas em Dados", desc: "Apoie empreendedores na redução de riscos por meio de experimentação e evidências."},
                  { id: '06', title: 'Prática de mentoria & condução de sessões', desc: 'Aplique técnicas em simulações, casos reais e roteiros estruturados de mentoria.' },
                  { id: '07', title: 'Ferramentas Para Mentorias de Alto Impacto', desc: 'Utilize frameworks e modelos para acompanhar evolução e apoiar a tomada de decisão.' },
                  { id: '08', title: 'Ètica, Limites & Governança', desc: 'Atue com responsabilidade, boas práticas e critérios que fortalecem o ecossistema.' },

                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start font-barlow">
                    <span className="text-[#00c9a7] font-black text-xs p-1.5 px-2 bg-[#31c891]/10 rounded-lg font-mono leading-none">
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


      {/* Benefits Grid (Por que ser mentor?) */}
      <section id="beneficios" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black text-[#8CC63F] uppercase tracking-[0.25em] block mb-2">Ecossistema de Alto Impacto</span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter ">
            Benefícios de ser um Mentor NINNA
          </h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto mt-3 text-sm">
            Além de fazer parte de uma comunidade exclusiva, confira o valor que a mentoria voluntária agrega à sua carreira e trajetória profissional:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white p-8 border border-gray-100 rounded-[32px] hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-[#8CC63F]/10 flex items-center justify-center mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter  mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-500 font-semibold text-xs leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      { /* Expectations Section (Compromisso Ético) */}
      <section className="py-16 bg-brand-darker border-t border-white/5 relative z-10">
      <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#8CC63F,transparent_70%)]" />
      </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="max-w-2xl mx-auto text-center space-y-4 ">
            {/* Atualizado para a badge padrão em dark mode */}
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#8CC63F]/10 text-[#8CC63F] text-[10px] font-black uppercase tracking-[0.3em] mb-2 border border-[#8CC63F]/20">
              Compromisso Ético
            </span>
            
            {/* Atualizado para combinar com o estilo dos H1s anteriores */}
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white leading-none">
              Qual a nossa expectativa mútua?
            </h2>
            
            {/* Alterado para text-gray-400 para manter a consistência da descrição */}
            <p className="text-gray-400 text-base font-medium max-w-xl mx-auto leading-relaxed">
              Trabalhamos sobre uma governança séria com regras bem estipuladas para garantir a entrega de extremo valor para os fundadores de startups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            {/* CARD 1 */}
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center hover:bg-white/[0.04] transition-all duration-300">
              {/* Substituído pelo text-[#8CC63F] do seu ecossistema */}
              <span className="text-5xl text-[#8CC63F] font-black tracking-tight block mb-2">4h</span>
              <h4 className="text-sm font-black uppercase tracking-wider text-white">Disponibilidade Mensal</h4>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">Sessões individuais ou workshops de grupo previamente acordados.</p>
            </div>
            
            {/* CARD 2 */}
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center hover:bg-white/[0.04] transition-all duration-300">
              <span className="text-5xl text-[#8CC63F] font-black tracking-tight block mb-2">50%+</span>
              <h4 className="text-sm font-black uppercase tracking-wider text-white">Taxa de Resposta</h4>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">Compromisso em responder solicitações de mentoria alinhadas ao seu perfil.</p>
            </div>
            
            {/* CARD 3 */}
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center hover:bg-white/[0.04] transition-all duration-300">
              <span className="text-5xl text-[#8CC63F] font-black tracking-tight block mb-2">12m</span>
              <h4 className="text-sm font-black uppercase tracking-wider text-white">Conclusão dos Módulos</h4>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">Conclusão de toda a trilha no período máximo de 1 ano letivo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form Block */}
      <section id="formulario" className="py-24 max-w-3xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form-container"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-xl"
            >
              <div className="text-center md:text-left mb-10 border-b border-gray-100 pb-8">
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter  mb-2">
                  Ficha de Inscrição
                </h2>
                <p className="text-gray-500 font-semibold text-xs leading-relaxed">
                  Preencha os campos abaixo com atenção para que possamos entender sua vivência profissional e combiná-la com as mentiras ideais.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Nome */}
                <div className="space-y-2">
                  <label htmlFor="nome" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#8CC63F]" /> Nome Completo
                  </label>
                  <input 
                    id="nome"
                    name="nome"
                    type="text"
                    required
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Ex: Roberto Silva"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#8CC63F] transition-all text-gray-900 shadow-sm font-semibold placeholder:text-gray-300"
                  />
                </div>

                {/* Grid Telefone e Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Telefone */}
                  <div className="space-y-2">
                    <label htmlFor="telefone" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#8CC63F]" /> Telefone para contato
                    </label>
                    <input 
                      id="telefone"
                      name="telefone"
                      type="tel"
                      required
                      value={formData.telefone}
                      onChange={handleInputChange}
                      placeholder="(DD) 99999-9999"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#8CC63F] transition-all text-gray-900 shadow-sm font-semibold placeholder:text-gray-300"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#8CC63F]" /> E-mail corporativo ou pessoal
                    </label>
                    <input 
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="roberto.silva@suaempresa.com"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#8CC63F] transition-all text-gray-900 shadow-sm font-semibold placeholder:text-gray-300"
                    />
                  </div>
                </div>

                

                {/* Grid País e Estado */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* País */}
                    <div className="space-y-2">
                      <label htmlFor="pais" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#8CC63F]" /> País
                      </label>
                      <input
                        id="pais"
                        name="pais"
                        type="text"
                        required
                        value={formData.pais}
                        onChange={handleInputChange}
                        placeholder="Ex: Brasil"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#8CC63F] transition-all text-gray-900 shadow-sm font-semibold placeholder:text-gray-300"
                      />
                    </div>

                    {/* Estado */}
                    <div className="space-y-2">
                      <label htmlFor="estado" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#8CC63F]" /> Estado
                      </label>
                      <select
                        id="estado"
                        name="estado"
                        required
                        value={formData.estado}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#8CC63F] transition-all text-gray-900 shadow-sm font-semibold appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Selecione o estado</option>
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                        <option value="Outros">Outros</option>
                      </select>
                    </div>
                  </div>

                {/* Grid Cidade e Area Predominante */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cidade */}
                  <div className="space-y-2">
                    <label htmlFor="cidade" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#8CC63F]" /> Cidade
                    </label>
                    <input 
                      id="cidade"
                      name="cidade"
                      type="text"
                      required
                      value={formData.cidade}
                      onChange={handleInputChange}
                      placeholder="Ex: Fortaleza, CE"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#8CC63F] transition-all text-gray-900 shadow-sm font-semibold placeholder:text-gray-300"
                    />
                  </div>

                  {/* Área Predominante */}
                  <div className="space-y-2">
                    <label htmlFor="areaMentoria" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-[#8CC63F]" /> Área predominante de mentoria
                    </label>
                    <select
                      id="areaMentoria"
                      name="areaMentoria"
                      required
                      value={formData.areaMentoria}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#8CC63F] transition-all text-gray-900 shadow-sm font-semibold"
                    >
                      <option value="" disabled>Selecione uma área...</option>
                      {areasMentoriaOptions.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Como conheceu o HUB */}
                <div className="space-y-2">
                  <label htmlFor="comoConheceu" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-[#8CC63F]" /> Como você conheceu o NINNA HUB?
                  </label>
                  <input 
                    id="comoConheceu"
                    name="comoConheceu"
                    type="text"
                    required
                    value={formData.comoConheceu}
                    onChange={handleInputChange}
                    placeholder="Ex: Redes sociais, indicação de parceiro, imprensa..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#8CC63F] transition-all text-gray-900 shadow-sm font-semibold placeholder:text-gray-300"
                  />
                </div>

                {/* Descrição do motivo */}
                <div className="space-y-2">
                  <label htmlFor="motivoInscricao" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#8CC63F]" /> Por que gostaria de ser um mentor NINNA?
                  </label>
                  <textarea 
                    id="motivoInscricao"
                    name="motivoInscricao"
                    required
                    rows={4}
                    value={formData.motivoInscricao}
                    onChange={handleInputChange}
                    placeholder="Escreva brevemente seu propósito ao doar mentores, interesses e quais especialidades deseja trabalhar..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#8CC63F] transition-all text-gray-900 shadow-sm font-semibold placeholder:text-gray-300 resize-none"
                  />
                </div>

              {/* Caixa Regras — PDF Preview */}
                <div className="space-y-2 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                    Termos do Programa de Mentoria Voluntária
                  </h4>

                  {/* PDF Viewer com iframe */}
                  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                    {/* Barra do visualizador */}
                    <div className="bg-[#e8e4e0] px-3 py-1.5 flex items-center gap-2 border-b border-gray-200">
                      <div className="flex gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                      </div>
                      <div className="flex-1 bg-[#d4cfc9] rounded h-[18px] flex items-center px-2 gap-1">
                        <span className="text-[10px] text-gray-500 font-medium">termos-mentoria-ninna-hub.pdf</span>
                      </div>
                    </div>

                    {/* iframe do PDF */}
                    <iframe
                      src="public/docs/RegulamentoMentores.pdf"
                      className="w-full h-48 border-0"
                      title="Termos do Programa de Mentoria Voluntária"
                    />
                  </div>

                  {/* Botão PDF completo */}
                        <a
                          href="public/docs/RegulamentoMentores.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl border border-gray-200 bg-white text-[11px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <DownloadIcon className="w-3.5 h-3.5" />
                          Ver documento completo
                        </a>
                      </div>

                {/* Checkbox Termos */}
                <div className="flex items-start gap-3 pt-2">
                  <input 
                    id="cienteRegulamento"
                    name="cienteRegulamento"
                    type="checkbox"
                    required
                    checked={formData.cienteRegulamento}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5 bg-gray-50 border-gray-100 rounded-md focus:ring-[#8CC63F] accent-[#8CC63F] mt-0.5 shrink-0"
                  />
                  <label htmlFor="cienteRegulamento" className="text-xs text-gray-500 font-bold leading-snug cursor-pointer select-none">
                    Garanto que estou ciente das condições impostas no regulamento do programa de mentores e aceito os termos voluntários estabelecidos.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#8CC63F] hover:bg-[#8CC63F]/90 text-white rounded-2xl py-4.5 font-black uppercase text-[11px] tracking-[0.2em] transition-all shadow-xl shadow-[#8CC63F]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Processando envio...' : 'Enviar Inscrição de Mentor'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
            ) : (
            <motion.div
              key="success-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white border border-gray-100 rounded-[40px] p-12 text-center shadow-xl space-y-6"
            >
              <div className="w-20 h-20 bg-[#8CC63F]/10 rounded-full flex items-center justify-center mx-auto text-[#8CC63F] shrink-0">
                <CheckCircle className="w-10 h-10" />
              </div>

              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter ">
                Inscrição Enviada!
              </h2>

              <p className="text-gray-500 font-semibold text-sm max-w-md mx-auto leading-relaxed">
                Muito obrigado por manifestar interesse em apoiar o ecossistema do <strong>NINNA HUB</strong>. 
                Nossa equipe avaliará suas informações profissionais e entrará em contato em breve através do e-mail ou telefone informado.
              </p>

              <div className="pt-6">
                <button
                  onClick={() => {
                    setSuccess(false);
                    setFormData({
                      nome: '',
                      telefone: '',
                      email: '',
                      cidade: '',
                      pais: '',
                      estado: '',
                      areaMentoria: '',
                      comoConheceu: '',
                      motivoInscricao: '',
                      cienteRegulamento: false
                    });
                  }}
                  className="bg-[#8CC63F] hover:bg-[#8CC63F]/90 text-white rounded-2xl py-4 px-10 font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-[#8CC63F]/15"
                >
                  Fazer nova inscrição
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      
    </div>
  );
}
