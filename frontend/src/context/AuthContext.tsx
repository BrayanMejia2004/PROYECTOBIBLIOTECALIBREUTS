import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../types';
import { authApi } from '../api/auth';
import { adminApi } from '../api/admin';
import { booksApi } from '../api/books';
import { queryClient } from '../App';
import { useTranslation } from '../i18n';
import { isTokenExpired } from '../utils/jwt';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<User>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getStoredUser(): User | null {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [isLoading, setIsLoading] = useState(true);
  const { resetLanguage } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest): Promise<User> => {
    queryClient.clear();
    
    const response = await authApi.login(credentials);
    const data: AuthResponse = response.data;
    
    localStorage.setItem('token', data.token);
    const userData: User = {
      id: data.id,
      document: data.document,
      name: data.name,
      semester: data.semester,
      phone: data.phone,
      email: data.email,
      role: data.role,
      photoUrl: data.photoUrl,
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    await prefetchInitialData(data.role);
    
    return userData;
  };

  const prefetchInitialData = async (role: string) => {
    try {
      if (role === 'ADMIN') {
        await Promise.all([
          queryClient.prefetchQuery({
            queryKey: ['adminStats'],
            queryFn: () => adminApi.getStats().then(res => res.data),
          }),
          queryClient.prefetchQuery({
            queryKey: ['adminBooks'],
            queryFn: () => booksApi.getAll(0, 100).then(res => res.data),
          }),
          queryClient.prefetchQuery({
            queryKey: ['adminLoans', 0],
            queryFn: () => adminApi.getAllLoans(0, 10).then(res => res.data),
          }),
          queryClient.prefetchQuery({
            queryKey: ['adminUsers', 0],
            queryFn: () => adminApi.getAllUsers(0, 10).then(res => res.data),
          }),
        ]);
      } else {
        await Promise.all([
          queryClient.prefetchQuery({
            queryKey: ['books', 'all', '', '', 0],
            queryFn: () => booksApi.getAll(0, 12).then(res => res.data),
          }),
        ]);
      }
    } catch (error) {
      console.error('Error prefetching initial data:', error);
    }
  };

  const register = async (data: RegisterRequest) => {
    const response = await authApi.register(data);
    const authData: AuthResponse = response.data;
    
    localStorage.setItem('token', authData.token);
    const userData: User = {
      id: authData.id,
      document: authData.document,
      name: authData.name,
      semester: authData.semester,
      phone: authData.phone,
      email: authData.email,
      role: authData.role,
      photoUrl: authData.photoUrl,
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    queryClient.clear();
    setUser(null);
    resetLanguage();
  };

  const refreshToken = async (): Promise<boolean> => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const response = await authApi.refreshToken(token);
      const data: AuthResponse = response.data;
      localStorage.setItem('token', data.token);
      const userData: User = {
        id: data.id,
        document: data.document,
        name: data.name,
        semester: data.semester,
        phone: data.phone,
        email: data.email,
        role: data.role,
        photoUrl: data.photoUrl,
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch {
      return false;
    }
  };

  const updateUser = (updates: Partial<User>) => {
    const currentUser = user;
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...updates };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const token = localStorage.getItem('token');
      if (token && isTokenExpired(token)) {
        const refreshed = await refreshToken();
        if (!refreshed) {
          logout();
        }
      }
    };
    
    const interval = setInterval(checkAndRefreshToken, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshToken,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
