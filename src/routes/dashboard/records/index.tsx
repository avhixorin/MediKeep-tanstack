import { createFileRoute } from '@tanstack/react-router';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ConnectedEntityGrid } from '@/components/records/ConnectedEntityGrid';
import { useAuthStore } from '@/stores';
import { UserRole } from '@/types';

export const Route = createFileRoute('/dashboard/records/')({
  component: RecordsPage,
});

function RecordsPage() {
  const { user } = useAuthStore();
  const isDoctor = user?.role === UserRole.DOCTOR;

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Records</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {isDoctor
              ? 'Select a patient to view and manage their shared medical records'
              : 'Select a doctor to view and manage your shared medical records'}
          </p>
        </div>

        <ConnectedEntityGrid title="Manage Records" />
      </div>
    </DashboardShell>
  );
}
