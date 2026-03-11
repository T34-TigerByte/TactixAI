export type Roles = 'admin' | 'learner';

export interface User {
    id: string;
    username: string;
    company: string;
    email: string;
    password: string;
    role: Roles;
    created_at: Date;
    updated_at: Date;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
}

