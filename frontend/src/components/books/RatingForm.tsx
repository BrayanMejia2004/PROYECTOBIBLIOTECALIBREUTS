import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { booksApi } from '../../api/books';
import { Button } from '../common/Button';
import { useTranslation } from '../../i18n';
import { StarIcon } from '../common/UserIcons';

interface RatingFormProps {
  bookId: string;
  onSuccess?: () => void;
  initialRating?: number;
  initialComment?: string;
}

export function RatingForm({ bookId, onSuccess, initialRating = 0, initialComment = '' }: RatingFormProps) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(initialComment);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    setRating(initialRating);
    setComment(initialComment);
  }, [initialRating, initialComment]);

  const mutation = useMutation({
    mutationFn: (data: { rating: number; comment?: string }) =>
      booksApi.rateBook(bookId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book', bookId] });
      if (initialRating > 0) {
        setSuccess(t('loans.ratingSuccess'));
      } else {
        setSuccess(t('loans.ratingSuccess'));
      }
      setRating(0);
      setComment('');
      onSuccess?.();
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || t('common.error'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (rating === 0) {
      setError(t('validation.required'));
      return;
    }
    
    mutation.mutate({ rating, comment: comment || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          {t('book.rating')}
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-2xl focus:outline-none transition-colors"
              aria-label={`Calificar con ${star} estrellas`}
            >
              <StarIcon 
                size={24} 
                className={star <= (hoverRating || rating) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'} 
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {t('book.description')} (opcional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder={t('book.description')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
      )}

      {success && (
        <div className="text-green-600 dark:text-green-400 text-sm">{success}</div>
      )}

      <Button
        type="submit"
        isLoading={mutation.isPending}
        disabled={rating === 0}
        className="w-full"
      >
        {initialRating > 0 ? t('loans.submitRating') : t('loans.submitRating')}
      </Button>
    </form>
  );
}
