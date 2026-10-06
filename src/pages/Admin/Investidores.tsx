import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import {
  CheckCircle,
  Clock,
  Download,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { db } from "../../lib/firebase";

type InvestorStatus = "pendente" | "apto" | "rejeitado";

interface InvestorApplication {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  teseInvestimento?: string;
  ticketInvestimento?: string;
  mensagem?: string;
  status: InvestorStatus;
  createdAt?: { toDate?: () => Date } | string | Date;
}

const STATUS_LABELS: Record<InvestorStatus, string> = {
  pendente: "Pendente",
  apto: "Apto",
  rejeitado: "Rejeitado",
};

function formatDate(value: InvestorApplication["createdAt"]) {
  if (!value) return "";
  const date =
    typeof value === "object" && "toDate" in value && value.toDate
      ? value.toDate()
      : new Date(value as string | Date);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("pt-BR");
}

function csvCell(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export default function AdminInvestidores() {
  const [investidores, setInvestidores] = useState<InvestorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | InvestorStatus>(
    "todos",
  );

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const investorQuery = query(
          collection(db, "inscricoes_investidores"),
          orderBy("createdAt", "desc"),
        );
        const snapshot = await getDocs(investorQuery);
        setInvestidores(
          snapshot.docs.map((investorDoc) => ({
            id: investorDoc.id,
            ...(investorDoc.data() as Omit<InvestorApplication, "id">),
          })),
        );
      } catch (error) {
        console.error("Erro ao carregar inscrições de investidores:", error);
        toast.error("Não foi possível carregar a lista de investidores.");
      } finally {
        setLoading(false);
      }
    };

    void fetchInvestors();
  }, []);

  const filteredInvestors = useMemo(() => {
    const search = searchTerm.trim().toLocaleLowerCase("pt-BR");
    return investidores.filter((investor) => {
      const matchesSearch = [
        investor.nome,
        investor.email,
        investor.empresa,
        investor.teseInvestimento,
      ].some((value) => value?.toLocaleLowerCase("pt-BR").includes(search));
      return (
        matchesSearch &&
        (statusFilter === "todos" || investor.status === statusFilter)
      );
    });
  }, [investidores, searchTerm, statusFilter]);

  const updateStatus = async (investor: InvestorApplication, status: InvestorStatus) => {
    try {
      await updateDoc(doc(db, "inscricoes_investidores", investor.id), {
        status,
      });
      setInvestidores((current) =>
        current.map((item) => (item.id === investor.id ? { ...item, status } : item)),
      );
      toast.success(`Status de ${investor.nome} atualizado para ${STATUS_LABELS[status].toLowerCase()}.`);
    } catch (error) {
      console.error("Erro ao atualizar status do investidor:", error);
      toast.error("Não foi possível atualizar o status do investidor.");
    }
  };

  const exportCsv = () => {
    const headers = [
      "Nome",
      "E-mail",
      "Telefone",
      "Empresa/Fundo",
      "Tese de investimento",
      "Faixa de investimento",
      "Mensagem",
      "Status",
      "Data de cadastro",
    ];
    const rows = filteredInvestors.map((investor) => [
      investor.nome,
      investor.email,
      investor.telefone,
      investor.empresa,
      investor.teseInvestimento,
      investor.ticketInvestimento,
      investor.mensagem,
      STATUS_LABELS[investor.status] ?? investor.status,
      formatDate(investor.createdAt),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map(csvCell).join(";"))
      .join("\r\n");
    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "investidores-ninna.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const countByStatus = (status: InvestorStatus) =>
    investidores.filter((investor) => investor.status === status).length;

  return (
    <div className="mx-auto max-w-7xl py-8">
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <Users className="h-8 w-8 text-brand-teal" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-teal">
              Rede de capital NINNA
            </p>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-wide text-gray-900">
            Investidores
          </h1>
          <p className="mt-2 text-gray-500">
            Analise os cadastros e gerencie a aptidão dos investidores.
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={filteredInvestors.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-teal px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-brand-teal/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Exportar CSV ({filteredInvestors.length})
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(
          [
            ["Todos", investidores.length, Users],
            ["Pendentes", countByStatus("pendente"), Clock],
            ["Aptos", countByStatus("apto"), CheckCircle],
          ] as const
        ).map(([label, count, Icon]) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="rounded-xl bg-brand-teal/10 p-3 text-brand-teal">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{count}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 sm:flex-row">
        <label className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            aria-label="Buscar investidores"
            placeholder="Buscar por nome, e-mail, empresa ou tese..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-brand-teal"
          />
        </label>
        <select
          aria-label="Filtrar por status"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as "todos" | InvestorStatus)
          }
          className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-brand-teal"
        >
          <option value="todos">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="apto">Apto</option>
          <option value="rejeitado">Rejeitado</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <tr>
                <th className="px-5 py-4">Investidor</th>
                <th className="px-5 py-4">Empresa / Perfil</th>
                <th className="px-5 py-4">Tese / Faixa</th>
                <th className="px-5 py-4">Cadastro</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                    Carregando investidores...
                  </td>
                </tr>
              ) : filteredInvestors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                    Nenhum investidor encontrado.
                  </td>
                </tr>
              ) : (
                filteredInvestors.map((investor) => (
                  <tr key={investor.id} className="align-top hover:bg-gray-50/70">
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900">{investor.nome}</p>
                      <a
                        href={`mailto:${investor.email}`}
                        className="mt-1 block text-xs text-brand-teal hover:underline"
                      >
                        {investor.email}
                      </a>
                      {investor.telefone && (
                        <p className="mt-1 text-xs text-gray-400">{investor.telefone}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-700">{investor.empresa || "—"}</p>
                    </td>
                    <td className="max-w-xs px-5 py-4">
                      <p className="text-gray-700">{investor.teseInvestimento || "—"}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        {investor.ticketInvestimento || "Faixa não informada"}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                      {formatDate(investor.createdAt) || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-wider ${
                          investor.status === "apto"
                            ? "bg-green-50 text-green-700"
                            : investor.status === "rejeitado"
                              ? "bg-red-50 text-red-600"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {investor.status === "apto" ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : investor.status === "rejeitado" ? (
                          <XCircle className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {STATUS_LABELS[investor.status] ?? "Pendente"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => void updateStatus(investor, "apto")}
                          disabled={investor.status === "apto"}
                          title="Marcar como apto"
                          className="rounded-lg border border-green-100 p-2 text-green-700 transition hover:bg-green-50 disabled:opacity-40"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void updateStatus(investor, "rejeitado")}
                          disabled={investor.status === "rejeitado"}
                          title="Rejeitar investidor"
                          className="rounded-lg border border-red-100 p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-40"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                        {investor.mensagem && (
                          <span
                            title={investor.mensagem}
                            className="max-w-32 truncate self-center text-xs text-gray-400"
                          >
                            {investor.mensagem}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
