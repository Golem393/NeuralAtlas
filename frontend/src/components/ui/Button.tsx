import type { JSX, ReactNode } from 'react';

interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: 'default' | 'outline';
  className?: string;
}

export const Button = ({ onClick, children, variant = 'default', className = '' }: ButtonProps): JSX.Element => {
  const baseStyles = 'py-[5px] px-[10px] rounded-[5px] cursor-pointer';
  const variantStyles = variant === 'outline' 
    ? 'bg-white border border-[#ccc]' 
    : 'bg-white';

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {children}
    </button>
  );
};
