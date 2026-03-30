import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LanguageToggle } from '../components/common/LanguageToggle';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n';

function compressImage(base64: string, maxWidth = 300, quality = 0.7): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxWidth) {
          width = (width * maxWidth) / height;
          height = maxWidth;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = base64;
  });
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(user?.photoUrl || null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const updateMutation = useMutation({
    mutationFn: (photoUrl: string) => authApi.updateProfilePhoto(photoUrl),
    onSuccess: (res) => {
      const updatedUser = res.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      queryClient.setQueryData(['user'], updatedUser);
      setSuccessMessage(t('settings.success'));
      setErrorMessage('');
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      setErrorMessage(axiosError.response?.data?.message || t('settings.error'));
      setSuccessMessage('');
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('El archivo debe ser una imagen');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('La imagen no puede superar 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (previewImage && previewImage !== user?.photoUrl) {
      const compressedImage = await compressImage(previewImage);
      updateMutation.mutate(compressedImage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 w-full">
      <button
        onClick={() => navigate(-1)}
        className="text-[#132F20] hover:text-[#c3d62f] dark:text-[#c3d62f] dark:hover:text-[#a8b828] mb-4 flex items-center gap-1 transition-colors"
      >
        ← {t('settings.back')}
      </button>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 slide-up">
        {t('settings.title')}
      </h1>

      <Card className="p-6 mb-6 card-lift">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('settings.profilePhoto')}
        </h2>

        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg mb-4">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4">
            {errorMessage}
          </div>
        )}

        <div className="flex items-center gap-6 mb-6">
          {previewImage ? (
            <div className="relative">
              <img
                src={previewImage}
                alt="Foto de perfil"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
              />
              <button
                type="button"
                onClick={() => {
                  setPreviewImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#c3d62f] flex items-center justify-center text-[#132F20] text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}

          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              {t('settings.changePhoto')}
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {t('settings.photoRequirements')}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={() => navigate(-1)}>
            {t('settings.cancel')}
          </Button>
          <Button
            onClick={handleSave}
            isLoading={updateMutation.isPending}
          >
            {t('settings.saveChanges')}
          </Button>
        </div>
      </Card>

      <Card className="p-6 card-lift" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('settings.language')}
        </h2>
        <LanguageToggle />
      </Card>
    </div>
  );
}
