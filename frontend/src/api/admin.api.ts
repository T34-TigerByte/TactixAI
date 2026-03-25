import type { AdminStats, AdminUserListItem, CreateUserPayload, UpdateUserPayload } from "../types/admin.types";
import api
 from "./client";

 /* Fetch admin user dashboard overview stats */
export async function getAdminStatsRequest(): Promise<AdminStats> {
    const response = await api.get<AdminStats>('/admin/stats');
    return response.data
}

/* Fetch users list in User Management Tab */
export async function getUsersRequest(): Promise<AdminUserListItem[]> {
    const response = await api.get<{ data: AdminUserListItem[] }>('/admin/users');
    return response.data.data
}

/* Fetch one user detail data for view detail page*/
export async function getUserByIdRequest(userId: number): Promise<AdminUserListItem> {
    const response = await api.get<AdminUserListItem>(`/admin/users/${userId}`);
    return response.data
}

export async function createUserRequest(payload: CreateUserPayload): Promise<AdminUserListItem> {
    const response = await api.post<AdminUserListItem>('/admin/users', payload);
    return response.data
}

export async function updateUserRequest(userId: number, payload: UpdateUserPayload): Promise<AdminUserListItem> {
    const response = await api.put<AdminUserListItem>(`/admin/users/${userId}`, payload);
    return response.data;
}

export async function deleteUserRequest(userId: number): Promise<void> {
    await api.delete(`/admin/users/${userId}`);
}