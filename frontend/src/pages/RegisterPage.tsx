import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { PasswordInput } from '../components/common/PasswordInput';
import { Card } from '../components/common/Card';
import { useTranslation } from '../i18n';
import { registerSchema, RegisterFormData, getPasswordStrength } from '../utils/validation';

interface ApiError {
  response?: {
    data?: {
      message?: string;
      fieldErrors?: Record<string, string>;
    };
  };
  message?: string;
  status?: number;
}

export default function RegisterPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setError: setFormError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  
  const passwordValue = watch('password', '');
  const passwordStrength = getPasswordStrength(passwordValue);

  const handleApiError = (err: unknown) => {
    const axiosError = err as ApiError;
    const responseData = axiosError.response?.data;
    
    if (responseData?.fieldErrors) {
      Object.entries(responseData.fieldErrors).forEach(([field, message]) => {
        setFormError(field as keyof RegisterFormData, { 
          type: 'server', 
          message: message as string 
        });
      });
      if (responseData.message) {
        setError(responseData.message);
      }
    } else {
      setError(responseData?.message || axiosError.message || t('auth.registerError'));
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setError('');
    setIsLoading(true);

    try {
      await registerUser({
        email: data.email,
        password: data.password,
      });
      navigate('/');
    } catch (err: unknown) {
      console.error('Error al registrarse:', err);
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      <div 
        className="absolute inset-x-0 top-0 h-[70vh]"
        style={{ 
          background: 'radial-gradient(ellipse at top, #c3d730 0%, #9aa836 100%)',
          borderBottomLeftRadius: '50% 20%',
          borderBottomRightRadius: '50% 20%'
        }}
      />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4">
        <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-30 h-30 rounded-full bg-[#c3d62f]/20 mb-4 bg-white dark:bg-[#1a2e24] border-4 border-[#c3d62f]">
            <svg className="w-16 h-16 text-[#132F20] dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-5xl font-display font-semibold text-[#132F20] dark:text-[#132F20]">Biblioteca UTS</h1>
          <p className="mt-2 text-[#5a6b5c] dark:text-[#132F20]">{t('auth.registerSubtitle')}</p>
        </div>

        <Card className="p-8 bg-white/90 dark:bg-[#1a2e24]/90 backdrop-blur-sm border border-[#c3d62f]/20 shadow-[0_2px_8px_rgba(19,47,32,0.1)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm" role="alert">
                {error}
              </div>
            )}

            <Input
              label={t('auth.email')}
              type="email"
              placeholder="tuemail@uts.edu.co"
              {...register('email')}
              error={errors.email?.message}
            />

            <PasswordInput
              label={t('auth.password')}
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />
            
            {passwordValue && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium ${passwordStrength.color}`}>
                    Fortaleza: {passwordStrength.label}
                  </span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        level <= passwordStrength.score
                          ? passwordStrength.score <= 2
                            ? 'bg-red-500'
                            : passwordStrength.score <= 4
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Mínimo: 8 caracteres, 1 mayúscula, 1 número, 1 carácter especial
                </p>
              </div>
            )}

            <PasswordInput
              label={t('auth.confirmPassword')}
              placeholder="••••••••"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />

            <Button 
              type="submit" 
              className="w-full" 
              isLoading={isLoading}
            >
              {t('auth.register')}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-[#5a6b5c] dark:text-white">{t('auth.hasAccount')} </span>
            <Link to="/login" className="text-[#132F20] dark:text-[#c3d62f] hover:underline font-medium">
              {t('auth.login')}
            </Link>
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
}
