import { createFileRoute } from '@tanstack/react-router';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Video,
  ArrowUpRight,
  Clock,
  TrendingUp,
  Heart,
  Thermometer,
  Droplets
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores';

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHome,
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function DashboardHome() {
  const { user } = useAuthStore();

  return (
    <DashboardShell>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Welcome back, {user?.fullName.split(' ')[0]}! 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Here's what's happening with your health today.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Book Appointment
            </Button>
            <Button>
              <Video className="mr-2 h-4 w-4" />
              Start Video Call
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard
            title="Total Appointments"
            value="12"
            change="+2"
            icon={Calendar}
            trend="up"
            color="blue"
          />
          <StatCard
            title="Health Score"
            value="94"
            change="+5%"
            icon={Activity}
            trend="up"
            color="green"
          />
          <StatCard
            title="Connected Providers"
            value="5"
            change="+1"
            icon={Users}
            trend="up"
            color="purple"
          />
          <StatCard
            title="Medical Records"
            value="24"
            change="+3"
            icon={FileText}
            trend="neutral"
            color="orange"
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks at your fingertips</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { icon: Calendar, label: 'Book Appt', color: 'bg-blue-100 text-blue-600' },
                      { icon: FileText, label: 'View Records', color: 'bg-green-100 text-green-600' },
                      { icon: MessageSquare, label: 'Send Message', color: 'bg-purple-100 text-purple-600' },
                      { icon: Video, label: 'Video Call', color: 'bg-orange-100 text-orange-600' },
                    ].map((action) => (
                      <button
                        key={action.label}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                          <action.icon className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Appointments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <CardDescription>Your scheduled consultations</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        doctor: 'Dr. Sarah Johnson',
                        specialty: 'Cardiologist',
                        date: 'Today, 2:00 PM',
                        status: 'confirmed',
                        avatar: null,
                      },
                      {
                        doctor: 'Dr. Michael Chen',
                        specialty: 'General Practitioner',
                        date: 'Tomorrow, 10:30 AM',
                        status: 'pending',
                        avatar: null,
                      },
                      {
                        doctor: 'Dr. Emily Rodriguez',
                        specialty: 'Dermatologist',
                        date: 'Dec 28, 3:15 PM',
                        status: 'confirmed',
                        avatar: null,
                      },
                    ].map((appointment, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-primary-100 text-primary-600">
                              {appointment.doctor[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">{appointment.doctor}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{appointment.specialty}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Clock className="h-4 w-4" />
                            {appointment.date}
                          </div>
                          <Badge variant="outline" color={appointment.status === 'confirmed' ? 'green' : 'yellow'}
                            className="mt-1"
                          >
                            {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - 1/3 */}
          <div className="space-y-6">
            {/* Health Vitals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Today's Vitals</CardTitle>
                  <CardDescription>Last updated 2 hours ago</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
                      { label: 'Heart Rate', value: '72', unit: 'BPM', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
                      { label: 'Temperature', value: '98.6', unit: '°F', icon: Thermometer, color: 'text-orange-500', bg: 'bg-orange-50' },
                      { label: 'SpO2', value: '98', unit: '%', icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-50' },
                    ].map((vital) => (
                      <div key={vital.label} className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg ${vital.bg} ${vital.color} flex items-center justify-center`}>
                          <vital.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-600 dark:text-slate-400">{vital.label}</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {vital.value} <span className="text-sm font-normal text-slate-500">{vital.unit}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Trends
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: 'Appointment scheduled', with: 'Dr. Johnson', time: '2 hours ago', icon: Calendar },
                      { action: 'Message received', with: 'Dr. Chen', time: '5 hours ago', icon: MessageSquare },
                      { action: 'Report uploaded', with: 'Lab Results', time: 'Yesterday', icon: FileText },
                      { action: 'Video call ended', with: 'Dr. Rodriguez', time: '2 days ago', icon: Video },
                    ].map((activity) => (
                      <div key={activity.action} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                          <activity.icon className="h-4 w-4 text-slate-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {activity.action}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {activity.with}
                          </p>
                          <p className="text-xs text-slate-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend: 'up' | 'down' | 'neutral';
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function StatCard({ title, value, change, icon: Icon, trend, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';

  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className={`flex items-center text-sm font-medium ${
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-slate-600'
            }`}>
              {trendIcon} {change}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{title}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
