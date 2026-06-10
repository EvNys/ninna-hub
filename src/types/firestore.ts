/**
 * Tipos das coleções do Firestore — NINNA Hub
 * ============================================
 *
 * Cada interface aqui descreve o formato de um documento salvo no Firestore.
 * Use esses tipos no lugar de `any` para ganhar autocomplete e segurança.
 *
 * Convenções:
 * - Todos os documentos têm `id` (gerado pelo Firestore) e estendem `BaseDoc`.
 * - Campos marcados com `?` são opcionais: documentos antigos podem não tê-los.
 * - O nome de cada interface corresponde a uma coleção (ver comentário acima dela).
 *
 * IMPORTANTE: a forma destes documentos é editada pelo Painel Admin (/admin).
 * Ao adicionar um campo novo no formulário de uma página admin, adicione-o
 * também aqui para manter os tipos em dia.
 */

import { Timestamp } from 'firebase/firestore';

/** Status comum usado pela maioria das entidades. */
export type Status = 'ativo' | 'inativo';

/**
 * Campos presentes em todos os documentos.
 * `createdAt` / `updatedAt` são preenchidos automaticamente pelo hook
 * `useFirestoreCollection` via `serverTimestamp()`.
 */
export interface BaseDoc {
  id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/** Coleção: `startups` */
export interface Startup extends BaseDoc {
  nome: string;
  descricaoCurta: string;
  descricaoCompleta?: string;
  categoria: string;
  estagio: string;
  tipoNegocio: string;
  logo?: string;
  site?: string;
  cidade?: string;
  estado?: string;
  status: Status;
}

/** Coleção: `eventos` */
export interface Evento extends BaseDoc {
  nome: string;
  descricao: string;
  data: string;
  horario?: string;
  local?: string;
  imagem?: string;
  linkInscricao?: string;
  status: Status;
  destaque?: boolean;
}

/** Coleção: `oportunidades` */
export interface Oportunidade extends BaseDoc {
  titulo: string;
  descricao: string;
  tipo: string;
  linkExterno?: string;
  dataLimite?: string;
  imagem?: string;
  status: Status;
  destaque?: boolean;
}

/** Coleção: `parceiros` */
export interface Parceiro extends BaseDoc {
  nome: string;
  tipo: string;
  logo?: string;
  site?: string;
  status: Status;
}

/** Coleção: `mentores` */
export interface Mentor extends BaseDoc {
  nome: string;
  cargo: string;
  empresa?: string;
  foto?: string;
  linkedin?: string;
  ordem: number;
  status: Status;
}

/** Coleção: `equipe` */
export interface EquipeMember extends BaseDoc {
  nome: string;
  cargo: string;
  foto?: string;
  linkedin?: string;
  ordem: number;
  status: Status;
}

/** Coleção: `beneficios` */
export interface Beneficio extends BaseDoc {
  nomeEmpresa: string;
  logo?: string;
  ordem: number;
  status: Status;
}

/** Coleção: `premiacoes` */
export interface Premiacao extends BaseDoc {
  titulo: string;
  organizacao?: string;
  ano?: string;
  imagem?: string;
  status: Status;
}

/** Coleção: `cases` */
export interface Case extends BaseDoc {
  titulo: string;
  cliente?: string;
  resumo?: string;
  conteudo?: string;
  imagem?: string;
  link?: string;
  status: Status;
}

/** Coleção: `treinamentos` */
export interface Treinamento extends BaseDoc {
  titulo: string;
  descricao?: string;
  capa?: string;
  categoria: string;
  ordem: number;
  status: Status;
}

/** Subcoleção: `treinamentos/{trainingId}/aulas` */
export interface Aula extends BaseDoc {
  titulo: string;
  descricao?: string;
  mediaUrl?: string;
  capa?: string;
  ordem: number;
}

/** Coleção: `users` */
export interface Usuario extends BaseDoc {
  name: string;
  email: string;
  role: 'user' | 'admin' | 'editor';
  telefone?: string;
  nomeEmpresa?: string;
}

/**
 * Documento único de configuração: `kpis/main`
 * (não é uma coleção — é um doc fixo lido com getDoc/setDoc).
 */
export interface Kpis {
  kpi1_label: string;
  kpi1_value: string;
  kpi2_label: string;
  kpi2_value: string;
  kpi3_label: string;
  kpi3_value: string;
  kpi4_label: string;
  kpi4_value: string;
  updatedAt?: Timestamp;
}
