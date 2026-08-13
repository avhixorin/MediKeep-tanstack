import { create } from 'zustand';
import type { ChatConversation, ChatMessage } from '@/types';

interface ChatState {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  onlineUsers: string[];
  isTyping: Record<string, boolean>;
  
  // Actions
  setConversations: (conversations: ChatConversation[]) => void;
  addConversation: (conversation: ChatConversation) => void;
  updateConversation: (friendId: string, updates: Partial<ChatConversation>) => void;
  setActiveConversation: (friendId: string | null) => void;
  addMessage: (friendId: string, message: ChatMessage) => void;
  setOnlineUsers: (userIds: string[]) => void;
  addOnlineUser: (userId: string) => void;
  removeOnlineUser: (userId: string) => void;
  setTyping: (userId: string, isTyping: boolean) => void;
  markAsRead: (friendId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversationId: null,
  onlineUsers: [],
  isTyping: {},

  setConversations: (conversations) => set({ conversations }),
  
  addConversation: (conversation) => 
    set((state) => ({
      conversations: [...state.conversations, conversation],
    })),
  
  updateConversation: (friendId, updates) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.friendId === friendId ? { ...conv, ...updates } : conv
      ),
    })),
  
  setActiveConversation: (friendId) => set({ activeConversationId: friendId }),
  
  addMessage: (friendId, message) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.friendId === friendId
          ? { 
              ...conv, 
              chatHistory: [...conv.chatHistory, message],
              unreadCount: state.activeConversationId === friendId 
                ? conv.unreadCount 
                : (conv.unreadCount || 0) + 1
            }
          : conv
      ),
    })),
  
  setOnlineUsers: (userIds) => set({ onlineUsers: userIds }),
  
  addOnlineUser: (userId) =>
    set((state) => ({
      onlineUsers: [...new Set([...state.onlineUsers, userId])],
    })),
  
  removeOnlineUser: (userId) =>
    set((state) => ({
      onlineUsers: state.onlineUsers.filter((id) => id !== userId),
    })),
  
  setTyping: (userId, isTyping) =>
    set((state) => ({
      isTyping: { ...state.isTyping, [userId]: isTyping },
    })),
  
  markAsRead: (friendId) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.friendId === friendId ? { ...conv, unreadCount: 0 } : conv
      ),
    })),
}));
