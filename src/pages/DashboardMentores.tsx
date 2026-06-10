import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { motion } from 'motion/react';
import { Linkedin, Search, MessageSquare, Info, Users } from 'lucide-react';

const DashboardMentores = () => {
  const [mentores, setMentores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMentores();
  }, []);

  const fetchMentores = async () => {
    try {
      const q = query(collection(db, 'mentores'), where('status', '==', 'ativo'), orderBy('ordem', 'asc'));
      const querySnapshot = await getDocs(q);
      setMentores(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error: any) {
      console.error('Firestore Error:', JSON.stringify({
        error: error.message,
        operationType: 'list',
        path: 'mentores',
        authInfo: {
          email: auth.currentUser?.email,
          uid: auth.currentUser?.uid
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const filtered = mentores.filter(m => 
    m.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.cargo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <section className="bg-brand-darker py-24 px-8 rounded-[40px] m-4 md:m-8 overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal opacity-10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-4xl">
          <h2 className="text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] mb-4">Capital Intelectual</h2>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic leading-none mb-6">
            NOSSOS <span className="gradient-text">MENTORES</span>
          </h1>
          <p className="text-gray-400 font-medium text-lg italic">
            Conecte-se com especialistas prontos para ajudar sua startup a superar desafios técnicos e de mercado.
          </p>
        </div>
      </section>

      <section className="px-4 md:px-8 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col md:flex-row gap-6 items-center">
            <div className="relative flex-grow group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-teal" />
              <input 
                placeholder="Buscar por nome, cargo ou empresa..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-[20px] pl-14 pr-6 py-5 focus:outline-none focus:border-brand-teal font-medium shadow-xl shadow-gray-200/50"
              />
            </div>
            <div className="bg-white px-8 py-5 rounded-[20px] border border-gray-100 flex items-center gap-3 text-brand-teal font-black uppercase text-[10px] tracking-widest shadow-xl shadow-gray-200/50">
              <Info className="w-5 h-5" /> {mentores.length} Mentores Ativos
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="aspect-[3/4] bg-white animate-pulse rounded-[40px] border border-gray-100" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filtered.map((mentor, i) => (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (i % 4) * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-xl group hover:shadow-2xl transition-all"
                >
                  <div className="aspect-[4/5] relative overflow-hidden bg-gray-50">
                    {mentor.foto ? (
                      <img 
                        src={mentor.foto} 
                        alt={mentor.nome} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="w-16 h-16 text-gray-200" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                      <div className="flex gap-4">
                        {mentor.linkedin && (
                          <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-brand-teal transition-all">
                            <Linkedin className="w-5 h-5 text-white" />
                          </a>
                        )}
                        <button className="flex-grow bg-white text-gray-900 font-black uppercase text-[10px] tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-teal hover:text-white transition-all">
                          <MessageSquare className="w-4 h-4" /> Solicitar Mentoria
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 text-center bg-white">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic mb-1 px-4">{mentor.nome}</h3>
                    <p className="text-brand-teal font-black text-[10px] uppercase tracking-widest mb-1 italic px-2">{mentor.cargo}</p>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest italic">{mentor.empresa}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardMentores;
