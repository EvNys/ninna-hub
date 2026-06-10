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
  { name: "Beanalytic", logo: "/Startups/Logo-Beanalytic.png", category: "Big Data & AI", website: "https://beanalytic.com.br/" },
  { name: "Cirurgia Autorizada", logo: "/Startups/cirurgia-autorizada.jpeg", category: "HealthTech", website: "https://cirurgiaautorizada.com.br/" },
  { name: "Clickmassa", logo: "/Startups/Clickmassa.jpg", category: "MarTech", website: "https://clickmassa.com.br/" },
  { name: "In House", logo: "/Startups/FISICO-InHouse-Market.png", category: "SportsTech", website: "https://inhousemarket.com.br/" },
  { name: "Flake", logo: "/Startups/thumbnail_flake2-scaled.png", category: "SaaS", website: "https://flake.com.br/" },
  { name: "HealthDev", logo: "/Startups/HealthDev.jpg", category: "HealthTech", website: "https://healthdev.com.br/" },
  { name: "Idun", logo: "/Startups/idun-logo-v2.png", category: "FinTech", website: "https://idun.co" },
  { name: "Jetsales", logo: "/Startups/jetsales.jpg", category: "SalesTech", website: "https://jetsales.com.br/" },
  { name: "Lovel", logo: "/Startups/lovel.dev_.jpg", category: "HRTech", website: "https://lovel.dev/" },
  { name: "Medflow", logo: "/Startups/medflow.png", category: "HealthTech", website: "https://medflow.com.br/" },
  { name: "Pliq", logo: "/Startups/pliq.jpg", category: "Customer Exp.", website: "https://pliq.com.br/" },
  { name: "Resolvvi", logo: "/Startups/Resolvvi.jpg", category: "LegalTech", website: "https://resolvvi.com/" },
  { name: "RH Gestão", logo: "/Startups/RhGestao.jpeg", category: "HRTech", website: "https://rhgestao.com.br/" },
  { name: "Sombank", logo: "/Startups/thumbnail_Logo-Sombank.png", category: "FinTech", website: "https://sombank.com.br/" },
  { name: "Starlight", logo: "/Startups/starlight-logo-default-1.png", category: "Logistics", website: "https://starlight.sh/" },
  { name: "Trilogo", logo: "/Startups/trilogo.jpg", category: "Facilities & IoT", website: "https://trilogo.com.br/" },
  { name: "Urbis", logo: "/Startups/urbis.png", category: "Smart Cities", website: "https://urbis.cc/" }
];
