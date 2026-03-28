import { CSSProperties, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

export function Card({ children, className = '', onClick, style }: CardProps) {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      onClick={onClick}
      style={style}
      className={`
        bg-white dark:bg-[#1a2e24] rounded-xl shadow-[0_2px_8px_rgba(19,47,32,0.1)] border border-[#c3d62f]/20
        ${onClick ? 'cursor-pointer hover:shadow-[0_4px_16px_rgba(19,47,32,0.15)] transition-all duration-200 hover:translate-y-[-1px]' : ''}
        ${className}
      `}
    >
      {children}
    </Component>
  );
}
