import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Member } from '../types';

interface AuthState {
  member: Member | null;
  isAuthenticated: boolean;
  login: (member: Member) => void;
  logout: () => void;
  updateProfile: (updates: Partial<Member>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      member: null,
      isAuthenticated: false,
      login: (member) => set({ member, isAuthenticated: true }),
      logout: () => set({ member: null, isAuthenticated: false }),
      updateProfile: (updates) => set((state) => ({
        member: state.member ? { ...state.member, ...updates } : null,
      })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Mock member data
export const mockMember: Member = {
  id: '1',
  name: '김그룹웨어',
  profileImageUrl: undefined,
};