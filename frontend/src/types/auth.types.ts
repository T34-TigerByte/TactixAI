export type Role = 'admin' | 'learner';

export interface User {
    role: Role;
    username: string;
    email: string;
    company?: string;
    created_at: string;
    updated_at: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<User>;
    logout: () => void;
}

