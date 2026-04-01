import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { booksApi } from '../api/books';
import { loansApi } from '../api/loans';
import { usersApi } from '../api/users';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { useTranslation } from '../i18n';
import { BookOpenIcon } from '../components/common/AdminIcons';
import { StarIcon } from '../components/common/UserIcons';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [loanMessage, setLoanMessage] = useState('');

  const isAdmin = user?.role === 'ADMIN';

  const { data: book, isLoading, isError } = useQuery({
    queryKey: ['book', id],
    queryFn: () => booksApi.getById(id!).then(res => res.data),
    enabled: !!id,
  });

  const loanMutation = useMutation({
    mutationFn: () => loansApi.create({ bookId: id! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book', id] });
      setLoanMessage(t('book.loanRequested'));
      setTimeout(() => navigate('/catalogue'), 2000);
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      setLoanMessage(axiosError.response?.data?.message || t('common.error'));
    },
  });



  if (isLoading) {
    return <Spinner size="lg" />;
  }

  if (isError || !book) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">{t('common.error')}</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          {t('common.back')}
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto fade-in w-full">
      <button
        onClick={() => navigate('/catalogue')}
        className="text-[#132F20] dark:text-[#c3d62f] hover:text-[#c3d62f] dark:hover:text-[#a8b828] mb-4 sm:mb-6 md:mb-8 flex items-center gap-1 transition-colors text-sm sm:text-base"
      >
        ← {t('common.back')}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="md:col-span-1 slide-up">
          {book.coverImage ? (
            <img 
              src={book.coverImage} 
              alt={book.title}
              className="w-full h-64 sm:h-80 md:h-auto max-h-96 object-cover rounded-xl shadow-lg card-lift mx-auto"
            />
          ) : (
            <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 sm:h-80 md:h-auto md:min-h-80 flex items-center justify-center card-lift">
              <BookOpenIcon size={48} className="sm:w-16 sm:h-16 text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </div>

        <div className="md:col-span-2 space-y-4 sm:space-y-6">
          <div className="slide-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
              {book.title}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">{book.author}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 slide-up" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center gap-1">
              <StarIcon size={20} className="text-yellow-500 fill-current" />
              <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                {book.rating ? book.rating.toFixed(1) : 'N/A'}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm hidden sm:inline">({book.ratingCount} {t('book.reviews')})</span>
            </div>
            <span
              className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                book.availability
                  ? 'bg-[#c3d62f] dark:bg-[#c3d62f] text-[#132F20] dark:text-[#132F20]'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              }`}
            >
              {book.availability ? t('book.available') : t('book.unavailable')}
            </span>
          </div>

          <Card className="p-4 sm:p-6 card-lift slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 text-sm sm:text-base">{t('book.description')}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{book.summary || t('book.noDescription')}</p>
          </Card>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 slide-up" style={{ animationDelay: '0.25s' }}>
            <div className="bg-white dark:bg-[#1a2e24] p-3 sm:p-4 rounded-lg border border-[#c3d62f]/20">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-white">{t('book.category')}</p>
              <p className="font-medium text-gray-900 dark:text-gray-400 text-sm sm:text-base">{book.category}</p>
            </div>
            <div className="bg-white dark:bg-[#1a2e24] p-3 sm:p-4 rounded-lg border border-[#c3d62f]/20">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-white">{t('book.language')}</p>
              <p className="font-medium text-gray-900 dark:text-gray-400 text-sm sm:text-base">{book.language}</p>
            </div>
            <div className="bg-white dark:bg-[#1a2e24] p-3 sm:p-4 rounded-lg border border-[#c3d62f]/20">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-white">{t('book.pages')}</p>
              <p className="font-medium text-gray-900 dark:text-gray-400 text-sm sm:text-base">{book.pages}</p>
            </div>
            <div className="bg-white dark:bg-[#1a2e24] p-3 sm:p-4 rounded-lg border border-[#c3d62f]/20">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-white">{t('book.year')}</p>
              <p className="font-medium text-gray-900 dark:text-gray-400 text-sm sm:text-base">{formatDate(book.publicationDate)}</p>
            </div>
          </div>

          {loanMessage && (
            <div className={`px-4 py-3 rounded-lg slide-up text-sm sm:text-base ${
              loanMessage.includes('Error') 
                ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800' 
                : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
            }`}>
              {loanMessage}
            </div>
          )}

          {book.availability && isAuthenticated && !isAdmin && (
            <Button
              onClick={async () => {
                const isComplete = await usersApi.checkProfileComplete().then(res => res.data);
                if (!isComplete) {
                  setLoanMessage(t('profile.profileRequired'));
                  setTimeout(() => navigate('/profile'), 2000);
                  return;
                }
                loanMutation.mutate();
              }}
              isLoading={loanMutation.isPending}
              className="w-full card-lift slide-up text-sm sm:text-base py-2.5 sm:py-3"
              style={{ animationDelay: '0.3s' }}
            >
              {t('book.requestLoan')}
            </Button>
          )}

          {book.availability && !isAuthenticated && (
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm sm:text-base">
                {t('book.addToCollection')}
              </p>
              <Button onClick={() => navigate('/login')} className="w-full text-sm sm:text-base py-2.5 sm:py-3">
                {t('auth.login')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
