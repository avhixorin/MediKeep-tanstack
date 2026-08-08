import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import type { ApiResponse, MedicalRecord, PaginatedResponse } from '@/types';
import { toast } from 'sonner';

export function useMedicalRecords() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['medicalRecords'],
    queryFn: async () => {
      const response = await apiClient.post<ApiResponse<MedicalRecord[]>>('/user/get-records');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch records');
    },
  });

  const uploadFilesMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      
      const response = await apiClient.post<ApiResponse<MedicalFile[]>>(
        '/user/upload-files',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Files uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['medicalRecords'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload files');
    },
  });

  const deleteFileMutation = useMutation({
    mutationFn: async (fileId: string) => {
      const response = await apiClient.post<ApiResponse>('/user/delete-file', { fileId });
      return response.data;
    },
    onSuccess: () => {
      toast.success('File deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['medicalRecords'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete file');
    },
  });

  return {
    records: data || [],
    isLoading,
    error,
    uploadFiles: uploadFilesMutation.mutate,
    isUploading: uploadFilesMutation.isPending,
    deleteFile: deleteFileMutation.mutate,
    isDeleting: deleteFileMutation.isPending,
  };
}

interface MedicalFile {
  _id: string;
  filename: string;
  url: string;
}
