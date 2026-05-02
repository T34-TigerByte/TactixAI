import api from './client';
import { parseResponse } from '../utils/parse.utils';
import {
  adminStatsSchema,
  adminUserSchema,
  adminUserByIdSchema,
  adminUserListPageSchema,
  adminActivitiesPageSchema,
  chatMessagesPageSchema,
  adminSessionListPageSchema,
  adminSessionSummarySchema,
  type AdminStats,
  type AdminUserListItem,
  type AdminUserById,
  type AdminUserListPage,
  type AdminActivitiesPage,
  type ChatMessagesPage,
  type AdminSessionListPage,
  type AdminSessionSummary,
} from '../schemas/api.schema';
import type { CreateUserPayload, UpdateUserPayload } from '../schemas/user.schema';

export async function getAdminStatsRequest(): Promise<AdminStats> {
  const response = await api.get('/admin/stats');
  return parseResponse(adminStatsSchema, response.data, 'getAdminStatsRequest');
}

export async function getUserActivitiesRequest(cursor?: string): Promise<AdminActivitiesPage> {
  const params = cursor ? { cursor } : {};
  const response = await api.get('/admin/activities', { params });
  return parseResponse(adminActivitiesPageSchema, response.data, 'getUserActivitiesRequest');
}

export async function getUsersRequest(cursor?: string): Promise<AdminUserListPage> {
  const params = cursor ? { cursor } : {};
  const response = await api.get('/admin/users', { params });
  return parseResponse(adminUserListPageSchema, response.data, 'getUsersRequest');
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

export async function getAdminSessionsRequest(userId: number, cursor?: string): Promise<AdminSessionListPage> {
  const params: Record<string, unknown> = { user_id: userId };
  if (cursor) params.cursor = cursor;
  const response = await api.get('/admin/sessions', { params });
  return parseResponse(adminSessionListPageSchema, response.data, 'getAdminSessionsRequest');
}

export async function getAdminSessionSummaryRequest(sessionUuid: string): Promise<AdminSessionSummary> {
  const response = await api.get(`/admin/sessions/${sessionUuid}/summary`);
  return parseResponse(adminSessionSummarySchema, response.data, 'getAdminSessionSummaryRequest');
}

export async function getAdminSessionMessagesRequest(sessionUuid: string, cursor?: string): Promise<ChatMessagesPage> {
  const params = cursor ? { cursor } : {};
  const response = await api.get(`/admin/sessions/${sessionUuid}/messages`, { params });
  return parseResponse(chatMessagesPageSchema, response.data, 'getAdminSessionMessagesRequest');
}
