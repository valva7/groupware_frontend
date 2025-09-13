// src/store/useAuthStore.ts
import { create } from "zustand";
import { Member, JwtPayload } from "../api/types/authTypes";

const ACCESS_TOKEN_KEY = "accessToken";

interface AuthState {
  member: Member | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  loadUserFromToken: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const jwtDecode = require("jwt-decode") as <T>(token: string) => T;

  return {
    member: null,
    isAuthenticated: false,

    // 로그인 후 토큰 저장 & 상태 업데이트
    login: async (token: string) => {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);

      const payload: JwtPayload = jwtDecode<JwtPayload>(token);
      set({
        member: {
          id: Number(payload.sub),
          name: payload.name,
          email: payload.email,
          roles: payload.roles,
          profileImageUrl: payload.profileImageUrl,
        },
        isAuthenticated: true,
      });
    },

    logout: () => {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      set({ member: null, isAuthenticated: false });
    },

    loadUserFromToken: () => {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!token) {
        set({ member: null, isAuthenticated: false });
        return;
      }

      try {
        const payload: JwtPayload = jwtDecode<JwtPayload>(token);

        set({
          member: {
            id: Number(payload.sub),
            name: payload.name,
            email: payload.email,
            roles: payload.roles,
            profileImageUrl: payload.profileImageUrl,
          },
          isAuthenticated: true,
        });
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        set({ member: null, isAuthenticated: false });
      }
    },
  };
});
