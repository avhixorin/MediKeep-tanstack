import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import type { ApiResponse, User } from '@/types';

export function useDoctors() {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<User[]>>('/user/getUsers');
      if (response.data.success && response.data.data) {
        return response.data.data.filter((user) => user.role === 'doctor');
      }
      throw new Error('Failed to fetch doctors');
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePatients() {
  return useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<User[]>>('/user/getUsers');
      if (response.data.success && response.data.data) {
        return response.data.data.filter((user) => user.role === 'patient');
      }
      throw new Error('Failed to fetch patients');
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useMyConnections() {
  return useQuery({
    queryKey: ['connections'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<User[]>>('/user/getUsers');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error('Failed to fetch connections');
    },
    staleTime: 5 * 60 * 1000,
  });
}
