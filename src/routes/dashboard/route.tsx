import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ location }) => {
    const { user } = useAuthStore.getState()

    console.log('Dashboard auth check:', user)

    if (!user) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.pathname,
        },
      })
    }
  },

  component: DashboardLayout,
})

function DashboardLayout() {
  return <Outlet />
}