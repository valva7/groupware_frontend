// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { parseToken, isTokenExpired, TokenPayload } from "@/utils/tokenUtils";
import {Member} from "@/types";

interface AuthState {
  token: string | null;
  user: TokenPayload | null;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  restoreSession: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
          token: null,
          user: null,
          isLoggedIn: false,

          login: (token: string) => {
            if (isTokenExpired(token)) {
              console.warn("만료된 토큰입니다.");
              set({ token: null, user: null, isLoggedIn: false });
              return;
            }
            const decoded = parseToken(token);
            if (decoded) {
              set({ token, user: decoded, isLoggedIn: true });
            }
          },

          logout: () => {
            set({ token: null, user: null, isLoggedIn: false });
          },

          restoreSession: () => {
            const token = get().token;
            if (token && !isTokenExpired(token)) {
              const decoded = parseToken(token);
              if (decoded) {
                set({ user: decoded, isLoggedIn: true });
              } else {
                set({ token: null, user: null, isLoggedIn: false });
              }
            } else {
              set({ token: null, user: null, isLoggedIn: false });
            }
          },
        }),
        {
          name: "auth-storage", // ✅ localStorage key
        }
    )
);
