import { createFileRoute } from '@tanstack/react-router';
import { DashboardShell } from '@/components/layout/DashboardShell';

export const Route = createFileRoute('/admin/patients')({
  component: PatientsPage,
});

function PatientsPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">All Patients</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">View and manage all registered patients</p>
        </div>
        {/* Patients management content would go here */}
      </div>
    </DashboardShell>
  );
}
