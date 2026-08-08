import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isSidebarCollapsed: boolean;
  isMobileMenuOpen: boolean;
  activeModal: string | null;
  searchQuery: string;
  notifications: Notification[];
  unreadNotificationsCount: number;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  setSearchQuery: (query: string) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  incrementUnreadNotifications: () => void;
  resetUnreadNotifications: () => void;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      isMobileMenuOpen: false,
      activeModal: null,
      searchQuery: '',
      notifications: [],
      unreadNotificationsCount: 0,

      toggleSidebar: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      
      setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
      
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      
      openModal: (modalId) => set({ activeModal: modalId }),
      
      closeModal: () => set({ activeModal: null }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadNotificationsCount: state.unreadNotificationsCount + 1,
        })),
      
      markNotificationAsRead: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
        })),
      
      clearNotifications: () => set({ notifications: [], unreadNotificationsCount: 0 }),
      
      incrementUnreadNotifications: () =>
        set((state) => ({
          unreadNotificationsCount: state.unreadNotificationsCount + 1,
        })),
      
      resetUnreadNotifications: () => set({ unreadNotificationsCount: 0 }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ 
        isSidebarCollapsed: state.isSidebarCollapsed 
      }),
    }
  )
);
