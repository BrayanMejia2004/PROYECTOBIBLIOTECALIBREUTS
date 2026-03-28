import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { notificationsApi } from '../api/notifications';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { useTranslation } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { AlertTriangleIcon, ClockIcon, BookOpenIcon, BellIcon } from '../components/common/AdminIcons';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'ADMIN';

  const { data: notifications, isLoading, isError } = useQuery({
    queryKey: ['notifications', isAdmin],
    queryFn: () => isAdmin 
      ? notificationsApi.getAdmin().then(res => res.data)
      : notificationsApi.getAll().then(res => res.data),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => isAdmin 
      ? notificationsApi.markAdminAsRead(id)
      : notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', isAdmin] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => isAdmin 
      ? notificationsApi.markAllAdminAsRead()
      : notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', isAdmin] });
    },
  });

  const unreadNotifications = notifications?.filter(n => !n.read) || [];
  const unreadCount = unreadNotifications.length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getNotificationIcon = (type: string) => {
    if (type === 'OVERDUE') return <AlertTriangleIcon size={24} className="text-red-500" />;
    if (type === 'DUE_SOON') return <ClockIcon size={24} className="text-orange-500" />;
    if (type === 'BOOK_ADDED') return <BookOpenIcon size={24} className="text-[#c3d62f]" />;
    return <BellIcon size={24} className="text-orange-500" />;
  };

  const getNotificationStyles = (type: string, read: boolean) => {
    if (type === 'OVERDUE') {
      return read 
        ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:scale-[1.01] transition-transform';
    }
    if (type === 'BOOK_ADDED') {
      return read 
        ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
        : 'bg-[#c3d62f]/10 dark:bg-[#c3d62f]/5 border-[#c3d62f]/30 hover:scale-[1.01] transition-transform';
    }
    return read 
      ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
      : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 hover:scale-[1.01] transition-transform';
  };

  const getNotificationTextStyles = (type: string) => {
    if (type === 'OVERDUE') return 'text-red-700 dark:text-red-400';
    if (type === 'BOOK_ADDED') return 'text-[#132F20] dark:text-[#c3d62f]';
    return 'text-orange-700 dark:text-orange-400';
  };

  const getNotificationTitle = (type: string) => {
    if (type === 'OVERDUE') return t('settings.overdueLoan');
    if (type === 'DUE_SOON') return t('settings.dueSoon');
    if (type === 'BOOK_ADDED') return t('settings.bookAdded');
    return '';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {t('common.error')}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 w-full">
      <button
        onClick={() => navigate(-1)}
        className="text-[#132F20] dark:text-[#c3d62f] hover:text-[#c3d62f] dark:hover:text-[#a8b828] mb-4 flex items-center gap-1 transition-colors"
      >
        ← {t('common.back')}
      </button>

      <div className="flex items-center justify-between mb-6 slide-up">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('settings.notifications')}
        </h1>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={() => markAllReadMutation.mutate()}
            isLoading={markAllReadMutation.isPending}
          >
            {t('settings.markAllRead')}
          </Button>
        )}
      </div>

      {notifications && notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <Card 
              key={notification.id} 
              className={`p-4 border card-lift ${getNotificationStyles(notification.type, notification.read)}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl flex-shrink-0">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1">
                    <p className={`font-medium ${getNotificationTextStyles(notification.type)}`}>
                      {getNotificationTitle(notification.type)}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">
                      {notification.message}
                    </p>
                    {notification.userName && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {notification.userName}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {notification.dueDate ? formatDate(notification.dueDate) : ''}
                    </p>
                  </div>
                </div>
                {!notification.read && (
                  <Button
                    variant="outline"
                    onClick={() => markAsReadMutation.mutate(notification.id)}
                    isLoading={markAsReadMutation.isPending}
                  >
                    {t('settings.markAsRead')}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center card-lift">
          <div className="flex justify-center mb-4">
            <BellIcon size={48} className="text-gray-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {t('settings.noNotifications')}
          </p>
        </Card>
      )}
    </div>
  );
}
