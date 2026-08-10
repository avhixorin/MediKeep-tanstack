import { createFileRoute } from '@tanstack/react-router';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle, 
  XCircle,
  MapPin,
  Stethoscope,
  Plus
} from 'lucide-react';
import { useState } from 'react';
import { useSocketEmitters } from '@/hooks';
import { motion } from 'framer-motion';

const appointments = [
  {
    id: '1',
    doctor: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    date: '2024-12-26',
    time: '14:00',
    status: 'scheduled',
    type: 'video',
    location: 'Video Call',
  },
  {
    id: '2',
    doctor: 'Dr. Michael Chen',
    specialty: 'General Practitioner',
    date: '2024-12-27',
    time: '10:30',
    status: 'pending',
    type: 'in-person',
    location: 'City General Hospital',
  },
  {
    id: '3',
    doctor: 'Dr. Emily Rodriguez',
    specialty: 'Dermatologist',
    date: '2024-12-28',
    time: '15:15',
    status: 'scheduled',
    type: 'video',
    location: 'Video Call',
  },
  {
    id: '4',
    doctor: 'Dr. James Wilson',
    specialty: 'Orthopedist',
    date: '2024-12-20',
    time: '09:00',
    status: 'completed',
    type: 'in-person',
    location: 'Metro Medical Center',
  },
  {
    id: '5',
    doctor: 'Dr. Lisa Park',
    specialty: 'Neurologist',
    date: '2024-12-18',
    time: '11:30',
    status: 'cancelled',
    type: 'video',
    location: 'Video Call',
  },
];

function AppointmentsPage() {
  const { acceptAppointment, declineAppointment, cancelAppointment } = useSocketEmitters();
  const [activeTab, setActiveTab] = useState('upcoming');

  const filteredAppointments = appointments.filter(apt => {
    if (activeTab === 'upcoming') return apt.status === 'scheduled' || apt.status === 'pending';
    if (activeTab === 'completed') return apt.status === 'completed';
    if (activeTab === 'cancelled') return apt.status === 'cancelled';
    return true;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
      scheduled: 'success',
      pending: 'warning',
      completed: 'secondary',
      cancelled: 'destructive',
      rescheduled: 'warning',
    };
    return <Badge>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Appointments</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your healthcare appointments</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Book Appointment
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: appointments.length, color: 'bg-blue-100 text-blue-600' },
            { label: 'Scheduled', value: appointments.filter(a => a.status === 'scheduled').length, color: 'bg-green-100 text-green-600' },
            { label: 'Pending', value: appointments.filter(a => a.status === 'pending').length, color: 'bg-yellow-100 text-yellow-600' },
            { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, color: 'bg-purple-100 text-purple-600' },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs & List */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {filteredAppointments.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-500">No appointments found</p>
                  </CardContent>
                </Card>
              ) : (
                filteredAppointments.map((appointment, index) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          {/* Date Block */}
                          <div className="flex items-center gap-4 lg:w-48">
                            <div className="w-16 h-16 rounded-xl bg-primary-50 flex flex-col items-center justify-center">
                              <span className="text-xs font-medium text-primary-600 uppercase">
                                {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short' })}
                              </span>
                              <span className="text-xl font-bold text-primary-600">
                                {new Date(appointment.date).getDate()}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {new Date(appointment.date).toLocaleDateString()}
                              </p>
                              <div className="flex items-center gap-1 text-sm text-slate-600">
                                <Clock className="h-4 w-4" />
                                {new Date(appointment.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>

                          {/* Doctor Info */}
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                              {appointment.doctor}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Stethoscope className="h-4 w-4" />
                              {appointment.specialty}
                            </div>
                          </div>

                          {/* Location/Type */}
                          <div className="lg:w-40">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              {appointment.type === 'video' ? (
                                <>
                                  <Video className="h-4 w-4" />
                                  Video Call
                                </>
                              ) : (
                                <>
                                  <MapPin className="h-4 w-4" />
                                  {appointment.location}
                                </>
                              )}
                            </div>
                          </div>

                          {/* Status & Actions */}
                          <div className="flex items-center gap-4">
                            {getStatusBadge(appointment.status)}
                            
                            {appointment.status === 'scheduled' && (
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Video className="mr-1 h-4 w-4" />
                                  Join
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => cancelAppointment(appointment.id)}
                                >
                                  <XCircle className="h-4 w-4 text-danger-500" />
                                </Button>
                              </div>
                            )}
                            
                            {appointment.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => acceptAppointment(appointment.id)}
                                >
                                  <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                                  Accept
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => declineAppointment(appointment.id)}
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
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}

export default AppointmentsPage;
