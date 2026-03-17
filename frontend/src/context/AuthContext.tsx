import { createContext, useState, useEffect, type ReactNode } from "react";
import { getToken, saveToken, clearToken } from "../utils/auth.utils.ts";
import type { AuthResponse } from "../api/auth.api.ts";
import { LoginRequest, getMeRequest } from "../api/auth.api.ts";
import type { User, LoginCredentials, AuthContextType } from "../types/auth.types.ts";

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({children} : {children: ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (token) {
            getMeRequest()
                .then(setUser)
                .catch(() => clearToken())
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (credentials: LoginCredentials): Promise<User> => {
        const { access_token, refresh_token }: AuthResponse = await LoginRequest(credentials);
        saveToken(access_token, refresh_token);
        const user = await getMeRequest();
        setUser(user);
        return user;
    }

    const logout = async () => {
        clearToken();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

