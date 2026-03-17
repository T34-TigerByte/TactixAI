export type Roles = 'admin' | 'learner';

export interface UserSession {
    total: number;
    average_score: number;
    total_hours: number;
}

export interface UserProgress {
    communication: number;
    negotication: number;
    risk_management: number;
}

export interface User {
    role: Roles;
    username?: string;
    session?: UserSession;
    progress?: UserProgress;
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

