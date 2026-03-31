import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { booksApi } from '../api/books';
import { Book, PageResponse } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { BookCard } from '../components/books/BookCard';
import { Spinner } from '../components/common/Spinner';
import { Button } from '../components/common/Button';
import { FilterChip } from '../components/common/FilterChip';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n';
import { ClipboardListIcon, BookOpenIcon } from '../components/common/AdminIcons';
import { CheckIcon, FlameIcon, StarIcon } from '../components/common/UserIcons';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const debouncedSearch = useDebounce(search, 300);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const activeFilter = (searchParams.get('filter') || 'all') as 'all' | 'available' | 'category' | 'author' | 'popular' | 'top-rated';
  const filterValue = searchParams.get('value') || '';

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin');
    }
  }, [user, navigate]);

  if (user?.role === 'ADMIN') {
    return null;
  }

  const { data: booksData, isLoading, isError } = useQuery({
    queryKey: ['books', activeFilter, filterValue, debouncedSearch, page],
    queryFn: async () => {
      if (debouncedSearch) {
        return booksApi.search(debouncedSearch, page, 12).then(res => res.data);
      }
      
      switch (activeFilter) {
        case 'available':
          return booksApi.getAvailable(page, 12).then(res => res.data);
        case 'category':
          return booksApi.getByCategory(filterValue, page, 12).then(res => res.data);
        case 'author':
          return booksApi.getByAuthor(filterValue, page, 12).then(res => res.data);
        case 'popular':
          return booksApi.getPopular().then(res => res.data);
        case 'top-rated':
          return booksApi.getTopRated().then(res => res.data);
        default:
          return booksApi.getAll(page, 12).then(res => res.data);
      }
    },
    staleTime: 30 * 1000,
  });

  const handleBookClick = (book: Book) => {
    navigate(`/books/${book.id}`);
  };

  const handleFilterChange = (filter: string, value: string = '') => {
    if (filter === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ filter, value });
    }
    setPage(0);
  };

  const handleClearFilter = () => {
    setSearchParams({});
    setPage(0);
  };

  const isPaginated = activeFilter !== 'popular' && activeFilter !== 'top-rated';
  const books = isPaginated ? (booksData as PageResponse<Book>)?.content || [] : (booksData as Book[]) || [];
  const totalPages = isPaginated ? (booksData as PageResponse<Book>)?.totalPages || 0 : 1;

  const getSectionTitle = () => {
    if (search) return `${t('home.resultsFor')}: "${search}"`;
    if (activeFilter === 'available') return t('home.available');
    if (activeFilter === 'popular') return t('home.popular');
    if (activeFilter === 'top-rated') return t('home.topRated');
    if (activeFilter === 'category') return `${t('home.category')}: ${filterValue}`;
    if (activeFilter === 'author') return `${t('home.author')}: ${filterValue}`;
    return t('home.allBooks');
  };

  const filterChips = [
    { id: 'all', label: t('home.allBooks'), icon: <BookOpenIcon size={16} /> },
    { id: 'available', label: t('home.available'), icon: <CheckIcon size={16} /> },
    { id: 'popular', label: t('home.popular'), icon: <FlameIcon size={16} /> },
    { id: 'top-rated', label: t('home.topRated'), icon: <StarIcon size={16} /> },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#132F20] dark:text-[#c3d62f]">
            {t('home.title')}
          </h1>
          <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
            <Button onClick={() => navigate('/loans')} className="w-full xs:w-auto text-sm sm:text-base">
              <span className="hidden sm:inline"><ClipboardListIcon size={16} className="inline mr-1" /></span>{t('nav.loans')}
            </Button>
            <Button onClick={() => navigate('/add-book')} variant="outline" className="w-full xs:w-auto text-sm sm:text-base">
              <span className="hidden sm:inline"><BookOpenIcon size={16} className="inline mr-1" /></span>{t('addBook.title')}
            </Button>
          </div>
        </div>
        
        {/* Search Input */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder={t('home.search')}
              className="w-full pl-10 pr-4 py-3 sm:py-3.5 border border-[#c3d62f]/30 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c3d62f] focus:border-transparent bg-white dark:bg-[#1a2e24] text-[#132F20] dark:text-[#e8ebe9] placeholder-[#8a9b8c] text-sm sm:text-base transition-all duration-200"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {filterChips.map((chip) => (
            <FilterChip
              key={chip.id}
              label={chip.label}
              icon={chip.icon}
              isActive={activeFilter === chip.id && !filterValue}
              onClick={() => handleFilterChange(chip.id)}
            />
          ))}
        </div>

        {/* Active Filter Display */}
        {activeFilter !== 'all' && (
          <div className="mb-4 text-sm text-[#5a6b5c] dark:text-[#8a9b8c] flex items-center gap-2 animate-fade-in">
            <span>{t('common.filter')}: </span>
            <span className="font-medium text-[#132F20] dark:text-[#c3d62f]">
              {activeFilter === 'available' && t('home.available')}
              {activeFilter === 'category' && `${t('home.category')}: ${filterValue}`}
              {activeFilter === 'author' && `${t('home.author')}: ${filterValue}`}
              {activeFilter === 'popular' && t('home.popular')}
              {activeFilter === 'top-rated' && t('home.topRated')}
            </span>
            <button
              onClick={handleClearFilter}
              className="ml-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline transition-colors"
            >
              {t('common.cancel')}
            </button>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg sm:text-xl font-display font-semibold text-[#132F20] dark:text-[#c3d62f] mb-4 animate-fade-in">
          {getSectionTitle()}
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : isError ? (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl animate-fade-in">
            {t('common.error')}
          </div>
        ) : !books || books.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-[#1a2e24] rounded-xl border border-[#c3d62f]/20 animate-fade-in">
            <BookOpenIcon size={48} className="sm:w-16 sm:h-16 text-[#c3d62f] mx-auto mb-4" />
            <p className="text-[#5a6b5c] dark:text-[#8a9b8c] text-lg">
              {t('home.noBooks')}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {books.map((book: Book, index: number) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => handleBookClick(book)}
                  animationDelay={index * 50}
                />
              ))}
            </div>

            {isPaginated && totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6 sm:mt-8 animate-fade-in">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 sm:px-4 py-2 border border-[#c3d62f]/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#c3d62f]/10 text-[#132F20] dark:text-[#c3d62f] transition-all duration-200 text-sm sm:text-base"
                >
                  {t('common.previous')}
                </button>
                <span className="px-3 sm:px-4 py-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages - 1}
                  className="px-3 sm:px-4 py-2 border border-[#c3d62f]/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#c3d62f]/10 text-[#132F20] dark:text-[#c3d62f] transition-all duration-200 text-sm sm:text-base"
                >
                  {t('common.next')}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
