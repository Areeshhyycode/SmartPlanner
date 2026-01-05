import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 active:bg-[#1a9eff] focus:bg-[#1a9eff] text-white active:text-white focus:text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:shadow-[#1a9eff]/40 focus:shadow-[#1a9eff]/40',
    secondary:
      'bg-dark-elevated hover:bg-dark-hover active:bg-[#1a9eff] focus:bg-[#1a9eff] border border-dark-border hover:border-blue-500/50 active:border-[#1a9eff] focus:border-[#1a9eff] text-text-primary active:text-white focus:text-white',
    outline:
      'bg-transparent hover:bg-blue-500/10 active:bg-[#1a9eff] focus:bg-[#1a9eff] border border-blue-500/50 hover:border-blue-500 active:border-[#1a9eff] focus:border-[#1a9eff] text-blue-400 hover:text-blue-300 active:text-white focus:text-white',
    ghost:
      'bg-transparent hover:bg-dark-elevated active:bg-[#1a9eff] focus:bg-[#1a9eff] text-text-secondary hover:text-text-primary active:text-white focus:text-white',
    danger:
      'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 active:bg-[#1a9eff] focus:bg-[#1a9eff] text-white active:text-white focus:text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5 active:shadow-[#1a9eff]/40 focus:shadow-[#1a9eff]/40',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}

export default Button;

