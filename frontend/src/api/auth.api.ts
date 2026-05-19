import api from './axios';
import { User, ApiResponse } from '@/types';

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  register: async (payload: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<AuthResponse> => {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', payload);
    return data.data!;
  },

  login: async (payload: { email: string; password: string }): Promise<AuthResponse> => {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', payload);
    return data.data!;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return data.data!.user;
  },
};
