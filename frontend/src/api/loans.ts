import { apiClient } from './client';
import { Loan, CreateLoanRequest, PageResponse } from '../types';

export const loansApi = {
  create: (data: CreateLoanRequest) =>
    apiClient.post<Loan>('/loans', data),

  getUserLoans: (page = 0, size = 20) =>
    apiClient.get<PageResponse<Loan>>('/loans', {
      params: { page, size },
    }),

  getById: (id: string) =>
    apiClient.get<Loan>(`/loans/${id}`),

  returnLoan: (id: string) =>
    apiClient.post<Loan>(`/loans/${id}/return`),
};
