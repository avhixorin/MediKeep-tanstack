import { createFileRoute } from '@tanstack/react-router'
import { DashboardShell } from '@/components/layout'
import { SettingsNav } from '@/components/settings/settings-nav'
import { SettingsSearch } from '@/components/settings/settings-search'
import { GeneralSettings } from '@/components/settings/general-settings'
import { SecuritySettings } from '@/components/settings/security-settings'
import { NotificationSettings } from '@/components/settings/notification-settings'
import { BillingSettings } from '@/components/settings/billing-settings'
import { useAuthStore } from '@/stores'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { useEffect, useRef, useState } from 'react'
import { Bell, CreditCard, Search, Settings, Shield, SlidersHorizontal } from 'lucide-react'

export const Route = createFileRoute('/dashboard/settings/')({
  component: SettingsPage,
})

const NAV_ITEMS = [
  { id: 'general', label: 'General', icon: SlidersHorizontal },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'billing', label: 'Billing', icon: CreditCard },
]

function SettingsPage() {
  const { user } = useAuthStore();
  const [active, setActive] = useState('general');
  const [search, setSearch] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <DashboardShell className="mx-auto w-full max-w-3xl">
      {search.trim().length > 0 && (
        <SettingsSearch
          searchText={search}
          setSearch={setSearch}
          onNavigate={(id) => setActive(id)}
        />
      )}

      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-semibold">
            <Settings className="h-5 w-5 text-primary" />
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your account, security and preferences.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="Search settings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56 pl-8"
            />
          </div>
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.profilePicture} alt={user?.firstName} />
            <AvatarFallback className="bg-primary/15 text-primary">
              {user?.firstName[0]}
              {user?.lastName[0]}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <SettingsNav
        items={NAV_ITEMS}
        active={active}
        onChange={setActive}
        className="mt-4"
      />

      <main className="py-6">
        {active === 'general' && <GeneralSettings />}
        {active === 'security' && <SecuritySettings />}
        {active === 'notifications' && <NotificationSettings />}
        {active === 'billing' && <BillingSettings />}
      </main>
    </DashboardShell>
  );
}
