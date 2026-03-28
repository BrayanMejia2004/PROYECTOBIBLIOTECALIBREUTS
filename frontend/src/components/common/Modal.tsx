import { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-[#132F20]/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <div className={`relative bg-white dark:bg-[#1a2e24] rounded-xl shadow-[0_8px_30px_rgba(19,47,32,0.3)] w-full ${sizeClasses[size]} transform transition-all border border-[#c3d62f]/20`}>
          <div className="flex items-center justify-between p-4 border-b border-[#c3d62f]/20">
            <h3 className="text-lg font-display font-semibold text-[#132F20] dark:text-[#c3d62f]">{title}</h3>
            <button
              onClick={onClose}
              className="text-[#5a6b5c] hover:text-[#132F20] dark:hover:text-[#c3d62f] transition-colors p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
