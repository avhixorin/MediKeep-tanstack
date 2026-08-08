import { createFileRoute } from '@tanstack/react-router';
import { DashboardShell } from '@/components/layout/DashboardShell';

export const Route = createFileRoute('/admin/appointments')({
  component: AppointmentsPage,
});

function AppointmentsPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">All Appointments</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">View and manage all platform appointments</p>
        </div>
        {/* Appointments management content would go here */}
      </div>
    </DashboardShell>
  );
}
