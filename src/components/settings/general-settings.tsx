import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AvatarUploadModal } from '@/components/settings/avatar-upload-modal';
import { useSettings } from '@/hooks/useSettings';
import type { User } from '@/types';
import { Camera, Pencil, Save, X } from 'lucide-react';

const FIELDS: Array<{ key: keyof Pick<User, 'firstName' | 'lastName' | 'username' | 'email' | 'phone' | 'about'>; label: string }> = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'about', label: 'About' },
];

export function GeneralSettings() {
  const { user, prefs, updatePreference, updateProfile } = useSettings();
  const { resolvedTheme, setTheme } = useTheme();

  const [form, setForm] = useState<Partial<User>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        about: user.about ?? '',
      });
    }
  }, [user]);

  const isDark = resolvedTheme === 'dark';
  const isPrivate = prefs.general?.accountPrivacy === 'Private';

  const handleSave = (key: (typeof FIELDS)[number]['key']) => {
    updateProfile({ [key]: form[key] ?? '' });
    setEditing(null);
  };

  return (
    <div className="space-y-8">
      {isUploadOpen && (
        <AvatarUploadModal onClose={() => setIsUploadOpen(false)} />
      )}

      <section>
        <h2 className="text-lg font-medium">General</h2>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </section>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setIsUploadOpen(true)}
          className="group relative"
          aria-label="Change profile picture"
        >
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.profilePicture} alt={user?.firstName} />
            <AvatarFallback className="bg-primary/15 text-primary">
              {user?.firstName[0]}
              {user?.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera className="h-5 w-5 text-white" />
          </span>
        </button>
        <div>
          <p className="font-semibold">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-sm text-muted-foreground">@{user?.username}</p>
          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="mt-1 text-sm font-medium text-primary hover:underline"
          >
            Change photo
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {FIELDS.map((field) => {
          const isEditing = editing === field.key;
          return (
            <div
              key={field.key}
              className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
            >
              <div className="min-w-0 flex-1">
                <Label>{field.label}</Label>
                {isEditing ? (
                  <Input
                    value={form[field.key] ?? ''}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    className="mt-1 max-w-md"
                  />
                ) : (
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {form[field.key] || 'Not set'}
                  </p>
                )}
              </div>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSave(field.key)}
                  >
                    <Save className="mr-1 h-3.5 w-3.5" />
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditing(null)}
                  >
                    <X className="mr-1 h-3.5 w-3.5" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(field.key)}
                >
                  <Pencil className="mr-1 h-3.5 w-3.5" />
                  Edit
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-md font-medium">Preferences</h3>
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">Light / Dark</p>
            </div>
            <Switch
              checked={isDark}
              onCheckedChange={() => {
                const next = isDark ? 'light' : 'dark';
                setTheme(next);
                updatePreference('general', { theme: next });
              }}
              aria-label="Toggle dark mode"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Account Privacy</Label>
              <p className="text-sm text-muted-foreground">Public / Private</p>
            </div>
            <Switch
              checked={isPrivate}
              onCheckedChange={() =>
                updatePreference('general', {
                  accountPrivacy: isPrivate ? 'Public' : 'Private',
                })
              }
              aria-label="Toggle account privacy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
