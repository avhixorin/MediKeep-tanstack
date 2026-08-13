import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/hooks/useSettings';
import { useAuth } from '@/hooks';
import { X } from 'lucide-react';
import { toast } from 'sonner';

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-md dark:bg-slate-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 transition-colors hover:text-red-500 dark:text-slate-400"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="mb-4 text-lg font-semibold">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export function SecuritySettings() {
  const { prefs, updatePreference } = useSettings();
  const { updatePassword, deleteAccount, isDeleteAccountPending } = useAuth();

  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  const twoFactorAuth = prefs.security?.twoFactorAuth ?? false;
  const isAccountActive = prefs.security?.isAccountActive ?? true;

  const handlePasswordUpdate = () => {
    if (!oldPassword || !newPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    updatePassword({ oldPassword, newPassword });
    setIsPasswordOpen(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = () => {
    if (!deletePassword) {
      toast.error('Please enter your password');
      return;
    }
    deleteAccount(deletePassword);
    setDeletePassword('');
  };

  return (
    <div className="space-y-8">
      {isPasswordOpen && (
        <Modal title="Change Password" onClose={() => setIsPasswordOpen(false)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="old-password">Current Password</Label>
              <Input
                id="old-password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            <Button className="w-full" onClick={handlePasswordUpdate}>
              Update Password
            </Button>
          </div>
        </Modal>
      )}

      {isDeleteOpen && (
        <Modal title="Delete Account" onClose={() => setIsDeleteOpen(false)}>
          <p className="mb-4 text-sm text-muted-foreground">
            This action is permanent and cannot be undone. Enter your password
            to confirm.
          </p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="delete-password">Password</Label>
              <Input
                id="delete-password"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <Button
              variant="destructive"
              className="w-full"
              disabled={isDeleteAccountPending}
              onClick={handleDeleteAccount}
            >
              {isDeleteAccountPending ? 'Deleting...' : 'Delete Account'}
            </Button>
          </div>
        </Modal>
      )}

      <section>
        <h2 className="text-lg font-medium">Security</h2>
        <p className="text-sm text-muted-foreground">
          Manage your password and account safety.
        </p>
      </section>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Two-Factor Authentication</Label>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account.
            </p>
          </div>
          <Switch
            checked={twoFactorAuth}
            onCheckedChange={() =>
              updatePreference('security', { twoFactorAuth: !twoFactorAuth })
            }
            aria-label="Toggle two-factor authentication"
          />
        </div>

        <div className="space-y-2">
          <div className="space-y-1">
            <Label>Password</Label>
            <p className="text-sm text-muted-foreground">
              Choose a strong, unique password for your account.
            </p>
          </div>
          <Button size="sm" onClick={() => setIsPasswordOpen(true)}>
            Change Password
          </Button>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-md font-medium">Account</h3>
          <div className="mt-4 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Account Status</Label>
                <p className="text-sm text-muted-foreground">
                  Deactivate your account temporarily.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updatePreference('security', {
                    isAccountActive: !isAccountActive,
                  })
                }
              >
                {isAccountActive ? 'Deactivate' : 'Activate'}
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data.
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleteOpen(true)}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
