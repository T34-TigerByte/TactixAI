import type { LoginCredentials } from '../types/auth.types';
import type { User } from '../schemas/api.schema';
import api from './client';
import { parseResponse } from '../utils/parse.utils';
import { authResponseSchema, userSchema, type AuthResponse } from '../schemas/api.schema';

export type { AuthResponse };

export async function LoginRequest(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await api.post('/auth/login', credentials);
  return parseResponse(authResponseSchema, response.data, 'LoginRequest');
}

export async function getMeRequest(): Promise<User> {
  const response = await api.get('/me');
  return parseResponse(userSchema, response.data, 'getMeRequest');
}

export async function logoutRequest(): Promise<void> {
  await api.post('/auth/logout');
}
