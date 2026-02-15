import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/intelligence')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/intelligence"!</div>
}
