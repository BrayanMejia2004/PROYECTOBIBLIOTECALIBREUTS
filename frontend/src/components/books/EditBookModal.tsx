import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { booksApi, UpdateBookRequest } from '../../api/books';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Book } from '../../types';
import { useTranslation } from '../../i18n';
import { BookOpenIcon, PenLineIcon } from '../common/AdminIcons';
import { GlobeIcon, FolderIcon } from '../common/UserIcons';

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
}

export function EditBookModal({ isOpen, onClose, book }: EditBookModalProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showNewImage, setShowNewImage] = useState(false);
  const [formData, setFormData] = useState<UpdateBookRequest>({
    title: '',
    author: '',
    summary: '',
    publicationDate: '',
    pages: 0,
    language: '',
    category: '',
    availability: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    if (book && isOpen) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        summary: book.summary || '',
        publicationDate: book.publicationDate?.split('T')[0] || '',
        pages: book.pages || 0,
        language: book.language || '',
        category: book.category || '',
        availability: book.availability ?? true,
      });
      setPreviewImage(null);
      setShowNewImage(false);
      setErrors({});
      setImageError('');
    }
  }, [book, isOpen]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateBookRequest) => {
      if (!book) throw new Error('No book selected');
      return booksApi.update(book.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBooks'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      handleClose();
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      setErrors({ submit: axiosError.response?.data?.message || t('addBook.error') });
    },
  });

  const handleInputChange = (field: keyof UpdateBookRequest, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
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
      setShowNewImage(true);
    };
    reader.readAsDataURL(file);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) newErrors.title = t('validation.required');
    if (!formData.author?.trim()) newErrors.author = t('validation.required');
    if (!formData.summary?.trim()) newErrors.summary = t('validation.required');
    if (!formData.publicationDate) newErrors.publicationDate = t('validation.required');
    if (!formData.pages || formData.pages <= 0) newErrors.pages = t('validation.required');
    if (!formData.language?.trim()) newErrors.language = t('validation.required');
    if (!formData.category?.trim()) newErrors.category = t('validation.required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const dataToSend: UpdateBookRequest = {
      ...formData,
      publicationDate: formData.publicationDate ? new Date(formData.publicationDate).toISOString() : undefined,
      coverImage: showNewImage ? previewImage || undefined : undefined,
    };

    if (!showNewImage) {
      delete dataToSend.coverImage;
    }

    updateMutation.mutate(dataToSend);
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
      availability: true,
    });
    setPreviewImage(null);
    setShowNewImage(false);
    setErrors({});
    setImageError('');
    onClose();
  };

  if (!book) return null;

  const coverUrl = showNewImage ? previewImage : book.coverImage;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="" size="xl">
      <div className="-mx-6 -mt-6">
        {/* Header con cover y info del libro */}
        <div className="bg-gradient-to-r from-[#132F20] to-[#1a4030] px-6 py-5 rounded-t-xl">
          <div className="flex items-start gap-4">
            {/* Cover */}
            <div className="flex-shrink-0">
              {coverUrl ? (
                <img 
                  src={coverUrl} 
                  alt={book.title}
                  className="w-20 h-28 object-cover rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-20 h-28 bg-[#c3d62f]/20 rounded-lg flex items-center justify-center">
                  <BookOpenIcon size={32} className="text-[#c3d62f]" />
                </div>
              )}
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-white truncate">
                {book.title}
              </h2>
              <p className="text-gray-300 text-sm mt-0.5 flex items-center gap-1">
                <PenLineIcon size={14} className="inline" /> {book.author}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 bg-[#c3d62f]/20 text-[#c3d62f] rounded-full text-xs font-medium flex items-center gap-1">
                  <FolderIcon size={12} className="inline" /> {book.category}
                </span>
                <span className="px-2 py-0.5 bg-white/10 text-gray-300 rounded-full text-xs flex items-center gap-1">
                  <GlobeIcon size={12} className="inline" /> {book.language}
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

          {/* Datos del Libro */}
          <div>
            <h3 className="text-sm font-semibold text-[#132F20] dark:text-[#c3d62f] mb-3 flex items-center gap-2">
              <BookOpenIcon size={16} /> Información del Libro
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {/* Resumen */}
          <div>
            <label className="block text-sm font-medium text-[#132F20] dark:text-gray-200 mb-1.5">
              {t('addBook.summaryField')}
            </label>
            <textarea
              value={formData.summary || ''}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-[#c3d62f]/30 dark:border-[#c3d62f]/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c3d62f] bg-white dark:bg-[#1a2e24] text-[#132F20] dark:text-gray-100 placeholder-gray-400"
              placeholder={t('addBook.summaryField')}
            />
            {errors.summary && <p className="text-red-500 text-sm mt-1">{errors.summary}</p>}
          </div>

          {/* Fecha y Páginas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#132F20] dark:text-gray-200 mb-1.5">
                {t('addBook.publicationYear')}
              </label>
              <input
                type="date"
                value={formData.publicationDate?.split('T')[0] || ''}
                onChange={(e) => handleInputChange('publicationDate', e.target.value)}
                className="w-full px-3 py-2 border border-[#c3d62f]/30 dark:border-[#c3d62f]/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c3d62f] bg-white dark:bg-[#1a2e24] text-[#132F20] dark:text-gray-100"
              />
              {errors.publicationDate && <p className="text-red-500 text-sm mt-1">{errors.publicationDate}</p>}
            </div>

            <Input
              label={t('addBook.pagesField')}
              type="number"
              min="1"
              value={formData.pages || ''}
              onChange={(e) => handleInputChange('pages', parseInt(e.target.value) || 0)}
              error={errors.pages}
              placeholder="Ej: 300"
            />
          </div>

          {/* Idioma y Categoría */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#132F20] dark:text-gray-200 mb-1.5">
                {t('addBook.languageField')}
              </label>
              <select
                value={formData.language || ''}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-[#c3d62f]/30 dark:border-[#c3d62f]/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c3d62f] bg-white dark:bg-[#1a2e24] text-[#132F20] dark:text-gray-100"
              >
                <option value="">Seleccionar idioma</option>
                <option value="Español">Español</option>
                <option value="Inglés">Inglés</option>
                <option value="Francés">Francés</option>
                <option value="Portugués">Portugués</option>
                <option value="Alemán">Alemán</option>
                <option value="Otro">Otro</option>
              </select>
              {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#132F20] dark:text-gray-200 mb-1.5">
                {t('addBook.categoryField')}
              </label>
              <select
                value={formData.category || ''}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-[#c3d62f]/30 dark:border-[#c3d62f]/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c3d62f] bg-white dark:bg-[#1a2e24] text-[#132F20] dark:text-gray-100"
              >
                <option value="">Seleccionar categoría</option>
                <option value="Programación">Programación</option>
                <option value="Base de Datos">Base de Datos</option>
                <option value="Redes">Redes</option>
                <option value="Seguridad">Seguridad</option>
                <option value="Matemáticas">Matemáticas</option>
                <option value="Física">Física</option>
                <option value="Literatura">Literatura</option>
                <option value="Historia">Historia</option>
                <option value="Otro">Otro</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
          </div>

          {/* Disponibilidad */}
          <div className="bg-[#c3d62f]/5 dark:bg-[#c3d62f]/5 p-4 rounded-xl border border-[#c3d62f]/20">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-[#132F20] dark:text-gray-200">
                  Disponibilidad
                </span>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formData.availability 
                    ? 'El libro está disponible para préstamos' 
                    : 'El libro NO está disponible para préstamos'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleInputChange('availability', !formData.availability)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  formData.availability ? 'bg-[#c3d62f]' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                    formData.availability ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Imagen de Cover */}
          <div>
            <label className="block text-sm font-medium text-[#132F20] dark:text-gray-200 mb-1.5">
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
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center cursor-pointer hover:border-[#c3d62f] transition-colors"
            >
              {coverUrl ? (
                <div className="relative inline-block">
                  <img
                    src={coverUrl}
                    alt="Cover preview"
                    className="max-h-32 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewImage(null);
                      setShowNewImage(false);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                  >
                    ×
                  </button>
                  {showNewImage && (
                    <span className="absolute -bottom-2 -left-2 bg-[#c3d62f] text-[#132F20] text-xs px-2 py-0.5 rounded-full">
                      Nueva
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-gray-500">
                  <BookOpenIcon size={32} className="block mx-auto mb-1 text-[#c3d62f]" />
                  <p className="text-sm">Click para seleccionar imagen</p>
                </div>
              )}
            </div>
            {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
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
