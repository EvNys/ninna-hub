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
  serverTimestamp, 
  where
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Mail,
  Phone,
  Building2,
  Tag,
  MessageSquare,
  X,
  HandCoins,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';


export default function AdminPatrocinadores() {
  const [patrocinadores, setPatrocinadores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatrocinador, setSelectedPatrocinador] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  useEffect(() => {
    fetchPatrocinadores();
  }, []);

  const fetchPatrocinadores = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'leads_eventos'),
        where('tipoInteresse', '==', 'sponsor'),
        orderBy('createdAt', 'desc')
      );
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
      setPatrocinadores(data);

      // Keep selected sync if selected
      if (selectedPatrocinador) {
        const updatedSelected = data.find(item => item.id === selectedPatrocinador.id);
        if (updatedSelected) {
          setSelectedPatrocinador(updatedSelected);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar patrocinadores:', error);
      toast.error('Erro ao carregar lista de patrocinadores.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'pendente' | 'em contato' | 'fechado' | 'recusado') => {
    try {
      await updateDoc(doc(db, 'leads_eventos', id), {
        status: newStatus
      });
      toast.success('Status do patrocinador atualizado com sucesso!');

      // Update local state smoothly
      setPatrocinadores(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      if (selectedPatrocinador && selectedPatrocinador.id === id) {
        setSelectedPatrocinador((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar status do patrocinador.');
    }
  };

  const handleDeletePatrocinador = async (id: string) => {
    if (window.confirm('Tem certeza de que deseja excluir permanentemente este registro?')) {
      try {
        await deleteDoc(doc(db, 'leads_eventos', id));
        toast.success('Registro excluído definitivamente.');
        if (selectedPatrocinador?.id === id) {
          setSelectedPatrocinador(null);
        }
        setPatrocinadores(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        console.error(error);
        toast.error('Erro ao deletar registro.');
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
      case 'fechado':
        return (
          <span className="px-3 py-1.5 bg-green-50 text-green-700 ring-1 ring-green-600/20 rounded-full text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
            <CheckCircle className="w-3 h-3 text-green-600" />
            Fechado
          </span>
        );
      case 'em contato':
        return (
          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 ring-1 ring-blue-500/20 rounded-full text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-blue-500" />
            Em Contato
          </span>
        );
      case 'recusado':
        return (
          <span className="px-3 py-1.5 bg-red-50 text-red-600 ring-1 ring-red-500/20 rounded-full text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
            <XCircle className="w-3 h-3 text-red-500" />
            Recusado
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

  // Filter list based on search bar and status select
  const filteredPatrocinadores = patrocinadores.filter(item => {
    const matchesSearch =
      item.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tipoPatrocinio?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'todos' || (item.status ?? 'pendente') === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const exportToCSV = (data: any[]) => {
    const headers = [
      'Nome', 'Email', 'Telefone', 'Empresa', 'Categoria de Patrocínio',
      'Status', 'Mensagem', 'Data de Envio'
    ];

    const rows = data.map(item => [
      item.nome ?? '',
      item.email ?? '',
      item.telefone ?? '',
      item.empresa ?? '',
      item.tipoPatrocinio ?? '',
      item.status ?? 'pendente',
      item.mensagem ?? '',
      formatDate(item.createdAt)
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `patrocinadores_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

return (
  <div className="p-6">
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-teal/10 rounded-xl flex items-center justify-center">
          <HandCoins className="w-5 h-5 text-brand-teal" />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900">Patrocinadores</h2>
          <p className="text-[11px] text-gray-400 flex items-center gap-1">
            <Users className="w-3 h-3" />
            {filteredPatrocinadores.length} registro{filteredPatrocinadores.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      <button
        onClick={() => exportToCSV(filteredPatrocinadores)}
        className="flex items-center gap-2 px-4 py-2 bg-brand-teal text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand-teal/90 transition-colors"
      >
        <Download className="w-3.5 h-3.5" />
        Exportar CSV
      </button>
    </div>

    {/* Busca e filtro */}
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nome, email, empresa..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-[#fafafa] border border-gray-100 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-brand-teal"
        />
      </div>
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-[#fafafa] border border-gray-100 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-brand-teal appearance-none"
        >
          <option value="todos">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="em contato">Em Contato</option>
          <option value="fechado">Fechado</option>
          <option value="recusado">Recusado</option>
        </select>
      </div>
    </div>

    {/* Tabela */}
    {loading ? (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Clock className="w-4 h-4 animate-spin" />
        Carregando patrocinadores...
      </div>
    ) : filteredPatrocinadores.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <HandCoins className="w-8 h-8 mb-2" />
        <p className="text-sm">Nenhum patrocinador encontrado.</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-[10px] uppercase tracking-widest text-gray-400 font-black">
              <th className="py-3 pr-4">Data</th>
              <th className="py-3 pr-4">Nome</th>
              <th className="py-3 pr-4">Empresa</th>
              <th className="py-3 pr-4">Email</th>
              <th className="py-3 pr-4">Telefone</th>
              <th className="py-3 pr-4">Categoria</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatrocinadores.map(item => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 pr-4 whitespace-nowrap text-gray-500">{formatDate(item.createdAt)}</td>
                <td className="py-3 pr-4 font-medium">{item.nome}</td>
                <td className="py-3 pr-4">
                  <span className="flex items-center gap-1.5 text-gray-600">
                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                    {item.empresa}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <a href={`mailto:${item.email}`} className="flex items-center gap-1.5 text-brand-teal hover:underline">
                    <Mail className="w-3.5 h-3.5" />
                    {item.email}
                  </a>
                </td>
                <td className="py-3 pr-4">
                  <span className="flex items-center gap-1.5 text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    {item.telefone}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <span className="flex items-center gap-1.5 text-gray-600">
                    <Tag className="w-3.5 h-3.5 text-gray-400" />
                    {item.tipoPatrocinio}
                  </span>
                </td>
                <td className="py-3 pr-4">{getStatusBadge(item.status ?? 'pendente')}</td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <select
                      value={item.status ?? 'pendente'}
                      onChange={e => handleUpdateStatus(item.id, e.target.value as any)}
                      className="text-[10px] border border-gray-200 rounded-lg px-2 py-1"
                    >
                      <option value="pendente">Pendente</option>
                      <option value="em contato">Em Contato</option>
                      <option value="fechado">Fechado</option>
                      <option value="recusado">Recusado</option>
                    </select>
                    <button
                      onClick={() => setSelectedPatrocinador(item)}
                      title="Ver detalhes"
                      className="p-1.5 text-brand-teal hover:bg-brand-teal/10 rounded-lg transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePatrocinador(item.id)}
                      title="Excluir"
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {/* Modal de detalhes */}
    {selectedPatrocinador && (
      <div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
        onClick={() => setSelectedPatrocinador(null)}
      >
        <div
          className="bg-white rounded-2xl p-6 max-w-md w-full relative"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => setSelectedPatrocinador(null)}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-teal/10 rounded-xl flex items-center justify-center">
              <HandCoins className="w-5 h-5 text-brand-teal" />
            </div>
            <h3 className="font-black text-lg">{selectedPatrocinador.nome}</h3>
          </div>

          <div className="space-y-2.5 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
              {selectedPatrocinador.empresa}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
              {selectedPatrocinador.email}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
              {selectedPatrocinador.telefone}
            </p>
            <p className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-400 shrink-0" />
              {selectedPatrocinador.tipoPatrocinio}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Mensagem
            </p>
            <p className="text-sm text-gray-500">{selectedPatrocinador.mensagem || '—'}</p>
          </div>
        </div>
      </div>
    )}
  </div>
);
}