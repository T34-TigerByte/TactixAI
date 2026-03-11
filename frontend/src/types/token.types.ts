
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;

export const saveToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
}

export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
}

export const clearToken = () => {
    localStorage.removeItem(TOKEN_KEY);
}
