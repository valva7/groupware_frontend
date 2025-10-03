export const storage = {
  setLocal: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  getLocal: <T>(key: string): T | null => {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  },

  removeLocal: (key: string) => {
    localStorage.removeItem(key);
  },

  setSession: (key: string, value: any) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  },

  getSession: <T>(key: string): T | null => {
    const value = sessionStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  },

  removeSession: (key: string) => {
    sessionStorage.removeItem(key);
  },
};
