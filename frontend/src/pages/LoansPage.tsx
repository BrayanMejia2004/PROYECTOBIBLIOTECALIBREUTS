import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loansApi } from '../api/loans';
import { LoanCard } from '../components/users/LoanCard';
import { Spinner } from '../components/common/Spinner';
import { useTranslation } from '../i18n';
import { BookOpenIcon, ClipboardListIcon } from '../components/common/AdminIcons';

export default function LoansPage() {
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: loansData, isLoading, isError } = useQuery({
    queryKey: ['loans', page],
    queryFn: () => loansApi.getUserLoans(page, 10).then(res => res.data),
  });

  const returnMutation = useMutation({
    mutationFn: (loanId: string) => loansApi.returnLoan(loanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto py-4 sm:py-8 px-3 sm:px-4 animate-fade-in">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
          {t('common.error')}
        </div>
      </div>
    );
  }

  const activeLoans = loansData?.content.filter(l => l.status === 'ACTIVE') || [];
  const returnedLoans = loansData?.content.filter(l => l.status !== 'ACTIVE') || [];

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4 space-y-6 sm:space-y-8 w-full">
      <div className="w-full animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="text-[#132F20] dark:text-[#c3d62f] hover:text-[#c3d62f] dark:hover:text-[#a8b828] mb-4 flex items-center gap-1 transition-colors text-sm sm:text-base"
        >
          ← {t('common.back')}
        </button>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#132F20] dark:text-white">
          {t('loans.title')}
        </h1>
      </div>

      {activeLoans.length > 0 && (
        <section className="animate-fade-in">
          <h2 className="text-lg sm:text-xl font-semibold text-[#132F20] dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
            <ClipboardListIcon size={20} className="text-[#c3d62f]" />
            {t('loans.active')} ({activeLoans.length}/2)
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {activeLoans.map((loan, index) => (
              <div key={loan.id} style={{ animationDelay: `${index * 50}ms` }}>
                <LoanCard
                  loan={loan}
                  onReturn={() => returnMutation.mutate(loan.id)}
                  isReturning={returnMutation.isPending}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {activeLoans.length === 0 && (
        <div className="text-center py-8 sm:py-12 bg-[#c3d62f]/5 dark:bg-[#c3d62f]/5 rounded-xl border border-[#c3d62f]/20 animate-fade-in">
          <BookOpenIcon size={40} className="text-[#c3d62f] mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{t('loans.noLoans')}</p>
        </div>
      )}

      {returnedLoans.length > 0 && (
        <section className="animate-fade-in">
          <h2 className="text-lg sm:text-xl font-semibold text-[#132F20] dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
            <ClipboardListIcon size={20} className="text-[#c3d62f]" />
            {t('loans.history')}
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {returnedLoans.map((loan, index) => (
              <div key={loan.id} style={{ animationDelay: `${index * 50}ms` }}>
                <LoanCard
                  loan={loan}
                  onReturn={() => {}}
                  isReturning={false}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {loansData && loansData.totalPages > 1 && (
        <div className="flex justify-center gap-2 animate-fade-in">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 sm:px-4 py-2 border border-[#c3d62f]/30 dark:border-[#c3d62f]/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#c3d62f]/10 text-[#132F20] dark:text-[#c3d62f] transition-all duration-200 text-sm sm:text-base"
          >
            {t('common.previous')}
          </button>
          <span className="px-3 sm:px-4 py-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            {page + 1} / {loansData.totalPages}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= loansData.totalPages - 1}
            className="px-3 sm:px-4 py-2 border border-[#c3d62f]/30 dark:border-[#c3d62f]/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#c3d62f]/10 text-[#132F20] dark:text-[#c3d62f] transition-all duration-200 text-sm sm:text-base"
          >
            {t('common.next')}
          </button>
        </div>
      )}
    </div>
  );
}
