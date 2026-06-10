import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { PlayCircle, Clock, BookOpen, ChevronRight, GraduationCap, ArrowLeft, Layout, Film, Music, Info } from 'lucide-react';

const Treinamentos = () => {
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTraining, setSelectedTraining] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [loadingLessons, setLoadingLessons] = useState(false);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const q = query(collection(db, 'treinamentos'), where('status', '==', 'ativo'), orderBy('ordem', 'asc'));
      const querySnapshot = await getDocs(q);
      setTrainings(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error: any) {
      console.error('Firestore Error:', JSON.stringify({
        error: error.message,
        operationType: 'list',
        path: 'treinamentos',
        authInfo: {
          email: auth.currentUser?.email,
          uid: auth.currentUser?.uid
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async (tId: string) => {
    setLoadingLessons(true);
    try {
      const q = query(collection(db, 'treinamentos', tId, 'aulas'), orderBy('ordem', 'asc'));
      const querySnapshot = await getDocs(q);
      const lessonsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLessons(lessonsData);
      if (lessonsData.length > 0) {
        setSelectedLesson(lessonsData[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingLessons(false);
    }
  };

  const handleSelectTraining = (training: any) => {
    setSelectedTraining(training);
    fetchLessons(training.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Youtube
    const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/);
    if (ytMatch && ytMatch[1]) {
      const id = ytMatch[1].split('&')[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    // Vimeo
    const vimeoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(.+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    return url;
  };

  if (selectedTraining) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        {/* Header / Nav */}
        <div className="bg-gray-900/50 backdrop-blur-md sticky top-0 z-30 border-b border-white/5 px-8 pt-20 pb-4 flex items-center justify-between">
          <button 
            onClick={() => { setSelectedTraining(null); setLessons([]); setSelectedLesson(null); }}
            className="flex items-center gap-2 text-gray-400 hover:text-brand-teal font-black uppercase text-[10px] tracking-widest transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para o Catálogo
          </button>
          <div className="text-right">
            <h2 className="text-xs font-black uppercase tracking-widest text-brand-teal">{selectedTraining.categoria}</h2>
            <h1 className="text-sm font-black uppercase tracking-tighter italic text-white">{selectedTraining.titulo}</h1>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
          {/* Viewer Side */}
          <div className="flex-grow bg-black flex flex-col">
            <div className="aspect-video w-full bg-gray-900 border-b border-white/5 relative">
              {selectedLesson?.mediaUrl ? (
                <iframe 
                  src={getEmbedUrl(selectedLesson.mediaUrl)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedLesson.titulo}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                  <PlayCircle className="w-20 h-20 mb-4 opacity-20" />
                  <p className="font-black uppercase text-[10px] tracking-[0.3em]">Selecione uma aula para assistir</p>
                </div>
              )}
            </div>
            <div className="p-12 max-w-4xl">
              <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-4">
                {selectedLesson?.titulo || 'Instruções do Treinamento'}
              </h2>
              <p className="text-gray-400 font-medium text-lg leading-relaxed italic">
                {selectedLesson?.descricao || selectedTraining.descricao}
              </p>
            </div>
          </div>

          {/* Sidebar Playlist */}
          <aside className="w-full lg:w-96 bg-gray-900/50 border-l border-white/5 flex flex-col pt-8">
            <div className="px-8 mb-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2">
                <Layout className="w-4 h-4" /> Conteúdo do Curso
              </h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-teal">{lessons.length} aulas disponíveis</p>
            </div>

            <div className="flex-grow overflow-y-auto px-4 pb-12 space-y-2 custom-scrollbar">
              {loadingLessons ? (
                [1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />)
              ) : lessons.map((lsn, idx) => (
                <button
                  key={lsn.id}
                  onClick={() => { setSelectedLesson(lsn); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`w-full text-left p-4 rounded-3xl transition-all flex items-start gap-4 group ${selectedLesson?.id === lsn.id ? 'bg-brand-teal text-white shadow-xl shadow-brand-teal/20' : 'hover:bg-white/5'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${selectedLesson?.id === lsn.id ? 'bg-white/20' : 'bg-gray-800 text-gray-500 group-hover:bg-gray-700'}`}>
                    <span className="font-black text-xs italic">{idx + 1}</span>
                  </div>
                  <div className="flex-grow py-1">
                    <h4 className="text-[10px] font-black uppercase tracking-tighter italic leading-tight mb-1 line-clamp-2">
                      {lsn.titulo}
                    </h4>
                    <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest opacity-60">
                      {lsn.mediaUrl?.includes('audio') ? <Music className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                      <span>{lsn.mediaUrl?.includes('audio') ? 'Áudio' : 'Vídeo'}</span>
                    </div>
                  </div>
                </button>
              ))}
              {lessons.length === 0 && !loadingLessons && (
                <div className="p-8 text-center bg-white/5 rounded-[40px] border border-dashed border-white/10 mx-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Nenhuma aula cadastrada ainda.</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <section className="bg-brand-dark py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2 className="text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] mb-4 italic">Conhecimento que escala</h2>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none mb-8">
              HUB DE <span className="gradient-text">TREINAMENTOS</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto font-medium text-lg italic">
              Acelere sua jornada empreendedora com conteúdos exclusivos curados pelo time NINNA.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white h-96 animate-pulse rounded-[40px]" />
              ))}
            </div>
          ) : trainings.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[40px] border border-gray-100 shadow-xl">
              <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-gray-400 uppercase tracking-tight italic">Nenhum treinamento disponível</h3>
              <p className="text-gray-500 font-medium italic uppercase tracking-widest mt-2">Em breve teremos novos conteúdos!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {trainings.map((tm, index) => (
                <motion.div
                  key={tm.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white group cursor-pointer rounded-[40px] border border-gray-100 shadow-xl hover:shadow-2xl transition-all overflow-hidden flex flex-col"
                >
                  <div 
                    onClick={() => handleSelectTraining(tm)}
                    className="relative aspect-video overflow-hidden"
                  >
                    {tm.capa ? (
                      <img src={tm.capa} alt={tm.titulo} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <PlayCircle className="w-16 h-16 text-brand-teal opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-white text-gray-900 rounded-2xl flex items-center justify-center shadow-2xl scale-0 group-hover:scale-100 transition-transform">
                        <PlayCircle className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <div className="p-10 flex-grow flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-[8px] font-black uppercase tracking-widest border border-brand-teal/20">
                        {tm.categoria || 'Curso'}
                      </div>
                      <div className="flex items-center gap-1 text-[8px] text-gray-400 font-black uppercase tracking-widest italic">
                        <Info className="w-3 h-3" /> Nível {index % 3 === 0 ? 'Expert' : 'Base'}
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic leading-none mb-4 group-hover:text-brand-teal transition-colors line-clamp-2">
                      {tm.titulo}
                    </h3>
                    
                    <p className="text-gray-500 text-sm font-medium mb-8 flex-grow line-clamp-3 italic">
                      {tm.descricao}
                    </p>

                    <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">
                        <BookOpen className="w-4 h-4 text-brand-teal" /> Aulas Exclusivas
                      </div>
                      <button 
                        onClick={() => handleSelectTraining(tm)}
                        className="text-brand-teal flex items-center gap-2 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform"
                      >
                        Começar Agora <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
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

export default Treinamentos;
