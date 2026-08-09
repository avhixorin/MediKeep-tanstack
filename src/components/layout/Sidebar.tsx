import { Link, useLocation } from '@tanstack/react-router';
import { 
  Home, 
  MessageSquare, 
  Calendar, 
  FileText, 
  Users, 
  Activity,
  Settings,
  User,
  ChevronLeft,
  Menu,
  LogOut,
  Stethoscope,
  Shield,
  Database,
  ClipboardList
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore, useUIStore } from '@/stores';
import { useAuth } from '@/hooks';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types';
import { useState } from 'react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: Home, roles: ['patient', 'doctor', 'superAdmin'] },
  { label: 'Chat', path: '/dashboard/chat', icon: MessageSquare, roles: ['patient', 'doctor'] },
  { label: 'Appointments', path: '/dashboard/appointments', icon: Calendar, roles: ['patient', 'doctor', 'superAdmin'] },
  { label: 'Medical Records', path: '/dashboard/records', icon: FileText, roles: ['patient', 'doctor'] },
  { label: 'Health Vitals', path: '/dashboard/vitals', icon: Activity, roles: ['patient'] },
  { label: 'Doctors', path: '/dashboard/doctors', icon: Stethoscope, roles: ['patient'] },
  { label: 'Patients', path: '/dashboard/patients', icon: Users, roles: ['doctor'] },
  { label: 'Profile', path: '/dashboard/profile', icon: User, roles: ['patient', 'doctor', 'superAdmin'] },
  { label: 'Settings', path: '/dashboard/settings', icon: Settings, roles: ['patient', 'doctor', 'superAdmin'] },
];

const adminNavItems: NavItem[] = [
  { label: 'Admin Dashboard', path: '/admin', icon: Shield, roles: ['superAdmin'] },
  { label: 'Users', path: '/admin/users', icon: Users, roles: ['superAdmin'] },
  { label: 'Patients', path: '/admin/patients', icon: Database, roles: ['superAdmin'] },
  { label: 'Doctors', path: '/admin/doctors', icon: Stethoscope, roles: ['superAdmin'] },
  { label: 'All Appointments', path: '/admin/appointments', icon: ClipboardList, roles: ['superAdmin'] },
];

export function Sidebar() {
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const location = useLocation();
  const role = user?.role || 'patient';

  const filteredNavItems = navItems.filter((item) => item.roles.includes(role));
  const filteredAdminItems = adminNavItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-background transition-all duration-300',
        isSidebarCollapsed ? 'w-16' : 'w-70'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isSidebarCollapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary-600">Medikeep</span>
          </Link>
        )}
        {isSidebarCollapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
        )}
        {!isSidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="rounded-md p-1 hover:bg-accent"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className={cn(
        'border-b p-4',
        isSidebarCollapsed && 'px-2'
      )}>
        <div className={cn(
          'flex items-center gap-3',
          isSidebarCollapsed && 'flex-col'
        )}>
          <Avatar className={cn(
            'h-10 w-10',
            isSidebarCollapsed && 'h-8 w-8'
          )}>
            <AvatarImage src={user?.profilePicture} alt={user?.firstName} />
            <AvatarFallback className="bg-primary-100 text-primary-600">
              {user?.firstName[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          {!isSidebarCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-medium">{user?.firstName}</p>
              <p className="truncate text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                           (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                  isActive 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  isSidebarCollapsed && 'justify-center px-2'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {role === 'superAdmin' && filteredAdminItems.length > 0 && (
          <>
            <div className={cn(
              'my-4 border-t',
              isSidebarCollapsed && 'mx-2'
            )} />
            <p className={cn(
              'mb-2 px-4 text-xs font-semibold text-muted-foreground',
              isSidebarCollapsed && 'px-2 text-center'
            )}>
              {!isSidebarCollapsed && 'Admin'}
              {isSidebarCollapsed && 'A'}
            </p>
            <div className="space-y-1 px-2">
              {filteredAdminItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                               (item.path !== '/admin' && location.pathname.startsWith(item.path));
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                      isActive 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                      isSidebarCollapsed && 'justify-center px-2'
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t p-4">
        <button
          onClick={() => logout()}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
            isSidebarCollapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="h-5 w-5" />
          {!isSidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export function MobileSidebar() {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const location = useLocation();
  const role = user?.role || 'patient';
  const [open, setOpen] = useState(false);

  const filteredNavItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="lg:hidden p-2 -ml-2 mr-2">
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent className="w-75 p-0">
        <div className="flex h-16 items-center border-b px-4">
          <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary-600">Medikeep</span>
          </Link>
        </div>

        <div className="border-b p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.profilePicture} alt={user?.firstName} />
              <AvatarFallback className="bg-primary-100 text-primary-600">
                {user?.firstName[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-medium">{user?.firstName}</p>
              <p className="truncate text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-2">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                             (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                    isActive 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t p-4">
          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
