import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'white' | 'primary' | 'gray';
}

export function Spinner({ size = 'md', className, color = 'white' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const colorClasses = {
    white: 'text-white',
    primary: 'text-primary',
    gray: 'text-gray-500',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        colorClasses[color],
        className,
      )}
      aria-label="Chargement..."
    />
  );
}
