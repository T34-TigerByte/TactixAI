export type Roles = 'admin' | 'user';

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

export interface LoginCrendentials {
    email: string;
    password: string;
}

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCrendentials) => Promise<void>;
    logout: () => void;
}

