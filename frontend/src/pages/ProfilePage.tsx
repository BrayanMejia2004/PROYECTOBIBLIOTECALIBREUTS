import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../api/users';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Spinner } from '../components/common/Spinner';
import { useTranslation } from '../i18n';
import { UpdateProfileRequest } from '../types';

export default function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    document: '',
    name: '',
    semester: 0,
    phone: '',
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => usersApi.getProfile().then((res) => res.data),
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => usersApi.updateFullProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      setIsEditing(false);
    },
  });

  const handleEdit = () => {
    setFormData({
      document: profile?.document || user?.document || '',
      name: profile?.name || user?.name || '',
      semester: profile?.semester || user?.semester || 0,
      phone: profile?.phone || user?.phone || '',
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const isProfileComplete = profile?.document && profile?.name && profile?.semester && profile?.phone;

  if (isLoading) {
    return <Spinner size="lg" />;
  }

  return (
    <div className="max-w-2xl mx-auto fade-in w-full">
      <div className="mb-4 sm:mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-[#132F20] dark:text-[#c3d62f] hover:text-[#c3d62f] dark:hover:text-[#a8b828] mb-4 flex items-center gap-1 transition-colors text-sm sm:text-base"
        >
          ← {t('common.back')}
        </button>
      </div>

      <div className="relative mb-6 sm:mb-8 slide-up">
        <div className="h-24 sm:h-32 rounded-t-2xl bg-gradient-to-r from-[#132F20] to-[#1a4a2e]"></div>
        <div className="absolute -bottom-10 sm:-bottom-12 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#c3d62f] flex items-center justify-center text-[#132F20] text-3xl sm:text-4xl font-bold border-4 border-white dark:border-gray-800 shadow-lg">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>

      <div className="pt-12 sm:pt-16 mb-4 sm:mb-6 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{profile?.name || user?.name || t('profile.notAvailable')}</h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">{profile?.email || user?.email}</p>
      </div>

      {!isProfileComplete && !isEditing && (
        <div className="mb-4 sm:mb-6 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded-lg slide-up text-sm sm:text-base" style={{ animationDelay: '0.1s' }}>
          {t('profile.completeFirst')}
        </div>
      )}

      <Card className="p-4 sm:p-6 card-lift">
        <div className="space-y-3 sm:space-y-4">
          <div className="bg-[#c3d62f]/5 dark:bg-[#c3d62f]/5 p-3 sm:p-4 rounded-lg border border-[#c3d62f]/20 card-lift" style={{ animationDelay: '0.05s' }}>
            <label className="block text-xs sm:text-sm font-medium text-[#132F20] dark:text-[#c3d62f] mb-1">
              {t('profile.document')}
            </label>
            {isEditing ? (
              <Input
                value={formData.document}
                onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                placeholder="12345678"
              />
            ) : (
              <p className="text-base sm:text-lg text-gray-900 dark:text-white font-medium">{profile?.document || user?.document || t('profile.notAvailable')}</p>
            )}
          </div>

          <div className="bg-[#c3d62f]/5 dark:bg-[#c3d62f]/5 p-3 sm:p-4 rounded-lg border border-[#c3d62f]/20 card-lift" style={{ animationDelay: '0.1s' }}>
            <label className="block text-xs sm:text-sm font-medium text-[#132F20] dark:text-[#c3d62f] mb-1">
              {t('profile.name')}
            </label>
            {isEditing ? (
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('profile.name')}
              />
            ) : (
              <p className="text-base sm:text-lg text-gray-900 dark:text-white font-medium">{profile?.name || user?.name || t('profile.notAvailable')}</p>
            )}
          </div>

          <div className="bg-[#c3d62f]/5 dark:bg-[#c3d62f]/5 p-3 sm:p-4 rounded-lg border border-[#c3d62f]/20 card-lift" style={{ animationDelay: '0.15s' }}>
            <label className="block text-xs sm:text-sm font-medium text-[#132F20] dark:text-[#c3d62f] mb-1">
              {t('profile.semester')}
            </label>
            {isEditing ? (
              <Input
                type="number"
                value={formData.semester || ''}
                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) || 0 })}
                placeholder="1"
              />
            ) : (
              <p className="text-base sm:text-lg text-gray-900 dark:text-white font-medium">{profile?.semester || user?.semester || t('profile.notAvailable')}</p>
            )}
          </div>

          <div className="bg-[#c3d62f]/5 dark:bg-[#c3d62f]/5 p-3 sm:p-4 rounded-lg border border-[#c3d62f]/20 card-lift" style={{ animationDelay: '0.2s' }}>
            <label className="block text-xs sm:text-sm font-medium text-[#132F20] dark:text-[#c3d62f] mb-1">
              {t('profile.phone')}
            </label>
            {isEditing ? (
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="3001234567"
              />
            ) : (
              <p className="text-base sm:text-lg text-gray-900 dark:text-white font-medium">{profile?.phone || user?.phone || t('profile.notAvailable')}</p>
            )}
          </div>

          <div className="bg-[#c3d62f]/5 dark:bg-[#c3d62f]/5 p-3 sm:p-4 rounded-lg border border-[#c3d62f]/20 card-lift" style={{ animationDelay: '0.25s' }}>
            <label className="block text-xs sm:text-sm font-medium text-[#132F20] dark:text-[#c3d62f] mb-1">
              {t('profile.email')}
            </label>
            <p className="text-base sm:text-lg text-gray-900 dark:text-white font-medium">{profile?.email || user?.email}</p>
          </div>

          <div className="bg-[#c3d62f]/5 dark:bg-[#c3d62f]/5 p-3 sm:p-4 rounded-lg border border-[#c3d62f]/20 card-lift" style={{ animationDelay: '0.3s' }}>
            <label className="block text-xs sm:text-sm font-medium text-[#132F20] dark:text-[#c3d62f] mb-1">
              {t('profile.role')}
            </label>
            <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
              user?.role === 'ADMIN' 
                ? 'bg-[#c3d62f]/30 text-[#132F20]' 
                : 'bg-[#c3d62f]/10 text-[#132F20]'
            }`}>
              {user?.role === 'ADMIN' ? t('profile.admin') : t('profile.user')}
            </span>
          </div>

          <div className="bg-[#c3d62f]/5 dark:bg-[#c3d62f]/5 p-3 sm:p-4 rounded-lg border border-[#c3d62f]/20 card-lift" style={{ animationDelay: '0.35s' }}>
            <label className="block text-xs sm:text-sm font-medium text-[#132F20] dark:text-[#c3d62f] mb-1">
              {t('profile.userId')}
            </label>
            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-mono truncate">{user?.id}</p>
          </div>

          <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
            {isEditing ? (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button onClick={handleSave} isLoading={updateMutation.isPending} className="w-full sm:w-auto text-sm sm:text-base">
                  {t('profile.save')}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="w-full sm:w-auto text-sm sm:text-base">
                  {t('profile.cancel')}
                </Button>
              </div>
            ) : !isProfileComplete && (
              <Button variant="outline" onClick={handleEdit} className="w-full sm:w-auto text-sm sm:text-base">
                {t('profile.edit')}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {updateMutation.isError && (
        <div className="mt-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg slide-up text-sm sm:text-base">
          {t('profile.updateError')}
        </div>
      )}

      {updateMutation.isSuccess && (
        <div className="mt-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg slide-up text-sm sm:text-base">
          {t('profile.updateSuccess')}
        </div>
      )}
    </div>
  );
}
