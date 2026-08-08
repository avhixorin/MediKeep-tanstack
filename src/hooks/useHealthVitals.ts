import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import type { ApiResponse, HealthVital } from '@/types';
import { toast } from 'sonner';

export function useHealthVitals() {
  const queryClient = useQueryClient();

  const { data: vitals, isLoading } = useQuery({
    queryKey: ['healthVitals'],
    queryFn: async () => {
      // This endpoint may need to be implemented on backend
      const response = await apiClient.get<ApiResponse<HealthVital[]>>('/user/vitals');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      // Return empty array if endpoint not available
      return [] as HealthVital[];
    },
  });

  const addVitalMutation = useMutation({
    mutationFn: async (data: Omit<HealthVital, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      const response = await apiClient.post<ApiResponse<HealthVital>>('/user/vitals', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Vital recorded successfully');
      queryClient.invalidateQueries({ queryKey: ['healthVitals'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to record vital');
    },
  });

  return {
    vitals: vitals || [],
    isLoading,
    addVital: addVitalMutation.mutate,
    isAdding: addVitalMutation.isPending,
  };
}
