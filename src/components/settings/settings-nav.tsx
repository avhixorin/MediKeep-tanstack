import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface SettingsNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SettingsNavProps {
  items: SettingsNavItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function SettingsNav({
  items,
  active,
  onChange,
  className,
}: SettingsNavProps) {
  return (
    <nav
      className={cn(
        'flex space-x-2 overflow-x-auto border-b border-border px-4 md:px-6',
        className
      )}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              'flex items-center gap-2 whitespace-nowrap border-b-2 py-3 text-sm font-medium transition-colors',
              isActive
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
