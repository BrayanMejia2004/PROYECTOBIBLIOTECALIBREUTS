import { ButtonHTMLAttributes, ReactNode } from 'react';
import { useTranslation } from '../../i18n';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const { t } = useTranslation();
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const baseStyles = `${sizeStyles[size]} rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`;
  
  const variantStyles = {
    primary: 'bg-[#c3d62f] text-[#132F20] hover:bg-[#a8b828] focus:ring-[#c3d62f] dark:bg-[#c3d62f] dark:text-[#132F20] dark:hover:bg-[#a8b828]',
    secondary: 'bg-[#132F20] text-[#c3d62f] hover:bg-[#0f241a] focus:ring-[#132F20]',
    outline: 'border-2 border-[#c3d62f] text-[#132F20] hover:bg-[#c3d62f]/10 focus:ring-[#c3d62f] dark:border-[#c3d62f] dark:text-[#c3d62f] dark:hover:bg-[#c3d62f]/10',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {t('common.loading')}
        </span>
      ) : children}
    </button>
  );
}
