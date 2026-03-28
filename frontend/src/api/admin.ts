import { apiClient } from './client';
import { User, Loan, PageResponse, UpdateUserRequest } from '../types';

export const adminApi = {
  getAllLoans: (page = 0, size = 20) =>
    apiClient.get<PageResponse<Loan>>('/admin/loans', {
      params: { page, size },
    }),

  getAllUsers: (page = 0, size = 20) =>
    apiClient.get<PageResponse<User>>('/admin/users', {
      params: { page, size },
    }),

  getStats: () =>
    apiClient.get<{
      totalBooks: number;
      totalUsers: number;
      activeLoans: number;
      overdueLoans: number;
      returnedLoans: number;
    }>('/admin/stats'),

  updateUser: (id: string, data: UpdateUserRequest) =>
    apiClient.put<User>(`/admin/users/${id}`, data),

  deleteUser: (id: string) =>
    apiClient.delete(`/admin/users/${id}`),
};
