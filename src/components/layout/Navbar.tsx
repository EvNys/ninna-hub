import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  Rocket, 
  ShieldCheck,
  Calendar,
  Laptop,
  Sparkles,
  ArrowRight,
  MapPin,
  ChevronDown,
  Monitor,
  CalendarClock,
  Handshake
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { NAV_LINKS, EVENTOS_NINNA } from '../../data/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, isEditor } = useAuth();

  // Dropdown hover handling
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [isStartupsDropdownActive, setIsStartupsDropdownActive] = useState(false);
  const [timeoutId, setTimeoutId] = useState<any>(null);
  const [startupsTimeoutId, setStartupsTimeoutId] = useState<any>(null);

  const showDropdown = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
    setTimeoutId(null);
  }
  // Fecha o dropdown de Startups ao abrir Ecossistema
  if (startupsTimeoutId) clearTimeout(startupsTimeoutId);
  setIsStartupsDropdownActive(false);
  setIsDropdownActive(true);
};

const showStartupsDropdown = () => {
  if (startupsTimeoutId) {
    clearTimeout(startupsTimeoutId);
    setStartupsTimeoutId(null);
  }
  // Fecha o dropdown de Ecossistema ao abrir Startups
  if (timeoutId) clearTimeout(timeoutId);
  setIsDropdownActive(false);
  setIsStartupsDropdownActive(true);
};

  const hideDropdown = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => {
      setIsDropdownActive(false);
    }, 300);
    setTimeoutId(id);
  };

  const hideStartupsDropdown = () => {
    if (startupsTimeoutId) {
      clearTimeout(startupsTimeoutId);
    }
    const id = setTimeout(() => {
      setIsStartupsDropdownActive(false);
    }, 300);
    setStartupsTimeoutId(id);
  };

  // Clean timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (startupsTimeoutId) clearTimeout(startupsTimeoutId);
    };
  }, [timeoutId, startupsTimeoutId]);

  // Dados de navegação ficam em src/data/navigation.ts (editáveis sem mexer no código).
  const ninnaEvents = EVENTOS_NINNA;
  const navLinks = NAV_LINKS;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg border-b border-[#1a1a2e]" style={{ backgroundColor: '#1a1a2e' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/Imagens_NINNA/NINNA.png"
                alt="NinnaHub Logo"
                className="h-15 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:block h-full">
            <div className="ml-10 flex items-center space-x-8 h-full">
              
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onMouseEnter={
                    link.name === 'Ecossistema' 
                      ? showDropdown 
                      : link.name === 'Startups'
                      ? showStartupsDropdown
                      : undefined
                  }
                  onMouseLeave={
                    link.name === 'Ecossistema' 
                      ? hideDropdown 
                      : link.name === 'Startups'
                      ? hideStartupsDropdown
                      : undefined
                  }
                  className={`px-3 py-2 rounded-md text-[10px] font-black uppercase tracking-[0.2em] transition-colors relative flex items-center gap-1 ${
                    location.pathname === link.path
                      ? 'text-[#00c9a7]'
                      : 'text-[#f8f8f8] hover:text-[#00c9a7]'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.name === 'Ecossistema' && (
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isDropdownActive ? 'rotate-180 text-[#00c9a7]' : 'text-[#f8f8f8]'}`} />
                  )}
                  {link.name === 'Startups' && (
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isStartupsDropdownActive ? 'rotate-180 text-[#00c9a7]' : 'text-[#f8f8f8]'}`} />
                  )}
                </Link>
              ))}

              <div className="flex items-center gap-3">
                {/* <Link
                  to="/seja-um-mentor"
                  className="px-4 py-2 bg-[#00c9a7] text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:bg-[#00c9a7]/90 hover:shadow-md hover:shadow-brand-teal/20"
                >
                  Seja um mentor
                </Link> */}
              {user && (
                <Link
                  to={isAdmin || isEditor ? "/admin" : "/dashboard/comunidade"}
                  className="flex items-center space-x-1 px-4 py-2 bg-brand-teal/10 hover:bg-brand-teal/20 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-teal transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isAdmin || isEditor ? 'Admin' : 'Membro'}</span>
                </Link>
              )}
              {!user && (
                <Link
                  to="/admin/login"
                  className="px-4 py-2 border border-brand-teal/20 hover:bg-brand-teal/5 text-brand-teal rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-brand-teal hover:bg-gray-100 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden relative bg-[#0a0e1a] border-b border-white/10"
        >
          <div className="px-3 pt-2 pb-3 space-y-0.5">
            {navLinks.map((link) => (
              <div key={link.name} className="space-y-0.5">
                <Link
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-colors ${
                    location.pathname === link.path
                      ? 'text-brand-teal bg-brand-teal/10'
                      : 'text-gray-300 hover:text-brand-teal hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>

                {link.name === 'Startups' && (
                  <div className="pl-2 pr-1 py-0.5 space-y-1">
                    <Link
                      to="/startups/ninna-4-startups"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors group"
                    >
                      <span className="flex items-center justify-center w-7 h-7 rounded-md bg-brand-teal/15 text-brand-teal shrink-0">
                        <Rocket className="w-3.5 h-3.5" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[10px] font-black uppercase tracking-wide text-white leading-tight">
                          NINNA 4 Startups
                        </span>
                        <span className="block text-[10px] text-gray-400 normal-case font-normal truncate leading-tight">
                          Aceleração comercial e mentorias
                        </span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-brand-teal transition-colors shrink-0" />
                    </Link>

                    <Link
                      to="/startups/portfolio"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors group"
                    >
                      <span className="flex items-center justify-center w-7 h-7 rounded-md bg-brand-teal/15 text-brand-teal shrink-0">
                        <Monitor className="w-3.5 h-3.5" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[10px] font-black uppercase tracking-wide text-white leading-tight">
                          Portfólio NINNA
                        </span>
                        <span className="block text-[10px] text-gray-400 normal-case font-normal truncate leading-tight">
                          Soluções do ecossistema
                        </span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-brand-teal transition-colors shrink-0" />
                    </Link>

                    <Link
                      to="/empresas"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors group"
                    >
                      <span className="flex items-center justify-center w-7 h-7 rounded-md bg-brand-teal/15 text-brand-teal shrink-0">
                        <Sparkles className="w-3.5 h-3.5" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[10px] font-black uppercase tracking-wide text-white leading-tight">
                          Inscrição para Parceria
                        </span>
                        <span className="block text-[10px] text-gray-400 normal-case font-normal truncate leading-tight">
                          Conecte sua startup ao NINNA
                        </span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-brand-teal transition-colors shrink-0" />
                    </Link>
                  </div>
                )}

                {link.name === 'Ecossistema' && (
                  <div className="pl-2 pr-1 py-0.5 space-y-1">
                    <Link
                      to="/ecossistema?action=booking&space=Auditório"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors group"
                    >
                      <span className="flex items-center justify-center w-7 h-7 rounded-md bg-brand-teal/15 text-brand-teal shrink-0">
                        <CalendarClock className="w-3.5 h-3.5" />
                      </span>
                      <span className="flex-1 min-w-0 text-[10px] font-black uppercase tracking-wide text-white">
                        Agendar Evento (Auditório)
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-brand-teal transition-colors shrink-0" />
                    </Link>

                    <Link
                      to="/ecossistema?action=sponsor"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors group"
                    >
                      <span className="flex items-center justify-center w-7 h-7 rounded-md bg-brand-teal/15 text-brand-teal shrink-0">
                        <Handshake className="w-3.5 h-3.5" />
                      </span>
                      <span className="flex-1 min-w-0 text-[10px] font-black uppercase tracking-wide text-white">
                        Seja um Parceiro
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-brand-teal transition-colors shrink-0" />
                    </Link>
                  </div>
                )}
              </div>
            ))}

            {user && (
              <Link
                to={isAdmin || isEditor ? "/admin" : "/dashboard/comunidade"}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 mt-0.5 rounded-lg text-xs font-black uppercase tracking-widest text-brand-teal hover:bg-white/5"
              >
                {isAdmin || isEditor ? 'Painel Administrativo' : 'Portal do Membro'}
              </Link>
            )}
          </div>
        </motion.div>
      )}

    {/* Horizontal Mega Menu for Ecossistema */}
      <AnimatePresence>
        {isDropdownActive && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={showDropdown}
            onMouseLeave={hideDropdown}
            className="absolute top-20 left-0 w-full border-b border-[#0a0a0a]/30 shadow-2xl z-40 hidden md:block"
            style={{ backgroundColor: '#0a0a0a' }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
              <div className="grid grid-cols-12 gap-8">
                
                {/* Ações e Reservas */}
                <div className="col-span-5 border-r border-white/10 pr-8">
                  <span className="text-[9px] font-black text-[#00c9a7] uppercase tracking-[0.3em] block mb-4">Ações e Reservas</span>
                  <div className="flex flex-col gap-3">
                    <a 
                    href="https://wa.me/558532114201?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20o%20Audit%C3%B3rio%20Premium%20do%20NINNA"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsDropdownActive(false)}
                    className="group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20 rounded-2xl transition-all"
                  >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#00c9a7]/20 flex items-center justify-center text-[#00c9a7] group-hover:scale-110 transition-transform">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <h5 className="font-barlowCondensed-Black uppercase text-[12px] tracking-widest text-[#f8f8f8] group-hover:text-[#00c9a7] transition-colors">Agende seu Evento</h5>
                          <p className="text-white/40 text-xs font-inter">Reserve o Auditório Premium do NINNA</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#00c9a7] group-hover:translate-x-1 transition-all" />
                    </a>

                    <Link
                      to="/ecossistema?action=sponsor"
                      onClick={() => setIsDropdownActive(false)}
                      className="group flex items-center justify-between p-4 bg-white/10 hover:bg-[#00c9a7] border border-transparent rounded-2xl transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                          <Sparkles className="w-5 h-5 text-amber-300" />
                        </div>
                        <div className="text-left">
                          <h5 className="font-barlowCondensed-Black uppercase text-[12px] tracking-widest text-white">Seja um Parceiro</h5>
                          <p className="text-white/60 text-xs font-inter">Impulsione a sua marca no ecossistema</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </Link>
                  </div>
                </div>

                {/* Eventos do NINNA */}
                <div className="col-span-7 pl-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[9px] font-black text-[#00c9a7] uppercase tracking-[0.3em] block">Eventos do NINNA</span>
                      <Link 
                        to="/agenda" 
                        onClick={() => setIsDropdownActive(false)}
                        className="text-[9px] font-black text-white/40 hover:text-[#00c9a7] uppercase tracking-widest transition-all"
                      >
                        Ver Agenda Completa →
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {ninnaEvents.map((ev) => (
                        <div key={ev.nome} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow group">
                          <div className="space-y-1">
                            <h6 className="font-barlowCondensed-Black uppercase text-[12px] tracking-widest leading-normal text-[#f8f8f8] group-hover:text-[#00c9a7] transition-colors">
                              {ev.nome}
                            </h6>
                          </div>
                          <div className="flex items-center gap-1.5 text-white/40 text-[9px] font-bold uppercase tracking-widest mt-4">
                            <MapPin className="w-3.5 h-3.5 text-[#00c9a7] shrink-0" />
                            <span className="truncate">{ev.local}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-white/10">
                    <Link
                      to="/oportunidades"
                      onClick={() => setIsDropdownActive(false)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00c9a7]/20 hover:bg-[#00c9a7] text-[#00c9a7] hover:text-white rounded-xl text-[9px] font-black uppercase tracking-[0.15em] transition-all cursor-pointer shadow-sm"
                    >
                      <span>Abertura de Oportunidades</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest italic text-right">
                      Nossa equipe está pronta para integrar sua marca e comunidade.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Horizontal Mega Menu for Startups */}
      <AnimatePresence>
        {isStartupsDropdownActive && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={showStartupsDropdown}
            onMouseLeave={hideStartupsDropdown}
            className="absolute top-20 left-0 w-full border-b border-[#0a0a0a]/30 shadow-2xl z-40 hidden md:block"
            style={{ backgroundColor: '#0a0a0a' }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
              <div className="grid grid-cols-12 gap-8">
                
                {/* Programas */}
                <div className="col-span-6 border-r border-white/10 pr-8">
                  <span className="text-[9px] font-black text-[#00c9a7] uppercase tracking-[0.3em] block mb-4">Programas e Performance</span>
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/startups/ninna-4-startups"
                      onClick={() => setIsStartupsDropdownActive(false)}
                      className="group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20 rounded-2xl transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#00c9a7]/20 flex items-center justify-center text-[#00c9a7] group-hover:scale-110 transition-transform">
                          <Rocket className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <h5 className="font-barlowCondensed-Black uppercase text-[12px] tracking-widest text-[#f8f8f8] group-hover:text-[#00c9a7] transition-colors">NINNA 4 Startups</h5>
                          <p className="text-white/40 text-xs font-inter">Aceleração comercial, fomento e mentorias sob medida</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#00c9a7] group-hover:translate-x-1 transition-all" />
                    </Link>

                    <Link
                      to="/startups/portfolio"
                      onClick={() => setIsStartupsDropdownActive(false)}
                      className="group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20 rounded-2xl transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#00c9a7]/20 flex items-center justify-center text-[#00c9a7] group-hover:scale-110 transition-transform">
                          <Laptop className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <h5 className="font-barlowCondensed-Black uppercase text-[12px] tracking-widest text-[#f8f8f8] group-hover:text-[#00c9a7] transition-colors">Portfólio de Startups</h5>
                          <p className="text-white/40 text-xs font-inter">Conheça as soluções inovadoras do nosso ecossistema</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#00c9a7] group-hover:translate-x-1 transition-all" />
                    </Link>
                  </div>
                </div>

                {/* Parceria */}
                <div className="col-span-6 pl-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-black text-[#00c9a7] uppercase tracking-[0.3em] block mb-4">Inscrição e Parcerias</span>
                    <Link
                      to="/empresas"
                      onClick={() => setIsStartupsDropdownActive(false)}
                      className="group flex items-center justify-between p-6 bg-white/10 hover:bg-[#00c9a7] border border-transparent rounded-[24px] transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                          <Sparkles className="w-6 h-6 text-amber-300" />
                        </div>
                        <div className="text-left">
                          <h5 className="font-barlowCondensed-Black uppercase text-[11px] tracking-widest text-white">Faça parte do NINNA 4 Startups</h5>
                          <p className="text-white/70 text-xs font-inter mt-1">Inscreva sua startup no portal para parceria estratégica com o NINNA</p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </Link>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-white/10">
                    <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest italic">
                      Conecte sua startup a dezenas de grandes corporações patrocinadoras do NINNA Hub.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
