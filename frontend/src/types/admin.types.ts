import type { Role } from "./auth.types";


export interface AdminStats {
    total_users: number;
    active_learners: number;
    total_sessions: number;
    uptime: number;
}

export interface UserSession {
    completed: number;
    last_session_at: number | null;  // Unix timestamp
    total_time_spent: number;
}

export interface AdminUserListItem {
    id: number;
    name: string;
    email: string;
    joined_at: number;  // Unix timestamp
    company: string;
    session: UserSession;
}

export interface CreateUserPayload {
    first_name: string;
    last_name: string;
    email: string;
    role: Role;
    company: string;
}

export interface UpdateUserPayload {
    first_name?: string;
    last_name?: string;
    // email?: string;
    // role?: Role;
    // company?: string;
}
