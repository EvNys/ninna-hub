import React, { useState, useEffect } from 'react';
import { 
  collection, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';
import { 
  Users, 
  UserPlus,
  MapPinned,
  MapPinHouse, 
  Phone, 
  Mail, 
  MapPin, 
  Target, 
  HelpCircle, 
  FileText, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Layers,
  Building2,
  Briefcase,
  ArrowUpRight,
  Search,
  Filter,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminInscricoesMentores() {
  const [inscricoes, setInscricoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInscricao, setSelectedInscricao] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  useEffect(() => {
    fetchInscricoes();
  }, []);

  const fetchInscricoes = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'inscricoes_mentores'), orderBy('createdAt', 'desc'));
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
      
      // Keep selected sync if selected
      if (selectedInscricao) {
        const updatedSelected = data.find(item => item.id === selectedInscricao.id);
        if (updatedSelected) {
          setSelectedInscricao(updatedSelected);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar inscrições:', error);
      toast.error('Erro ao carregar lista de inscrições.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'pendente' | 'apto á começar o programa' | 'inapto') => {
    try {
      await updateDoc(doc(db, 'inscricoes_mentores', id), {
        status: newStatus
      });
      toast.success('Status do candidato atualizado com sucesso!');
      
      // Update local state smoothly
      setInscricoes(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      if (selectedInscricao && selectedInscricao.id === id) {
        setSelectedInscricao((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar status do candidato.');
    }
  };

  const handleDeleteInscricao = async (id: string) => {
    if (window.confirm('Tem certeza de que deseja excluir permanentemente esta inscrição?')) {
      try {
        await deleteDoc(doc(db, 'inscricoes_mentores', id));
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

  // Promotes applicant directly to the official active mentor list ("mentores" collection)
  const handlePromoteToRoster = async (item: any) => {
    if (window.confirm(`Deseja aprovar e cadastrar ${item.nome} diretamente no Roster Oficial de Mentores?`)) {
      try {
        // Step 1: Add to 'mentores' collection
        await addDoc(collection(db, 'mentores'), {
          nome: item.nome,
          cargo: item.areaMentoria,
          empresa: 'Mentor NINNA Hub',
          foto: '',
          linkedin: '',
          ordem: 0,
          status: 'ativo',
          createdAt: serverTimestamp()
        });

        // Step 2: Mark inscription as "apto á começar o programa"
        await updateDoc(doc(db, 'inscricoes_mentores', item.id), {
          status: 'apto á começar o programa'
        });

        toast.success(`${item.nome} promovido com sucesso ao Roster Oficial de Mentores de Inovação!`);
        fetchInscricoes();
      } catch (error) {
        console.error(error);
        toast.error('Erro ao promover e cadastrar candidato.');
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'apto á começar o programa':
        return (
          <span className="px-3 py-1.5 bg-green-50 text-green-700 ring-1 ring-green-600/20 rounded-full text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
            <CheckCircle className="w-3 h-3 text-green-600" />
            Apto a Começar o Programa
          </span>
        );
      case 'inapto':
        return (
          <span className="px-3 py-1.5 bg-red-50 text-red-600 ring-1 ring-red-500/20 rounded-full text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
            <XCircle className="w-3 h-3 text-red-500" />
            Inapto
          </span>
        );
      default:
        return (
          <span className="px-3 py-1.5 bg-amber-50 text-amber-700 ring-1 ring-amber-500/20 rounded-full text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-amber-500 animate-pulse" />
            Pendente
          </span>
        );
    }
  };

  // Filter application list based on search bar and status select
  const filteredInscricoes = inscricoes.filter(item => {
    const matchesSearch = 
      item.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.areaMentoria?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'todos' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const exportToCSV = (data: any[]) => {
  const headers = [
    'Nome', 'Email', 'Telefone', 'Cidade', 'Área de Mentoria',
    'Status', 'Data de Inscrição'
  ];

  const rows = data.map(item => [
    item.nome ?? '',
    item.email ?? '',
    item.telefone ?? '',
    item.cidade ?? '',
    item.areaMentoria ?? '',
    item.status ?? 'pendente',
    formatDate(item.createdAt)
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `inscricoes_mentores_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 font-sans">
      
      {/* Title Segment */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-black flex items-center gap-4 uppercase tracking-wide italic text-gray-900">
            <UserPlus className="text-brand-teal w-8 h-8" />
            Inscrições de Mentores
          </h1>
          <p className="text-gray-500 font-medium mt-2">
            Acompanhe o funil de recebimento e aprove os profissionais para o programa de mentores.
          </p>
        </div>
      </div>

      {/* Filters bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-white p-4 border border-gray-100 rounded-3xl shadow-sm">
        
      {/* Search */}
      <div className="relative md:col-span-2">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Buscar por nome, e-mail, área predominante ou cidade..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl pl-12 pr-6 py-3.5 focus:outline-none focus:border-brand-teal transition-all text-sm font-semibold text-gray-800 placeholder:text-gray-400"
        />
      </div>

      {/* Status Dropdown Filter */}
      <div className="relative">
        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full bg-[#fafafa] border border-gray-100 rounded-2xl pl-12 pr-6 py-3.5 focus:outline-none focus:border-brand-teal transition-all text-sm font-bold text-gray-700 appearance-none"
        >
          <option value="todos">Filtrar por Status (Todos)</option>
          <option value="pendente">Pendente</option>
          <option value="apto á começar o programa">Apto a Começar</option>
          <option value="inapto">Inapto</option>
        </select>
      </div>

      {/* Export CSV Button */}
      <button
        onClick={() => exportToCSV(filteredInscricoes)}
        className="inline-flex items-center justify-center gap-2 bg-[#fafafa] border border-gray-100 hover:border-brand-teal hover:bg-brand-teal/5 text-gray-700 hover:text-brand-teal rounded-2xl px-6 py-3.5 text-sm font-bold transition-all"
      >
        <ArrowUpRight className="w-4 h-4" />
        Exportar CSV
      </button>

    </div>

      {/* Main Panel Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: Candidates Data Table list */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-[#fafafa]">
                  <th className="py-4.5 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Dados do Candidato</th>
                  <th className="py-4.5 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Área Pretendida</th>
                  <th className="py-4.5 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Data</th>
                  <th className="py-4.5 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50 animate-pulse">
                      <td className="py-4 px-6" colSpan={4}>
                        <div className="h-10 bg-gray-50 rounded-2xl" />
                      </td>
                    </tr>
                  ))
                ) : filteredInscricoes.length === 0 ? (
                  <tr>
                    <td className="py-24 text-center cursor-default" colSpan={4}>
                      <div className="flex flex-col items-center text-gray-400">
                        <FileText className="w-12 h-12 mb-4 text-brand-teal opacity-25" />
                        <span className="font-extrabold uppercase tracking-widest text-xs">Nenhum candidato encontrado</span>
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
                          <span className="text-xs text-gray-400 font-semibold tracking-wide">{item.email}</span>
                          <span className="text-[10px] text-gray-400 font-medium tracking-wide mt-0.5">{item.telefone}</span>
                        </div>
                      </td>
                      <td className="py-4.5 px-6">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-gray-800 tracking-wide line-clamp-1">{item.areaMentoria}</span>
                          <span className="text-[10px] text-gray-400 font-semibold">{item.cidade}</span>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 text-[11px] font-semibold text-gray-400 whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="py-4.5 px-6">
                        {getStatusBadge(item.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-[#fafafa] border-t border-gray-50 flex items-center justify-between text-xs text-gray-400 font-semibold">
            <span>Listando {filteredInscricoes.length} de {inscricoes.length} inscrições registradas</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Selective Candidate Profile Card Panel */}
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
                
                {/* Profile Header */}
                <div className="flex items-start justify-between border-b border-gray-100 pb-5">
                  <div className="min-w-0">
                    <span className="text-[9px] font-black text-brand-teal uppercase tracking-widest block mb-1">Candidato Escolhido</span>
                    <h3 className="font-extrabold uppercase text-lg text-gray-900 tracking-wide leading-snug break-words">{selectedInscricao.nome}</h3>
                    <p className="text-gray-400 text-xs font-semibold truncate mt-0.5">{selectedInscricao.email}</p>
                  </div>
                </div>

                {/* Candidate detailed questions inputs */}
                <div className="space-y-4">
                  
                  {/* Status update selector block */}
                  <div className="p-4.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Avaliar Candidato</span>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => handleUpdateStatus(selectedInscricao.id, 'pendente')}
                        className={`w-full py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest border transition-all text-center flex items-center justify-center gap-1.5 ${
                          selectedInscricao.status === 'pendente'
                            ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/10'
                            : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-100/50'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        Pendente
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(selectedInscricao.id, 'apto á começar o programa')}
                        className={`w-full py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest border transition-all text-center flex items-center justify-center gap-1.5 ${
                          selectedInscricao.status === 'apto á começar o programa'
                            ? 'bg-green-600 border-green-600 text-white shadow-md shadow-green-600/10'
                            : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-100/50'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        Apto a Começar o Programa
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(selectedInscricao.id, 'inapto')}
                        className={`w-full py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest border transition-all text-center flex items-center justify-center gap-1.5 ${
                          selectedInscricao.status === 'inapto'
                            ? 'bg-red-500 border-red-500 text-white shadow-md shadow-red-500/10'
                            : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-100/50'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Inapto
                      </button>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Informações de contato</span>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50 text-xs text-gray-500 font-semibold space-y-2">
                      <div className="flex items-center gap-2.5"><Phone className="w-4 h-4 text-brand-teal shrink-0" /> {selectedInscricao.telefone}</div>
                      <div className="flex items-center gap-2.5"><Mail className="w-4 h-4 text-brand-teal shrink-0" /> {selectedInscricao.email}</div>
                      <div className="flex items-center gap-2.5"><MapPinned className="w-4 h-4 text-brand-teal shrink-0" /> {selectedInscricao.pais}</div>
                      <div className="flex items-center gap-2.5"><MapPin className="w-4 h-4 text-brand-teal shrink-0" /> {selectedInscricao.estado}</div>
                      <div className="flex items-center gap-2.5"><MapPinHouse className="w-4 h-4 text-brand-teal shrink-0" /> {selectedInscricao.cidade}</div>
                      <div className="flex items-center gap-2.5"><Calendar className="w-4 h-4 text-brand-teal shrink-0" /> Inscrito em {formatDate(selectedInscricao.createdAt)}</div>
                    </div>
                  </div>

                  {/* Segment of mentorship area */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Informações de mentoria</span>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50 text-xs text-gray-500 font-semibold space-y-2">                     
                      <div className="flex items-center gap-2.5"><Building2 className="w-4 h-4 text-brand-teal shrink-0" /> {selectedInscricao.empresa}</div>
                      <div className="flex items-center gap-2.5"><Briefcase className="w-4 h-4 text-brand-teal shrink-0" /> {selectedInscricao.cargo}</div>
                      <div className="flex items-center gap-2.5"><Target className="w-4 h-4 text-brand-teal shrink-0" /> {selectedInscricao.areaMentoria}</div>
                      <div className="flex items-center gap-2.5"><Layers className="w-4 h-4 text-brand-teal shrink-0" /> {selectedInscricao.areaAtuacao}</div>
                    </div>
                  </div>

                  {/* How they knew */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-brand-teal" /> Como Conheceu o HUB
                    </span>
                    <p className="text-gray-600 font-semibold text-xs leading-normal">{selectedInscricao.comoConheceu}</p>
                  </div>

                  {/* Why they want to be a mentor */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-brand-teal" /> Propósito da Inscrição
                    </span>
                    <p className="text-gray-600 font-medium text-xs leading-relaxed p-4 bg-gray-50 rounded-2xl border border-gray-100/50 max-h-36 overflow-y-auto">
                      {selectedInscricao.motivoInscricao}
                    </p>
                  </div>

                  {/* Conditions Check Verified Icon */}
                  <div className="text-[10.5px] font-bold text-gray-500 flex items-center gap-2 bg-green-50/50 p-2.5 rounded-lg border border-green-100/30">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0" /> Ciente e concorda com o regulamento.
                  </div>

                </div>

                {/* Promotional to Oficial Roster Button & Delete Button */}
                <div className="pt-4 border-t border-gray-100 space-y-2.5">
                  
                  {selectedInscricao.status === 'apto á começar o programa' && (
                    <button
                      onClick={() => handlePromoteToRoster(selectedInscricao)}
                      className="w-full bg-brand-teal hover:bg-brand-teal/90 text-white font-black uppercase text-[10px] tracking-widest py-3.5 rounded-2xl transition-all shadow-xl shadow-brand-teal/15 flex items-center justify-center gap-1.5"
                    >
                      Adicionar ao Roster Oficial <ArrowUpRight className="w-4 h-4" />
                    </button>
                  )}

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
                  Selecione um candidato cadastrado na tabela ao lado para conferir os dados detalhados e atualizar o status
                </span>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
