import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/users')({
  component: UsersComponent,
})

function UsersComponent() {
  return <div>User Management Page (Coming Soon)</div>
}
