// app/routes/admin/__layout.tsx
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/stores';

export const Route = createFileRoute('/admin/__layout')({
  beforeLoad: () => {
    const { user, isAuthenticated } = useAuthStore.getState();
    
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
      });
    }
    
    if (user?.role !== 'superAdmin') {
      throw redirect({
        to: '/dashboard',
      });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return <Outlet />;
}
