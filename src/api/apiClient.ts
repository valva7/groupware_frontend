// src/api/api.ts
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import {toast} from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청마다 token 자동 추가
api.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
);

// 응답 interceptor: 401 → 자동 로그아웃
api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
        window.location.href = "/login";
      } else if (error.response?.status === 403) {
        toast.error('권한이 없습니다.');
      } else if (error.response?.status === 500) {
        toast.error('알 수 없는 오류가 발생했습니다. 관리자에게 문의하세요.');
      }

      return Promise.reject(error);
    }
);

export default api;
