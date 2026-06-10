# Guia do desenvolvedor — NINNA Hub

Este guia é para quem vai **alterar o código** do site. Ele assume que você já
conseguiu rodar o projeto (veja o [README](README.md)). O objetivo é que mesmo
quem está começando consiga fazer mudanças com segurança.

## Regras de ouro

1. **Sempre rode `npm run lint` antes de finalizar.** Ele aponta erros de tipo
   sem precisar abrir o navegador. Se passar limpo, você não quebrou os tipos.
2. **Faça uma mudança por vez** e confira no navegador (`npm run dev`).
3. **Não mude a forma dos dados no Firestore** sem necessidade — outras telas
   podem depender dos mesmos campos.
4. **Conteúdo do site se edita pelo Painel Admin** (`/admin`), não no código.

---

## Conceitos principais

### 1. Tipos das coleções — `src/types/firestore.ts`

Cada "coisa" salva no banco (Startup, Evento, Parceiro...) tem um tipo. Use o
tipo no lugar de `any` para ganhar autocomplete e checagem de erros.

```ts
import type { Startup } from '../types';
```

### 2. CRUD do Firestore — `src/hooks/useFirestoreCollection.ts`

Em vez de copiar o código de buscar/criar/editar/excluir em cada tela, use o
hook. Ele já cuida de `loading`, mensagens de sucesso/erro e recarregar a lista.

```ts
const { items, loading, create, update, remove } =
  useFirestoreCollection<Startup>({
    collectionName: 'startups',     // nome da coleção no Firestore
    orderByField: 'createdAt',      // campo de ordenação
    orderDirection: 'desc',
    successLabels: {
      create: 'Startup cadastrada com sucesso',
      update: 'Startup atualizada com sucesso',
      delete: 'Startup excluída',
    },
  });
```

### 3. Conteúdo fixo — `src/data/`

Menu, equipe padrão e listas de fallback. Editável sem mexer em lógica.
Veja [`src/data/README.md`](src/data/README.md).

---

## Receita: adicionar uma nova tela de Admin (CRUD)

Suponha que você queira gerenciar "Depoimentos" (coleção `depoimentos`).

**Passo 1 — Adicione o tipo** em `src/types/firestore.ts`:

```ts
/** Coleção: `depoimentos` */
export interface Depoimento extends BaseDoc {
  autor: string;
  texto: string;
  status: Status;
}
```

**Passo 2 — Crie a página** em `src/pages/Admin/Depoimentos.tsx`. Copie uma tela
parecida já existente (ex: `src/pages/Admin/Premiacoes.tsx`) como ponto de partida
e troque pelo seu tipo/coleção:

```tsx
import React, { useState } from 'react';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import type { Depoimento } from '../../types';

const AdminDepoimentos = () => {
  const { items, loading, create, update, remove } =
    useFirestoreCollection<Depoimento>({
      collectionName: 'depoimentos',
      orderByField: 'createdAt',
      orderDirection: 'desc',
      successLabels: {
        create: 'Depoimento criado',
        update: 'Depoimento atualizado',
        delete: 'Depoimento excluído',
      },
    });

  const [editingItem, setEditingItem] = useState<Depoimento | null>(null);
  const [formData, setFormData] = useState({ autor: '', texto: '', status: 'ativo' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await update(editingItem.id, formData);
    } else {
      await create(formData);
    }
    // fechar modal / limpar formulário aqui
  };

  const handleDelete = (id: string) => {
    remove(id, 'Tem certeza que deseja excluir este depoimento?');
  };

  // ...JSX: lista `items`, formulário, botões...
};

export default AdminDepoimentos;
```

**Passo 3 — Registre a rota** em `src/App.tsx`. Primeiro importe a página no topo
do arquivo (junto dos outros `import Admin...`):

```tsx
import AdminDepoimentos from './pages/Admin/Depoimentos';
```

Depois adicione a rota junto das outras de admin, seguindo **exatamente** o mesmo
padrão (envolvida por `AdminProtectedRoute` + `AdminLayout`):

```tsx
<Route path="/admin/depoimentos" element={<AdminProtectedRoute><AdminLayout><AdminDepoimentos /></AdminLayout></AdminProtectedRoute>} />
```

**Passo 4 — Adicione o link** no menu lateral do admin
(`src/components/layout/AdminSidebar.tsx`).

**Passo 5 — Valide:** rode `npm run lint`, abra `/admin/depoimentos` e teste
criar, editar e excluir.

---

## Casos que NÃO usam o hook (e por quê)

Algumas telas têm comportamento especial e propositalmente **não** usam o
`useFirestoreCollection`:

- **`Admin/Treinamentos.tsx`** — após criar, navega para a tela de aulas usando o
  ID do documento recém-criado.
- **`Admin/Aulas.tsx`** — usa uma _subcoleção_ (`treinamentos/{id}/aulas`).
- **`Admin/Usuarios.tsx`** — cria contas de autenticação (login/senha).
- **`Admin/KPIs.tsx`** — edita um único documento de configuração (`kpis/main`),
  não uma lista.

Nesses casos, melhore a tipagem mas mantenha a lógica específica.
