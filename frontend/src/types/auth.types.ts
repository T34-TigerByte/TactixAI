export type Role = 'admin' | 'learner';

export type { User } from '../schemas/api.schema';
import type { User } from '../schemas/api.schema';

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

