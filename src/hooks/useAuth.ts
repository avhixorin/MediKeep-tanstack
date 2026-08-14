import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { useAuthStore } from '@/stores';
import type { ApiResponse, SignInData, ForgotPasswordData, ResetPasswordData, User, RegistrationFormData } from '@/types';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

export function useAuth() {
  const { login: storeLogin, logout: storeLogout, user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const loginMutation = useMutation({
    mutationFn: async (data: SignInData) => {
      const response = await apiClient.post<ApiResponse<User>>(
        '/users/login',
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        storeLogin(data.data);
        toast.success('Login successful');
        queryClient.setQueryData(['user'], data.data);
      } else {
        toast.error(data.message || 'Login failed');
        return Promise.reject(new Error(data.message || 'Login failed'));
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
      return Promise.reject(error);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      const response = await apiClient.post<
        ApiResponse<{
          authUser: User;
          accessToken: string;
          refreshToken: string;
        }>
      >('/users/register', data);

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.message || "Registration failed"
        );
      }

      return response.data;
    },

    onSuccess: (data) => {
      const { authUser } = data.data!;

      storeLogin(authUser);
      toast.success("Registration successful");
      queryClient.setQueryData(["user"], authUser);
    },

    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Registration failed"
      );
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post('/users/logout');
    },
    onSuccess: () => {
      storeLogout();
      queryClient.clear();
      toast.success('Logged out successfully');
      navigate({to: "/auth/login", replace: true})
    },
    onError: () => {
      storeLogout();
      queryClient.clear();
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      const response = await apiClient.post<ApiResponse>('/users/forgot/verify', data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Password reset instructions sent');
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send reset instructions');
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const response = await apiClient.post<ApiResponse>('/users/forgot/newPass', data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Password reset successful');
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<User>) => {
      const response = await apiClient.patch<ApiResponse<User>>('/users/update', data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        useAuthStore.getState().updateUser(data.data);
        queryClient.setQueryData(['user'], data.data);
        toast.success('Profile updated successfully');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
      const response = await apiClient.patch<ApiResponse>('/users/update/password', data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Password updated successfully');
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update password');
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async (password: string) => {
      const response = await apiClient.delete<ApiResponse>('/users/delete/user', {
        data: { password },
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        storeLogout();
        queryClient.clear();
        toast.success('Account deleted successfully');
        navigate({ to: '/auth/login', replace: true });
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await apiClient.post<ApiResponse<string>>(
        '/users/upload',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        useAuthStore.getState().updateUser({ profilePicture: data.data });
        queryClient.setQueryData(['user'], (old: User | undefined) =>
          old ? { ...old, profilePicture: data.data } : old
        );
        toast.success('Profile picture updated successfully');
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to update profile picture'
      );
    },
  });

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutateAsync,
    isLoginPending: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegisterPending: registerMutation.isPending,
    logout: logoutMutation.mutate,
    isLogoutPending: logoutMutation.isPending,
    forgotPassword: forgotPasswordMutation.mutate,
    isForgotPasswordPending: forgotPasswordMutation.isPending,
    resetPassword: resetPasswordMutation.mutate,
    isResetPasswordPending: resetPasswordMutation.isPending,
    updateProfile: updateProfileMutation.mutate,
    isUpdateProfilePending: updateProfileMutation.isPending,
    updatePassword: updatePasswordMutation.mutate,
    isUpdatePasswordPending: updatePasswordMutation.isPending,
    deleteAccount: deleteAccountMutation.mutate,
    isDeleteAccountPending: deleteAccountMutation.isPending,
    uploadAvatar: uploadAvatarMutation.mutate,
    isUploadAvatarPending: uploadAvatarMutation.isPending,
  };
}

export function useCurrentUser() {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ["user"],

    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<User>>(
        "/users/verify"
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(
        response.data.message || "Session verification failed"
      );
    },
    enabled: !!user,
    retry: false,
  });
}

export function useUser(username: string) {
  return useQuery({
    queryKey: ['user', username],
    queryFn: async () => {
      const response = await apiClient.post<ApiResponse<User>>('/users/getUserData', { username });
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error('Failed to fetch user');
    },
    enabled: !!username,
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<User[]>>('/users/getUsers');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error('Failed to fetch users');
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCheckAvailability() {
  return useMutation({
    mutationFn: async (data: { type: 'username' | 'email'; value: string }) => {
      const response = await apiClient.post<ApiResponse<{ available: boolean }>>(
        '/users/check/availability',
        data
      );
      return response.data;
    },
  });
}
