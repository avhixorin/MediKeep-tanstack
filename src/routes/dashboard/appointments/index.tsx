import { DashboardShell } from '#/components/layout';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import { Card, CardContent } from '#/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '#/components/ui/tabs';
import { useSocketEmitters } from '#/hooks/useSocket';
import { useAuthStore } from '#/stores/authStore';
import { AppointmentStatus } from '#/types';
import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  Stethoscope,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';

export const Route = createFileRoute('/dashboard/appointments/')({
  component: AppointmentsPage,
});

function AppointmentsPage() {
  const {
    acceptAppointment,
    declineAppointment,
    cancelAppointment,
  } = useSocketEmitters();

  const [activeTab, setActiveTab] = useState('upcoming');

  const { user } = useAuthStore();

  const appointments = user?.appointments ?? [];

  console.log(appointments, 'appointments');

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const formatDate = (date: string) => {
    if (!date) return 'N/A';

    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getMonth = (date: string) => {
    if (!date) return '';

    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
    });
  };

  const getDay = (date: string) => {
    if (!date) return '';

    return new Date(date).getDate();
  };

  const formatTime = (time: string) => {
    if (!time) return 'N/A';

    const [hours, minutes] = time.split(':').map(Number);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes)
    ) {
      return time;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatStatus = (status: string) => {
    if (!status) return 'Unknown';

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
      case 'scheduled':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Scheduled
          </Badge>
        );

      case AppointmentStatus.REQUESTED:
      case 'requested':
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Pending
          </Badge>
        );

      case AppointmentStatus.COMPLETED:
      case 'completed':
        return (
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
            Completed
          </Badge>
        );

      case AppointmentStatus.CANCELLED:
      case 'cancelled':
        return (
          <Badge variant="destructive">
            Cancelled
          </Badge>
        );

      case AppointmentStatus.RESCHEDULED:
      case 'rescheduled':
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
            Rescheduled
          </Badge>
        );

      default:
        return <Badge>{formatStatus(status)}</Badge>;
    }
  };

  const filteredAppointments = useMemo(() => {
    switch (activeTab) {
      case 'upcoming':
        return appointments.filter(
          (appointment) =>
            appointment.status === AppointmentStatus.SCHEDULED  ||
            appointment.status === AppointmentStatus.REQUESTED   ||
            appointment.status === AppointmentStatus.RESCHEDULED 
        );

      case 'completed':
        return appointments.filter(
          (appointment) =>
            appointment.status === AppointmentStatus.COMPLETED 
        );

      case 'cancelled':
        return appointments.filter(
          (appointment) =>
            appointment.status === AppointmentStatus.CANCELLED
        );

      case 'all':
      default:
        return appointments;
    }
  }, [appointments, activeTab]);

  const scheduledCount = appointments.filter(
    (appointment) =>
      appointment.status === AppointmentStatus.SCHEDULED 
  ).length;

  const pendingCount = appointments.filter(
    (appointment) =>
      appointment.status === AppointmentStatus.REQUESTED
  ).length;

  const completedCount = appointments.filter(
    (appointment) =>
      appointment.status === AppointmentStatus.COMPLETED
  ).length;

  return (
    <DashboardShell>
      <div className="space-y-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Appointments
            </h1>

            <p className="mt-1 text-slate-600 dark:text-slate-400">
              Manage your healthcare appointments
            </p>
          </div>

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Book Appointment
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Calendar className="h-6 w-6" />
              </div>

              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Total
                </p>

                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {appointments.length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>

              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Scheduled
                </p>

                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {scheduledCount}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                <Clock className="h-6 w-6" />
              </div>

              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Pending
                </p>

                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {pendingCount}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <CheckCircle className="h-6 w-6" />
              </div>

              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Completed
                </p>

                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {completedCount}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming
            </TabsTrigger>

            <TabsTrigger value="completed">
              Completed
            </TabsTrigger>

            <TabsTrigger value="cancelled">
              Cancelled
            </TabsTrigger>

            <TabsTrigger value="all">
              All
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value={activeTab}
            className="mt-6"
          >
            <div className="space-y-4">

              {filteredAppointments.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-300" />

                    <p className="text-slate-500">
                      No appointments found
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredAppointments.map(
                  (appointment, index) => (
                    <motion.div
                      key={appointment._id}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.1,
                      }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">

                            <div className="flex items-center gap-4 lg:w-56">
                              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-primary-50">
                                <span className="text-xs font-medium uppercase text-primary-600">
                                  {getMonth(appointment.date)}
                                </span>

                                <span className="text-xl font-bold text-primary-600">
                                  {getDay(appointment.date)}
                                </span>
                              </div>

                              <div>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                  {formatDate(appointment.date)}
                                </p>

                                <div className="mt-1 flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                                  <Clock className="h-4 w-4" />
                                  {formatTime(appointment.time)}
                                </div>
                              </div>
                            </div>

                            <div className="flex-1">

                              <div className="flex items-center gap-2">
                                <Stethoscope className="h-5 w-5 text-primary-600" />

                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                  {appointment.doctor.firstName} {appointment.doctor.lastName}
                                </h3>
                              </div>

                              <p className="mt-1 text-xs text-slate-400">
                                Appointment ID: {appointment._id}
                              </p>
                            </div>

                            <div className="lg:w-48">
                              <p className="text-xs font-medium uppercase text-slate-400">
                                Reason
                              </p>

                              <p className="mt-1 font-medium text-slate-700 dark:text-slate-300">
                                {appointment.reason || 'General consultation'}
                              </p>
                            </div>

                            <div className="flex items-center gap-4">
                              {getStatusBadge(appointment.status)}

                              {(appointment.status === AppointmentStatus.SCHEDULED) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    cancelAppointment(
                                      appointment._id
                                    )
                                  }
                                >
                                  <XCircle className="h-4 w-4 text-danger-500" />
                                </Button>
                              )}

                              {(appointment.status === AppointmentStatus.REQUESTED) && (
                                <div className="flex gap-2">

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      acceptAppointment(
                                        appointment._id
                                      )
                                    }
                                  >
                                    <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                                    Accept
                                  </Button>

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      declineAppointment(
                                        appointment._id
                                      )
                                    }
                                  >
                                    <XCircle className="h-4 w-4 text-danger-500" />
                                  </Button>

                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                )
              )}

            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}