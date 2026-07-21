import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Calendar, MapPin, Clock, Ticket, Users, Sparkles, SlidersHorizontal, Search } from 'lucide-react';

const AgendaEventos = () => {
  const [eventos, setEventos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'todos' | 'destaque' | 'regular'>('todos');

  useEffect(() => {
    const fetchEventos = async () => {
      setLoading(true);
      setErro(null);

      try {
        const q = query(
          collection(db, 'eventos'),
          where('status', '==', 'ativo'),
          orderBy('data', 'asc')
        );
        const querySnapshot = await getDocs(q);
        const dbEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

        // Filtra apenas eventos com data válida
        const eventsWithDates = dbEvents.filter((ev: any) => ev.data);

        // Ordena por data ascendente
        eventsWithDates.sort((a: any, b: any) => new Date(a.data).getTime() - new Date(b.data).getTime());

        setEventos(eventsWithDates);
      } catch (error) {
        console.error("Erro ao carregar agenda de eventos:", error);
        setEventos([]);
        setErro('Não foi possível carregar a agenda de eventos no momento. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);
  // Filter & Search Logic
  const filteredEvents = eventos.filter(ev => {
    const matchesSearch = ev.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ev.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ev.local?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'destaque') {
      return matchesSearch && ev.destaque;
    }
    if (filterType === 'regular') {
      return matchesSearch && !ev.destaque;
    }
    return matchesSearch;
  });

  return (
    <div className="pb-32 bg-[#fafafa] min-h-screen">
      {/* Page Header */}   
      <meta name="description" content="Acompanhe a agenda de eventos do NINNA Hub, incluindo workshops, painéis e encontros estratégicos do ecossistema de inovação." />

      <section className="relative overflow-hidden py-24 border-b border-gray-100 bg-white">
        <div className="absolute top-1/2 left-0 w-32 h-[400px] bg-brand-teal/5 -translate-y-1/2 -skew-x-12 z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/5 blur-[120px] rounded-full -mr-40 -mt-40 z-10 pointer-events-none" />

        {/* Low opacity background image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-white/85 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2000" 
            alt="Event Stage" 
            className="w-full h-full object-cover grayscale scale-110 opacity-70"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white to-transparent z-20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-[10px] font-black uppercase tracking-[0.3em] mb-6">
              Programação NINNA Hub
            </div>
            <h1 className="text-4xl md:text-7xl font-black mb-6 uppercase tracking-wide leading-none text-gray-900 ">
              AGENDA DE <br /><span className="gradient-text">EVENTOS</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed border-t border-gray-100 pt-6 mt-6 font-medium">
              Acompanhe discussões disruptivas, workshops interativos, painéis de CVC e encontros estratégicos do ecossistema de inovação.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-md flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por evento, local ou tema..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 hover:bg-gray-50/50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/20 transition-all font-sans"
            />
          </div>

          {/* Filter categories */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setFilterType('todos')}
              className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                filterType === 'todos'
                  ? 'bg-brand-teal text-white shadow-md shadow-brand-teal/20'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Todos os Eventos
            </button>
            <button
              onClick={() => setFilterType('destaque')}
              className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                filterType === 'destaque'
                  ? 'bg-brand-teal text-white shadow-md shadow-brand-teal/20'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Eventos Especiais
            </button>
            <button
              onClick={() => setFilterType('regular')}
              className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                filterType === 'regular'
                  ? 'bg-brand-teal text-white shadow-md shadow-brand-teal/20'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Workshops e Painéis
            </button>
          </div>
        </div>
      </section>

      {/* Events Listing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
  {loading ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="bg-white h-[420px] animate-pulse rounded-[40px] border border-gray-100 shadow-md" />
      ))}
    </div>
  ) : filteredEvents.length === 0 ? (
    <div className="text-center py-24 bg-white rounded-[40px] border border-gray-100 shadow-sm">
      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-6" />
      <h3 className="text-2xl font-black text-gray-400 uppercase tracking-wide ">Nenhum evento encontrado</h3>
      <p className="text-gray-500 mt-2 font-medium">Experimente mudar o filtro de busca ou conferir mais tarde.</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredEvents.map((evento, index) => (
        <motion.div
          key={evento.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-[40px] overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-gray-100 shadow-xl flex flex-col"
        >
          {/* Event Banner Image */}
          <div className="relative h-64 overflow-hidden bg-gray-50">
            {evento.imagem ? (
              <img 
                src={evento.imagem} 
                alt={evento.nome} 
                className="w-full h-full object-bottom group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-12 bg-gray-50">
                <Calendar className="w-16 h-16 text-gray-200" />
              </div>
            )}
            {evento.destaque && (
              <div className="absolute top-4 left-4">
                <span className="bg-brand-teal text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                  Destaque
                </span>
              </div>
            )}
          </div>

          {/* Event Content */}
          <div className="p-8 flex flex-col flex-1">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="flex items-center text-brand-teal font-black text-[9px] uppercase tracking-widest bg-brand-teal/5 px-3 py-1.5 rounded-xl border border-brand-teal/10">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                {new Date(evento.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              {evento.horario && (
                <span className="flex items-center text-gray-500 font-bold text-[9px] uppercase tracking-widest border border-gray-100 px-3 py-1.5 rounded-xl">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-brand-teal" />
                  {evento.horario}
                </span>
              )}
            </div>

            <span className="flex items-center text-gray-500 font-bold text-[9px] uppercase tracking-widest mb-3">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-brand-teal" />
              {evento.local || 'NINNA Hub'}
            </span>

            <h3 className="text-xl font-black mb-3 group-hover:text-brand-teal transition-colors text-gray-950 uppercase tracking-wide leading-tight">
              {evento.nome}
            </h3>
            <p className="text-gray-500 mb-6 leading-relaxed text-sm font-medium line-clamp-3 flex-1">
              {evento.descricao}
            </p>

            <a 
              href={evento.linkInscricao || 'https://wa.me/5585989844779'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full px-6 py-3.5 bg-gray-900 text-white font-black text-[10px] tracking-widest uppercase rounded-2xl flex items-center justify-center transition-all shadow-lg hover:bg-brand-teal"
            >
              <Ticket className="mr-2 w-4 h-4" /> Garantir Ingresso
            </a>
          </div>
        </motion.div>
      ))}
    </div>
  )}
</section>

      {/* Proactive Realization CTA Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="relative rounded-[40px] overflow-hidden bg-gray-900 py-16 px-8 md:p-20 shadow-2xl text-center">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-teal/10 blur-[100px] rounded-full" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="text-brand-teal text-[9px] font-black uppercase tracking-[0.4em] block">Sua marca no Hub</span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-wide ">QUER CO-REALIZAR OU PATROCINAR UM EVENTO?</h2>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
              Conecte sua corporação ao ecossistema do NINNA de forma dinâmica. Fale conosco para agendar o Auditório Premium ou promover painéis temáticos.
            </p>
            <div className="pt-6 flex flex-wrap justify-center gap-4">
              <a 
                href="https://wa.me/558532114201?text=Ol%C3%A1%2C+gostaria+de+realizar+um+evento+no+NINNA."
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-brand-teal text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-brand-teal/90 transition-all cursor-pointer shadow-lg shadow-brand-teal/10 hover:scale-[1.02]"
              >
                Reservar um Espaço
              </a>
              <Link
                to="/ecossistema?action=sponsor"
                className="px-8 py-4 bg-white/10 text-white border border-white/10 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white/20 transition-all cursor-pointer hover:scale-[1.02]"
              >
                Seja Patrocinador
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AgendaEventos;
