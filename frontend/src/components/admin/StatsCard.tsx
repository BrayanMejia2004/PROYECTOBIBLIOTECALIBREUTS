import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  variant?: 'default' | 'warning' | 'success';
}

export function StatsCard({ title, value, icon, variant = 'default' }: StatsCardProps) {
  const variantStyles = {
    default: 'border-[#c3d62f]/30',
    warning: 'border-red-500/30',
    success: 'border-green-500/30',
  };

  const iconBgStyles = {
    default: 'bg-[#c3d62f]/10 text-[#132F20] dark:text-white',
    warning: 'bg-red-100 dark:bg-red-900/20 text-red-500 dark:text-red-400',
    success: 'bg-green-100 dark:bg-green-900/20 text-[#132F20] dark:text-white',
  };

  const textStyles = {
    default: 'text-[#132F20] dark:text-white',
    warning: 'text-red-600 dark:text-red-400',
    success: 'text-green-600 dark:text-green-400',
  };

  const hoverLineStyles = {
    default: 'hover:before:bg-[#c3d62f]',
    warning: 'hover:before:bg-red-500',
    success: 'hover:before:bg-green-500',
  };

  return (
    <div
      className={`
        relative overflow-hidden p-6 rounded-xl 
        bg-white dark:bg-[#1a2e24] 
        border ${variantStyles[variant]}
        shadow-sm hover:shadow-md transition-all duration-300
        before:absolute before:bottom-0 before:left-0 before:right-0 before:h-1
        before:opacity-0 ${hoverLineStyles[variant]} hover:before:opacity-100 before:transition-opacity
      `}
    >
      <div className="flex items-end justify-between">
        <div className="flex-1 pb-2">
          <p className="text-sm font-medium text-gray-500 dark:text-white mb-1">
            {title}
          </p>
          <p className={`text-4xl font-bold font-mono ${textStyles[variant]}`}>
            {value}
          </p>
        </div>
        <div className={`w-14 h-14 rounded-xl ${iconBgStyles[variant]} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
