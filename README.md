# NINNA Hub — Site institucional

Site do NINNA Hub: páginas públicas (institucional, startups, eventos, parceiros)
e um **Painel Admin** (`/admin`) para gerenciar o conteúdo, além de uma **área de
membros** (`/dashboard`).

**Stack:** React 19 + Vite + TypeScript • Tailwind CSS • Firebase (Auth + Firestore
+ Storage) • Express (servidor) • React Router.

---

## Rodando o projeto localmente

**Pré-requisitos:** [Node.js](https://nodejs.org/) 18 ou superior.

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev
```

Abra **http://localhost:3000** no navegador. As alterações no código recarregam
a página automaticamente (hot reload).

### Scripts disponíveis

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe o site em modo desenvolvimento (porta 3000) |
| `npm run lint` | Verifica erros de TypeScript (`tsc --noEmit`) — rode antes de subir mudanças |
| `npm run build` | Gera a versão de produção em `dist/` |
| `npm run start` | Sobe o servidor servindo a build de produção |

### Configuração do Firebase

A conexão com o Firebase fica em `firebase-applet-config.json` (na raiz) e é
inicializada em [`src/lib/firebase.ts`](src/lib/firebase.ts), que exporta `auth`,
`db` (Firestore) e `storage`. As regras de acesso ao banco estão em
[`firestore.rules`](firestore.rules).

---

## Como o projeto está organizado

```
src/
├── App.tsx                  # Rotas do site (públicas, admin, membros)
├── main.tsx                 # Ponto de entrada do React
├── components/
│   ├── layout/              # Navbar, Footer, AdminLayout, AdminSidebar
│   └── ...
├── contexts/
│   └── AuthContext.tsx      # Login e permissões (admin/editor/usuário)
├── hooks/
│   └── useFirestoreCollection.ts  # CRUD reutilizável do Firestore (ver abaixo)
├── types/
│   └── firestore.ts         # Tipos de cada coleção (Startup, Evento, etc.)
├── data/                    # Conteúdo fixo editável (ver src/data/README.md)
├── lib/
│   ├── firebase.ts          # Inicialização do Firebase
│   └── firestore-errors.ts  # Tratamento padronizado de erros
└── pages/
    ├── Admin/               # Telas do Painel Admin (/admin/...)
    └── *.tsx                # Páginas públicas e da área de membros

components/ui/               # Componentes visuais base (shadcn/ui) — na raiz
public/                      # Imagens e arquivos estáticos
```

> 📖 **Guia para desenvolvedores:** veja [`CONTRIBUTING.md`](CONTRIBUTING.md) para
> a "receita" de como adicionar uma nova tela admin, editar conteúdo e os padrões
> do projeto.

---

## Editando o conteúdo do site

A **forma oficial** de editar conteúdo (startups, eventos, parceiros, equipe,
benefícios, etc.) é pelo **Painel Admin** em `/admin` — tudo é salvo no banco
(Firestore), sem precisar mexer no código.

Alguns dados fixos (menu, lista de fallback) ficam em arquivos editáveis na pasta
[`src/data/`](src/data/) — veja [`src/data/README.md`](src/data/README.md).
