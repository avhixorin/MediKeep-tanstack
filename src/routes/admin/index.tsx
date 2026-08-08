import { createFileRoute } from '@tanstack/react-router';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Activity, 
  TrendingUp,
  DollarSign,
  Calendar,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
});

const stats = [
  { 
    label: 'Total Users', 
    value: '2,543', 
    change: '+12%',
    trend: 'up',
    icon: Users,
    color: 'bg-blue-100 text-blue-600'
  },
  { 
    label: 'Active Patients', 
    value: '1,890', 
    change: '+8%',
    trend: 'up',
    icon: Activity,
    color: 'bg-green-100 text-green-600'
  },
  { 
    label: 'Healthcare Providers', 
    value: '653', 
    change: '+15%',
    trend: 'up',
    icon: TrendingUp,
    color: 'bg-purple-100 text-purple-600'
  },
  { 
    label: 'Appointments Today', 
    value: '127', 
    change: '-5%',
    trend: 'down',
    icon: Calendar,
    color: 'bg-orange-100 text-orange-600'
  },
];

const recentUsers = [
  { name: 'John Smith', email: 'john@example.com', role: 'Patient', status: 'active', joined: '2 hours ago' },
  { name: 'Dr. Sarah Johnson', email: 'sarah@example.com', role: 'Doctor', status: 'active', joined: '5 hours ago' },
  { name: 'Michael Chen', email: 'michael@example.com', role: 'Patient', status: 'pending', joined: '1 day ago' },
  { name: 'Dr. Emily Rodriguez', email: 'emily@example.com', role: 'Doctor', status: 'active', joined: '2 days ago' },
];

function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Monitor platform activity and manage users</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className={`flex items-center text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trend === 'up' ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                      {stat.change}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Newly registered users and providers</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {recentUsers.map((user, index) => (
                    <motion.div
                      key={user.email}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between py-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-medium">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={user.role === 'Doctor' ? 'secondary' : 'default'}>
                          {user.role}
                        </Badge>
                        <Badge variant={user.status === 'active' ? 'success' : 'warning'}>
                          {user.status}
                        </Badge>
                        <span className="text-sm text-slate-500">{user.joined}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="mr-2 h-4 w-4" />
                  View System Health
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Review Appointments
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Financial Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
