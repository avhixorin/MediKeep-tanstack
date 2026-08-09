import { Link } from '@tanstack/react-router';
import { Search, Bell, ChevronLeft, ChevronRight, LucideBedDouble, ArrowRightFromLine, ArrowBigRight } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore, useUIStore } from '@/stores';
import { MobileSidebar } from './Sidebar';
import ThemeToggle from '../ui/theme-toggle';

export function TopBar() {
  const { user } = useAuthStore();
  const { unreadNotificationsCount, isSidebarCollapsed, toggleSidebar } = useUIStore();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 lg:px-8">
      <div className="flex items-center">
        <MobileSidebar />
        <nav className="hidden text-sm text-muted-foreground lg:block">
          <ol className="flex items-center justify-center gap-2">
            <button
              onClick={toggleSidebar}
              className="rounded-md cursor-pointer mb-1 mr-2"
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? (
                <span className='text-2xl'>»</span>
              ) : (
                <span className='text-2xl'>«</span>
              )}
            </button>
            <li>
              <Link to="/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
            </li>
            <li className="text-muted-foreground">/</li>
            <li className="text-foreground">Overview</li>
          </ol>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-64 rounded-md border border-input bg-background pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <button className="relative rounded-md p-2 hover:bg-accent">
          <Bell className="h-5 w-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger-500 text-[10px] font-medium text-white">
              {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
            </span>
          )}
        </button>

        <ThemeToggle />
        {/* User Menu */}
        <Link
          to="/dashboard/profile"
          className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.profilePicture} alt={user?.firstName} />
            <AvatarFallback className="bg-primary-100 text-primary-600 text-sm">
              {user?.firstName[0] || 'U'}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
