import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Users, Search, Mail, Phone, Building2, UserCircle } from 'lucide-react';

const Comunidade = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      // Only show members who opted to be public
      const q = query(
        collection(db, 'users'), 
        where('publico', '==', true),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(q);
      setMembers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error: any) {
      console.error('Firestore Error:', JSON.stringify({
        error: error.message,
        operationType: 'list',
        path: 'users',
        authInfo: {
          email: auth.currentUser?.email,
          uid: auth.currentUser?.uid
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(m => 
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.nomeEmpresa?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <section className="bg-brand-darker py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-teal rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] mb-4">Network & Conexão</h2>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-wide italic leading-none mb-8">
              NOSSA <span className="gradient-text">COMUNIDADE</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto font-medium text-lg">
              Conecte-se com fundadores, diretores e entusiastas que fazem o ecossistema NINNA acontecer.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 sticky top-0 z-40 bg-[#fafafa]/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="relative w-full max-w-xl group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-teal transition-colors" />
              <input 
                placeholder="Buscar por nome ou empresa..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-100 pl-14 pr-6 h-16 rounded-[20px] focus:outline-none focus:border-brand-teal text-gray-900 transition-all font-medium shadow-xl shadow-gray-200/50"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="bg-white h-72 animate-pulse rounded-[40px] border border-gray-100" />
              ))}
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[40px] border border-gray-100 shadow-xl">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-gray-400 uppercase tracking-tight italic">Nenhum membro encontrado</h3>
              <p className="text-gray-500 font-medium">Experimente outro termo de busca.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (index % 4) * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl hover:shadow-2xl transition-all group text-center"
                >
                  <div className="relative inline-block mb-6">
                    <div className="w-24 h-24 rounded-[30px] bg-brand-teal/10 flex items-center justify-center overflow-hidden border-2 border-white shadow-lg group-hover:scale-105 transition-transform">
                      {member.foto ? (
                        <img src={member.foto} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <UserCircle className="w-12 h-12 text-brand-teal" />
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic mb-1 px-2 line-clamp-1">{member.name}</h3>
                  <div className="flex items-center justify-center gap-2 text-brand-teal font-black text-[10px] uppercase tracking-widest mb-6 italic">
                    <Building2 className="w-3 h-3" />
                    {member.nomeEmpresa || 'Hub Ninja'}
                  </div>

                  <div className="space-y-3 pt-6 border-t border-gray-50">
                    {member.email && (
                      <div className="flex items-center justify-center gap-2 text-gray-400 text-xs font-medium">
                        <Mail className="w-3 h-3 text-brand-teal" />
                        {member.email}
                      </div>
                    )}
                    {member.telefone && (
                      <div className="flex items-center justify-center gap-2 text-gray-400 text-xs font-medium">
                        <Phone className="w-3 h-3 text-brand-teal" />
                        {member.telefone}
                      </div>
                    )}
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

export default Comunidade;
