import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';
import { useAppointments } from '#/hooks/useAppointments';
import { useAuthStore } from '#/stores/authStore';
import type { Appointment } from '#/types';

interface RescheduleModalProps {
  appointment: Appointment;
  onClose: () => void;
}

const toDateInputValue = (date: string) => {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? ''
    : parsed.toISOString().split('T')[0];
};

export function RescheduleModal({
  appointment,
  onClose,
}: RescheduleModalProps) {
  const { user } = useAuthStore();
  const { rescheduleAppointment, isRescheduling } = useAppointments();

  const [date, setDate] = useState(toDateInputValue(appointment.date));
  const [time, setTime] = useState(appointment.time);
  const [reason, setReason] = useState(appointment.reason);

  const isDoctor = user?.role === 'DOCTOR';
  const otherParty = isDoctor ? appointment.patient : appointment.doctor;

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async () => {
    if (!date || !time || !reason.trim()) return;

    try {
      await rescheduleAppointment({
        appointmentId: appointment._id,
        data: { date, time, reason: reason.trim() },
      });
      onClose();
    } catch {
      // Error toast handled by the mutation
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 transition-colors hover:text-red-500 dark:text-slate-400"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-1 text-xl font-semibold text-slate-800 dark:text-slate-200">
          Reschedule Appointment
        </h2>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          {isDoctor ? 'Patient' : 'Doctor'}: {otherParty.firstName}{' '}
          {otherParty.lastName}
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="reschedule-date">New Date</Label>
              <Input
                id="reschedule-date"
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="reschedule-time">New Time</Label>
              <Input
                id="reschedule-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="reschedule-reason">Reason</Label>
            <textarea
              id="reschedule-reason"
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
            onClick={onClose}
            disabled={isRescheduling}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isRescheduling || !date || !time || !reason.trim()}
          >
            {isRescheduling ? 'Rescheduling...' : 'Reschedule'}
          </Button>
        </div>
      </div>
    </div>
  );
}
