import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-3 py-2 border rounded-lg shadow-sm
            focus:outline-none focus:ring-2 focus:ring-[#c3d62f] focus:border-[#c3d62f]
            bg-white dark:bg-[#1a2e24]
            text-[#1a2e1c] dark:text-[#e8ebe9]
            placeholder-[#8a9b8c] dark:placeholder-[#5a6b5c]
            ${error ? 'border-red-500 dark:border-red-400' : 'border-[#c3d62f]/30 dark:border-[#c3d62f]/30'}
            ${className}
          `}
          aria-invalid={!!error}
          {...props}
        />
        {error && (
          <p role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
