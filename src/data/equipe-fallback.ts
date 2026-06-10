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
  { id: 'gabriela', nome: 'Gabriela Purcaru', cargo: 'COO | Gestão operacional', foto: '/Fotos do Time NINNA/Gabriela Purcaru.jpeg', linkedin: '', ordem: 1, status: 'ativo' },
  { id: 'pedro', nome: 'Pedro Praxedes', cargo: 'Advisor', foto: '/Fotos do Time NINNA/Pedro Praxedes.jpeg', linkedin: '', ordem: 2, status: 'ativo' },
  { id: 'francisco', nome: 'Francisco Holanda', cargo: 'Board', foto: '/Fotos do Time NINNA/Holanda Junior.jpeg', linkedin: '', ordem: 3, status: 'ativo' },
  { id: 'jojo', nome: 'Jojo Pagy', cargo: 'Head de inovação corporativa', foto: '/Fotos do Time NINNA/Jojo.jpeg', linkedin: '', ordem: 4, status: 'ativo' },
  { id: 'alice', nome: 'Alice Freire', cargo: 'Analista de inovação corporativa', foto: '/Fotos do Time NINNA/Alice Freire.png', linkedin: '', ordem: 5, status: 'ativo' },
  { id: 'camila', nome: 'Camila Costa', cargo: 'Secretária executiva', foto: '/Fotos do Time NINNA/Camila Bezerra.jpg', linkedin: '', ordem: 6, status: 'ativo' },
  { id: 'rafael', nome: 'Rafael Alves', cargo: 'Infra estrutura de TI', foto: '/Fotos do Time NINNA/Rafael Alves.jpg', linkedin: '', ordem: 7, status: 'ativo' },
  { id: 'marildo', nome: 'Marildo Martins', cargo: 'Analista de inovação', foto: '/Fotos do Time NINNA/Marildo Martins.jpeg', linkedin: '', ordem: 8, status: 'ativo' }
];
