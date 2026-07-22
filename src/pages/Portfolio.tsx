import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Rocket, Search, MapPin, ExternalLink, Filter, X, ChevronDown, Briefcase, Award } from 'lucide-react';

const Portfolio = () => {
  const [startups, setStartups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMaturity, setSelectedMaturity] = useState('all');
  const [selectedBusinessType, setSelectedBusinessType] = useState('all');
  const [selectedStartup, setSelectedStartup] = useState<any>(null);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const q = query(
          collection(db, 'startups'), 
          where('status', '==', 'ativo'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        setStartups(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, []);

  const categories = [
    'all', 
    'Agritech', 'FoodTech', 'HealthTech', 'MedTech', 'BioTech', 
    'FinTech', 'InsurTech', 'PropTech', 'Construtech', 'RetailTech', 
    'E-commerce Tech', 'LogTech', 'MobilityTech', 'AutoTech', 'EnergyTech', 
    'ClimateTech', 'CleanTech', 'GovTech', 'RegTech', 'LegalTech', 
    'EdTech', 'HRTech', 'WorkTech', 'Martech', 'AdTech', 'SalesTech', 
    'Customer Experience (CX Tech)', 'TravelTech', 'HospitalityTech', 
    'SportTech', 'GameTech', 'MediaTech', 'CreatorTech', 'FashionTech', 
    'BeautyTech', 'PetTech', 'AgFinTech', 'SpaceTech', 'OceanTech', 
    'MiningTech', 'IndustryTech (IndTech)', 'ManufacturingTech', 
    'SupplyChainTech', 'Cybersecurity (CyberTech)', 'DataTech', 
    'AI Tech', 'Blockchain / Web3 Tech', 'Outros'
  ];

  const [isOpen, setIsOpen] = useState(false);

  const maturityOptions = ['all', 'Ideação', 'Validação', 'Operação', 'Tração', 'Scale-up'];
  const businessTypeOptions = ['all', 'B2B', 'B2C', 'B2B2C', 'B2G', 'SaaS', 'Marketplace', 'Hardware', 'Outros'];

  const filteredStartups = startups.filter(s => {
    const matchesSearch = s.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.descricaoCurta.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || s.categoria?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesMaturity = selectedMaturity === 'all' || s.estagio?.toLowerCase() === selectedMaturity.toLowerCase();
    const matchesBusinessType = selectedBusinessType === 'all' || s.tipoNegocio?.toLowerCase() === selectedBusinessType.toLowerCase();
    return matchesSearch && matchesCategory && matchesMaturity && matchesBusinessType;
  });

  return (
    <div className="pb-32 relative overflow-hidden bg-[#fafafa]">
      <meta name="description" content="Explore o portfólio de startups do ecossistema NINNA, incluindo empresas em diferentes etapas de desenvolvimento e categorias." />
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ x: [0, 30, 0], y: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[10%] -left-20 w-80 h-80 bg-brand-teal/5 blur-[100px] rounded-full" 
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-[20%] -right-20 w-96 h-96 bg-brand-teal/5 blur-[100px] rounded-full" 
        />
      </div>

      {/* Header */}
      <section className="relative overflow-hidden py-32 border-b border-gray-100">
        <div className="absolute top-1/2 left-0 w-32 h-[400px] bg-brand-teal/5 -translate-y-1/2 -skew-x-12 z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/5 blur-[120px] rounded-full -mr-40 -mt-40 z-10 pointer-events-none" />
        
        {/* Low opacity background image with 70% opacity and 85% background matching cases tab */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#fafafa]/85 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2000" 
            alt="Startup Ecosystem" 
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
              Ecossistema em Movimento
            </div>
            <h1 className="text-7xl md:text-[120px] font-black mb-8 uppercase tracking-wide leading-[0.85] text-gray-900 ">
              NINNA 4 <br /><span className="gradient-text">STARTUPS</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed border-t border-gray-200 pt-8 mt-8 font-medium">
              Conheça as soluções inovadoras que fazem parte do nosso ecossistema e estão transformando o mercado global.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Banners Recém-Adicionados */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Banner 1 */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden p-10 rounded-[40px] bg-gradient-to-br from-brand-teal to-[#16a34a] group cursor-pointer shadow-xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform" />
            <div className="relative z-10">
              <h3 className="text-4xl font-black text-white mb-4 leading-tight uppercase tracking-wide ">quero me conectar com as <br />soluções do NINNA hub</h3>
              <p className="text-white/80 mb-8 font-medium max-w-sm">Conecte sua startup a grandes corporações e acelere seu crescimento no maior hub de inovação do Ceará.</p>
              <button className="bg-white text-brand-teal px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg">
                Clique Aqui
              </button>
            </div>
            <Rocket className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          </motion.div>

          {/* Banner 2 */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden p-10 rounded-[40px] bg-gradient-to-br from-gray-900 to-gray-800 group cursor-pointer shadow-xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform" />
            <div className="relative z-10">
              <h3 className="text-4xl font-black text-white mb-4 leading-tight uppercase tracking-wide ">NINNA 4 <br />Startup</h3>
              <p className="text-white/70 mb-8 font-medium max-w-sm">O programa de fomento definitivo para startups que buscam escala, mentorias e networking estratégico.</p>
              <Link 
                to="/startups/ninna-4-startups"
                className="bg-brand-teal text-white px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                Clique Aqui
              </Link>
            </div>
            <Award className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          </motion.div>
        </div>
      </section>

      {/* Filters & Grid Container */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/10 text-[#0ae2b1] text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-[#0ae2b1]/20">
              Startups do Nosso Ecossistema
          </div>
          <h2 className="text-4xl md:text-6xl font-barlowCondensed-Black font-black pb-4 text-gray-900 uppercase tracking-wide">
              <span className="gradient-text">NOSSO PORTFÓLIO DE STARTUPS</span>
          </h2>
          {/* Barra de Filtros Horizontal */}
          <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm p-6 mb-12 space-y-6">
            
            {/* Linha 1: Busca + Categorias */}
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              {/* Search */}
              <div className="relative group flex-1 md:max-w-xs">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-teal transition-colors" />
                <input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-gray-100 pl-11 h-12 rounded-xl focus:outline-none focus:border-brand-teal text-xs font-bold transition-all shadow-sm"
                />
              </div>

              {/* Categorias Dropdown */}
              <div className="relative w-full md:w-64 shrink-0">
                <button
                  onClick={() => setIsOpen(prev => !prev)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-brand-teal text-white shadow-lg shadow-brand-teal/20"
                >
                  <span className="flex items-center gap-2">
                    <Filter className="w-3 h-3" />
                    {selectedCategory === 'all' ? 'Todas Categorias' : selectedCategory}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="absolute z-20 flex flex-col gap-1 mt-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar rounded-xl border border-gray-100 bg-white p-1 shadow-lg w-full">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsOpen(false);
                        }}
                        className={`
                          text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                          ${selectedCategory === cat
                            ? 'bg-brand-teal text-white shadow-lg shadow-brand-teal/20 translate-x-1'
                            : 'text-gray-400 hover:text-gray-900 hover:bg-white hover:translate-x-1'}
                        `}
                      >
                        {cat === 'all' ? 'Todas' : cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear */}
              {(selectedCategory !== 'all' || selectedMaturity !== 'all' || selectedBusinessType !== 'all' || searchTerm !== '') && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedMaturity('all');
                    setSelectedBusinessType('all');
                    setSearchTerm('');
                  }}
                  className="shrink-0 px-5 py-3 border border-dashed border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 hover:border-red-200 transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-3 h-3" /> Limpar Filtros
                </button>
              )}
            </div>

            {/* Linha 2: Maturidade + Tipo de Negócio */}
            <div className="flex flex-col md:flex-row gap-6 pt-6 border-t border-gray-100">
              {/* Maturidade */}
              <div className="space-y-3 flex-1">
                <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Award className="w-3 h-3 text-brand-teal" /> Maturidade
                </h4>
                <div className="flex flex-wrap gap-2">
                  {maturityOptions.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setSelectedMaturity(opt)}
                      className={`
                        px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                        ${selectedMaturity === opt
                          ? 'bg-gray-900 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100'}
                      `}
                    >
                      {opt === 'all' ? 'Qualquer estágio' : opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Negócio */}
              <div className="space-y-3 flex-1">
                <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Briefcase className="w-3 h-3 text-brand-teal" /> Tipo de Negócio
                </h4>
                <div className="flex flex-wrap gap-2">
                  {businessTypeOptions.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setSelectedBusinessType(opt)}
                      className={`
                        px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                        ${selectedBusinessType === opt
                          ? 'bg-gray-900 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100'}
                      `}
                    >
                      {opt === 'all' ? 'Todos os modelos' : opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Grid Content */}
          <div className="w-full">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-gray-100 h-80 animate-pulse rounded-[40px]" />
                ))}
              </div>
            ) : filteredStartups.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-[40px] border border-gray-100 shadow-xl">
                <Rocket className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-gray-400 uppercase tracking-wide">Nenhuma startup encontrada</h3>
                <p className="text-gray-500 font-medium text-xs uppercase tracking-widest mt-2">Tente ajustar seus filtros de busca.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                {filteredStartups.map((startup, index) => (
                  <motion.div
                    key={startup.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    onClick={() => setSelectedStartup(startup)}
                    className="bg-white p-8 flex flex-col h-full group hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer relative rounded-[40px] border border-gray-100 shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 p-2 shadow-sm transition-transform group-hover:scale-105">
                        {startup.logo ? (
                          <img src={startup.logo} alt={startup.nome} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        ) : (
                          <Rocket className="w-10 h-10 text-brand-teal/50" />
                        )}
                      </div>
                      <div className="px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-[9px] font-black uppercase tracking-widest">
                        {startup.categoria}
                      </div>
                    </div>

                    <h3 className="text-2xl font-black mb-3 group-hover:text-brand-teal transition-colors text-gray-900 uppercase tracking-wide">{startup.nome}</h3>
                    <p className="text-gray-500 mb-6 flex-grow leading-relaxed line-clamp-3 font-medium text-sm">
                      {startup.descricaoCurta}
                    </p>

                    <div className="space-y-4 pt-6 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-400 font-bold uppercase tracking-wider">
                        <MapPin className="w-4 h-4 mr-2 text-brand-teal" />
                        {startup.cidade}, {startup.estado}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <div className="px-3 py-1 rounded-full bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border border-gray-100">
                            {startup.estagio}
                          </div>
                          {startup.tipoNegocio && (
                            <div className="px-3 py-1 rounded-full bg-gray-900/5 text-gray-600 text-[10px] font-black uppercase tracking-widest border border-gray-100">
                              {startup.tipoNegocio}
                            </div>
                          )}
                        </div>
                        <div className="text-brand-teal flex items-center text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                          Saiba Mais <Briefcase className="ml-2 w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Startup Details Modal */}
      <AnimatePresence>
        {selectedStartup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStartup(null)}
              className="absolute inset-0 bg-gray-900/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white border border-gray-200 rounded-[40px] overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedStartup(null)}
                className="absolute top-8 right-8 z-10 w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-5 h-full">
                {/* Modal Sidebar */}
                <div className="md:col-span-2 bg-gray-50 p-10 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-100 text-center">
                  <div className="w-32 h-32 rounded-3xl bg-white p-4 mb-6 shadow-xl border border-gray-100">
                    {selectedStartup.logo ? (
                      <img src={selectedStartup.logo} alt={selectedStartup.nome} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <Rocket className="w-full h-full text-brand-teal" />
                    )}
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-wide ">{selectedStartup.nome}</h2>
                  <div className="px-4 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-[10px] font-black uppercase tracking-widest mb-8 border border-brand-teal/20">
                    {selectedStartup.categoria}
                  </div>

                  <div className="w-full space-y-4 text-left">
                    <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                      <span className="text-gray-400 text-[10px] uppercase font-black tracking-widest block mb-1">Localização</span>
                      <p className="text-gray-900 flex items-center font-black uppercase tracking-wide">
                        <MapPin className="w-4 h-4 mr-2 text-brand-teal" />
                        {selectedStartup.cidade}, {selectedStartup.estado}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                      <span className="text-gray-400 text-[10px] uppercase font-black tracking-widest block mb-1">Estágio Atual</span>
                      <p className="text-gray-900 flex items-center font-black uppercase tracking-widest">{selectedStartup.estagio}</p>
                    </div>
                    {selectedStartup.tipoNegocio && (
                      <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                        <span className="text-gray-400 text-[10px] uppercase font-black tracking-widest block mb-1">Tipo de Negócio</span>
                        <p className="text-gray-900 flex items-center font-black uppercase tracking-widest">{selectedStartup.tipoNegocio}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-12 w-full">
                    {selectedStartup.site && (
                      <a 
                        href={selectedStartup.site} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full btn-primary py-4 flex items-center justify-center text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-teal/20"
                      >
                        Visitar Website <ExternalLink className="ml-2 w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Modal Content */}
                <div className="md:col-span-3 p-10 md:p-16">
                  <h4 className="text-brand-teal font-black uppercase text-[10px] tracking-[0.3em] mb-6">Sobre a Startup</h4>
                  <p className="text-gray-900 text-2xl font-black leading-relaxed mb-8  uppercase tracking-wide">
                    "{selectedStartup.descricaoCurta}"
                  </p>
                  
                  <div className="prose max-w-none">
                    <h5 className="text-gray-900 font-black uppercase text-xs tracking-widest mb-4">Solução e Impacto</h5>
                    <p className="text-gray-500 leading-loose text-lg mb-12 font-medium">
                      {selectedStartup.descricaoCompleta || selectedStartup.descricaoCurta}
                    </p>

                    {selectedStartup.tags && selectedStartup.tags.length > 0 && (
                      <div>
                        <h5 className="text-gray-900 font-black uppercase text-xs tracking-widest mb-4 ">Keywords</h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedStartup.tags.map((tag: string) => (
                            <span key={tag} className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-400 text-[10px] font-black uppercase tracking-widest transition-all hover:border-brand-teal hover:text-brand-teal">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;
