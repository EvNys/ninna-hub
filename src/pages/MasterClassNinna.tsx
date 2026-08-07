'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Target, 
  Award, 
  HelpCircle, 
  CheckCircle, 
  Clock,  
  ChevronRight, 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  FileText,
  User,
  Heart,
  DownloadIcon,
  CircleCheck,
  Building2,
  Briefcase,
  Layers,
  ChevronDown,
  Rocket
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
    empresa: '',
    cargo: '',
  });


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


    setLoading(true);

    try {
      // Save data under the 'master_class' collection in Firestore
      await addDoc(collection(db, 'master_class'), {
        nome: formData.nome,
        telefone: formData.telefone,
        email: formData.email,
        empresa: formData.empresa,
        cargo: formData.cargo,
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
      title: 'Clareza Estratégica',
      description: 'entenda exatamente quais são as 4 camadas que sustentam retorno em projetos de IA — e pare de investir só no topo do iceberg.',
      icon: <Users className="w-8 h-8 text-[#00c9a7]" />
    },
    {
      title: 'Diagnóstico Imediato',
      description: 'identifique, ao vivo, em qual camada (estratégia, dados, processos ou cultura) sua empresa está travando hoje. ',
      icon: <Sparkles className="w-8 h-8 text-[#00c9a7]" />
    },
    {
      title: 'Dados de Mercado',
      description: 'entenda o que o relatório do MIT/NANDA revela sobre os 95% dos projetos de IA que não geram retorno — e o que os 5% fazem diferente.',
      icon: <Target className="w-8 h-8 text-[#00c9a7]" />
    },
    {
      title: 'Framework Prático',
      description: 'leve um roteiro replicável para conectar IA aos OKRs e à geração de receita da sua empresa. ',
      icon: <Award className="w-8 h-8 text-[#00c9a7]" />
    },
    {
      title: 'Interação ao Vivo',
      description: 'tire suas dúvidas em tempo real com o time do NINNA Hub — nada de conteúdo gravado. ',
      icon: <Heart className="w-8 h-8 text-[#00c9a7]" />
    },
    {
      title: 'Vagas Limitadas',
      description: 'por ser uma masterclass ao vivo, o grupo é reduzido para manter a qualidade da troca — garanta a sua.',
      icon: <Clock className="w-8 h-8 text-[#00c9a7]" />
    }
  ];

  function formatarTelefone(valor: string) {
  const numeros = valor.replace(/\D/g, '').slice(0, 11)
  if (numeros.length <= 2) return `(${numeros}`
  if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`
}

// estados
const [areaAtuacaoOpen, setAreaAtuacaoOpen] = useState(false);
const [areaAtuacaoSearch, setAreaAtuacaoSearch] = useState("");
const areaAtuacaoRef = useRef<HTMLDivElement>(null);

// fechar ao clicar fora
useEffect(() => {
  const handler = (e: MouseEvent) => {
    if (areaAtuacaoRef.current && !areaAtuacaoRef.current.contains(e.target as Node)) {
      setAreaAtuacaoOpen(false);
    }
  };
  document.addEventListener("mousedown", handler);
  return () => document.removeEventListener("mousedown", handler);
}, []);

// opções
const areasAtuacaoOptions = [
  "Agronegócio",
  "Comércio",
  "Construção Civil & Imobiliário",
  "Educação",
  "Energia & Recursos Naturais",
  "Finanças",
  "Indústria",
  "Saúde",
  "Serviços",
  "Tecnologia da Informação (TI)",
  // adicione mais conforme necessário
];


        return (
          <div className="pb-32 bg-[#fafafa] min-h-screen font-sans">
            
            {/* Hero Section */}
            <section className="relative overflow-hidden py-32 bg-brand-darker">
              <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#00c9a7,transparent_70%)]" />
              </div>

              <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] mb-6 uppercase tracking-widest">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-[#00c9a7]/10 text-[#00c9a7] text-[10px] font-black uppercase tracking-[0.3em] mb-2 border border-[#00c9a7]/20">
                    MASTERCLASS GRATUITA · AO VIVO · 17/08 ÀS 19H30 
                  </span>
                </div>

                {/* Título Hero → Barlow Condensed Black, weight 900, uppercase, size 48–80px */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-[48px] md:text-[72px] text-white uppercase leading-[1.0] mb-6"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, letterSpacing: '-0.5px' }}
                >
                  A VERDADE INVISÍVEL SOBRE A IA NOS <span className="text-[#00c9a7]">NEGÓCIOS</span>.
                  
                </motion.h1>

                {/* Subtítulo → Barlow Condensed Bold, weight 700, size 24–36px, leading 1.2 */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-gray-400 text-[20px] md:text-[20px] max-w-2xl mx-auto mb-10"
                  style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 500, lineHeight: 1.2 }}
                >
                  95% dos projetos de IA não geram retorno financeiro, segundo um relatório do MIT.
                  Na Masterclass gratuita do NINNA Hub, você vai entender por que isso acontece e como estruturar a base da sua empresa (estratégia, dados, processos e cultura) para transformar IA em ROI de verdade. 
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
                    className="w-full sm:w-auto bg-[#00c9a7] hover:bg-[#00c9a7]/90 text-white rounded-2xl py-4 px-10 uppercase transition-all shadow-xl shadow-[#00c9a7]/20 text-[13px]"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: '3px' }}
                  >
                    QUERO GARANTIR MINHA VAGA 
                  </button>

                  <button
                    onClick={() => window.open('/docs/RegulamentoMentores.pdf', '_blank')}
                    className="w-full sm:w-auto border border-gray-800 bg-transparent hover:bg-gray-900 text-white rounded-2xl py-4 px-10 uppercase transition-all text-[13px]"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, letterSpacing: '3px' }}
                  >
                    SAIBA MAIS SOBRE A MASTERCLASS 
                  </button>
                </motion.div>
              </div>
            </section>

            <section className="py-20 relative bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  
                  <div className="space-y-6">
                    <span className="text-[10px] font-black text-[#00c9a7] uppercase tracking-[0.25em] bg-[#00c9a7]/10 rounded-full px-3.5 py-1 border border-[#00c9a7]/20">
                      Participe da Master Class
                    </span>
                    
                    <h2 className="text-3xl sm:text-5xl font-black text-gray-900 uppercase tracking-wide  leading-tight">
                        A CONTA QUE NÃO FECHA NO CORPORATIVO 
                    </h2>
                    
                    <p className="text-gray-500 font-medium leading-relaxed text-sm sm:text-base">
                      Segundo um relatório do MIT (NANDA), 95% do valor investido em projetos de IA para negócios não está gerando retorno. Não é falta de tecnologia — é falta de base. A maioria das empresas investe no topo do iceberg (o uso visível da IA) e ignora a estrutura que sustenta resultado: estratégia, dados, processos e cultura. 
                    </p>
                    <p className="text-gray-500 font-medium leading-relaxed text-sm sm:text-base">
                      Aqui investimos em quem ajuda: oferecemos uma jornada educacional moderna em parceria com formadores de renome, além de incluí-lo imediatamente na rede M2M interligada de CEOs, investidores anjos e diretores inovadores.
                    </p>
                    
                    <div className="pt-4 flex items-center gap-4">
                      <div className="flex -space-x-3">
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-[#1A1A2E] flex items-center justify-center font-black text-xs text-white">CE</div>
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-[#00c9a7] flex items-center justify-center font-black text-xs text-white">SP</div>
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

            {/* Seção Pricing Cards — NINNA Hub */}
            <section className="relative overflow-hidden py-32 bg-brand-darker">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="absolute inset-0 z-0 opacity-20">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#00c9a7,transparent_70%)]" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Esquerda: texto */}
            <div className="space-y-6">


              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-wide leading-tight">
                A VERDADE INVISÍVEL SOBRE <br />A IA NOS NEGÓCIOS
              </h2>

              <p className="text-gray-500 font-medium leading-relaxed text-sm sm:text-base">
                Masterclass ao vivo e gratuita para quem quer estruturar a base de IA da empresa e gerar ROI de verdade. 
              </p>

              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-[#1A1A2E] flex items-center justify-center font-black text-xs text-white">CE</div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-[#00c9a7] flex items-center justify-center font-black text-xs text-white">SP</div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-[#E63946] flex items-center justify-center font-black text-xs text-white">SC</div>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                   
                </p>
              </div>
            </div>

            {/* Direita: card */}
            <div className="border-2 border-[#00c9a7] rounded-2xl p-6 sm:p-8">

              <div className="mt-4 flex items-center gap-4">
                <p className="text-4xl font-barlow-cond font-black text-white">
                 Gratuito
                </p>
              </div>
              <p className="text-[11px] text-gray-400 font-medium mt-1">acesso completo à trilha · 12 meses</p>

              <hr className="my-4 border-gray-100" />

              <ul className="space-y-2 mb-5">
                {[
                  '8 módulos completos da trilha',
                  'Acesso à rede M2M de CEOs e investidores',
                  'Jornada educacional com formadores de renome',
                  'Sessões práticas com casos reais',
                  'Frameworks e ferramentas para mentoria',
                  'Certificado de mentor credenciado NINNA Hub',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-500 font-medium">
                    <CircleCheck className="w-4 h-4 text-[#00c9a7] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="bg-[#00c9a7]/7 border border-[#00c9a7]/20 rounded-xl p-3 flex gap-2">
                <div>
                  <p className="text-[10px] font-black text-[#00c9a7] uppercase tracking-[0.1em] mb-0.5">
                    Master Class de inteligência artificial aplicada a negócios
                  </p>
                  <span className="text-[11px] text-gray-400 font-medium leading-relaxed">
                    Masterclass ao vivo, sem custo. As vagas são limitadas para garantir qualidade na interação — garanta a sua inscrevendo-se abaixo.
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Disclaimer */}
          <div className="mt-8 bg-[#1a1a2e] border border-white/5 rounded-2xl px-5 py-4">
            <p className="text-xs text-white/50 font-medium leading-relaxed">
              Este card é apenas informativo.{' '}
              <span className="text-[#00c9a7] font-bold">Nenhuma compra é realizada aqui.</span>{' '}
              Os preços apresentados são de referência para o mercado. Mentores voluntários selecionados pelo NINNA Hub têm acesso integral à formação de forma completamente gratuita
            </p>
          </div>

        </div>
      </section>


      {/* Benefits Grid (Por que ser mentor?) */}
      <section id="beneficios" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black text-[#00c9a7] uppercase tracking-[0.25em] block mb-2">Resultados da Master Class</span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-wide ">
            O QUE VOCÊ VAI LEVAR DESSA MASTERCLASS 
          </h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto mt-3 text-sm">
            Além de conteúdo direto ao ponto, você sai com clareza sobre o que realmente sustenta ROI em IA: 
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
                <div className="w-16 h-16 rounded-2xl bg-[#00c9a7]/10 flex items-center justify-center mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-wide  mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-500 font-barlow text-xs leading-relaxed">
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
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#00c9a7,transparent_70%)]" />
      </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="max-w-2xl mx-auto text-center space-y-4 ">
            {/* Atualizado para a badge padrão em dark mode */}
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#00c9a7]/10 text-[#00c9a7] text-[10px] font-black uppercase tracking-[0.3em] mb-2 border border-[#00c9a7]/20">
              COMO FUNCIONA 
            </span>
            
            {/* Atualizado para combinar com o estilo dos H1s anteriores */}
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-wide text-white leading-none">
              O QUE ESPERAR DA MASTERCLASS AO VIVO 
            </h2>
            
            {/* Alterado para text-gray-400 para manter a consistência da descrição */}
            <p className="text-gray-400 text-base font-medium max-w-xl mx-auto leading-relaxed">
              Uma sessão direta ao ponto, pensada para quem decide — não para quem só quer "testar mais uma ferramenta de IA". 
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            {/* CARD 1 */}
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center hover:bg-white/[0.04] transition-all duration-300">
              {/* Substituído pelo text-[#00c9a7] do seu ecossistema */}
              <span className="text-5xl text-[#00c9a7] font-black tracking-wide block mb-2">60 Min</span>
              <h4 className="text-sm font-black uppercase tracking-wider text-white">CONTEÚDO DIRETO AO PONTO</h4>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">sem enrolação: as 4 camadas do ROI em IA explicadas de forma prática, com exemplos reais.</p>
            </div>
            
            {/* CARD 2 */}
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center hover:bg-white/[0.04] transition-all duration-300">
              <span className="text-5xl text-[#00c9a7] font-black tracking-wide block mb-2">100%</span>
              <h4 className="text-sm font-black uppercase tracking-wider text-white">Ao vivo e gratuita</h4>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">sem custo, sem pegadinha. Você só precisa se inscrever e aparecer.</p>
            </div>
            
            {/* CARD 3 */}
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center hover:bg-white/[0.04] transition-all duration-300">
              <span className="text-5xl text-[#00c9a7] font-black tracking-wide block mb-2">17/08</span>
              <h4 className="text-sm font-black uppercase tracking-wider text-white">Data da Master Class</h4>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">às 19h30, online, com sessão de perguntas e respostas ao final.</p>
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
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-wide  mb-2">
                  GARANTA SUA VAGA NA MASTERCLASS
                </h2>
                <p className="text-gray-500 font-barlow text-xs leading-relaxed">
                  Preencha os campos abaixo com atenção para que possamos entender sua vivência profissional e combiná-la com as mentiras ideais.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Nome */}
                <div className="space-y-2">
                  <label htmlFor="nome" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#00c9a7]" /> Nome Completo
                  </label>
                  <input 
                    id="nome"
                    name="nome"
                    type="text"
                    required
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Ex: Roberto Silva"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#00c9a7] transition-all text-gray-900 shadow-sm font-barlow placeholder:text-gray-300"
                  />
                </div>

                {/* Grid Telefone e Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Telefone */}
                  <div className="space-y-2">
                    <label htmlFor="telefone" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#00c9a7]" /> Telefone para contato
                    </label>
                    <input 
                      id="telefone"
                      name="telefone"
                      type="tel"
                      required
                      value={formData.telefone}
                      onChange={handleInputChange}
                      placeholder="(DD) 99999-9999"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#00c9a7] transition-all text-gray-900 shadow-sm font-barlow placeholder:text-gray-300"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#00c9a7]" /> E-mail corporativo ou pessoal
                    </label>
                    <input 
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="roberto.silva@suaempresa.com"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#00c9a7] transition-all text-gray-900 shadow-sm font-barlow placeholder:text-gray-300"
                    />
                  </div>
                </div>
                

                  {/* Grid Empresa, Cargo e Área de Atuação */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Empresa */}
                    <div className="space-y-2">
                      <label htmlFor="empresa" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#00c9a7]" /> Empresa
                      </label>
                      <input
                        id="empresa"
                        name="empresa"
                        type="text"
                        required
                        value={formData.empresa}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#00c9a7] transition-all text-gray-900 shadow-sm font-barlow placeholder:text-gray-300"
                      />
                    </div>

                    {/* Cargo */}
                    <div className="space-y-2">
                      <label htmlFor="cargo" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-[#00c9a7]" /> Cargo
                      </label>
                      <input
                        id="cargo"
                        name="cargo"
                        type="text"
                        required
                        value={formData.cargo}
                        onChange={handleInputChange}
                        placeholder="Ex: Gerente Comercial"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#00c9a7] transition-all text-gray-900 shadow-sm font-barlow placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                                                                                           
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00c9a7] hover:bg-[#00c9a7]/90 text-white rounded-2xl py-4.5 font-black uppercase text-[11px] tracking-[0.2em] transition-all shadow-xl shadow-[#00c9a7]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Processando envio...' : 'Enviar Inscrição para Master Class NINNA'}
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
              <div className="w-20 h-20 bg-[#00c9a7]/10 rounded-full flex items-center justify-center mx-auto text-[#00c9a7] shrink-0">
                <CheckCircle className="w-10 h-10" />
              </div>

              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-wide ">
                Inscrição Enviada!
              </h2>

              <p className="text-gray-500 font-barlow text-sm max-w-md mx-auto leading-relaxed">
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
                      empresa: '',
                      cargo: '',
                    });
                  }}
                  className="bg-[#00c9a7] hover:bg-[#00c9a7]/90 text-white rounded-2xl py-4 px-10 font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-[#00c9a7]/15"
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
