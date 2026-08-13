import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/lib/api';
import type {
  ApiResponse,
  ChatConversation,
  ChatMessage,
  User,
} from '@/types';

export const CONNECTIONS_QUERY_KEY = ['connections'] as const;

interface RawChatEntry {
  friendId: string;
  chatHistory: Array<{
    messageId: string;
    message: string;
    sender: User | string;
    timestamp?: string;
  }>;
}

export interface ConnectionsData {
  connections: User[];
  connectionRequests: User[];
  outgoingRequests: User[];
  chatHistory?: RawChatEntry[];
}

const getErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as
    | { response?: { data?: { message?: string } } }
    | null;
  return apiError?.response?.data?.message || fallback;
};

const EMPTY_USERS: User[] = [];
const EMPTY_CONVERSATIONS: ChatConversation[] = [];

export function useConnectionsData() {
  return useQuery({
    queryKey: CONNECTIONS_QUERY_KEY,
    queryFn: async () => {
      const response = await apiClient.post<{ data: ConnectionsData }>(
        '/users/getUserData',
        { field: 'connections' }
      );
      return response.data.data;
    },
  });
}

export function useConnections() {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useConnectionsData();

  const connections = data?.connections ?? EMPTY_USERS;
  const connectionRequests = data?.connectionRequests ?? EMPTY_USERS;
  const outgoingRequests = data?.outgoingRequests ?? EMPTY_USERS;

  const conversations = useMemo<ChatConversation[]>(() => {
    if (!data) return EMPTY_CONVERSATIONS;

    const historyByFriend = new Map(
      (data.chatHistory ?? []).map((entry) => [
        entry.friendId.toString(),
        entry,
      ])
    );

    return connections.map((connection) => {
      const entry = historyByFriend.get(connection._id);
      const chatHistory: ChatMessage[] = (entry?.chatHistory ?? []).map(
        (msg) => ({
          messageId: msg.messageId,
          message: msg.message,
          sender:
            typeof msg.sender === 'string'
              ? msg.sender
              : msg.sender._id,
          timestamp: msg.timestamp ?? '',
          isRead: true,
        })
      );

      return {
        friendId: connection._id,
        friend: connection,
        chatHistory,
        unreadCount: 0,
      };
    });
  }, [data, connections]);

  const invalidateConnections = () =>
    queryClient.invalidateQueries({ queryKey: CONNECTIONS_QUERY_KEY });

  const sendConnectionRequestMutation = useMutation({
    mutationFn: async (to: string) => {
      const response = await apiClient.post<ApiResponse>(
        '/users/connection/request',
        { to }
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message || 'Connection request sent');
      invalidateConnections();
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, 'Failed to send connection request')
      );
    },
  });

  const acceptConnectionMutation = useMutation({
    mutationFn: async (requesterId: string) => {
      const response = await apiClient.patch<ApiResponse>(
        '/users/connection/accept',
        { requesterId }
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message || 'Connection request accepted');
      invalidateConnections();
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, 'Failed to accept connection request')
      );
    },
  });

  const rejectConnectionMutation = useMutation({
    mutationFn: async (requesterId: string) => {
      const response = await apiClient.patch<ApiResponse>(
        '/users/connection/reject',
        { requesterId }
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message || 'Connection request rejected');
      invalidateConnections();
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, 'Failed to reject connection request')
      );
    },
  });

  return {
    connections,
    connectionRequests,
    outgoingRequests,
    conversations,
    isLoading,
    refetch,
    sendConnectionRequest: sendConnectionRequestMutation.mutateAsync,
    isSendingRequest: sendConnectionRequestMutation.isPending,
    acceptConnection: acceptConnectionMutation.mutateAsync,
    isAcceptingConnection: acceptConnectionMutation.isPending,
    rejectConnection: rejectConnectionMutation.mutateAsync,
    isRejectingConnection: rejectConnectionMutation.isPending,
  };
}

export function useDoctors() {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<User[]>>(
        '/users/getUsers'
      );
      if (response.data.success && response.data.data) {
        return response.data.data.filter(
          (user) => user.role === 'DOCTOR'
        );
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
      const response = await apiClient.get<ApiResponse<User[]>>(
        '/users/getUsers'
      );
      if (response.data.success && response.data.data) {
        return response.data.data.filter(
          (user) => user.role === 'PATIENT'
        );
      }
      throw new Error('Failed to fetch patients');
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useMyConnections() {
  return useQuery({
    queryKey: ['connections-all'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<User[]>>(
        '/users/getUsers'
      );
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error('Failed to fetch connections');
    },
    staleTime: 5 * 60 * 1000,
  });
}
