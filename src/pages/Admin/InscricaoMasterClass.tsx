import React, { useState, useEffect } from 'react';
import { 
  collection, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';
import { 
  Users, 
  GraduationCap,
  Phone, 
  Mail, 
  Building2,
  Briefcase,
  Calendar,
  FileText,
  ArrowUpRight,
  Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminInscricoesMasterClass() {
  const [inscricoes, setInscricoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInscricao, setSelectedInscricao] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInscricoes();
  }, []);

  const fetchInscricoes = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'master_class'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => {
        const docData = doc.data();
        let firestoreDate = docData.createdAt;
        let jsDate = new Date();
        if (firestoreDate && typeof firestoreDate.toDate === 'function') {
          jsDate = firestoreDate.toDate();
        } else if (firestoreDate) {
          jsDate = new Date(firestoreDate);
        }
        return {
          id: doc.id,
          ...docData,
          createdAt: jsDate
        };
      });
      setInscricoes(data);

      // Mantém o card selecionado sincronizado, se houver
      if (selectedInscricao) {
        const updatedSelected = data.find(item => item.id === selectedInscricao.id);
        if (updatedSelected) {
          setSelectedInscricao(updatedSelected);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar inscrições da master class:', error);
      toast.error('Erro ao carregar lista de inscrições.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInscricao = async (id: string) => {
    if (window.confirm('Tem certeza de que deseja excluir permanentemente esta inscrição?')) {
      try {
        await deleteDoc(doc(db, 'master_class', id));
        toast.success('Inscrição excluída definitivamente.');
        if (selectedInscricao?.id === id) {
          setSelectedInscricao(null);
        }
        setInscricoes(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        console.error(error);
        toast.error('Erro ao deletar inscrição.');
      }
    }
  };

  const formatDate = (date: any) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtra a lista de inscritos com base na barra de busca
  const filteredInscricoes = inscricoes.filter(item => {
    return (
      item.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cargo?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const exportToCSV = (data: any[]) => {
    const headers = ['Nome', 'Email', 'Telefone', 'Empresa', 'Cargo', 'Data de Inscrição'];

    const rows = data.map(item => [
      item.nome ?? '',
      item.email ?? '',
      item.telefone ?? '',
      item.empresa ?? '',
      item.cargo ?? '',
      formatDate(item.createdAt)
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inscricoes_master_class_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 font-sans">

      {/* Título */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-black flex items-center gap-4 uppercase tracking-wide italic text-gray-900">
            <GraduationCap className="text-brand-teal w-8 h-8" />
            Inscrições Master Class
          </h1>
          <p className="text-gray-500 font-medium mt-2">
            Acompanhe os profissionais inscritos na Master Class.
          </p>
        </div>
      </div>

      {/* Barra de filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-white p-4 border border-gray-100 rounded-3xl shadow-sm">

        {/* Busca */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail, empresa ou cargo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl pl-12 pr-6 py-3.5 focus:outline-none focus:border-brand-teal transition-all text-sm font-barlow text-gray-800 placeholder:text-gray-400"
          />
        </div>

        {/* Exportar CSV */}
        <button
          onClick={() => exportToCSV(filteredInscricoes)}
          className="inline-flex items-center justify-center gap-2 bg-[#fafafa] border border-gray-100 hover:border-brand-teal hover:bg-brand-teal/5 text-gray-700 hover:text-brand-teal rounded-2xl px-6 py-3.5 text-sm font-bold transition-all"
        >
          <ArrowUpRight className="w-4 h-4" />
          Exportar CSV
        </button>

      </div>

      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* COLUNA ESQUERDA: Tabela de inscritos */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-[#fafafa]">
                  <th className="py-4.5 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Dados do Inscrito</th>
                  <th className="py-4.5 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Empresa / Cargo</th>
                  <th className="py-4.5 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Data</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50 animate-pulse">
                      <td className="py-4 px-6" colSpan={3}>
                        <div className="h-10 bg-gray-50 rounded-2xl" />
                      </td>
                    </tr>
                  ))
                ) : filteredInscricoes.length === 0 ? (
                  <tr>
                    <td className="py-24 text-center cursor-default" colSpan={3}>
                      <div className="flex flex-col items-center text-gray-400">
                        <FileText className="w-12 h-12 mb-4 text-brand-teal opacity-25" />
                        <span className="font-extrabold uppercase tracking-widest text-xs">Nenhum inscrito encontrado</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredInscricoes.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedInscricao(item)}
                      className={`border-b border-gray-50 hover:bg-brand-teal/[0.01] transition-all cursor-pointer ${
                        selectedInscricao?.id === item.id ? 'bg-brand-teal/[0.03]' : ''
                      }`}
                    >
                      <td className="py-4.5 px-6">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-[13px] text-gray-900 uppercase tracking-wide truncate max-w-[180px]">{item.nome}</span>
                          <span className="text-xs text-gray-400 font-barlow tracking-wide">{item.email}</span>
                          <span className="text-[10px] text-gray-400 font-medium tracking-wide mt-0.5">{item.telefone}</span>
                        </div>
                      </td>
                      <td className="py-4.5 px-6">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-gray-800 tracking-wide line-clamp-1">{item.empresa}</span>
                          <span className="text-[10px] text-gray-400 font-barlow">{item.cargo}</span>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 text-[11px] font-barlow text-gray-400 whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-[#fafafa] border-t border-gray-50 flex items-center justify-between text-xs text-gray-400 font-barlow">
            <span>Listando {filteredInscricoes.length} de {inscricoes.length} inscrições registradas</span>
          </div>
        </div>

        {/* COLUNA DIREITA: Painel de detalhes do inscrito */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedInscricao ? (
              <motion.div
                key={selectedInscricao.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="bg-white border border-gray-100 p-8 rounded-[32px] shadow-xl text-left space-y-6"
              >

                {/* Cabeçalho do perfil */}
                <div className="flex items-start justify-between border-b border-gray-100 pb-5">
                  <div className="min-w-0">
                    <span className="text-[9px] font-black text-brand-teal uppercase tracking-widest block mb-1">Inscrito Selecionado</span>
                    <h3 className="font-extrabold uppercase text-lg text-gray-900 tracking-wide leading-snug break-words">{selectedInscricao.nome}</h3>
                    <p className="text-gray-400 text-xs font-barlow truncate mt-0.5">{selectedInscricao.email}</p>
                  </div>
                </div>

                {/* Informações de contato */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Informações de contato</span>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50 text-xs text-gray-500 font-barlow space-y-2">
                    <div className="flex items-center gap-2.5"><Phone className="w-4 h-4 text-brand-teal shrink-0" /> {selectedInscricao.telefone}</div>
                    <div className="flex items-center gap-2.5"><Mail className="w-4 h-4 text-brand-teal shrink-0" /> {selectedInscricao.email}</div>
                    <div className="flex items-center gap-2.5"><Calendar className="w-4 h-4 text-brand-teal shrink-0" /> Inscrito em {formatDate(selectedInscricao.createdAt)}</div>
                  </div>
                </div>

                {/* Informações profissionais */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Informações profissionais</span>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50 text-xs text-gray-500 font-barlow space-y-2">
                    <div className="flex items-center gap-2.5"><Building2 className="w-4 h-4 text-brand-teal shrink-0" /> {selectedInscricao.empresa}</div>
                    <div className="flex items-center gap-2.5"><Briefcase className="w-4 h-4 text-brand-teal shrink-0" /> {selectedInscricao.cargo}</div>
                  </div>
                </div>

                {/* Botão de deletar */}
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleDeleteInscricao(selectedInscricao.id)}
                    className="w-full border border-gray-100 hover:bg-red-50 hover:border-red-100 hover:text-red-500 text-gray-400 font-black uppercase text-[10px] tracking-widest py-3 rounded-2xl transition-all"
                  >
                    Deletar Ficha de Inscrição
                  </button>
                </div>

              </motion.div>
            ) : (
              <div className="border-2 border-dashed border-gray-100 p-8 py-32 rounded-[32px] text-center text-gray-400 flex flex-col items-center bg-white">
                <Users className="w-12 h-12 mb-4 text-brand-teal opacity-20" />
                <span className="font-extrabold uppercase tracking-widest text-[10px] leading-relaxed max-w-[200px] text-gray-300">
                  Selecione um inscrito na tabela ao lado para conferir os dados detalhados
                </span>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}