import { apiClient } from './client';
import { User, UpdateProfileRequest } from '../types';

export const usersApi = {
  getProfile: () =>
    apiClient.get<User>('/users/profile'),

  updateProfile: (name: string) =>
    apiClient.put<User>('/users/profile', null, { params: { name } }),

  updateFullProfile: (data: UpdateProfileRequest) =>
    apiClient.put<User>('/users/profile/full', data),

  checkProfileComplete: () =>
    apiClient.get<boolean>('/users/profile/complete'),
};
