import type { LoginCredentials, User } from '../types/auth.types';
import api from './client';

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}


export async function LoginRequest (credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
}

export async function getMeRequest(): Promise<User> {
    const response = await api.get<User>('/me');
    return response.data;
}

export async function logoutRequest(): Promise<void> {
    await api.post('/auth/logout');
}

/*
const mockLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000)) // simulate network delay

    const mockData: Record<string, AuthResponse> = {
      'admin@test.com': {
        user: {
            id: '1',
            company: '',
            email: 'admin@test.com',
            username: 'Admin',
            role: 'admin',
            password: 'demo123',
            created_at:  new Date(),
            updated_at: new Date(),
        },
        token: 'mock-admin-token',
      },
      'learner@test.com': {
        user: {
          id: '2',
          email: 'learner@test.com',
          username: 'Learner',
          role: 'learner',
          company: 'Test Company',
          password: 'demo123',
          created_at:  new Date(),
          updated_at: new Date(),
        },
        token: 'mock-learner-token',
      },
    };
    const match = mockData[credentials.email];

    if (!match) {
      throw new Error('Invalid credentials');
    }
    return match;
}
*/