import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useUIStore } from '@/stores';

interface DashboardShellProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardShell({ children, className }: DashboardShellProps) {
  const { isSidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-300',
          isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-70'
        )}
      >
        <TopBar />
        <main className={cn('p-4 lg:p-8', className)}>
          {children}
        </main>
      </div>
    </div>
  );
}
