import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { SOCKET_EVENTS } from '@/constants/socketEvents';
import { useAuthStore, useChatStore } from '@/stores';
import { APPOINTMENTS_QUERY_KEY } from '@/hooks/useAppointments';
import { CONNECTIONS_QUERY_KEY } from '@/hooks/useConnections';
import type { ChatMessage, User, Appointment, ApiResponse } from '@/types';
import { toast } from 'sonner';

type AppointmentEventPayload = ApiResponse<Appointment> & {
  appointment?: Appointment;
};

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const { addMessage, addOnlineUser, removeOnlineUser } = useChatStore();

  const connect = useCallback(() => {
    if (socketRef.current?.connected || !isAuthenticated) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    socketRef.current = io(socketUrl, {
      // The backend authenticates sockets via the httpOnly accessToken cookie
      withCredentials: true,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socketRef.current.on(SOCKET_EVENTS.ERROR, (error: ApiResponse) => {
      console.error('Socket error:', error);
      toast.error(error.message);
    });

    // Chat events
    socketRef.current.on(SOCKET_EVENTS.NEW_PRIVATE_MESSAGE, (data: {
      message: string;
      sender: Partial<User>;
      messageId: string;
    }) => {
      if (data.sender._id) {
        const chatMessage: ChatMessage = {
          messageId: data.messageId,
          message: data.message,
          sender: data.sender._id,
          timestamp: new Date().toISOString(),
        };
        addMessage(data.sender._id, chatMessage);

        // Show notification if not in active conversation
        toast.info(`New message from ${data.sender.username || 'Unknown'}`, {
          description: data.message,
        });
      }
    });

    // Connection events — sockets only deliver live notifications; the actual
    // send/accept/reject operations go through the REST API.
    socketRef.current.on(SOCKET_EVENTS.NEW_CONNECTION_NOTIFICATION, (data: {
      type: string;
      message: string;
      from: Partial<User>;
    }) => {
      toast.info(data.message);
      queryClient.invalidateQueries({
        queryKey: CONNECTIONS_QUERY_KEY,
      });
    });

    socketRef.current.on(SOCKET_EVENTS.ACCEPTED_CONNECTION, (data: {
      message: string;
      accepter: Partial<User>;
    }) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: CONNECTIONS_QUERY_KEY,
      });
    });

    socketRef.current.on(SOCKET_EVENTS.REJECTED_CONNECTION, (data: {
      message: string;
      rejecterId: string;
    }) => {
      toast.error(data.message);
      queryClient.invalidateQueries({
        queryKey: CONNECTIONS_QUERY_KEY,
      });
    });

    // Appointment events — sockets are only used for live updates and
    // notifications. All appointment actions go through the REST API.
    const handleAppointmentUpdate = (
      payload: AppointmentEventPayload,
      toastFn: (message: string) => void = toast.info
    ) => {
      if (payload.message) {
        toastFn(payload.message);
      }
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    };

    socketRef.current.on(
      SOCKET_EVENTS.NEW_APPOINTMENT_REQUEST,
      (payload: AppointmentEventPayload) => handleAppointmentUpdate(payload)
    );

    socketRef.current.on(
      SOCKET_EVENTS.ACCEPT_APPOINTMENT,
      (payload: AppointmentEventPayload) =>
        handleAppointmentUpdate(payload, toast.success)
    );

    socketRef.current.on(
      SOCKET_EVENTS.RESCHEDULED_APPOINTMENT,
      (payload: AppointmentEventPayload) => handleAppointmentUpdate(payload)
    );

    socketRef.current.on(
      SOCKET_EVENTS.CANCELLED_APPOINTMENT,
      (payload: AppointmentEventPayload) => handleAppointmentUpdate(payload)
    );

    socketRef.current.on(
      SOCKET_EVENTS.DECLINE_APPOINTMENT_REQUEST,
      (payload: AppointmentEventPayload) =>
        handleAppointmentUpdate(payload, toast.error)
    );

    socketRef.current.on(
      SOCKET_EVENTS.COMPLETED_APPOINTMENT,
      (payload: AppointmentEventPayload) =>
        handleAppointmentUpdate(payload, toast.success)
    );

    // Video call events
    socketRef.current.on(SOCKET_EVENTS.VIDEO_CALL_REQUEST, (_data: { from: User }) => {
      // Handle incoming call - will be handled by useRTC hook
    });

    socketRef.current.on(SOCKET_EVENTS.VIDEO_CALL_RESPONSE, (_data: { from: User; verdict?: string }) => {
      // Handle call response - will be handled by useRTC hook
    });

    // Online status events
    socketRef.current.on(SOCKET_EVENTS.USER_CONNECTED, (data: { userId: string }) => {
      addOnlineUser(data.userId);
    });

    socketRef.current.on(SOCKET_EVENTS.USER_DISCONNECTED, (data: { userId: string }) => {
      removeOnlineUser(data.userId);
    });

  }, [isAuthenticated, queryClient, addMessage, addOnlineUser, removeOnlineUser]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, connect, disconnect]);

  const emit = useCallback(<T = unknown>(event: string, data: T) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  }, []);

  const on = useCallback(<T = unknown>(event: string, callback: (data: T) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  const off = useCallback(<T = unknown>(event: string, callback?: (data: T) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected || false,
    emit,
    on,
    off,
    connect,
    disconnect,
  };
}

export function useSocketEmitters() {
  const { emit } = useSocket();

  const sendMessage = useCallback((sender: string, receiver: string, message: string, messageId: string) => {
    emit(SOCKET_EVENTS.PRIVATE_MESSAGE, { sender, receiver, message, messageId });
  }, [emit]);

  const requestVideoCall = useCallback((to: string) => {
    emit(SOCKET_EVENTS.VIDEO_CALL_REQUEST, { to });
  }, [emit]);

  const respondToVideoCall = useCallback((to: string, verdict: 'accepted' | 'rejected') => {
    emit(SOCKET_EVENTS.VIDEO_CALL_RESPONSE, { to, verdict });
  }, [emit]);

  const joinRoom = useCallback((roomId: string, username: string) => {
    emit(SOCKET_EVENTS.JOIN_ROOM, { roomId, username });
  }, [emit]);

  const getOnlineFriends = useCallback(() => {
    emit(SOCKET_EVENTS.GET_ONLINE_FRIENDS, {});
  }, [emit]);

  return {
    sendMessage,
    requestVideoCall,
    respondToVideoCall,
    joinRoom,
    getOnlineFriends,
  };
}
