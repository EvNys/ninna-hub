/**
 * Configuração de navegação do site (menu principal e lista de eventos
 * exibida no dropdown da Navbar).
 *
 * Para adicionar/remover um item do menu, edite `NAV_LINKS`. Cada item tem
 * um `name` (texto exibido) e um `path` (rota — precisa existir em App.tsx).
 */

export interface NavLink {
  name: string;
  path: string;
}

export const NAV_LINKS: NavLink[] = [
  { name: 'Home', path: '/' },
  { name: 'Empresas', path: '/empresas' },
  { name: 'Startups', path: '/startups' },
  { name: 'Ecossistema', path: '/ecossistema' },
  { name: 'Agenda de eventos', path: '/agenda' },
  { name: 'Serviços', path: '/Servicos' },
  { name: 'Sobre nós', path: '/sobre' },
];

export interface EventoNinna {
  nome: string;
  local: string;
}

/** Eventos institucionais fixos mostrados no dropdown "Ecossistema" da Navbar. */
export const EVENTOS_NINNA: EventoNinna[] = [
  { nome: 'NINNA Connection', local: 'Auditório NINNA' },
  { nome: 'Terceiro Tempo', local: 'Área de Convivência' },
  { nome: 'Hub Session', local: 'Sala Pregão' },
  { nome: 'Licor', local: 'Espaço de Conexão' }
];
