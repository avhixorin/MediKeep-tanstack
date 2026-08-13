import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '@/hooks/useSettings';
import { useState } from 'react';
import { toast } from 'sonner';

export function BillingSettings() {
  const { prefs } = useSettings();
  const [cardNumber, setCardNumber] = useState('');

  const plan = prefs.billing?.plan ?? 'Free';
  const billingHistory = prefs.billing?.billingHistory ?? [];

  const handleUpdatePayment = () => {
    if (!cardNumber.trim()) {
      toast.error('Please enter a card number');
      return;
    }
    toast.success('Payment method updated (demo)');
    setCardNumber('');
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-medium">Billing</h2>
        <p className="text-sm text-muted-foreground">
          Manage your plan and payment details.
        </p>
      </section>

      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-md font-medium">Current Plan</h3>
          <p className="text-sm text-muted-foreground">
            You are on the{' '}
            <strong className="text-foreground">{plan}</strong> plan.
          </p>
          <div className="flex items-center gap-2">
            <Badge variant={plan === 'Premium' ? 'default' : 'secondary'}>
              {plan}
            </Badge>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                toast.info('Plan changes are handled by an admin (demo)')
              }
            >
              Change Plan
            </Button>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-md font-medium">Payment Method</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add or update the card used for your subscription.
          </p>
          <div className="mt-4 max-w-md space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                type="text"
                inputMode="numeric"
                placeholder="•••• •••• •••• ••••"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>
            <Button size="sm" onClick={handleUpdatePayment}>
              Update Payment Method
            </Button>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-md font-medium">Billing History</h3>
          {billingHistory.length > 0 ? (
            <div className="mt-4 space-y-2">
              {billingHistory.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md border px-4 py-2 text-sm"
                >
                  <span>{new Date(entry.date).toLocaleDateString()}</span>
                  <span>${entry.amount}</span>
                  <Badge variant="secondary">{entry.status}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              No billing history yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
