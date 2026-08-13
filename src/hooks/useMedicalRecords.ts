import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import type { ApiResponse, MedicalRecord } from '@/types';
import { toast } from 'sonner';

const ACTIVE_STATUSES = new Set(['PENDING', 'PROCESSING']);

interface UseMedicalRecordsParams {
  doctorId?: string;
  patientId?: string;
}

/**
 * Records for a single doctor-patient connection. Both doctorId and
 * patientId are required — the backend authorizes every call against the
 * requester's actual clinical connection, so there is no "all my records"
 * endpoint.
 */
export function useMedicalRecords({ doctorId, patientId }: UseMedicalRecordsParams) {
  const queryClient = useQueryClient();
  const queryKey = ['medicalRecords', doctorId, patientId];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await apiClient.post<ApiResponse<never> & { records: MedicalRecord[] }>(
        '/users/get-records',
        { doctorId, patientId }
      );
      return response.data.records ?? [];
    },
    enabled: !!doctorId && !!patientId,
    refetchInterval: (query) => {
      const records = query.state.data as MedicalRecord[] | undefined;
      const hasActiveJob = records?.some((r) => ACTIVE_STATUSES.has(r.processingStatus));
      return hasActiveJob ? 3000 : false;
    },
  });

  const uploadFilesMutation = useMutation({
    mutationFn: async ({ files, target }: { files: File[]; target: string }) => {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      formData.append('target', target);

      const response = await apiClient.post('/users/upload-files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Files uploaded successfully');
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload files');
    },
  });

  const deleteFileMutation = useMutation({
    mutationFn: async (recordId: string) => {
      const response = await apiClient.post<ApiResponse>('/users/delete-file', { recordId });
      return response.data;
    },
    onSuccess: () => {
      toast.success('File deleted successfully');
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete file');
    },
  });

  const retryProcessingMutation = useMutation({
    mutationFn: async (recordId: string) => {
      const response = await apiClient.post<ApiResponse<MedicalRecord>>(
        `/users/records/${recordId}/retry`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Reprocessing started');
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to retry processing');
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
    retryProcessing: retryProcessingMutation.mutate,
    isRetrying: retryProcessingMutation.isPending,
  };
}

/**
 * A single record, polled while its AI processing job is still running.
 * Used for the record-detail/status view rather than the list.
 */
export function useMedicalRecord(recordId: string | undefined) {
  return useQuery({
    queryKey: ['medicalRecord', recordId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<MedicalRecord>>(`/users/records/${recordId}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch record');
    },
    enabled: !!recordId,
    refetchInterval: (query) => {
      const status = query.state.data?.processingStatus;
      return status === 'PENDING' || status === 'PROCESSING' ? 3000 : false;
    },
  });
}
