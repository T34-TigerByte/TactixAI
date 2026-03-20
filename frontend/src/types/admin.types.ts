import type { User, Role } from "./auth.types";


export interface AdminStats {
    total_users: number;
    active_learners: number;
    total_sessions: number;                                                                                               
    uptime: number;                                                                                                       
}

export interface AdminUser extends User {}

export interface AdminUserListItem extends User {
    last_session?: string;
    completed_sessions?: number;
    time_spent?: number;
}

export interface CreateUserPayload {
    username: string;
    email: string;
    password: string;
    role: Role;
    company?: string;
}

export interface UpdateUserPayload {
    username?: string;
    email?: string;
    role?: Role;
    company?: string;
}
