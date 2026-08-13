import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { FileText, Stethoscope, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/stores';
import { UserRole, type User } from '@/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Grid of the current user's clinically-connected doctors (if they're a
 * patient) or patients (if they're a doctor), sourced from
 * user.doctors/user.patients — the same connection data the backend's
 * assertDoctorPatientLink authorizes against, not the platform-wide user
 * directory. Each card links into the connection-scoped records page.
 */
export function ConnectedEntityGrid({ title = 'Manage Records' }: { title?: string }) {
  const { user } = useAuthStore();
  const isDoctor = user?.role === UserRole.DOCTOR;
  const entities: User[] = (isDoctor ? user?.patients : user?.doctors) || [];

  if (entities.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          {isDoctor ? (
            <UserIcon className="h-12 w-12 mx-auto mb-4 text-slate-300" />
          ) : (
            <Stethoscope className="h-12 w-12 mx-auto mb-4 text-slate-300" />
          )}
          <p className="text-slate-500">
            {isDoctor ? 'No connected patients yet' : 'No connected doctors yet'}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            {isDoctor
              ? 'Patients appear here once you have a scheduled appointment together.'
              : 'Doctors appear here once you have a scheduled appointment together.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {entities.map((entity) => (
        <motion.div key={entity._id} variants={itemVariants}>
          <Link
            to="/dashboard/records/$entityId"
            params={{ entityId: entity._id }}
            className="block"
          >
            <Card className="group hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-5 flex items-center gap-4">
                <Avatar className="size-12">
                  <AvatarImage src={entity.profilePicture} alt={entity.firstName} />
                  <AvatarFallback className="bg-primary-100 text-primary-600">
                    {entity.firstName?.[0]}
                    {entity.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                    {isDoctor ? '' : 'Dr. '}
                    {entity.firstName} {entity.lastName}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                    @{entity.username}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs font-medium text-primary-600 group-hover:underline">
                    <FileText className="h-3.5 w-3.5" />
                    {title}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
