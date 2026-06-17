import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Download, 
  LogOut, 
  Linkedin, 
  Phone, 
  MapPin, 
  Star, 
  Trash2, 
  RefreshCw, 
  AlertCircle,
  Calendar,
  Save,
  Menu,
  ShieldAlert,
  ChevronRight,
  Filter
} from 'lucide-react';
import { MentorApplication } from '../types';
import NinnaHubLogo from './NinnaLogo';

interface AdminDashboardProps {
  applications: MentorApplication[];
  onUpdateApplication: (application: MentorApplication) => void;
  onDeleteApplication: (id: string) => void;
  onResetDatabase: () => void;
  currentAdminEmail: string;
  onLogout: () => void;
}

export default function AdminDashboard({
  applications,
  onUpdateApplication,
  onDeleteApplication,
  onResetDatabase,
  currentAdminEmail,
  onLogout
}: AdminDashboardProps) {
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterArea, setFilterArea] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Active application selected for display/edit in details panel
  const [selectedAppId, setSelectedAppId] = useState<string | null>(
    applications.length > 0 ? applications[0].id : null
  );

  // Transient edit states for the selected application
  const [notesDraft, setNotesDraft] = useState('');
  const [ratingDraft, setRatingDraft] = useState<number>(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Find the currently selected application
  const selectedApp = useMemo(() => {
    const found = applications.find(app => app.id === selectedAppId);
    return found || null;
  }, [applications, selectedAppId]);

  // Sync edits when selectedApp shifts
  React.useEffect(() => {
    if (selectedApp) {
      setNotesDraft(selectedApp.observacoes || '');
      setRatingDraft(selectedApp.score || 0);
      setSaveSuccess(false);
    }
  }, [selectedAppId, selectedApp]);

  // Handle active status update on individual applicant
  const handleStatusChange = (newStatus: 'pendente' | 'apto' | 'não apto') => {
    if (!selectedApp) return;
    const updated: MentorApplication = {
      ...selectedApp,
      status: newStatus
    };
    onUpdateApplication(updated);
  };

  // Save assessment notes and star count
  const handleSaveEvaluation = () => {
    if (!selectedApp) return;
    const updated: MentorApplication = {
      ...selectedApp,
      observacoes: notesDraft,
      score: ratingDraft
    };
    onUpdateApplication(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  };

  // General counts for Metrics cards
  const kpis = useMemo(() => {
    const total = applications.length;
    const aptas = applications.filter(a => a.status === 'apto').length;
    const pendentes = applications.filter(a => a.status === 'pendente').length;
    const naoAptas = applications.filter(a => a.status === 'não apto').length;
    return { total, aptas, pendentes, naoAptas };
  }, [applications]);

  // Translate code values to user friendly strings
  const getAreaLabel = (areaCode: string) => {
    const areas: { [key: string]: string } = {
      inovacao: 'Inovação & Tecnologia',
      negocios: 'Negócios & Estratégia',
      financas: 'Finanças & Venture Capital',
      marketing: 'Marketing & Growth',
      rh: 'Pessoas & Cultura',
      juridico: 'Jurídico & Regulatório',
      operacoes: 'Operações & Supply Chain',
      outro: 'Outra'
    };
    return areas[areaCode] || areaCode;
  };

  // Fuzzy filter list of applications
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = 
        app.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.motivacao.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.cidade.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesArea = filterArea === 'all' || app.area === filterArea;
      const matchesStatus = filterStatus === 'all' || app.status === filterStatus;

      return matchesSearch && matchesArea && matchesStatus;
    });
  }, [applications, searchQuery, filterArea, filterStatus]);

  // Automated CSV generation handler
  const handleExportCSV = () => {
    if (applications.length === 0) {
      alert('Nenhuma inscrição encontrada para exportação!');
      return;
    }

    // Prepare headers (with analysis/aptitude metrics integrated)
    const headers = [
      'ID',
      'Nome Completo',
      'E-mail',
      'WhatsApp',
      'Cidade e Estado',
      'Link LinkedIn',
      'Área de Atuação',
      'Como Conheceu',
      'Motivação / Justificativa',
      'Data de Submissão',
      'Pontuação (Estrelas)',
      'Status de Aptidão',
      'Análise de Aptidão (Observações do Coordenador)'
    ];

    // Build values arrays
    const rows = applications.map(app => {
      return [
        app.id,
        app.nome,
        app.email,
        app.whatsapp,
        app.cidade,
        app.linkedin,
        getAreaLabel(app.area),
        app.indicacao || 'Não informado',
        app.motivacao.replace(/\n/g, ' '), // sanitize linebreaks
        new Date(app.dataEnvio).toLocaleString('pt-BR'),
        app.score || 'Sem nota',
        app.status === 'apto' ? 'Apto' : app.status === 'não apto' ? 'Não Apto' : 'Pendente',
        (app.observacoes || 'Nenhuma observação inserida').replace(/\n/g, ' ')
      ];
    });

    const csvContent = [
      headers.join(';'),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(';'))
    ].join('\n');

    // Add UTF-8 BOM to make sure characters are parsed beautifully in MS Excel
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Painel_Mentores_NINNA_Hub_Exportacao_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: 'pendente' | 'apto' | 'não apto') => {
    switch (status) {
      case 'apto':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-250 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Apto para Programa
        </span>;
      case 'não apto':
        return <span className="bg-rose-50 text-rose-700 border border-rose-250 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Inapto
        </span>;
      default:
        return <span className="bg-amber-50 text-amber-700 border border-amber-250 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Em Avaliação
        </span>;
    }
  };

  const getWhatsappUrl = (phone: string) => {
    const rawNumber = phone.replace(/\D/g, '');
    return `https://wa.me/55${rawNumber}`;
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0A0A0A] text-slate-300 flex flex-col shrink-0 border-b md:border-b-0 md:border-r border-slate-850">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-850 flex items-center justify-between">
          <NinnaHubLogo light={true} scale={0.95} />
          <span className="text-[9px] bg-slate-900 border border-slate-800 text-[#00C9A7] font-extrabold px-2 py-0.5 rounded-md tracking-wider">
            COORD
          </span>
        </div>

        {/* Sidebar Nav links */}
        <nav className="flex-1 p-4 space-y-1.5">
          <div className="px-4 py-2.5 bg-slate-800 text-white rounded-lg flex items-center gap-3 text-sm font-semibold cursor-pointer">
            <Users className="w-4.5 h-4.5 text-blue-500" />
            <span>Fichas Recebidas</span>
            <span className="ml-auto bg-blue-600 text-[10px] text-white font-bold px-1.5 py-0.5 rounded-full">
              {applications.length}
            </span>
          </div>

          <div className="px-4 py-2.5 hover:bg-slate-800/60 hover:text-white rounded-lg transition text-sm font-medium flex items-center gap-3 text-slate-400 cursor-not-allowed">
            <span className="w-4.5 h-4.5 rounded bg-slate-800 flex items-center justify-center text-[10px] text-slate-500">M</span>
            <span>Mapeamento M2M</span>
            <span className="text-[9px] uppercase bg-slate-800 text-slate-600 px-1 py-0.2 rounded ml-auto">Breve</span>
          </div>

          <div className="px-4 py-2.5 hover:bg-slate-800/60 hover:text-white rounded-lg transition text-sm font-medium flex items-center gap-3 text-slate-400 cursor-not-allowed">
            <span className="w-4.5 h-4.5 rounded bg-slate-800 flex items-center justify-center text-[10px] text-slate-500">E</span>
            <span>Indicadores de Edital</span>
            <span className="text-[9px] uppercase bg-slate-800 text-slate-600 px-1 py-0.2 rounded ml-auto">Breve</span>
          </div>
        </nav>

        {/* Profile Details Bottom Panel */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between mb-3 text-[11px] text-slate-400">
            <span>Operador Autenticado</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs font-bold shrink-0 uppercase">
              {currentAdminEmail ? currentAdminEmail.substring(0, 2) : 'AD'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white font-semibold truncate" title={currentAdminEmail}>
                {currentAdminEmail}
              </p>
              <button 
                onClick={onLogout}
                className="text-[10px] text-red-400 hover:text-red-300 transition font-bold block mt-0.5"
              >
                Logout do Sistema
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
        
        {/* Header Bar */}
        <header className="h-20 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">Gestão de Inscrições</h2>
            <p className="text-xs sm:text-sm text-slate-500">Programa de Mentores • NINNA Hub 2026</p>
          </div>
          
          <div className="flex items-center gap-2.5">
            {/* Quick prefill reset for testing */}
            <button
              onClick={onResetDatabase}
              title="Restaurar dados de teste"
              className="p-2.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition"
            >
              <Download className="w-4 h-4" />
              <span>Baixar CSV Geral</span>
            </button>
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-6 shrink-0 bg-slate-50">
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Inscritos Totais</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{kpis.total}</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-lg text-slate-500">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">Aptos</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{kpis.aptas}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">Em Avaliação</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{kpis.pendentes}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">Inaptos / Recusados</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{kpis.naoAptas}</p>
            </div>
            <div className="p-3 bg-rose-50 rounded-lg text-rose-600">
              <XCircle className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Dynamic Split Layout Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden px-4 sm:px-6 pb-6 gap-6">
          
          {/* Left panel: Interactive Table block inside rounded card */}
          <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            
            {/* Filter controls panel */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
              
              {/* Search input field */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar candidato..."
                  className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              {/* Area & Status pickers */}
              <div className="flex gap-2 w-full sm:w-auto">
                <select
                  value={filterArea}
                  onChange={(e) => setFilterArea(e.target.value)}
                  className="flex-1 sm:flex-initial bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-600 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">Especialidades</option>
                  <option value="inovacao">Inovação & Tecnologia</option>
                  <option value="negocios">Negócios & Estratégia</option>
                  <option value="financas">Finanças & VC</option>
                  <option value="marketing">Marketing & Growth</option>
                  <option value="rh">Pessoas & Cultura</option>
                  <option value="juridico">Jurídico & Regulatório</option>
                  <option value="operacoes">Operações & Supply</option>
                  <option value="outro">Outra</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex-1 sm:flex-initial bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-600 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">Sua Aptidão</option>
                  <option value="pendente">Pendente</option>
                  <option value="apto">Apto</option>
                  <option value="não apto">Inapto</option>
                </select>

                {(searchQuery || filterArea !== 'all' || filterStatus !== 'all') && (
                  <button 
                    onClick={() => { setSearchQuery(''); setFilterArea('all'); setFilterStatus('all'); }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold px-2 whitespace-nowrap"
                  >
                    Limpar
                  </button>
                )}
              </div>

            </div>

            {/* In-container Table space */}
            <div className="flex-1 overflow-y-auto">
              {filteredApplications.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-700">Nenhum mentor encontrado</h4>
                    <p className="text-xs text-slate-400">Tente redefinir seus filtros da pesquisa.</p>
                  </div>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200 sticky top-0 z-10">
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-tight">Candidato</th>
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-tight">Especialidade / Origem</th>
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-tight">Status / Aptidão</th>
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-tight text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApplications.map((app) => {
                      const isSelected = app.id === selectedAppId;
                      return (
                        <tr 
                          key={app.id}
                          onClick={() => setSelectedAppId(app.id)}
                          className={`group cursor-pointer transition ${isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/80 bg-white'}`}
                        >
                          <td className="p-4">
                            <div className="font-semibold text-slate-900">{app.nome}</div>
                            <div className="text-xs text-slate-500 font-mono">{app.email}</div>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded uppercase">
                              {getAreaLabel(app.area)}
                            </span>
                            <div className="text-[10px] text-slate-400 mt-1">{app.cidade}</div>
                          </td>
                          <td className="p-4">
                            {getStatusBadge(app.status)}
                          </td>
                          <td className="p-4 text-right">
                            <span className={`text-xs font-semibold ${isSelected ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'} transition flex items-center justify-end gap-1`}>
                              <span>Avaliar</span>
                              <ChevronRight className="w-4.5 h-4.5" />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Table Footer */}
            <div className="border-t border-slate-200 p-4 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-medium shrink-0">
              <p>Exibindo {filteredApplications.length} de {applications.length} submissões</p>
              <div className="text-[10px] bg-slate-100 px-2 py-1 border border-slate-200 rounded text-slate-500">
                Página 1 • Formulário Local
              </div>
            </div>
          </div>

          {/* Right panel: Premium evaluation and notes console sheet */}
          <div className="w-full lg:w-96 bg-white border border-slate-200 rounded-xl shadow-sm overflow-y-auto flex flex-col p-5">
            <AnimatePresence mode="wait">
              {!selectedApp ? (
                <div className="text-center py-20 text-slate-400 space-y-3 flex-1 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                    <Filter className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-600">Nenhum avaliado</h4>
                    <p className="text-xs max-w-xs mx-auto">Por favor, clique em um candidato da tabela para consolidar observações e preencher seu parecer.</p>
                  </div>
                </div>
              ) : (
                <motion.div 
                  key={selectedApp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5 flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-5">
                    {/* Applicant details */}
                    <div className="border-b border-slate-100 pb-4 flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] bg-blue-100 text-blue-700 font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                          Ficha de Análise
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900 pr-2 leading-snug">
                          {selectedApp.nome}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono">{selectedApp.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          const confirmDelete = window.confirm(`Deseja remover a ficha de ${selectedApp.nome}?`);
                          if (confirmDelete) {
                            onDeleteApplication(selectedApp.id);
                            setSelectedAppId(applications.length > 1 ? applications[0].id : null);
                          }
                        }}
                        className="p-1 px-2 text-[10px] text-red-500 hover:bg-red-50 border border-transparent rounded hover:border-red-100 transition whitespace-nowrap shrink-0 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Excluir
                      </button>
                    </div>

                    {/* Contacts & actions */}
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Informações Rápidas</h5>
                      
                      <div className="p-3.5 bg-slate-50/50 rounded-lg border border-slate-200/80 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Localização:</span>
                          <span className="font-semibold text-slate-700">{selectedApp.cidade}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">WhatsApp:</span>
                          <a 
                            href={getWhatsappUrl(selectedApp.whatsapp)} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="font-semibold text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3 text-green-500 shrink-0" /> {selectedApp.whatsapp}
                          </a>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">LinkedIn:</span>
                          {selectedApp.linkedin ? (
                            <a 
                              href={selectedApp.linkedin} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="font-semibold text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <Linkedin className="w-3 h-3 text-blue-500 shrink-0" /> Ver perfil
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">Não inserido</span>
                          )}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Origem:</span>
                          <span className="font-medium text-slate-600 truncate max-w-[150px]" title={selectedApp.indicacao || 'Não informado'}>
                            {selectedApp.indicacao || 'Inscrição direta'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Interview Motivation Paragraph */}
                    <div className="space-y-1 bg-blue-50/30 p-3 rounded-lg border border-blue-100">
                      <h6 className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Motivação Candidatada:</h6>
                      <p className="text-xs text-slate-700 leading-relaxed max-h-36 overflow-y-auto">
                        {selectedApp.motivacao || <span className="text-slate-400 italic">Justificativa não inserida.</span>}
                      </p>
                    </div>

                    {/* Evaluation Form section */}
                    <div className="border-t border-slate-100 pt-4 space-y-4">
                      
                      {/* Define Aptitude Status */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block">
                          Elegibilidade (Parecer Técnico)
                        </label>
                        <div className="grid grid-cols-3 gap-1 px-0.5">
                          <button
                            onClick={() => handleStatusChange('apto')}
                            className={`py-2 px-1 text-center font-bold text-[10px] rounded-lg border transition ${selectedApp.status === 'apto' ? 'bg-emerald-50 text-emerald-700 border-emerald-350 shadow-xs' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                          >
                            Apto
                          </button>
                          <button
                            onClick={() => handleStatusChange('pendente')}
                            className={`py-2 px-1 text-center font-bold text-[10px] rounded-lg border transition ${selectedApp.status === 'pendente' ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-xs' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                          >
                            Pendente
                          </button>
                          <button
                            onClick={() => handleStatusChange('não apto')}
                            className={`py-2 px-1 text-center font-bold text-[10px] rounded-lg border transition ${selectedApp.status === 'não apto' ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-xs' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                          >
                            Inapto
                          </button>
                        </div>
                      </div>

                      {/* Consolidate rating metric */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                            Fit Técnico / Nível
                          </label>
                          <span className="text-[11px] font-bold text-slate-600">{ratingDraft ? `${ratingDraft} Estrelas` : 'Sem nota'}</span>
                        </div>
                        <div className="flex gap-1.5 bg-slate-50 p-1.5 border border-slate-200 rounded-lg justify-center">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const active = star <= ratingDraft;
                            return (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRatingDraft(star)}
                                className="p-0.5 text-slate-400 hover:scale-110 active:scale-95 transition"
                              >
                                <Star className={`w-5.5 h-5.5 ${active ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Text remarks */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block">
                          Anotações do Coordenador (Notas Privadas)
                        </label>
                        <textarea 
                          value={notesDraft}
                          onChange={(e) => setNotesDraft(e.target.value)}
                          placeholder="Ex: Ótimo perfil de tração em marketing, convidado para banca. Ou: perfil muito júnior, aguardar próximo edital..."
                          className="w-full h-24 bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 resize-none font-medium leading-relaxed"
                        />
                      </div>

                    </div>
                  </div>

                  {/* Submit evaluation controls */}
                  <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveEvaluation}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-lg flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition shrink-0"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Salvar Avaliação</span>
                    </button>

                    {saveSuccess && (
                      <span className="text-[10px] text-green-700 bg-green-50 border border-green-200 py-1.5 px-2.5 rounded-lg font-bold block whitespace-nowrap">
                        ✓ OK
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </main>

    </div>
  );
}
