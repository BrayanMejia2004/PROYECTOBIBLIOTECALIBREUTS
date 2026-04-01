import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { booksApi } from '../api/books';
import { adminApi } from '../api/admin';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';
import { SkeletonStats, SkeletonChart, SkeletonTable, SkeletonCard } from '../components/common/Skeleton';
import { SearchInput } from '../components/common/SearchInput';
import { ActionMenu } from '../components/common/ActionMenu';
import { CreateBookModal } from '../components/books/CreateBookModal';
import { EditBookModal } from '../components/books/EditBookModal';
import { EditUserModal } from '../components/users/EditUserModal';
import { StatsCard, AdminLoanCard, AdminTabs } from '../components/admin';
import { CategoryChart, LoanStatusChart, LoansTrendChart } from '../components/admin/charts';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n';
import { User, Book } from '../types';
import toast, { Toaster } from 'react-hot-toast';
import {
  LayoutDashboardIcon,
  BookOpenIcon,
  ClipboardListIcon,
  UsersIcon,
  BookMarkedIcon,
  PieChartIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
  EyeIcon,
  Edit2Icon,
  Trash2Icon,
  CrownIcon,
  UserIcon,
  UsersXIcon,
  ClipboardXIcon,
} from '../components/common/AdminIcons';

type AdminTab = 'dashboard' | 'books' | 'loans' | 'users';

