import type { LoginCredentials, User } from '../types/auth.types';
import api from './client';

interface AuthResponse {
  user: User;
  token: string;
}


export async function LoginRequest (credentials: LoginCredentials): Promise<AuthResponse> {
    if (import.meta.env.DEV) {
        return mockLogin(credentials);
    }

    const response = await api.post<'/auth/login', AuthResponse>('/auth/login', credentials);
    return response;
}

const mockLogin = async ( credentials: LoginCredentials): Promise<AuthResponse> => {
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