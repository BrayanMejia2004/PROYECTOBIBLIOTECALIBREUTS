import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../i18n';
import { BookOpenIcon, UserIcon } from '../common/AdminIcons';
import { FolderIcon, CheckIcon, FlameIcon, MenuIcon } from '../common/UserIcons';

export type FilterType = 'all' | 'available' | 'category' | 'author' | 'popular' | 'top-rated';

interface FilterPanelProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType, value?: string) => void;
  filterValue?: string;
}

const CATEGORIES = [
  'Programación',
  'Base de Datos',
  'Redes',
  'Seguridad',
  'Matemáticas',
  'Física',
  'Literatura',
  'Historia',
  'Otro'
];

export function FilterPanel({ activeFilter, onFilterChange, filterValue = '' }: FilterPanelProps) {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [authorOpen, setAuthorOpen] = useState(false);
  const [authorInput, setAuthorInput] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setCategoryOpen(false);
        setAuthorOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategorySelect = (category: string) => {
    onFilterChange('category', category);
    setCategoryOpen(false);
    setIsMenuOpen(false);
  };

  const handleAuthorSubmit = () => {
    if (authorInput.trim()) {
      onFilterChange('author', authorInput.trim());
      setAuthorOpen(false);
      setIsMenuOpen(false);
    }
  };

  const handleSimpleFilter = (filter: FilterType) => {
    onFilterChange(filter);
    setIsMenuOpen(false);
    setCategoryOpen(false);
    setAuthorOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
          isMenuOpen 
            ? 'bg-[#c3d62f] text-[#132F20] border-[#c3d62f]' 
            : 'bg-transparent text-[#132F20] dark:text-[#c3d62f] border-[#c3d62f]/30 hover:bg-[#c3d62f]/10'
        }`}
      >
        <MenuIcon size={20} />
        <span className="font-medium">{t('common.filter')}</span>
      </button>

      {isMenuOpen && (
        <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-[#1a2e24] rounded-lg shadow-lg border border-[#c3d62f]/20 z-50">
          <div className="py-2">
            <button
              onClick={() => handleSimpleFilter('all')}
              className={`w-full text-left px-4 py-3 hover:bg-[#c3d62f]/10 flex items-center gap-3 ${
                activeFilter === 'all' ? 'bg-[#c3d62f]/20 text-[#132F20]' : 'text-[#132F20] dark:text-[#e8ebe9]'
              }`}
            >
              <BookOpenIcon size={18} />
              <span className="font-medium">{t('home.allBooks')}</span>
            </button>

            <hr className="my-2 border-[#c3d62f]/20" />

            <div className="relative">
              <button
                onClick={() => { setCategoryOpen(!categoryOpen); setAuthorOpen(false); }}
                className="w-full text-left px-4 py-3 hover:bg-[#c3d62f]/10 flex items-center justify-between text-[#132F20] dark:text-[#e8ebe9]"
              >
                <div className="flex items-center gap-3">
                  <FolderIcon size={18} />
                  <span>{t('home.category')}</span>
                </div>
                <span className={`transform transition-transform ${categoryOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>
              
              {categoryOpen && (
                <div className="bg-[#c3d62f]/5 border-t border-b border-[#c3d62f]/20">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className="w-full text-left px-8 py-2 hover:bg-[#c3d62f]/20 text-[#132F20] dark:text-[#e8ebe9] text-sm"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => { setAuthorOpen(!authorOpen); setCategoryOpen(false); }}
                className="w-full text-left px-4 py-3 hover:bg-[#c3d62f]/10 flex items-center justify-between text-[#132F20] dark:text-[#e8ebe9]"
              >
                <div className="flex items-center gap-3">
                  <UserIcon size={18} />
                  <span>{t('home.author')}</span>
                </div>
                <span className={`transform transition-transform ${authorOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>
              
              {authorOpen && (
                <div className="bg-[#c3d62f]/5 border-t border-b border-[#c3d62f]/20 p-3">
                  <input
                    type="text"
                    value={authorInput}
                    onChange={(e) => setAuthorInput(e.target.value)}
                    placeholder={t('home.author')}
                    className="w-full px-3 py-2 border border-[#c3d62f]/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c3d62f] bg-white dark:bg-[#132F20] text-[#132F20] dark:text-[#e8ebe9]"
                  />
                  <button
                    onClick={handleAuthorSubmit}
                    disabled={!authorInput.trim()}
                    className="mt-2 w-full px-3 py-2 bg-[#c3d62f] text-[#132F20] rounded-lg text-sm hover:bg-[#a8b828] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('common.search')}
                  </button>
                </div>
              )}
            </div>

            <hr className="my-2 border-[#c3d62f]/20" />

            <button
              onClick={() => handleSimpleFilter('available')}
              className={`w-full text-left px-4 py-3 hover:bg-[#c3d62f]/10 flex items-center gap-3 ${
                activeFilter === 'available' ? 'bg-[#c3d62f]/20 text-[#132F20]' : 'text-[#132F20] dark:text-[#e8ebe9]'
              }`}
            >
              <CheckIcon size={18} />
              <span className="font-medium">{t('home.available')}</span>
            </button>

            <button
              onClick={() => handleSimpleFilter('popular')}
              className={`w-full text-left px-4 py-3 hover:bg-[#c3d62f]/10 flex items-center gap-3 ${
                activeFilter === 'popular' ? 'bg-[#c3d62f]/20 text-[#132F20]' : 'text-[#132F20] dark:text-[#e8ebe9]'
              }`}
            >
              <FlameIcon size={18} />
              <span className="font-medium">{t('home.popular')}</span>
            </button>

            <button
              onClick={() => handleSimpleFilter('top-rated')}
              className={`w-full text-left px-4 py-3 hover:bg-[#c3d62f]/10 flex items-center gap-3 ${
                activeFilter === 'top-rated' ? 'bg-[#c3d62f]/20 text-[#132F20]' : 'text-[#132F20] dark:text-[#e8ebe9]'
              }`}
            >
              <span>⭐</span>
              <span className="font-medium">{t('home.topRated')}</span>
            </button>
          </div>
        </div>
      )}

      {activeFilter !== 'all' && (
        <div className="mt-3 text-sm text-[#5a6b5c] dark:text-[#8a9b8c] flex items-center gap-2">
          <span>{t('common.filter')}: </span>
          <span className="font-medium text-[#132F20] dark:text-[#c3d62f]">
            {activeFilter === 'available' && t('home.available')}
            {activeFilter === 'category' && `${t('home.category')}: ${filterValue}`}
            {activeFilter === 'author' && `${t('home.author')}: ${filterValue}`}
            {activeFilter === 'popular' && t('home.popular')}
            {activeFilter === 'top-rated' && t('home.topRated')}
          </span>
          <button
            onClick={() => onFilterChange('all')}
            className="ml-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
          >
            {t('common.cancel')}
          </button>
        </div>
      )}
    </div>
  );
}
