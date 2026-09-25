export interface MentorApplication {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  cidade: string;
  linkedin: string;
  area: string;
  indicacao: string;
  motivacao: string;
  status: "pendente" | "apto" | "não apto";
  observacoes: string;
  dataEnvio: string;
  score?: number; // 1 to 5 assessment rating
}

export interface AdminUser {
  email: string;
  role: string;
}

export * from "./types/firestore";
