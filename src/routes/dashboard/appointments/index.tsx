import { useState } from 'react';
import { DashboardShell } from '#/components/layout';
import { BookAppointmentModal } from '#/components/appointment/book-appointment-modal';
import { RescheduleModal } from '#/components/appointment/reschedule-modal';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import { Card, CardContent } from '#/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '#/components/ui/tabs';
import { useAppointments } from '#/hooks/useAppointments';
import { useAuthStore } from '#/stores/authStore';
import { AppointmentStatus } from '#/types';
import type { Appointment } from '#/types';
import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  Stethoscope,
  User,
  XCircle,
} from 'lucide-react';

export const Route = createFileRoute('/dashboard/appointments/')({
  component: AppointmentsPage,
});

function AppointmentsPage() {
  const { user } = useAuthStore();
  const isDoctor = user?.role === 'DOCTOR';

  const {
    appointments,
    appointmentRequests,
    isLoading,
    updateAppointmentStatus,
    cancelAppointment,
  } = useAppointments();

  const [activeTab, setActiveTab] = useState('upcoming');
  const [isBooking, setIsBooking] = useState(false);
  const [reschedulingAppointment, setReschedulingAppointment] =
    useState<Appointment | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

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

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return time;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Scheduled
          </Badge>
        );

      case AppointmentStatus.REQUESTED:
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Pending
          </Badge>
        );

      case AppointmentStatus.COMPLETED:
        return (
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
            Completed
          </Badge>
        );

      case AppointmentStatus.CANCELLED:
      case AppointmentStatus.DECLINED:
        return <Badge variant="destructive">Cancelled</Badge>;

      case AppointmentStatus.RESCHEDULED:
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
            Rescheduled
          </Badge>
        );

      default:
        return (
          <Badge>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
    }
  };

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      appointment.status === AppointmentStatus.SCHEDULED ||
      appointment.status === AppointmentStatus.RESCHEDULED
  );

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === AppointmentStatus.COMPLETED
  );

  const cancelledAppointments = appointments.filter(
    (appointment) =>
      appointment.status === AppointmentStatus.CANCELLED ||
      appointment.status === AppointmentStatus.DECLINED
  );

  const filteredAppointments = (() => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingAppointments;
      case 'completed':
        return completedAppointments;
      case 'cancelled':
        return cancelledAppointments;
      case 'all':
      default:
        return appointments;
    }
  })();

  const handleAccept = async (appointment: Appointment) => {
    setActionId(appointment._id);
    try {
      await updateAppointmentStatus({
        appointmentId: appointment._id,
        status: AppointmentStatus.SCHEDULED,
      });
    } finally {
      setActionId(null);
    }
  };

  const handleDecline = async (appointment: Appointment) => {
    setActionId(appointment._id);
    try {
      await updateAppointmentStatus({
        appointmentId: appointment._id,
        status: AppointmentStatus.DECLINED,
      });
    } finally {
      setActionId(null);
    }
  };

  const handleCancel = async (appointment: Appointment) => {
    setActionId(appointment._id);
    try {
      await cancelAppointment(appointment._id);
    } finally {
      setActionId(null);
    }
  };

  const renderAppointmentCard = (
    appointment: Appointment,
    index: number,
    isRequest = false
  ) => {
    const otherParty = isDoctor
      ? appointment.patient
      : appointment.doctor;

    return (
      <motion.div
        key={appointment._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
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
                    {isDoctor
                      ? `${otherParty.firstName} ${otherParty.lastName}`
                      : `Dr. ${otherParty.firstName} ${otherParty.lastName}`}
                  </h3>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {isDoctor ? 'Patient' : 'Doctor'} • @{otherParty.username}
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

              <div className="flex items-center gap-2">
                {getStatusBadge(appointment.status)}

                {isRequest ? (
                  <>
                    {isDoctor && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAccept(appointment)}
                        disabled={actionId === appointment._id}
                      >
                        <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                        Accept
                      </Button>
                    )}

                    {isDoctor ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDecline(appointment)}
                        disabled={actionId === appointment._id}
                      >
                        <XCircle className="h-4 w-4 text-danger-500" />
                        Decline
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancel(appointment)}
                        disabled={actionId === appointment._id}
                      >
                        <XCircle className="h-4 w-4 text-danger-500" />
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    {(appointment.status === AppointmentStatus.SCHEDULED ||
                      appointment.status ===
                        AppointmentStatus.RESCHEDULED) && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setReschedulingAppointment(appointment)
                          }
                        >
                          <Calendar className="mr-1 h-4 w-4" />
                          Reschedule
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancel(appointment)}
                          disabled={actionId === appointment._id}
                        >
                          <XCircle className="h-4 w-4 text-danger-500" />
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <DashboardShell>
        <p className="py-16 text-center text-slate-500">
          Loading appointments...
        </p>
      </DashboardShell>
    );
  }

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

          {!isDoctor && (
            <Button onClick={() => setIsBooking(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Book Appointment
            </Button>
          )}
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
                  {upcomingAppointments.length}
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
                  Requests
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {appointmentRequests.length}
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
                  {completedAppointments.length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="requests">
              Requests
              {appointmentRequests.length > 0 && (
                <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">
                  {appointmentRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="mt-6">
            <div className="space-y-4">
              {appointmentRequests.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <User className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                    <p className="text-slate-500">
                      {isDoctor
                        ? 'No appointment requests at the moment'
                        : 'You have no pending appointment requests'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                appointmentRequests.map((request, index) =>
                  renderAppointmentCard(request, index, true)
                )
              )}
            </div>
          </TabsContent>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {filteredAppointments.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                    <p className="text-slate-500">No appointments found</p>
                  </CardContent>
                </Card>
              ) : (
                filteredAppointments.map((appointment, index) =>
                  renderAppointmentCard(appointment, index)
                )
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {isBooking && <BookAppointmentModal onClose={() => setIsBooking(false)} />}

      {reschedulingAppointment && (
        <RescheduleModal
          appointment={reschedulingAppointment}
          onClose={() => setReschedulingAppointment(null)}
        />
      )}
    </DashboardShell>
  );
}
