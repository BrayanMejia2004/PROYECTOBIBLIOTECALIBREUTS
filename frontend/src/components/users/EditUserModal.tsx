import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/admin';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { PasswordInput } from '../common/PasswordInput';
import { User, UpdateUserRequest } from '../../types';
import { useTranslation } from '../../i18n';
import { CrownIcon, UserIcon } from '../common/AdminIcons';
import { MailIcon, GraduationCapIcon, LockIcon } from '../common/UserIcons';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function EditUserModal({ isOpen, onClose, user }: EditUserModalProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<UpdateUserRequest>({
    document: '',
    name: '',
    semester: 1,
    phone: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        document: user.document || '',
        name: user.name || '',
        semester: user.semester || 1,
        phone: user.phone || '',
        email: user.email || '',
        password: '',
      });
      setErrors({});
    }
  }, [user, isOpen]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateUserRequest) => {
      if (!user) throw new Error('No user selected');
      return adminApi.updateUser(user.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      handleClose();
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      setErrors({ submit: axiosError.response?.data?.message || t('editUser.error') });
    },
  });

  const handleInputChange = (field: keyof UpdateUserRequest, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.document.trim()) newErrors.document = t('validation.required');
    if (!formData.name.trim()) newErrors.name = t('validation.required');
    if (!formData.semester || formData.semester <= 0) newErrors.semester = t('validation.required');
    if (!formData.phone.trim()) newErrors.phone = t('validation.required');
    if (!formData.email.trim()) newErrors.email = t('validation.required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.invalidEmail');
    } else if (!formData.email.endsWith('@uts.edu.co')) {
      newErrors.email = t('validation.invalidEmail');
    }

    if (formData.password && formData.password.length > 0) {
      if (formData.password.length < 10) {
        newErrors.password = t('validation.minLength');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const dataToSend: UpdateUserRequest = {
      document: formData.document,
      name: formData.name,
      semester: formData.semester,
      phone: formData.phone,
      email: formData.email,
    };

    if (formData.password && formData.password.length > 0) {
      dataToSend.password = formData.password;
    }

    updateMutation.mutate(dataToSend);
  };

  const handleClose = () => {
    setFormData({
      document: '',
      name: '',
      semester: 1,
      phone: '',
      email: '',
      password: '',
    });
    setErrors({});
    onClose();
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="" size="lg">
      <div className="-mx-6 -mt-6">
        {/* Header con avatar */}
        <div className="bg-gradient-to-r from-[#132F20] to-[#1a4030] px-6 py-6 rounded-t-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c3d62f] to-[#a8b828] flex items-center justify-center text-[#132F20] text-2xl font-bold shadow-lg">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white">{user.name}</h2>
              <p className="text-gray-300 text-sm">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'ADMIN' 
                    ? 'bg-[#c3d62f]/30 text-[#c3d62f]' 
                    : 'bg-white/10 text-white'
                }`}>
                  {user.role === 'ADMIN' ? (
                    <>
                      <CrownIcon size={14} className="inline mr-1" />
                      Administrador
                    </>
                  ) : (
                    <>
                      <UserIcon size={14} className="inline mr-1" />
                      Usuario
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
              {errors.submit}
            </div>
          )}

          {/* Datos Personales */}
          <div>
            <h3 className="text-sm font-semibold text-[#132F20] dark:text-[#c3d62f] mb-3 flex items-center gap-2">
              <UserIcon size={16} /> Datos Personales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('editUser.document')}
                value={formData.document}
                onChange={(e) => handleInputChange('document', e.target.value)}
                error={errors.document}
                placeholder="Ej: 1234567890"
              />

              <Input
                label={t('editUser.name')}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
                placeholder="Ej: Juan Pérez"
              />
            </div>
          </div>

          {/* Información de Contacto */}
          <div>
            <h3 className="text-sm font-semibold text-[#132F20] dark:text-[#c3d62f] mb-3 flex items-center gap-2">
              <MailIcon size={16} /> Información de Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('editUser.email')}
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                placeholder="Ej: juan.perez@uts.edu.co"
              />

              <Input
                label={t('editUser.phone')}
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={errors.phone}
                placeholder="Ej: 3123456789"
              />
            </div>
          </div>

          {/* Información Académica */}
          <div>
            <h3 className="text-sm font-semibold text-[#132F20] dark:text-[#c3d62f] mb-3 flex items-center gap-2">
              <GraduationCapIcon size={16} /> Información Académica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('editUser.semester')}
                type="number"
                min="1"
                max="10"
                value={formData.semester || ''}
                onChange={(e) => handleInputChange('semester', parseInt(e.target.value) || 1)}
                error={errors.semester}
                placeholder="Ej: 3"
              />
            </div>
          </div>

          {/* Seguridad */}
          <div>
            <h3 className="text-sm font-semibold text-[#132F20] dark:text-[#c3d62f] mb-3 flex items-center gap-2">
              <LockIcon size={16} /> Seguridad
            </h3>
            <PasswordInput
              label={t('editUser.password')}
              value={formData.password || ''}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={errors.password}
              placeholder={t('editUser.password')}
              autoComplete="new-password"
            />
            <p className="mt-1.5 text-xs text-gray-500">
              Dejar en blanco para mantener la contraseña actual
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#c3d62f]/20">
            <Button type="button" variant="outline" onClick={handleClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" isLoading={updateMutation.isPending}>
              {t('editUser.save')}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
