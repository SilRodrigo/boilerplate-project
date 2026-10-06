# Frontend

React + TypeScript + Vite + Tailwind + Shadcn.

## Rodando

Pela raiz do monorepo, `npm run dev` sobe backend e frontend juntos. Só o frontend:

```bash
npm run dev --workspace frontend
```

## Configuração

As variáveis ficam em `frontend/.env` (veja [.env.example](.env.example)). Todas são opcionais.

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `VITE_API_URL` | `/api/v1` | URL base da API. Defina quando a API estiver em outro domínio. |
| `VITE_API_PROXY_TARGET` | `http://localhost:4000` | Para onde o servidor de dev do Vite encaminha `/api`. |

Em desenvolvimento o Vite faz proxy de `/api` para o backend, então o front chama a API na mesma origem e não depende de CORS. Em produção, sirva o front e a API no mesmo domínio (ex.: nginx com `/api` apontando para o backend) ou defina `VITE_API_URL`.

## Estrutura

```
src/
├── components/
│   ├── ui/            # componentes Shadcn
│   ├── forms/         # BaseForm e formulários
│   ├── list-header.tsx
│   └── list-table.tsx
├── config/            # menuOptions
├── contexts/          # AuthContext
├── hooks/             # useAuth, useApi, useList, useAdminAccess
├── lib/               # api.ts (URL base), utils
├── pages/             # páginas por rota
└── types/
```

## Autenticação

- `AuthProvider` envolve o app e expõe `useAuth()` (de `@/contexts/AuthContext`): `user`, `isAuthenticated`, `login`, `logout`, `getAuthHeader`.
- O login chama `POST /user/auth` e guarda token e usuário no `localStorage`. Ao recarregar a página, a sessão é validada em `GET /user/me`.
- Rotas privadas ficam dentro de `<PrivateRoute>` em `App.tsx`.
- `useApi()` já envia o token. Se a API responder 401, a sessão é encerrada e o usuário volta para `/login`.
- `useAdminAccess()` retorna `true` para usuários `ADMIN`. `ListHeader` e `ListTable` usam isso para esconder ações de criação, edição e exclusão.

Sempre use o `useAuth` do contexto (`@/contexts/AuthContext`). O de `@/hooks/useAuth` cria um estado separado e só deve ser usado pelo `AuthProvider`.

## Chamando a API

```tsx
const api = useApi()

const { data } = await api('/example')
await api('/example', { method: 'POST', body: JSON.stringify({ name: 'Novo' }) })
```

## Criando uma página de CRUD

O fluxo usa três peças: `useList` (dados e ações), `ListHeader` + `ListTable` (tela) e `BaseForm` (modal de formulário).

### Formulário

```tsx
import { BaseForm } from "@/components/forms/BaseForm"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Example {
  id?: string
  name: string
}

interface ExampleFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Example) => Promise<void>
  initialData?: Example
}

export function ExampleForm({ open, onClose, onSubmit, initialData }: ExampleFormProps) {
  return (
    <BaseForm<Example>
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      initialData={initialData || { name: '' }}
      title={initialData ? 'Editar exemplo' : 'Novo exemplo'}
    >
      {(formData, setFormData) => (
        <div className="grid gap-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
      )}
    </BaseForm>
  )
}
```

`BaseForm` cuida do estado do formulário, do loading no envio, dos botões Cancelar/Salvar e de fechar o modal após salvar.

### Página

```tsx
import { useState } from "react"
import { useList } from "@/hooks/useList"
import { ListHeader } from "@/components/list-header"
import { ListTable, type Column } from "@/components/list-table"
import { ExampleForm } from "@/components/forms/example"

export default function ExamplesPage() {
  const { items, isLoading, error, selectedItem, setSelectedItem, handleCreate, handleUpdate, handleDelete } =
    useList<Example>({ fetchUrl: '/example', entityName: 'exemplo' })

  const [formOpen, setFormOpen] = useState(false)

  const columns: Column<Example>[] = [
    { key: 'name', label: 'Nome' },
  ]

  const openCreate = () => { setSelectedItem(undefined); setFormOpen(true) }
  const openEdit = (item: Example) => { setSelectedItem(item); setFormOpen(true) }

  const onSubmit = (data: Example) => selectedItem
    ? handleUpdate(data, `/example/${selectedItem.id}`, 'Exemplo atualizado!')
    : handleCreate(data, '/example', 'Exemplo criado!')

  return (
    <>
      <ListHeader title="Exemplos" onCreate={openCreate} newButtonLabel="Novo exemplo" />
      <ListTable<Example>
        columns={columns}
        items={items}
        isLoading={isLoading}
        error={error}
        emptyMessage="Nenhum exemplo cadastrado"
        itemKey="id"
        onEdit={openEdit}
        onDelete={(id) => handleDelete(id, `/example/${id}`, 'Exemplo excluído!')}
      />
      <ExampleForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={onSubmit} initialData={selectedItem} />
    </>
  )
}
```

Depois registre a rota em `App.tsx` (dentro de `<PrivateRoute>`) e, se quiser, adicione a página em `src/config/menuOptions.ts`.

- `useList` busca a lista em `fetchUrl`, guarda o item selecionado, mostra toasts de sucesso e erro e recarrega a lista após criar, editar ou excluir.
- `ListTable` aceita `render` por coluna para formatar valores e `rowActions` para ações extras por linha.
- `ListHeader` aceita `headerActions` para botões extras no cabeçalho.
