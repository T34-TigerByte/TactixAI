import type { AdminStats, AdminUserListItem, CreateUserPayload, UpdateUserPayload } from '../types/admin.types';
import api from './client';
import { parseResponse } from '../utils/parse.utils';
import {
  adminStatsSchema,
  adminUserSchema,
  adminUserByIdSchema,
  adminUserListSchema,
  type AdminUserById,
  type LearnerActivity,
  learnerActivitySchema,
} from '../schemas/api.schema';

export async function getAdminStatsRequest(): Promise<AdminStats> {
  const response = await api.get('/admin/stats');
  return parseResponse(adminStatsSchema, response.data, 'getAdminStatsRequest');
}

export async function getUserActivitiesRequest(): Promise<LearnerActivity[]> {
  const response = await api.get<{data: LearnerActivity[] }>('/admin/activities');
  return parseResponse(learnerActivitySchema.array(), response.data.data, 'getUserActivitiesRequest');
}

export async function getUsersRequest(): Promise<AdminUserListItem[]> {
  const response = await api.get<{ data: AdminUserListItem[] }>('/admin/users');
  return parseResponse(adminUserListSchema, response.data.data, 'getUsersRequest');
}

export async function getUserByIdRequest(userId: number): Promise<AdminUserById> {
  const response = await api.get(`/admin/users/${userId}`);
  return parseResponse(adminUserByIdSchema, response.data, 'getUserByIdRequest');
}

export async function createUserRequest(payload: CreateUserPayload): Promise<AdminUserListItem> {
  const response = await api.post('/admin/users', payload);
  return parseResponse(adminUserSchema, response.data, 'createUserRequest');
}

export async function updateUserRequest(userId: number, payload: UpdateUserPayload): Promise<AdminUserListItem> {
  const response = await api.put(`/admin/users/${userId}`, payload);
  return parseResponse(adminUserSchema, response.data, 'updateUserRequest');
}

export async function deleteUserRequest(userId: number): Promise<void> {
  await api.delete(`/admin/users/${userId}`);
}
