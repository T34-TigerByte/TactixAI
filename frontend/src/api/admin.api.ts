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
  registrationRequestListSchema,
  type AdminStats,
  type AdminUserListItem,
  type AdminUserById,
  type AdminUserListPage,
  type AdminActivitiesPage,
  type ChatMessagesPage,
  type AdminSessionListPage,
  type AdminSessionSummary,
  type AdminAnalytics,
  type RegistrationRequestList,
  adminAnalyticsSchema,
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

export async function getAdminAnalyticsRequest(): Promise<AdminAnalytics> {
  const response = await api.get('/admin/analytics');
  return parseResponse(adminAnalyticsSchema,response.data,'getAdminAnalyticsRequest');
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

export async function updateUserRequest(userId: number, payload: UpdateUserPayload): Promise<void> {
  await api.put(`/admin/users/${userId}`, payload);
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

export async function getRegistrationRequestsRequest(status = 'pending', page = 1): Promise<RegistrationRequestList> {
  const response = await api.get('/admin/registration-requests', { params: { status, page } });
  return parseResponse(registrationRequestListSchema, response.data, 'getRegistrationRequestsRequest');
}

export async function approveRegistrationRequestRequest(requestId: number): Promise<void> {
  await api.post(`/admin/registration-requests/${requestId}/approve`);
}

export async function rejectRegistrationRequestRequest(requestId: number): Promise<void> {
  await api.post(`/admin/registration-requests/${requestId}/reject`);
}
