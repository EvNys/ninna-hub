# Pasta `src/data/` — Conteúdo editável do site

Esta pasta reúne **dados fixos** (constantes) usados pelo site. A ideia é que
você consiga ajustar textos, listas e imagens **sem precisar mexer na lógica
dos componentes** — basta editar os objetos destes arquivos.

## Importante: o que é "fonte oficial" e o que é "fallback"

A maior parte do conteúdo do site é gerenciada pelo **Painel Admin** (`/admin`),
que salva tudo no banco de dados (Firestore). Os arquivos desta pasta são
**fallback**: valores padrão que aparecem quando o banco ainda está vazio,
enquanto carrega, ou em caso de erro de conexão.

| Arquivo | O que controla | Fonte oficial (Admin) |
|---|---|---|
| `startups-fallback.ts` | Vitrine de startups da página `/startups` | `/admin/startups` |
| `equipe-fallback.ts` | Equipe mostrada em `/sobre` + botão "Importar equipe" | `/admin/equipe` |
| `parceiros-fallback.ts` | Logos de parceiros na Home (fallback) | `/admin/parceiros` |
| `navigation.ts` | Menu do topo e eventos fixos da Navbar | _(não há — edite aqui)_ |

## Como editar

- **Texto/links do menu:** edite `NAV_LINKS` em `navigation.ts`.
- **Equipe:** edite `EQUIPE_PADRAO` em `equipe-fallback.ts`. Fotos ficam na pasta
  `Fotos do Time NINNA/` (caminho começa com `/Fotos do Time NINNA/...`).
- **Startups da vitrine:** edite `NINNA_STARTUPS` em `startups-fallback.ts`.
  Logos ficam em `public/Startups/`.
- **Parceiros (fallback):** edite `PARCEIROS_FALLBACK`. Logos ficam em
  `public/Imagens_NINNA/`.

Depois de salvar, o site recarrega sozinho (em modo de desenvolvimento) e você
vê o resultado no navegador.
