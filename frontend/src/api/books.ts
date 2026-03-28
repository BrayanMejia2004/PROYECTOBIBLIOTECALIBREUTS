import { apiClient } from './client';
import { Book, PageResponse, RatingRequest } from '../types';

export interface CreateBookRequest {
  title: string;
  author: string;
  summary: string;
  publicationDate: string;
  pages: number;
  language: string;
  category: string;
  coverImage?: string;
}

export interface UpdateBookRequest {
  title?: string;
  author?: string;
  summary?: string;
  publicationDate?: string;
  pages?: number;
  language?: string;
  category?: string;
  availability?: boolean;
  coverImage?: string;
}

export interface UserRatingResponse {
  rating: number;
  comment?: string;
}

export const booksApi = {
  getAll: (page = 0, size = 20) =>
    apiClient.get<PageResponse<Book>>('/books', {
      params: { page, size },
    }),

  getAvailable: (page = 0, size = 20) =>
    apiClient.get<PageResponse<Book>>('/books/available', {
      params: { page, size },
    }),

  search: (q: string, page = 0, size = 20) =>
    apiClient.get<PageResponse<Book>>('/books/search', {
      params: { q, page, size },
    }),

  getByCategory: (category: string, page = 0, size = 20) =>
    apiClient.get<PageResponse<Book>>(`/books/category/${category}`, {
      params: { page, size },
    }),

  getByAuthor: (author: string, page = 0, size = 20) =>
    apiClient.get<PageResponse<Book>>(`/books/author/${author}`, {
      params: { page, size },
    }),

  getPopular: () =>
    apiClient.get<Book[]>('/books/popular'),

  getTopRated: () =>
    apiClient.get<Book[]>('/books/top-rated'),

  getById: (id: string) =>
    apiClient.get<Book>(`/books/${id}`),

  create: (data: CreateBookRequest) =>
    apiClient.post<Book>('/books', data),

  update: (id: string, data: UpdateBookRequest) =>
    apiClient.put<Book>(`/books/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/books/${id}`),

  rateBook: (id: string, data: RatingRequest) =>
    apiClient.post<Book>(`/books/${id}/rate`, data),

  getUserRating: (id: string) =>
    apiClient.get<UserRatingResponse | null>(`/books/${id}/user-rating`),
};
