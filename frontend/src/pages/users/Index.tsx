import { useList } from "@/hooks/useList"
import { ListHeader } from "@/components/list-header"
import { ListTable, type Column } from "@/components/list-table"
import type { User } from "@/types/user"

const ORDER = encodeURIComponent(JSON.stringify({ createdAt: 'desc' }))

// Admin only (the route and the API both check it). Read-only for now.
export default function UsersPage() {
  const { items, isLoading, error } = useList<User>({
    fetchUrl: `/user?pageSize=100&order=${ORDER}`,
    entityName: 'usuários',
  })

  const columns: Column<User>[] = [
    { key: 'email', label: 'Email' },
    { key: 'userType', label: 'Tipo', render: (value) => (value === 'ADMIN' ? 'Administrador' : 'Usuário') },
    { key: 'createdAt', label: 'Cadastrado em', render: (value) => new Date(value).toLocaleString('pt-BR') },
  ]

  return (
    <>
      <ListHeader title="Usuários" />
      <ListTable<User>
        columns={columns}
        items={items}
        isLoading={isLoading}
        error={error}
        emptyMessage="Nenhum usuário cadastrado"
        itemKey="id"
      />
    </>
  )
}
