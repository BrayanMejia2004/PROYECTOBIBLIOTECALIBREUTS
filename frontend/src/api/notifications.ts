import { apiClient } from './client';
import { Notification } from '../types';

export const notificationsApi = {
  getAll: () =>
    apiClient.get<Notification[]>('/notifications'),

  markAsRead: (id: string) =>
    apiClient.put<void>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    apiClient.put<void>('/notifications/read-all'),

  getAdmin: () =>
    apiClient.get<Notification[]>('/notifications/admin'),

  markAdminAsRead: (id: string) =>
    apiClient.put<void>(`/notifications/admin/${id}/read`),

  markAllAdminAsRead: () =>
    apiClient.put<void>('/notifications/admin/read-all'),
};
