// app/routes/dashboard/__layout.tsx
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/stores';

export const Route = createFileRoute('/dashboard/__layout')({
  beforeLoad: () => {
    const { isAuthenticated, isLoading } = useAuthStore.getState();
    
    // If not loading and not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.pathname,
        },
      });
    }
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  return <Outlet />;
}
