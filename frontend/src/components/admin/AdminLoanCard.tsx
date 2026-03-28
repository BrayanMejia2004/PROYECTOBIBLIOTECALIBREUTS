import { useState } from 'react';
import { BookOpenIcon, ClipboardListIcon, CheckCircleIcon, AlertTriangleIcon, CalendarIcon, ClockIcon, PenLineIcon, ChevronDownIcon, ChevronUpIcon } from '../common/AdminIcons';

interface Loan {
  id: string;
  book?: {
    title: string;
    author: string;
    coverImage?: string;
  };
  bookTitle?: string;
  user?: {
    name: string;
  };
  userName?: string;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
  loanDate: string;
  dueDate: string;
  returnDate?: string | null;
}

interface AdminLoanCardProps {
  loan: Loan;
  formatDate: (date: string) => string;
}

export function AdminLoanCard({ loan, formatDate }: AdminLoanCardProps) {
  const [expanded, setExpanded] = useState(false);

  const statusConfig = {
    ACTIVE: {
      bg: 'bg-white dark:bg-[#1a2e24]',
      border: 'border-[#c3d62f]/30',
      leftBorder: 'border-l-[#c3d62f]',
      text: 'text-[#132F20]',
      label: 'Activo',
      icon: <ClipboardListIcon size={16} className="text-[#c3d62f]" />,
    },
    RETURNED: {
      bg: 'bg-white dark:bg-[#1a2e24]',
      border: 'border-green-200 dark:border-green-800/30',
      leftBorder: 'border-l-green-500',
      text: 'text-green-700 dark:text-green-400',
      label: 'Devuelto',
      icon: <CheckCircleIcon size={16} className="text-green-500" />,
    },
    OVERDUE: {
      bg: 'bg-white dark:bg-[#1a2e24]',
      border: 'border-red-200 dark:border-red-800/30',
      leftBorder: 'border-l-red-500',
      text: 'text-red-700 dark:text-red-400',
      label: 'Vencido',
      icon: <AlertTriangleIcon size={16} className="text-red-500" />,
    },
  };

  const status = statusConfig[loan.status];
  
  const isOverdue = loan.status === 'OVERDUE' || 
    (loan.status === 'ACTIVE' && new Date(loan.dueDate) < new Date());

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
    <div
      className={`
        p-4 rounded-xl 
        ${status.bg}
        border ${status.border}
        border-l-4 ${status.leftBorder}
        hover:shadow-md transition-all duration-200 cursor-pointer
      `}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* Book Cover */}
        <div className="flex-shrink-0">
          {loan.book?.coverImage ? (
            <img 
              src={loan.book.coverImage} 
              alt={loan.book?.title || 'Libro'}
              className="w-16 h-24 object-cover rounded-lg shadow-sm"
            />
          ) : (
            <div className="w-16 h-24 bg-[#c3d62f]/10 rounded-lg flex items-center justify-center">
              <BookOpenIcon size={24} className="text-[#c3d62f]" />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#132F20] dark:text-white truncate">
                {loan.book?.title || loan.bookTitle || 'Libro'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1.5">
                <PenLineIcon size={14} className="text-gray-400" />
                {loan.book?.author || 'Autor desconocido'}
              </p>
            </div>
            
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.border}`}>
              <span className="w-4 h-4 flex items-center justify-center">{status.icon}</span>
              <span className={status.text}>{status.label}</span>
            </div>
          </div>

          {/* User Info */}
          <div className="mt-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#c3d62f] flex items-center justify-center text-[#132F20] text-xs font-bold">
              {loan.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {loan.user?.name || 'Desconocido'}
            </span>
          </div>

          {/* Dates - Always visible */}
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
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

          {/* Expanded Details */}
          {expanded && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Fecha de préstamo:</span>
                  <p className="font-medium text-[#132F20] dark:text-white">{formatDate(loan.loanDate)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Fecha de vencimiento:</span>
                  <p className={`font-medium ${isOverdue ? 'text-red-500' : 'text-[#132F20] dark:text-white'}`}>
                    {formatDate(loan.dueDate)}
                  </p>
                </div>
                {loan.returnDate && (
                  <div>
                    <span className="text-gray-500">Fecha de devolución:</span>
                    <p className="font-medium text-green-600 dark:text-green-400">{formatDate(loan.returnDate)}</p>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Usuario:</span>
                  <p className="font-medium text-[#132F20] dark:text-white">{loan.user?.name || 'Desconocido'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Expand Indicator */}
        <div className="hidden md:block text-gray-400">
          {expanded ? (
            <ChevronUpIcon size={16} />
          ) : (
            <ChevronDownIcon size={16} />
          )}
        </div>
      </div>
    </div>
  );
}
