import { ReactNode } from 'react';

interface FilterChipProps {
  label: string;
  icon?: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  count?: number;
}

export function FilterChip({ label, icon, isActive, onClick, count }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
        transition-all duration-200 ease-out
        ${isActive 
          ? 'bg-[#c3d62f] text-[#132F20] shadow-sm' 
          : 'bg-white dark:bg-[#1a2e24] text-[#132F20] dark:text-gray-300 border border-[#c3d62f]/20 hover:bg-[#c3d62f]/10 hover:border-[#c3d62f]/40'
        }
      `}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
      {count !== undefined && (
        <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
          isActive 
            ? 'bg-[#132F20]/10 text-[#132F20]' 
            : 'bg-[#c3d62f]/20 text-[#132F20]'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}
