import { createContext, useState, useEffect, type ReactNode } from "react";
import { getToken, saveToken, clearToken } from "../utils/auth.utils.ts";
import type { User, LoginCredentials, AuthContextType } from "../types/auth.types.ts";
import { LoginRequest } from "../api/auth.api.ts";

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({children} : {children: ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (token) {
           // GET /auth/me to validate token and fetch user data
           // For the time being, we'll mock this with a mock user data just with the token
            const savedUser = localStorage.getItem('mock_user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: LoginCredentials) => {
        const {user, token} = await LoginRequest(credentials);
        saveToken(token);
        localStorage.setItem('mock_user', JSON.stringify(user)); // Mocking user data storage
        setUser(user);
    }

    const logout = async () => {
        clearToken();
        localStorage.removeItem('mock_user');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

