import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/patients/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/patients/"!</div>
}
