import { create } from 'zustand';
import { Notification } from '@/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [
    {
      id: '1',
      type: 'approval',
      title: '전자결재 승인 요청',
      message: '휴가신청서가 승인 대기 중입니다.',
      isRead: false,
      createdAt: '2024-01-20T09:00:00Z',
      link: '/approval/1',
    },
    {
      id: '2',
      type: 'project',
      title: '프로젝트 업데이트',
      message: '웹사이트 리뉴얼 프로젝트에 새로운 태스크가 추가되었습니다.',
      isRead: false,
      createdAt: '2024-01-20T08:30:00Z',
      link: '/projects/1',
    },
    {
      id: '3',
      type: 'vote',
      title: '투표 참여',
      message: '사내 카페테리아 메뉴 투표가 시작되었습니다.',
      isRead: true,
      createdAt: '2024-01-19T14:00:00Z',
      link: '/votes/1',
    },
  ],
  unreadCount: 2,
  isOpen: false,
  
  addNotification: (notification) =>
    set((state) => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      return {
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    }),
    
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
    
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
    
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open) => set({ isOpen: open }),
}));