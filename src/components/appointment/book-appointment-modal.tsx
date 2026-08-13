import { useState } from 'react';
import { CalendarIcon, Search, Stethoscope, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';
import { useAppointments, useDoctorSearch } from '#/hooks/useAppointments';
import { useAuthStore } from '#/stores/authStore';
import type { User } from '#/types';

interface BookAppointmentModalProps {
  onClose: () => void;
}

export function BookAppointmentModal({ onClose }: BookAppointmentModalProps) {
  const { user } = useAuthStore();
  const { requestAppointment, isRequesting } = useAppointments();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<User | null>(null);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  const { data: doctors = [], isLoading: isLoadingDoctors } =
    useDoctorSearch(searchQuery);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async () => {
    if (!selectedDoctor || !date || !time || !reason.trim()) return;

    try {
      await requestAppointment({
        doctorId: selectedDoctor._id,
        date,
        time,
        reason: reason.trim(),
      });
      onClose();
    } catch {
      // Error toast handled by the mutation
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-md dark:bg-slate-900">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 transition-colors hover:text-red-500 dark:text-slate-400"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {!selectedDoctor ? (
          <>
            <h2 className="mb-4 text-xl font-semibold text-slate-800 dark:text-white">
              Book an Appointment
            </h2>

            <div className="relative mb-4">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search doctors by name or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {isLoadingDoctors ? (
              <p className="py-8 text-center text-slate-500">
                Loading doctors...
              </p>
            ) : doctors.length > 0 ? (
              <div className="max-h-[60vh] space-y-2 overflow-y-auto">
                {doctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="flex items-center gap-4 rounded-md border border-slate-200 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={doctor.profilePicture}
                        alt={doctor.username}
                      />
                      <AvatarFallback>
                        {doctor.firstName[0]}
                        {doctor.lastName[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold text-slate-800 dark:text-white">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </h3>
                      <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                        @{doctor.username}
                      </p>
                    </div>

                    <Button size="sm" onClick={() => setSelectedDoctor(doctor)}>
                      Request
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Stethoscope className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                <p className="text-slate-500">No doctors found</p>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="mb-4 text-xl font-semibold text-slate-800 dark:text-white">
              Request Appointment
            </h2>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-sm font-medium">Doctor</Label>
                <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                  Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                </p>
                <p className="text-sm text-slate-500">
                  @{selectedDoctor.username}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Patient</Label>
                <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-slate-500">@{user?.username}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="appointment-date">Appointment Date</Label>
                  <div className="relative mt-1">
                    <CalendarIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="appointment-date"
                      type="date"
                      min={today}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="appointment-time">Appointment Time</Label>
                  <Input
                    id="appointment-time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="appointment-reason">
                  Reason for Appointment
                </Label>
                <textarea
                  id="appointment-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter the reason..."
                  rows={3}
                  className="mt-1 w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setSelectedDoctor(null)}
                disabled={isRequesting}
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  isRequesting || !date || !time || !reason.trim()
                }
              >
                {isRequesting ? 'Requesting...' : 'Send Request'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
