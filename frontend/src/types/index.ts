export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  document: string;
  name: string;
  semester: number;
  phone: string;
  email: string;
  role: Role;
  photoUrl?: string;
}

export interface AuthResponse {
  token: string;
  id: string;
  document: string;
  name: string;
  semester: number;
  phone: string;
  email: string;
  role: Role;
  photoUrl?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  summary: string;
  publicationDate: string;
  pages: number;
  language: string;
  category: string;
  rating: number;
  ratingCount: number;
  availability: boolean;
  coverImage?: string;
}

export type LoanStatus = 'ACTIVE' | 'RETURNED' | 'OVERDUE';

export interface Loan {
  id: string;
  userId: string;
  user?: User;
  bookId: string;
  book?: Book;
  bookTitle?: string;
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
  status: LoanStatus;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  document: string;
  name: string;
  semester: number;
  phone: string;
}

export interface CreateLoanRequest {
  bookId: string;
}

export interface RatingRequest {
  rating: number;
  comment?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface UpdateUserRequest {
  document: string;
  name: string;
  semester: number;
  phone: string;
  email: string;
  password?: string;
}

export interface Notification {
  id: string;
  type: 'OVERDUE' | 'DUE_SOON' | 'BOOK_ADDED';
  message: string;
  loanId?: string;
  bookTitle?: string;
  dueDate?: string;
  userName?: string;
  read: boolean;
  createdAt: string;
}
