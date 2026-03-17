const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;
const REFRESH_TOKEN_KEY = `${TOKEN_KEY}_REFRESH`;

export const saveToken = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};
