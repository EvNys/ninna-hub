/**
 * Equipe padrão do NINNA Hub.
 *
 * Usada em dois lugares:
 *  - Página pública /sobre — mostrada quando ainda não há equipe no Firestore.
 *  - Painel Admin /admin/equipe — botão "Importar equipe oficial" usa esta lista
 *    para popular o Firestore de uma vez.
 *
 * ⚠️ Fonte oficial = Painel Admin (coleção `equipe`). Esta lista é o ponto de
 * partida / fallback. Para editar: altere os objetos abaixo. As fotos ficam na
 * pasta `Fotos do Time NINNA/` (servida em `/Fotos do Time NINNA/...`).
 */

export interface MembroEquipePadrao {
  id: string;
  nome: string;
  cargo: string;
  foto: string;
  linkedin: string;
  ordem: number;
  status: 'ativo' | 'inativo';
}

export const EQUIPE_PADRAO: MembroEquipePadrao[] = [
  
];
