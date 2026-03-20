import type { AdminStats, AdminUserListItem, CreateUserPayload, UpdateUserPayload } from "../types/admin.types";
import api
 from "./client";

 /* Fetch admin user dashboard overview stats */
export async function getAdminStatsRequest(): Promise<AdminStats> {
    const response = await api.get<AdminStats>('/admin/stats');
    return response.data
}

/* Fetch users list in User Management Tab */
export async function getUsersRequest(query: string): Promise<AdminUserListItem[]> {
    const response = await api.get<AdminUserListItem[]>('/admin/users', {
        params: query ? { q: query } : undefined
    });
    return response.data
}

/* Fetch one user detail data for view detail page*/
export async function getUserByIdRequest(userId: string): Promise<AdminUserListItem> {
    const response = await api.get<AdminUserListItem>(`/admin/users/${userId}`);
    return response.data
}

export async function createUserRequest(payload: CreateUserPayload): Promise<AdminUserListItem> {
    const response = await api.post<AdminUserListItem>('/admin/users', payload);
    return response.data
}

export async function updateUserRequest(payload: UpdateUserPayload): Promise<AdminUserListItem> {
    const response = await api.put<AdminUserListItem>('/admin/users', payload);
    return response.data;
}

export async function deleteUserRequest(userId: string): Promise<void> {
    await api.delete(`/admin/users/${userId}`);
}