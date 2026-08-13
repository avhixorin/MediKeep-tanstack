import { createFileRoute } from '@tanstack/react-router';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ConnectedEntityGrid } from '@/components/records/ConnectedEntityGrid';

export const Route = createFileRoute('/dashboard/doctors/')({
  component: DoctorsPage,
});

function DoctorsPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Doctors</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Doctors you're clinically connected with
          </p>
        </div>

        <ConnectedEntityGrid title="View Records" />
      </div>
    </DashboardShell>
  );
}
