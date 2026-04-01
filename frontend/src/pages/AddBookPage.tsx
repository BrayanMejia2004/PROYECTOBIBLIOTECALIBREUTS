import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { booksApi, CreateBookRequest } from '../api/books';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { CustomDropdown } from '../components/common/CustomDropdown';
import { useTranslation } from '../i18n';
import { BookOpenIcon } from '../components/common/AdminIcons';

export default function AddBookPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateBookRequest>({
    title: '',
    author: '',
    summary: '',
    publicationDate: '',
    pages: 0,
    language: '',
    category: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageError, setImageError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const createMutation = useMutation({
    mutationFn: (data: CreateBookRequest) => {
      return booksApi.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setSuccessMessage(t('addBook.success'));
      setTimeout(() => {
        navigate('/catalogue');
      }, 2000);
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      setErrors({ submit: axiosError.response?.data?.message || t('addBook.error') });
    },
  });

  const handleInputChange = (field: keyof CreateBookRequest, value: string | number) => {
    setFormData((prev: CreateBookRequest) => ({ ...prev, [field]: value }));
    if (field in errors) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError('');
    
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError(t('validation.invalidImage') || 'El archivo debe ser una imagen');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError(t('settings.photoRequirements') || 'La imagen no puede superar 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = t('validation.required');
    if (!formData.author.trim()) newErrors.author = t('validation.required');
    if (!formData.summary.trim()) newErrors.summary = t('validation.required');
    if (!formData.publicationDate) newErrors.publicationDate = t('validation.required');
    if (!formData.pages || formData.pages <= 0) newErrors.pages = t('validation.required');
    if (!formData.language.trim()) newErrors.language = t('validation.required');
    if (!formData.category.trim()) newErrors.category = t('validation.required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    createMutation.mutate({
      ...formData,
      publicationDate: new Date(formData.publicationDate).toISOString(),
      coverImage: previewImage || undefined,
    });
  };

  const handleClose = () => {
    setFormData({
      title: '',
      author: '',
      summary: '',
      publicationDate: '',
      pages: 0,
      language: '',
      category: '',
    });
    setPreviewImage(null);
    setErrors({});
    setImageError('');
    setSuccessMessage('');
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 w-full">
      <button
        onClick={() => navigate('/catalogue')}
        className="text-[#132F20] dark:text-[#c3d62f] hover:text-[#c3d62f] dark:hover:text-[#a8b828] mb-4 flex items-center gap-1"
      >
        ← {t('common.back')}
      </button>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t('addBook.title')}</h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label={t('addBook.titleField')}
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={errors.title}
              placeholder="Ej: El Quijote"
            />

            <Input
              label={t('addBook.authorField')}
              value={formData.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              error={errors.author}
              placeholder="Ej: Miguel de Cervantes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {t('addBook.summaryField')}
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-[#c3d62f]/30 dark:border-[#c3d62f]/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c3d62f] focus:border-[#c3d62f] bg-white dark:bg-[#1a2e24] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder={t('addBook.summaryField')}
            />
            {errors.summary && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.summary}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label={t('addBook.publicationYear')}
              type="date"
              value={formData.publicationDate}
              onChange={(e) => handleInputChange('publicationDate', e.target.value)}
              error={errors.publicationDate}
            />

            <Input
              label={t('addBook.pagesField')}
              type="number"
              min="1"
              value={formData.pages || ''}
              onChange={(e) => handleInputChange('pages', parseInt(e.target.value) || 0)}
              error={errors.pages}
              placeholder="Ej: 200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomDropdown
              label={t('addBook.languageField')}
              value={formData.language}
              options={[
                { value: 'Español', label: 'Español' },
                { value: 'Inglés', label: 'Inglés' },
                { value: 'Francés', label: 'Francés' },
                { value: 'Portugués', label: 'Portugués' },
                { value: 'Alemán', label: 'Alemán' },
                { value: 'Otro', label: 'Otro' },
              ]}
              onChange={(value) => handleInputChange('language', value)}
              placeholder={t('createBook.selectLanguage')}
              error={errors.language}
            />

            <CustomDropdown
              label={t('addBook.categoryField')}
              value={formData.category}
              options={[
                { value: 'Programación', label: 'Programación' },
                { value: 'Base de Datos', label: 'Base de Datos' },
                { value: 'Redes', label: 'Redes' },
                { value: 'Seguridad', label: 'Seguridad' },
                { value: 'Matemáticas', label: 'Matemáticas' },
                { value: 'Física', label: 'Física' },
                { value: 'Literatura', label: 'Literatura' },
                { value: 'Historia', label: 'Historia' },
                { value: 'Otro', label: 'Otro' },
              ]}
              onChange={(value) => handleInputChange('category', value)}
              placeholder={t('createBook.selectCategory')}
              error={errors.category}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {t('addBook.coverImage')}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-[#c3d62f] transition-colors"
            >
              {previewImage ? (
                <div className="relative inline-block">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewImage(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="text-gray-500 dark:text-gray-400">
                  <BookOpenIcon size={40} className="block mx-auto mb-2 text-[#c3d62f]" />
                  <p>{t('addBook.selectImage')}</p>
                  <p className="text-xs mt-1">{t('settings.photoRequirements')}</p>
                </div>
              )}
            </div>
            {imageError && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{imageError}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={handleClose}>
              {t('addBook.cancel')}
            </Button>
            <Button type="submit" isLoading={createMutation.isPending}>
              {t('addBook.submit')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
