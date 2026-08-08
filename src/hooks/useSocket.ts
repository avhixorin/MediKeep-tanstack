import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from '@/constants/socketEvents';
import { useAuthStore, useChatStore, useAppointmentStore } from '@/stores';
import type { ChatMessage, User, Appointment, ApiResponse } from '@/types';
import { toast } from 'sonner';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { user, accessToken, isAuthenticated } = useAuthStore();
  const { addMessage, addOnlineUser, removeOnlineUser, addConversation, updateConversation } = useChatStore();
  const { 
    addAppointment, 
    addAppointmentRequest, 
    updateAppointment, 
    removeAppointment,
    removeAppointmentRequest 
  } = useAppointmentStore();

  const connect = useCallback(() => {
    if (socketRef.current?.connected || !accessToken) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    
    socketRef.current = io(socketUrl, {
      auth: {
        token: accessToken,
      },
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

    // Connection events
    socketRef.current.on(SOCKET_EVENTS.NEW_CONNECTION_NOTIFICATION, (data: {
      type: string;
      message: string;
      from: Partial<User>;
    }) => {
      toast.info(data.message);
    });

    socketRef.current.on(SOCKET_EVENTS.ACCEPTED_CONNECTION, (data: {
      message: string;
      accepter: Partial<User>;
    }) => {
      toast.success(data.message);
    });

    socketRef.current.on(SOCKET_EVENTS.REJECTED_CONNECTION, (data: {
      message: string;
      rejecterId: string;
    }) => {
      toast.error(data.message);
    });

    // Appointment events
    socketRef.current.on(SOCKET_EVENTS.NEW_APPOINTMENT_REQUEST, (response: ApiResponse<Appointment>) => {
      if (response.data) {
        addAppointmentRequest(response.data);
        toast.info(response.message);
      }
    });

    socketRef.current.on(SOCKET_EVENTS.ACCEPT_APPOINTMENT, (response: ApiResponse<Appointment>) => {
      if (response.data) {
        updateAppointment(response.data._id, { status: 'scheduled' });
        toast.success(response.message);
      }
    });

    socketRef.current.on(SOCKET_EVENTS.RESCHEDULED_APPOINTMENT, (response: ApiResponse<Appointment>) => {
      if (response.data) {
        updateAppointment(response.data._id, response.data);
        toast.info(response.message);
      }
    });

    socketRef.current.on(SOCKET_EVENTS.CANCELLED_APPOINTMENT, (response: ApiResponse<Appointment>) => {
      if (response.data) {
        removeAppointment(response.data._id);
        toast.info(response.message);
      }
    });

    socketRef.current.on(SOCKET_EVENTS.DECLINE_APPOINTMENT_REQUEST, (response: ApiResponse<Appointment>) => {
      if (response.data) {
        removeAppointmentRequest(response.data._id);
        toast.error(response.message);
      }
    });

    socketRef.current.on(SOCKET_EVENTS.COMPLETED_APPOINTMENT, (response: ApiResponse<Appointment>) => {
      if (response.data) {
        updateAppointment(response.data._id, { status: 'completed' });
        toast.success(response.message);
      }
    });

    // Video call events
    socketRef.current.on(SOCKET_EVENTS.VIDEO_CALL_REQUEST, (data: { from: User }) => {
      // Handle incoming call - will be handled by useRTC hook
    });

    socketRef.current.on(SOCKET_EVENTS.VIDEO_CALL_RESPONSE, (data: { from: User; verdict?: string }) => {
      // Handle call response - will be handled by useRTC hook
    });

    // Online status events
    socketRef.current.on(SOCKET_EVENTS.USER_CONNECTED, (data: { userId: string }) => {
      addOnlineUser(data.userId);
    });

    socketRef.current.on(SOCKET_EVENTS.USER_DISCONNECTED, (data: { userId: string }) => {
      removeOnlineUser(data.userId);
    });

  }, [accessToken, addMessage, addOnlineUser, removeOnlineUser, addAppointment, addAppointmentRequest, updateAppointment, removeAppointment, removeAppointmentRequest]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, accessToken, connect, disconnect]);

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
  const { socket, emit } = useSocket();

  const sendMessage = useCallback((sender: string, receiver: string, message: string, messageId: string) => {
    emit(SOCKET_EVENTS.PRIVATE_MESSAGE, { sender, receiver, message, messageId });
  }, [emit]);

  const sendConnectionRequest = useCallback((from: Partial<User>, to: string) => {
    emit(SOCKET_EVENTS.CONNECT_USER, { from, to });
  }, [emit]);

  const acceptConnection = useCallback((accepterId: string, requestId: string) => {
    emit(SOCKET_EVENTS.ACCEPT_CONNECTION, { accepterId, requestId });
  }, [emit]);

  const rejectConnection = useCallback((rejecterId: string, requesterId: string) => {
    emit(SOCKET_EVENTS.REJECT_CONNECTION, { rejecterId, requesterId });
  }, [emit]);

  const requestAppointment = useCallback((data: {
    patientId: string;
    doctorId: string;
    date: string;
    time: string;
    status: string;
    reason: string;
  }) => {
    emit(SOCKET_EVENTS.REQUEST_APPOINTMENT, data);
  }, [emit]);

  const acceptAppointment = useCallback((appointmentId: string) => {
    emit(SOCKET_EVENTS.ACCEPT_APPOINTMENT, { appointmentId });
  }, [emit]);

  const rescheduleAppointment = useCallback((data: {
    appointmentId: string;
    date: string;
    time: string;
    reason: string;
  }) => {
    emit(SOCKET_EVENTS.RESCHEDULED_APPOINTMENT, data);
  }, [emit]);

  const cancelAppointment = useCallback((appointmentId: string) => {
    emit(SOCKET_EVENTS.CANCELLED_APPOINTMENT, { appointmentId });
  }, [emit]);

  const declineAppointment = useCallback((appointmentId: string) => {
    emit(SOCKET_EVENTS.DECLINE_APPOINTMENT_REQUEST, { appointmentId });
  }, [emit]);

  const completeAppointment = useCallback((appointmentId: string) => {
    emit(SOCKET_EVENTS.COMPLETED_APPOINTMENT, { appointmentId });
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
    sendConnectionRequest,
    acceptConnection,
    rejectConnection,
    requestAppointment,
    acceptAppointment,
    rescheduleAppointment,
    cancelAppointment,
    declineAppointment,
    completeAppointment,
    requestVideoCall,
    respondToVideoCall,
    joinRoom,
    getOnlineFriends,
  };
}
