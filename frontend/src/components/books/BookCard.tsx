import { Book } from '../../types';
import { Card } from '../common/Card';
import { useTranslation } from '../../i18n';
import { BookOpenIcon } from '../common/AdminIcons';
import { StarIcon, CheckIcon, XIcon } from '../common/UserIcons';

interface BookCardProps {
  book: Book;
  onClick?: () => void;
  animationDelay?: number;
}

export function BookCard({ book, onClick, animationDelay = 0 }: BookCardProps) {
  const { t } = useTranslation();
  
  return (
    <div 
      className="animate-fade-in" 
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <Card 
        onClick={onClick} 
        className="p-3 sm:p-4 h-full flex flex-col card-lift cursor-pointer group"
      >
        <div className="flex-shrink-0 mb-2 sm:mb-3 overflow-hidden rounded-lg">
          {book.coverImage ? (
            <img 
              src={book.coverImage} 
              alt={book.title}
              className="w-full h-32 sm:h-40 object-cover transform group-hover:scale-105 transition-transform duration-300 ease-out"
            />
          ) : (
            <div className="w-full h-32 sm:h-40 bg-[#c3d62f]/10 rounded-lg flex items-center justify-center group-hover:bg-[#c3d62f]/20 transition-colors duration-300">
              <BookOpenIcon size={32} className="sm:w-10 sm:h-10 text-[#c3d62f] group-hover:scale-110 transition-transform duration-300" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-sm sm:text-base md:text-lg text-[#1a2e1c] dark:text-[#e8ebe9] line-clamp-2 mb-1 group-hover:text-[#c3d62f] transition-colors duration-200">
            {book.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#5a6b5c] dark:text-[#8a9b8c] mb-1 sm:mb-2 truncate">{book.author}</p>
          <p className="text-xs text-[#5a6b5c] dark:text-[#8a9b8c] line-clamp-2 mb-2 sm:mb-3 hidden sm:block">
            {book.summary && book.summary.length > 80 ? book.summary.substring(0, 80) + '...' : book.summary}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-[#c3d62f]/20">
          <div className="flex items-center gap-1">
            <StarIcon size={16} className="sm:w-5 sm:h-5 text-[#c3d62f] fill-current" />
            <span className="text-sm font-medium text-[#132F20] dark:text-[#e8ebe9]">
              {book.rating ? book.rating.toFixed(1) : 'N/A'}
            </span>
            <span className="text-xs text-[#8a9b8c] hidden sm:inline">
              ({book.ratingCount || 0})
            </span>
          </div>
          
          <span
            className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium flex items-center gap-0.5 sm:gap-1 ${
              book.availability
                ? 'bg-[#c3d62f]/20 text-[#132F20]'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}
          >
            {book.availability ? <CheckIcon size={14} className="text-green-600 dark:text-green-400" /> : <XIcon size={14} className="text-red-600 dark:text-red-400" />}
            <span className="hidden xs:inline">{book.availability ? t('book.available') : t('book.unavailable')}</span>
          </span>
        </div>
      </Card>
    </div>
  );
}
