/**
 * Lista de startups exibida na página pública /startups.
 *
 * ⚠️ Estes são dados FIXOS (fallback) usados na vitrine pública.
 * Para o portfólio gerenciável (cadastro/edição/exclusão), use o Painel
 * Admin em /admin/startups — aquele vem do Firestore.
 *
 * Para editar esta vitrine: altere/adicione objetos abaixo. As imagens
 * ficam em `public/Startups/` e o caminho começa com `/Startups/...`.
 */

export interface StartupVitrine {
  name: string;
  /** Caminho da logo dentro de public/ (ex: '/Startups/logo.png'). */
  logo: string;
  category: string;
  website: string;
}

export const NINNA_STARTUPS: StartupVitrine[] = [
  { name: "Suri", logo:"/Startups/suri-cbm-logo-blue.png", category: "", website: "https://www.suri.ai" },
  { name: "Flake", logo: "/Startups/thumbnail_flake2-scaled.png", category: "SaaS", website: "https://flake.com.br/" },
  { name: "Nexcode", logo: "/Startups/Nexcode.png", category: "SaaS", website: "https://www.nexcode.live" },
  { name: "MoldIAX", logo:"/Startups/MoldIax.png", category: "", website: "https://moldiax.com/" },
  { name: "Straloo", logo:"/Startups/straloo.png", category: "HealthTech", website: "https://straloo.com.br" },
  { name: "Lovel", logo: "/Startups/lovel.dev_.jpg", category: "HRTech", website: "https://lovel.dev/" },
  { name: "Medflow", logo: "/Startups/medflow.png", category: "HealthTech", website: "https://medflow.com.br/" },
  { name: "Pliq", logo: "/Startups/pliq.jpg", category: "Customer Exp.", website: "https://pliq.com.br/" },
  { name: "Resolvvi", logo: "/Startups/Resolvvi.jpg", category: "LegalTech", website: "https://resolvvi.com/" },
  { name: "RH Gestão", logo: "/Startups/RhGestao.jpeg", category: "HRTech", website: "https://rhgestao.com.br/" },
  { name: "Urbis", logo: "/Startups/urbis.png", category: "Smart Cities", website: "https://urbis.cc/" },
  { name: "EdukDados", logo:"/Startups/edukdados.png", category: "", website: "https://www.edukdados.com.br" },
  { name: "synapsystem", logo:"/Startups/synapsystem.png", category: "", website: "https://synapsystem.com" },
  { name: "Leme", logo:"/Startups/Logo-Leme.jpeg", category: "", website: "https://lemeapp.com.br" },
  { name: "Compliance Avant", logo:"/Startups/Compliance_avant_logo.png", category: "", website: "https://complianceavant.com" },
];
