import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loan } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useTranslation } from '../../i18n';
import { booksApi } from '../../api/books';
import { BookOpenIcon, ClipboardListIcon, CheckCircleIcon, AlertTriangleIcon, CalendarIcon, ClockIcon } from '../common/AdminIcons';
import { StarIcon } from '../common/UserIcons';

interface LoanCardProps {
  loan: Loan;
  onReturn: () => void;
}

export function LoanCard({ loan, onReturn }: LoanCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showRating, setShowRating] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const { data: userRating } = useQuery({
    queryKey: ['book-user-rating', loan.bookId],
    queryFn: () => booksApi.getUserRating(loan.bookId).then(res => res.data),
    enabled: !!loan.bookId,
  });

  const ratingMutation = useMutation({
    mutationFn: (data: { rating: number; comment?: string }) =>
      booksApi.rateBook(loan.bookId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book-user-rating', loan.bookId] });
      setRatingSubmitted(true);
      onReturn();
    },
  });

  const statusConfig = {
    ACTIVE: {
      bg: 'bg-white dark:bg-[#1a2e24]',
      border: 'border-[#c3d62f]/30',
      leftBorder: 'border-l-[#c3d62f]',
      text: 'text-[#132F20]',
      label: t('loans.statusActive'),
      icon: <ClipboardListIcon size={14} className="text-[#c3d62f]" />,
    },
    RETURNED: {
      bg: 'bg-white dark:bg-[#1a2e24]',
      border: 'border-green-200 dark:border-green-800/30',
      leftBorder: 'border-l-green-500',
      text: 'text-green-700 dark:text-green-400',
      label: t('loans.statusReturned'),
      icon: <CheckCircleIcon size={14} className="text-green-500" />,
    },
    OVERDUE: {
      bg: 'bg-white dark:bg-[#1a2e24]',
      border: 'border-red-200 dark:border-red-800/30',
      leftBorder: 'border-l-red-500',
      text: 'text-red-700 dark:text-red-400',
      label: t('loans.statusOverdue'),
      icon: <AlertTriangleIcon size={14} className="text-red-500" />,
    },
  };

  const status = statusConfig[loan.status];
  
  const isOverdue = loan.status === 'OVERDUE' || 
    (loan.status === 'ACTIVE' && new Date(loan.dueDate) < new Date());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    if (diffDays === -1) return 'Ayer';
    if (diffDays > 0 && diffDays <= 7) return `En ${diffDays} días`;
    if (diffDays < 0 && diffDays >= -7) return `Hace ${Math.abs(diffDays)} días`;
    return formatDate(dateString);
  };

  return (
    <Card 
      className={`
        p-4 border-l-4 ${status.border} ${status.leftBorder}
        card-lift animate-fade-in
      `}
    >
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* Book Cover - Hidden on mobile, visible on desktop */}
        <div 
          className="hidden sm:block flex-shrink-0 cursor-pointer"
          onClick={() => navigate(`/books/${loan.bookId}`)}
        >
          {loan.book?.coverImage ? (
            <img 
              src={loan.book.coverImage} 
              alt={loan.book?.title || 'Libro'}
              className="w-16 h-24 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow"
            />
          ) : (
            <div className="w-16 h-24 bg-[#c3d62f]/10 rounded-lg flex items-center justify-center">
              <BookOpenIcon size={24} className="text-[#c3d62f]" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h3 
                className="font-semibold text-[#132F20] dark:text-white truncate cursor-pointer hover:text-[#c3d62f] transition-colors"
                onClick={() => navigate(`/books/${loan.bookId}`)}
              >
                {loan.book?.title || loan.bookTitle || 'Libro'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                {loan.book?.author || 'Autor desconocido'}
              </p>
            </div>
            
            <span className={`
              flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
              ${status.bg} ${status.border}
            `}>
              <span>{status.icon}</span>
              <span className={status.text}>{status.label}</span>
            </span>
          </div>

          {/* Dates */}
          <div className="flex flex-wrap gap-3 text-sm mt-3">
            <div className="flex items-center gap-1.5">
              <CalendarIcon size={16} className="text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">
                Préstamo: <span className="font-medium">{formatDate(loan.loanDate)}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ClockIcon size={16} className="text-gray-400" />
              <span className={`${isOverdue ? 'text-red-500 font-medium' : 'text-gray-600 dark:text-gray-300'}`}>
                Vence: <span className="font-medium">{getRelativeDate(loan.dueDate)}</span>
              </span>
            </div>
            {loan.returnDate && (
              <div className="flex items-center gap-1.5">
                <CheckCircleIcon size={16} className="text-green-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  Devuelto: <span className="font-medium">{formatDate(loan.returnDate)}</span>
                </span>
              </div>
            )}
          </div>

          {/* Return Button */}
          {loan.status === 'ACTIVE' && !ratingSubmitted && !showRating && (
            <div className="mt-4">
              <Button
                onClick={() => setShowRating(true)}
                className="btn-ripple"
              >
                {t('loans.returnBook')}
              </Button>
            </div>
          )}

          {/* Rating Form */}
          {loan.status === 'ACTIVE' && showRating && !ratingSubmitted && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">{t('book.rateBook')}</h4>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => ratingMutation.mutate({ rating: star })}
                    disabled={ratingMutation.isPending}
                    className="focus:outline-none"
                  >
                    <StarIcon 
                      size={28} 
                      className={star <= (userRating?.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'} 
                    />
                  </button>
                ))}
              </div>
              {ratingMutation.isPending && (
                <p className="text-xs text-gray-500">{t('common.loading')}...</p>
              )}
            </div>
          )}

          {ratingSubmitted && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-700 dark:text-green-400 text-sm">
              ✓ {t('loans.ratingSuccess')}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
