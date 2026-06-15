/**
 * Parceiros/patrocinadores exibidos na Home quando o Firestore não retorna
 * dados (ou enquanto carrega). Garante que a seção nunca apareça vazia.
 *
 * ⚠️ Fonte oficial = Painel Admin (/admin/parceiros). Esta lista é fallback.
 * As logos ficam em `public/Imagens_NINNA/` (caminho começa com '/Imagens_NINNA/').
 */

export interface ParceiroFallback {
  id: string;
  nome: string;
  logo: string;
}

export const PARCEIROS_FALLBACK: ParceiroFallback[] = [
  { id: 'bp-unimed', nome: 'Unimed Fortaleza', logo: '/Imagens_NINNA/Unimed.png' },
  { id: 'bp-mdias', nome: 'M. Dias Branco', logo: '/Imagens_NINNA/M-Dias-Branco.png' },
  { id: 'bp-sebrae', nome: 'Sebrae Ceará', logo: '/Imagens_NINNA/Sebrae-PNG.png' },
  { id: 'bp-cagece', nome: 'Cagece', logo: '/Imagens_NINNA/Cagece.png' },
  { id: 'bp-bnb', nome: 'Banco do Nordeste', logo: '/Imagens_NINNA/BancoNordeste.png' },
  { id: 'bp-paguemenos', nome: 'Pague Menos', logo: '/Imagens_NINNA/PagueMenos.png' },
  { id: 'bp-fecomercio', nome: 'Fecomércio CE', logo: '/Imagens_NINNA/fecomercio-ce.png' },
  { id: 'bp-igc', nome: 'Instituto de Gestão e Cidadania', logo: '/Imagens_NINNA/IGCLogo.png' },
  { id: 'bp-acerloMittal', nome: 'arceloMittal', logo: '/Imagens_NINNA/arceloMittal.png' },
  { id: 'bp-hapvida', nome: 'Hapvida', logo: '/Imagens_NINNA/Hapvida.png' },
  { id: "bp-ufc", nome: 'UFC', logo: '/Imagens_NINNA/UFC.png' },
  { id: 'bp-uece', nome: 'UECE', logo: '/Imagens_NINNA/Uece.png' },
];
