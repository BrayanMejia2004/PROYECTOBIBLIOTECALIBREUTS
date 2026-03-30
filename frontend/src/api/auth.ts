import { apiClient } from './client';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', data),

  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>('/auth/register', data),

  refreshToken: (token: string) =>
    apiClient.post<AuthResponse>('/auth/refresh', { token }),

  updateProfile: (name?: string, photoUrl?: string) =>
    apiClient.put<User>('/users/profile', null, { params: { name, photoUrl } }),

  updateProfilePhoto: (photoUrl: string | null) =>
    apiClient.put<User>('/users/profile/photo', { photoUrl }),
};