export default function AdminPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditBookModalOpen, setIsEditBookModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [loansPage, setLoansPage] = useState(0);
  const [usersPage, setUsersPage] = useState(0);
  const [booksSearch, setBooksSearch] = useState('');
  const [usersSearch, setUsersSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'ALL' | 'ADMIN' | 'USER'>('ALL');
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['dashboard', 'books', 'loans', 'users'].includes(tabParam)) {
      setActiveTab(tabParam as AdminTab);
    }
  }, [searchParams]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => adminApi.getStats().then(res => res.data),
  });

  const { data: booksData, isLoading: booksLoading, refetch } = useQuery({
    queryKey: ['adminBooks'],
    queryFn: () => booksApi.getAll(0, 100).then(res => res.data),
  });

  const { data: loansData, isLoading: loansLoading } = useQuery({
    queryKey: ['adminLoans', loansPage],
    queryFn: () => adminApi.getAllLoans(loansPage, 10).then(res => res.data),
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsers', usersPage],
    queryFn: () => adminApi.getAllUsers(usersPage, 10).then(res => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => adminApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setDeleteError('');
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      setDeleteError(axiosError.response?.data?.message || 'Error al eliminar el usuario');
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: (bookId: string) => booksApi.delete(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBooks'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setDeleteError('');
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      setDeleteError(axiosError.response?.data?.message || 'Error al eliminar el libro');
    },
  });

  const handleEditUser = (userItem: User) => {
    setSelectedUser(userItem);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (userItem: User) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <div>
          <p className="font-medium text-[#132F20] dark:text-white">¿Eliminar usuario?</p>
          <p className="text-sm text-gray-500 mt-1">"{userItem.name}" - Esta acción no se puede deshacer.</p>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              deleteMutation.mutate(userItem.id);
            }}
            className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
      style: {
        background: '#fff',
        color: '#132F20',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        border: '1px solid #c3d62f',
        maxWidth: '400px',
      },
    });
  };

  const handleDeleteBook = (bookItem: Book) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <div>
          <p className="font-medium text-[#132F20] dark:text-white">¿Eliminar libro?</p>
          <p className="text-sm text-gray-500 mt-1">"{bookItem.title}" - Esta acción no se puede deshacer.</p>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              deleteBookMutation.mutate(bookItem.id);
            }}
            className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
      style: {
        background: '#fff',
        color: '#132F20',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        border: '1px solid #c3d62f',
        maxWidth: '400px',
      },
    });
  };

  const tabs = [
    { id: 'dashboard' as const, label: t('admin.statistics'), icon: <LayoutDashboardIcon size={20} /> },
    { id: 'books' as const, label: t('admin.books'), icon: <BookOpenIcon size={20} /> },
    { id: 'loans' as const, label: t('admin.loans'), icon: <ClipboardListIcon size={20} /> },
    { id: 'users' as const, label: t('admin.users'), icon: <UsersIcon size={20} /> },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <Toaster />
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-4">
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#132F20] dark:text-white">
          {t('admin.title')}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t('profile.name')}: <span className="font-medium text-[#132F20] dark:text-[#c3d62f]">{user?.name}</span>
        </p>
      </div>

      <div className="mt-6 sm:mt-8 mb-4 sm:mb-6 overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
        <AdminTabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={(id) => setActiveTab(id as AdminTab)} 
        />
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4 sm:space-y-6">
          {statsLoading ? (
            <>
              <SkeletonStats />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <SkeletonChart />
                <SkeletonChart />
              </div>
              <SkeletonChart />
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <StatsCard
                  title={t('admin.totalBooks')}
                  value={stats?.totalBooks || 0}
                  icon={<BookOpenIcon size={24} />}
                />
                <StatsCard
                  title={t('admin.totalUsers')}
                  value={stats?.totalUsers || 0}
                  icon={<UsersIcon size={24} />}
                />
                <StatsCard
                  title={t('admin.activeLoans')}
                  value={stats?.activeLoans || 0}
                  icon={<ClipboardListIcon size={24} />}
                />
                <StatsCard
                  title={t('admin.overdueLoans')}
                  value={stats?.overdueLoans || 0}
                  icon={<AlertTriangleIcon size={24} />}
                  variant="warning"
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Books by Category */}
                <div className="bg-white dark:bg-[#1a2e24] rounded-xl p-4 sm:p-6 border border-[#c3d62f]/20 shadow-sm">
                  <h3 className="text-base sm:text-lg font-semibold text-[#132F20] dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <BookMarkedIcon size={20} className="text-[#c3d62f]" />
                    Libros por Categoría
                  </h3>
                  {booksData?.content ? (
                    <CategoryChart 
                      data={Object.entries(
                        booksData.content.reduce((acc, book) => {
                          acc[book.category] = (acc[book.category] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([category, count]) => ({ category, count }))}
                    />
                  ) : (
                    <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500">
                      <Spinner size="md" />
                    </div>
                  )}
                </div>

                {/* Loan Status Distribution */}
                <div className="bg-white dark:bg-[#1a2e24] rounded-xl p-4 sm:p-6 border border-[#c3d62f]/20 shadow-sm">
                  <h3 className="text-base sm:text-lg font-semibold text-[#132F20] dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <PieChartIcon size={20} className="text-[#c3d62f]" />
                    Estado de Préstamos
                  </h3>
                  <LoanStatusChart 
                    data={{
                      active: stats?.activeLoans || 0,
                      returned: stats?.returnedLoans || 0,
                      overdue: stats?.overdueLoans || 0,
                    }}
                  />
                </div>
              </div>

              {/* Loans Trend */}
              <div className="bg-white dark:bg-[#1a2e24] rounded-xl p-4 sm:p-6 border border-[#c3d62f]/20 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-[#132F20] dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <TrendingUpIcon size={20} className="text-[#c3d62f]" />
                  Tendencia de Préstamos
                </h3>
                <LoansTrendChart 
                  data={loansData?.content ? Array.from({ length: 7 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (6 - i));
                    const dateStr = date.toISOString().split('T')[0];
                    const loansOnDate = loansData.content.filter((loan: any) => {
                      const loanDate = new Date(loan.loanDate).toISOString().split('T')[0];
                      return loanDate === dateStr;
                    }).length;
                    return {
                      date: date.toISOString(),
                      loans: loansOnDate,
                    };
                  }) : []}
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* LIBROS */}
      {activeTab === 'books' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <h2 className="text-lg sm:text-xl font-semibold text-[#132F20] dark:text-white">
              {t('admin.books')}
            </h2>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="flex-1 sm:w-64">
                <SearchInput
                  value={booksSearch}
                  onChange={setBooksSearch}
                  placeholder="Buscar libros..."
                />
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-3 sm:px-5 py-2 sm:py-2.5 bg-[#c3d62f] text-[#132F20] rounded-lg sm:rounded-xl hover:bg-[#a8b828] transition-colors font-medium shadow-sm whitespace-nowrap text-sm sm:text-base"
              >
                + {t('admin.addBook')}
              </button>
            </div>
          </div>

          {booksLoading ? (
            <SkeletonTable rows={6} />
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
                <table className="w-full min-w-[600px] sm:min-w-0">
                  <thead>
                    <tr className="bg-[#c3d62f]/5 dark:bg-[#c3d62f]/5 border-b border-[#c3d62f]/20">
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-[#132F20] dark:text-[#c3d62f]">
                        {t('admin.booksTable.cover')}
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-[#132F20] dark:text-[#c3d62f]">
                        {t('admin.booksTable.title')}
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-[#132F20] dark:text-[#c3d62f]">
                        {t('admin.booksTable.author')}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#132F20] dark:text-[#c3d62f]">
                        {t('admin.booksTable.category')}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#132F20] dark:text-[#c3d62f]">
                        {t('admin.booksTable.status')}
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-[#132F20] dark:text-[#c3d62f]">
                        {t('common.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {booksData?.content
                      .filter(book => 
                        booksSearch === '' ||
                        book.title.toLowerCase().includes(booksSearch.toLowerCase()) ||
                        book.author.toLowerCase().includes(booksSearch.toLowerCase()) ||
                        book.category.toLowerCase().includes(booksSearch.toLowerCase())
                      )
                      .map((book, index) => (
                      <tr 
                        key={book.id} 
                        className={`hover:bg-[#c3d62f]/5 dark:hover:bg-[#c3d62f]/5 transition-colors ${index % 2 === 1 ? 'bg-gray-50/50 dark:bg-gray-800/30' : ''}`}
                      >
                        <td className="px-4 py-3">
                          {book.coverImage ? (
                            <img 
                              src={book.coverImage} 
                              alt={book.title}
                              className="w-14 h-20 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            />
                          ) : (
                            <div className="w-14 h-20 bg-[#c3d62f]/10 rounded-lg flex items-center justify-center">
                              <BookOpenIcon size={24} className="text-[#c3d62f]" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-[#132F20] dark:text-white max-w-xs truncate">
                            {book.title}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                          {book.author}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-1 bg-[#c3d62f] dark:bg-[#c3d62f] text-[#132F20] dark:text-[#132F20] rounded-full text-xs font-medium">
                            {book.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              book.availability
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            }`}
                          >
                            {book.availability ? '✓' : '✗'} {book.availability ? t('book.available') : t('book.unavailable')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end">
                            <ActionMenu
                              actions={[
                                {
                                  label: 'Ver detalles',
                                  icon: <EyeIcon size={16} />,
                                  onClick: () => navigate(`/books/${book.id}`),
                                },
                                {
                                  label: 'Editar',
                                  icon: <Edit2Icon size={16} />,
                                  onClick: () => {
                                    setSelectedBook(book);
                                    setIsEditBookModalOpen(true);
                                  },
                                },
                                {
                                  label: 'Eliminar',
                                  icon: <Trash2Icon size={16} />,
                                  onClick: () => handleDeleteBook(book),
                                },
                              ]}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('admin.totalBooks')}: <span className="font-medium text-[#132F20] dark:text-[#c3d62f]">{booksData?.totalElements || 0}</span>
              {booksSearch && (
                <span className="ml-2">
                  (filtrados: {booksData?.content.filter(book => 
                    book.title.toLowerCase().includes(booksSearch.toLowerCase()) ||
                    book.author.toLowerCase().includes(booksSearch.toLowerCase()) ||
                    book.category.toLowerCase().includes(booksSearch.toLowerCase())
                  ).length || 0})
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* PRÉSTAMOS */}
      {activeTab === 'loans' && (
        <div>
          <h2 className="text-xl font-semibold text-[#132F20] dark:text-white mb-6">
            {t('admin.loans')}
          </h2>

          {loansLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : loansData?.content.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-[#c3d62f]/10">
                <ClipboardXIcon size={40} className="text-[#c3d62f]" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">{t('admin.noLoans')}</p>
            </Card>
          ) : (
            <>
              <div className="space-y-3">
                {loansData?.content.map((loan) => (
                  <AdminLoanCard
                    key={loan.id}
                    loan={loan}
                    formatDate={formatDate}
                  />
                ))}
              </div>

              {loansData && loansData.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setLoansPage(p => Math.max(0, p - 1))}
                    disabled={loansPage === 0}
                    className="px-4 py-2 border border-[#c3d62f]/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#c3d62f]/10 text-[#132F20] dark:text-[#c3d62f] transition-colors"
                  >
                    {t('common.previous')}
                  </button>
                  <span className="px-4 py-2 text-gray-500 dark:text-gray-400">
                    {t('common.page')} {loansPage + 1} {t('common.of')} {loansData.totalPages}
                  </span>
                  <button
                    onClick={() => setLoansPage(p => p + 1)}
                    disabled={loansPage >= loansData.totalPages - 1}
                    className="px-4 py-2 border border-[#c3d62f]/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#c3d62f]/10 text-[#132F20] dark:text-[#c3d62f] transition-colors"
                  >
                    {t('common.next')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* USUARIOS */}
      {(activeTab === 'users') && (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-[#132F20] dark:text-white">
              {t('admin.users')}
            </h2>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
              {/* Role Filter Chips */}
              <div className="flex bg-[#c3d62f]/10 dark:bg-[#1a2e24] rounded-lg p-1">
                {(['ALL', 'ADMIN', 'USER'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => setUserRoleFilter(role)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                      userRoleFilter === role
                        ? 'bg-[#c3d62f] text-[#132F20] shadow-sm'
                        : 'text-[#132F20] dark:text-gray-300 hover:bg-[#c3d62f]/20'
                    }`}
                  >
                    {role === 'ALL' ? 'Todos' : role === 'ADMIN' ? 'Admin' : 'Usuario'}
                  </button>
                ))}
              </div>
              
              <div className="w-full sm:w-64">
                <SearchInput
                  value={usersSearch}
                  onChange={setUsersSearch}
                  placeholder="Buscar usuario..."
                />
              </div>
            </div>
          </div>

          {deleteError && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
              {deleteError}
            </div>
          )}

          {usersLoading ? (
            <SkeletonTable rows={6} />
          ) : usersData?.content.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-[#c3d62f]/10">
                <UsersXIcon size={40} className="text-[#c3d62f]" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">No se encontraron usuarios</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Intenta con otros filtros de búsqueda</p>
            </Card>
          ) : (
            <>
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#c3d62f]/5 dark:bg-[#c3d62f]/5 border-b border-[#c3d62f]/20">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#132F20] dark:text-[#c3d62f]">
                          {t('profile.name')}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#132F20] dark:text-[#c3d62f]">
                          {t('profile.document')}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#132F20] dark:text-[#c3d62f]">
                          {t('profile.email')}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#132F20] dark:text-[#c3d62f]">
                          {t('profile.semester')}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#132F20] dark:text-[#c3d62f]">
                          {t('profile.phone')}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#132F20] dark:text-[#c3d62f]">
                          {t('profile.role')}
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-[#132F20] dark:text-[#c3d62f]">
                          {t('common.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {usersData?.content
                        .filter(userItem => {
                          const matchesSearch = usersSearch === '' ||
                            userItem.name?.toLowerCase().includes(usersSearch.toLowerCase()) ||
                            userItem.email?.toLowerCase().includes(usersSearch.toLowerCase()) ||
                            userItem.document?.includes(usersSearch);
                          const matchesRole = userRoleFilter === 'ALL' || 
                            (userRoleFilter === 'ADMIN' && userItem.role === 'ADMIN') ||
                            (userRoleFilter === 'USER' && userItem.role !== 'ADMIN');
                          return matchesSearch && matchesRole;
                        })
                        .map((userItem, index) => (
                        <tr 
                          key={userItem.id} 
                          className={`hover:bg-[#c3d62f]/5 dark:hover:bg-[#c3d62f]/5 transition-colors ${index % 2 === 1 ? 'bg-gray-50/50 dark:bg-gray-800/30' : ''}`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="hidden md:flex w-9 h-9 rounded-full bg-gradient-to-br from-[#c3d62f] to-[#a8b828] items-center justify-center text-[#132F20] text-sm font-bold shadow-sm">
                                {userItem.name?.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-[#132F20] dark:text-white">
                                {userItem.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300 font-mono text-sm">
                            {userItem.document || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                            {userItem.email}
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                            {userItem.semester || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                            {userItem.phone || 'N/A'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit ${
                              userItem.role === 'ADMIN' 
                                ? 'bg-[#c3d62f] dark:bg-[#c3d62f] text-[#132F20] dark:text-[#132F20]' 
                                : 'bg-[#c3d62f] dark:bg-[#c3d62f] text-[#132F20] dark:text-[#132F20]'
                            }`}>
                              {userItem.role === 'ADMIN' ? (
                                <>
                                  <CrownIcon size={14} />
                                  Admin
                                </>
                              ) : (
                                <>
                                  <UserIcon size={14} />
                                  Usuario
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end">
                              <ActionMenu
                                actions={[
                                  {
                                    label: 'Editar',
                                    icon: <Edit2Icon size={16} />,
                                    onClick: () => handleEditUser(userItem),
                                  },
                                  {
                                    label: 'Eliminar',
                                    icon: <Trash2Icon size={16} />,
                                    onClick: () => handleDeleteUser(userItem),
                                    variant: 'danger',
                                  },
                                ]}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total: <span className="font-medium text-[#132F20] dark:text-[#c3d62f]">{usersData?.totalElements || 0}</span> usuarios
                  {(usersSearch || userRoleFilter !== 'ALL') && (
                    <span className="ml-2">
                      (filtrados: {usersData?.content.filter(userItem => {
                        const matchesSearch = usersSearch === '' ||
                          userItem.name?.toLowerCase().includes(usersSearch.toLowerCase()) ||
                          userItem.email?.toLowerCase().includes(usersSearch.toLowerCase()) ||
                          userItem.document?.includes(usersSearch);
                        const matchesRole = userRoleFilter === 'ALL' || 
                          (userRoleFilter === 'ADMIN' && userItem.role === 'ADMIN') ||
                          (userRoleFilter === 'USER' && userItem.role !== 'ADMIN');
                        return matchesSearch && matchesRole;
                      }).length})
                    </span>
                  )}
                </p>
              </div>

              {usersData && usersData.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button
                    onClick={() => setUsersPage(p => Math.max(0, p - 1))}
                    disabled={usersPage === 0}
                    className="px-4 py-2 border border-[#c3d62f]/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#c3d62f]/10 text-[#132F20] transition-colors"
                  >
                    Anterior
                  </button>
                  <span className="px-4 py-2 text-gray-500">
                    Página {usersPage + 1} de {usersData.totalPages}
                  </span>
                  <button
                    onClick={() => setUsersPage(p => p + 1)}
                    disabled={usersPage >= usersData.totalPages - 1}
                    className="px-4 py-2 border border-[#c3d62f]/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#c3d62f]/10 text-[#132F20] transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <CreateBookModal 
        isOpen={isCreateModalOpen} 
        onClose={() => {
          setIsCreateModalOpen(false);
          refetch();
        }} 
      />

      <EditBookModal
        isOpen={isEditBookModalOpen}
        onClose={() => {
          setIsEditBookModalOpen(false);
          setSelectedBook(null);
        }}
        book={selectedBook}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </div>
    </>
  );
}
