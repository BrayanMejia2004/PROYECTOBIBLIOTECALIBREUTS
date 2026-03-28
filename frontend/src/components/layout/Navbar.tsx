import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../i18n';
import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '../../api/notifications';

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

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const FolderIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ClipboardListIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [authorOpen, setAuthorOpen] = useState(false);
  const [authorInput, setAuthorInput] = useState('');
  const filterRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isHomePage = location.pathname === '/';

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getAll().then(res => res.data),
    enabled: isAuthenticated && user?.role !== 'ADMIN',
  });

  const { data: adminNotifications } = useQuery({
    queryKey: ['adminNotifications'],
    queryFn: () => notificationsApi.getAdmin().then(res => res.data),
    enabled: isAuthenticated && user?.role === 'ADMIN',
  });

  const unreadCount = user?.role === 'ADMIN'
    ? (adminNotifications?.filter(n => !n.read).length || 0)
    : (notifications?.filter(n => !n.read).length || 0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
        setCategoryOpen(false);
        setAuthorOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (user?.role === 'ADMIN') {
      e.preventDefault();
      navigate('/admin');
    }
  };

  const handleCategorySelect = (category: string) => {
    navigate(`/catalogue?filter=category&value=${encodeURIComponent(category)}`);
    setCategoryOpen(false);
    setIsFilterOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleAuthorSubmit = () => {
    if (authorInput.trim()) {
      navigate(`/catalogue?filter=author&value=${encodeURIComponent(authorInput.trim())}`);
      setAuthorOpen(false);
      setIsFilterOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleSimpleFilter = (filter: string) => {
    navigate(`/catalogue?filter=${filter}`);
    setIsFilterOpen(false);
    setIsMobileMenuOpen(false);
    setCategoryOpen(false);
    setAuthorOpen(false);
  };

  return (
    <>
      <nav className="bg-[#132F20] border-b border-[#c3d62f]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -ml-2 rounded-lg text-[#c3d62f] hover:bg-[#c3d62f]/10 transition-colors md:hidden touch-target"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>

              <Link
                to={user?.role === 'ADMIN' ? '/admin' : '/catalogue'}
                onClick={handleLogoClick}
                className="flex items-center gap-2"
              >
                <span className="font-display font-bold text-basesm:text-xl text-[#c3d62f] hidden xs:inline">
                  Biblioteca Libre UTS
                </span>
                <span className="font-display font-bold text-[#c3d62f] text-5sm sm:text-xl xs:hidden">
                  Biblioteca Libre UTS
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-1 sm:gap-3">
              {isAuthenticated && user?.role !== 'ADMIN' && (
                <div className="relative hidden sm:block" ref={filterRef}>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`p-2 rounded-lg border transition-colors touch-target ${isFilterOpen
                        ? 'bg-[#c3d62f] text-[#132F20] border-[#c3d62f]'
                        : 'bg-transparent text-[#c3d62f] border-[#c3d62f]/30 hover:bg-[#c3d62f]/10'
                      }`}
                    title={t('common.filter')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </button>

                  {isFilterOpen && (
                    <div className="absolute left-0 mt-2 w-64 sm:w-72 bg-white dark:bg-[#1a2e24] rounded-xl shadow-xl border border-[#c3d62f]/20 z-50 animate-fade-in">
                      <div className="py-2">
                        <button
                          onClick={() => handleSimpleFilter('all')}
                          className="w-full text-left px-4 py-3 hover:bg-[#c3d62f]/10 flex items-center gap-3 text-[#132F20] dark:text-[#e8ebe9] transition-colors"
                        >
                          <span className="text-[#c3d62f]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                          </span>
                          <span className="font-medium">{t('home.allBooks')}</span>
                        </button>

                        <hr className="my-2 border-gray-200 dark:border-gray-700" />

                        <div className="relative">
                          <button
                            onClick={() => { setCategoryOpen(!categoryOpen); setAuthorOpen(false); }}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between text-gray-700 dark:text-gray-200 transition-colors touch-target"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-[#c3d62f]"><FolderIcon /></span>
                              <span>{t('home.category')}</span>
                            </div>
                            <span className={`transform transition-transform ${categoryOpen ? 'rotate-180' : ''}`}>
                              <ChevronDownIcon />
                            </span>
                          </button>

                          {categoryOpen && (
                            <div className="bg-gray-50 dark:bg-gray-700 border-t border-b border-gray-200 dark:border-gray-600 max-h-48 overflow-y-auto">
                              {CATEGORIES.map((category) => (
                                <button
                                  key={category}
                                  onClick={() => handleCategorySelect(category)}
                                  className="w-full text-left px-8 py-2.5 hover:bg-[#c3d62f]/20 text-gray-600 dark:text-gray-300 hover:text-[#132F20] dark:hover:text-[#c3d62f] text-sm transition-colors touch-target"
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
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between text-gray-700 dark:text-gray-200 transition-colors touch-target"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-[#c3d62f]"><UserIcon /></span>
                              <span>{t('home.author')}</span>
                            </div>
                            <span className={`transform transition-transform ${authorOpen ? 'rotate-180' : ''}`}>
                              <ChevronDownIcon />
                            </span>
                          </button>

                          {authorOpen && (
                            <div className="bg-gray-50 dark:bg-gray-700 border-t border-b border-gray-200 dark:border-gray-600 p-3">
                              <input
                                type="text"
                                value={authorInput}
                                onChange={(e) => setAuthorInput(e.target.value)}
                                placeholder={t('home.author')}
                                className="w-full px-3 py-2.5 border border-[#c3d62f]/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c3d62f] bg-white dark:bg-[#132F20] text-[#132F20] dark:text-[#e8ebe9]"
                              />
                              <button
                                onClick={handleAuthorSubmit}
                                disabled={!authorInput.trim()}
                                className="mt-2 w-full px-3 py-2.5 bg-[#c3d62f] text-[#132F20] rounded-lg text-sm font-medium hover:bg-[#a8b828] disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-target"
                              >
                                {t('common.search')}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isAuthenticated && (
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative p-2 rounded-lg hover:bg-[#c3d62f]/10 transition-colors touch-target"
                  >
                    <span className="text-[#c3d62f]">
                      <BellIcon />
                    </span>
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-[#c3d62f] text-[#132F20] text-[10px] font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-fade-in">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                          {t('settings.notifications')}
                          {unreadCount > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="py-2 max-h-64 sm:max-h-96 overflow-y-auto">
                        {((user?.role === 'ADMIN' ? adminNotifications : notifications)?.length ?? 0) > 0 ? (
                          (user?.role === 'ADMIN' ? adminNotifications : notifications)?.slice(0, 5).map((notification: any) => (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 transition-colors ${notification.read
                                  ? 'border-gray-300'
                                  : notification.type === 'OVERDUE'
                                    ? 'border-red-500'
                                    : 'border-orange-500'
                                }`}
                            >
                              <p className={`text-sm font-medium ${notification.type === 'OVERDUE'
                                  ? 'text-red-700 dark:text-red-400'
                                  : notification.type === 'BOOK_ADDED'
                                    ? 'text-[#132F20] dark:text-[#c3d62f]'
                                    : 'text-orange-700 dark:text-orange-400'
                                }`}>
                                {notification.type === 'OVERDUE' ? t('settings.overdueLoan') :
                                  notification.type === 'BOOK_ADDED' ? t('settings.bookAdded') :
                                    t('settings.dueSoon')}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                            {t('settings.noNotifications')}
                          </div>
                        )}
                      </div>
                      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => {
                            setIsNotificationsOpen(false);
                            navigate('/notifications');
                          }}
                          className="w-full text-center text-sm text-[#132F20] dark:text-[#c3d62f] hover:text-[#c3d62f] dark:hover:text-[#a8b828] font-medium transition-colors"
                        >
                          {t('settings.notifications')} →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isAuthenticated ? (
                <div className="relative hidden sm:block" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 focus:outline-none touch-target"
                  >
                    {user?.photoUrl ? (
                      <img
                        src={user.photoUrl}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-[#c3d62f]/30"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#c3d62f] flex items-center justify-center text-[#132F20] font-medium text-sm">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-fade-in">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-medium text-[#132F20] dark:text-white truncate">{user?.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-target"
                        >
                          <span className="text-[#c3d62f]"><UserIcon /></span>
                          <span>{t('nav.profile')}</span>
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-target"
                        >
                          <span className="text-[#c3d62f]"><SettingsIcon /></span>
                          <span>{t('nav.settings')}</span>
                        </Link>

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors touch-target"
                        >
                          <LogoutIcon />
                          <span>{t('nav.logout')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="hidden xs:block">
                    <Button variant="outline" size="sm">{t('nav.login')}</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">{t('nav.register')}</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            ref={mobileMenuRef}
            className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-white dark:bg-[#1a2e24] shadow-2xl animate-slide-in overflow-y-auto"
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
              <span className="font-display font-bold text-lg text-[#132F20] dark:text-[#c3d62f]">
                Menú
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 touch-target"
              >
                <CloseIcon />
              </button>
            </div>

            {isAuthenticated ? (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  {user?.photoUrl ? (
                    <img
                      src={user.photoUrl}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#c3d62f]/30"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#c3d62f] flex items-center justify-center text-[#132F20] font-bold text-lg">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#132F20] dark:text-white truncate">{user?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <Link to="/login" className="flex-1">
                    <Button variant="outline" className="w-full">{t('nav.login')}</Button>
                  </Link>
                  <Link to="/register" className="flex-1">
                    <Button className="w-full">{t('nav.register')}</Button>
                  </Link>
                </div>
              </div>
            )}

            <nav className="py-2">
              {isAuthenticated && (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-target"
                  >
                    <span className="text-[#c3d62f]"><UserIcon /></span>
                    <span>{t('nav.profile')}</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-target"
                  >
                    <span className="text-[#c3d62f]"><SettingsIcon /></span>
                    <span>{t('nav.settings')}</span>
                  </Link>
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                </>
              )}

              {isHomePage && isAuthenticated && user?.role !== 'ADMIN' && (
                <>
                  <div className="px-4 py-2">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Filtros
                    </p>
                  </div>

                  <button
                    onClick={() => handleSimpleFilter('all')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-target"
                  >
                    <span className="text-[#c3d62f]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </span>
                    <span>{t('home.allBooks')}</span>
                  </button>

                  <div>
                    <button
                      onClick={() => { setCategoryOpen(!categoryOpen); setAuthorOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-target"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[#c3d62f]"><FolderIcon /></span>
                        <span>{t('home.category')}</span>
                      </div>
                      <span className={`transform transition-transform ${categoryOpen ? 'rotate-180' : ''}`}>
                        <ChevronDownIcon />
                      </span>
                    </button>

                    {categoryOpen && (
                      <div className="bg-gray-50 dark:bg-gray-700 border-t border-b border-gray-200 dark:border-gray-600">
                        {CATEGORIES.map((category) => (
                          <button
                            key={category}
                            onClick={() => handleCategorySelect(category)}
                            className="w-full text-left pl-12 pr-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-[#c3d62f]/20 hover:text-[#132F20] dark:hover:text-[#c3d62f] text-sm transition-colors touch-target"
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      onClick={() => { setAuthorOpen(!authorOpen); setCategoryOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-target"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[#c3d62f]"><UserIcon /></span>
                        <span>{t('home.author')}</span>
                      </div>
                      <span className={`transform transition-transform ${authorOpen ? 'rotate-180' : ''}`}>
                        <ChevronDownIcon />
                      </span>
                    </button>

                    {authorOpen && (
                      <div className="bg-gray-50 dark:bg-gray-700 border-t border-b border-gray-200 dark:border-gray-600 p-3">
                        <input
                          type="text"
                          value={authorInput}
                          onChange={(e) => setAuthorInput(e.target.value)}
                          placeholder={t('home.author')}
                          className="w-full px-3 py-2.5 border border-[#c3d62f]/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c3d62f] bg-white dark:bg-[#132F20] text-[#132F20] dark:text-[#e8ebe9]"
                        />
                        <button
                          onClick={handleAuthorSubmit}
                          disabled={!authorInput.trim()}
                          className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-[#c3d62f] text-[#132F20] rounded-lg text-sm font-medium hover:bg-[#a8b828] disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-target"
                        >
                          <SearchIcon />
                          <span>{t('common.search')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {user?.role !== 'ADMIN' && (
                <Link
                  to="/loans"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-target"
                >
                  <span className="text-[#c3d62f]"><ClipboardListIcon /></span>
                  <span>{t('nav.loans')}</span>
                </Link>
              )}

              {isAuthenticated && (
                <>
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors touch-target"
                  >
                    <LogoutIcon />
                    <span>{t('nav.logout')}</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
