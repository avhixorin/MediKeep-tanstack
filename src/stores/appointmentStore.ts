import { create } from 'zustand';
import type { Appointment } from '@/types';

interface AppointmentState {
  appointments: Appointment[];
  appointmentRequests: Appointment[];
  selectedAppointment: Appointment | null;
  isLoading: boolean;
  
  // Actions
  setAppointments: (appointments: Appointment[]) => void;
  setAppointmentRequests: (requests: Appointment[]) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (appointmentId: string, updates: Partial<Appointment>) => void;
  removeAppointment: (appointmentId: string) => void;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  addAppointmentRequest: (request: Appointment) => void;
  removeAppointmentRequest: (requestId: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [],
  appointmentRequests: [],
  selectedAppointment: null,
  isLoading: false,

  setAppointments: (appointments) => set({ appointments }),
  
  setAppointmentRequests: (requests) => set({ appointmentRequests: requests }),
  
  addAppointment: (appointment) =>
    set((state) => ({
      appointments: [...state.appointments, appointment],
    })),
  
  updateAppointment: (appointmentId, updates) =>
    set((state) => ({
      appointments: state.appointments.map((app) =>
        app._id === appointmentId ? { ...app, ...updates } : app
      ),
    })),
  
  removeAppointment: (appointmentId) =>
    set((state) => ({
      appointments: state.appointments.filter((app) => app._id !== appointmentId),
    })),
  
  setSelectedAppointment: (appointment) => set({ selectedAppointment: appointment }),
  
  addAppointmentRequest: (request) =>
    set((state) => ({
      appointmentRequests: [...state.appointmentRequests, request],
    })),
  
  removeAppointmentRequest: (requestId) =>
    set((state) => ({
      appointmentRequests: state.appointmentRequests.filter((req) => req._id !== requestId),
    })),
  
  setLoading: (isLoading) => set({ isLoading }),
}));
