import { jwtDecode } from "jwt-decode";

export interface TokenPayload {
  sub: string;
  email: string;
  name?: string;
  role?: string;
  exp?: number;
  profileImage?: number;
}

export const parseToken = (token: string): TokenPayload | null => {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp?: number }>(token);
    if (!decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
};
