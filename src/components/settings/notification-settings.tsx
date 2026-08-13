import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/hooks/useSettings';

const TOGGLES = [
  { key: 'isEnabled', label: 'Enable Notifications', description: 'Master switch for all notifications.' },
  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email.' },
  { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser push notifications.' },
  { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive text message updates.' },
  { key: 'promotionalEmails', label: 'Promotional Emails', description: 'Get news, tips and special offers.' },
  { key: 'notificationSound', label: 'Notification Sound', description: 'Play a sound when a notification arrives.' },
  { key: 'weeklyDigest', label: 'Weekly Digest', description: 'A weekly summary of your account activity.' },
] as const;

type NotificationKey = (typeof TOGGLES)[number]['key'];

export function NotificationSettings() {
  const { prefs, updatePreference } = useSettings();
  const notifications = prefs.notifications ?? {};

  const handleToggle = (key: NotificationKey, value: boolean) => {
    updatePreference('notifications', { [key]: value });
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-medium">Notifications</h2>
        <p className="text-sm text-muted-foreground">
          Choose what notifications you receive.
        </p>
      </section>

      <div className="space-y-6">
        {TOGGLES.map((toggle) => (
          <div key={toggle.key} className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>{toggle.label}</Label>
              <p className="text-sm text-muted-foreground">
                {toggle.description}
              </p>
            </div>
            <Switch
              checked={notifications[toggle.key] ?? false}
              onCheckedChange={(value) => handleToggle(toggle.key, value)}
              aria-label={toggle.label}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
