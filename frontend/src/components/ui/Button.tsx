import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  active?: boolean;
}

export const Button = ({ variant = 'primary', active, className = '', ...props }: ButtonProps) => {
  const baseStyles =
    'flex items-center gap-3 p-3 rounded-lg transition-all duration-200 disabled:opacity-50';

  const variants = {
    primary: active
      ? 'bg-primary text-primary-foreground glow-sm'
      : 'bg-secondary/50 text-foreground hover:bg-secondary',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100',
  };

  return <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />;
};
