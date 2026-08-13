import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '#/lib/api';
import { useAuthStore } from '#/stores';
import type {
  ApiResponse,
  Appointment,
  AppointmentRequestData,
  AppointmentRescheduleData,
  AppointmentsData,
  AppointmentStatus,
  User,
} from '#/types';

export const APPOINTMENTS_QUERY_KEY = ['appointments'] as const;

const getErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as
    | { response?: { data?: { message?: string } } }
    | null;
  return apiError?.response?.data?.message || fallback;
};

export function useAppointments() {
  const queryClient = useQueryClient();

  const appointmentsQuery = useQuery({
    queryKey: APPOINTMENTS_QUERY_KEY,
    queryFn: async () => {
      const response = await apiClient.post<{ data: AppointmentsData }>(
        '/users/getUserData',
        { field: 'appointments' }
      );
      return response.data.data;
    },
  });

  const invalidateAppointments = () =>
    queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });

  const requestAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: AppointmentRequestData) => {
      const response = await apiClient.post<ApiResponse<Appointment>>(
        '/appointments',
        appointmentData
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Appointment request sent');
      invalidateAppointments();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to request appointment'));
    },
  });

  const rescheduleAppointmentMutation = useMutation({
    mutationFn: async ({
      appointmentId,
      data,
    }: {
      appointmentId: string;
      data: AppointmentRescheduleData;
    }) => {
      const response = await apiClient.patch<ApiResponse<Appointment>>(
        `/appointments/${appointmentId}`,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Appointment rescheduled');
      invalidateAppointments();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to reschedule appointment'));
    },
  });

  const updateAppointmentStatusMutation = useMutation({
    mutationFn: async ({
      appointmentId,
      status,
    }: {
      appointmentId: string;
      status: AppointmentStatus;
    }) => {
      const response = await apiClient.patch<ApiResponse<Appointment>>(
        `/appointments/${appointmentId}/status`,
        { status }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Appointment status updated');
      invalidateAppointments();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update appointment'));
    },
  });

  const cancelAppointmentMutation = useMutation({
    mutationFn: async (appointmentId: string) => {
      const response = await apiClient.delete<ApiResponse<Appointment>>(
        `/appointments/${appointmentId}`
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Appointment cancelled');
      invalidateAppointments();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to cancel appointment'));
    },
  });

  return {
    appointments: appointmentsQuery.data?.appointments ?? [],
    appointmentRequests: appointmentsQuery.data?.appointmentRequests ?? [],
    isLoading: appointmentsQuery.isLoading,
    isError: appointmentsQuery.isError,
    refetch: appointmentsQuery.refetch,
    requestAppointment: requestAppointmentMutation.mutateAsync,
    isRequesting: requestAppointmentMutation.isPending,
    rescheduleAppointment: rescheduleAppointmentMutation.mutateAsync,
    isRescheduling: rescheduleAppointmentMutation.isPending,
    updateAppointmentStatus: updateAppointmentStatusMutation.mutateAsync,
    isUpdatingStatus: updateAppointmentStatusMutation.isPending,
    cancelAppointment: cancelAppointmentMutation.mutateAsync,
    isCancelling: cancelAppointmentMutation.isPending,
  };
}

export function useDoctorSearch(searchQuery: string) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['doctors', 'search', searchQuery],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<User[]>>(
        '/users/getUsers'
      );

      if (!response.data.success || !response.data.data) {
        throw new Error('Failed to fetch doctors');
      }

      const query = searchQuery.trim().toLowerCase();

      return response.data.data.filter(
        (candidate) =>
          candidate.role === 'DOCTOR' &&
          candidate._id !== user?._id &&
          (!query ||
            `${candidate.firstName} ${candidate.lastName} ${candidate.username}`
              .toLowerCase()
              .includes(query))
      );
    },
    staleTime: 60 * 1000,
  });
}
