import React from 'react';
import { LucideIcon } from 'lucide-react';
import Loading from '@/components/ui/Loading';

export interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

const AdminButton = React.forwardRef<HTMLButtonElement, AdminButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      loading = false,
      loadingText,
      disabled,
      className = '',
      children,
      ...props
    },
    ref,
  ) => {
    // Variant styles (matching original admin design)
    const variantStyles = {
      primary:
        'bg-primary text-white border-primary hover:bg-primary/90 hover:border-primary/90 focus:ring-primary/20',
      secondary:
        'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-200',
      danger:
        'bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 focus:ring-red-200',
      success:
        'bg-white text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300 focus:ring-green-200',
      warning:
        'bg-white text-yellow-700 border-yellow-200 hover:bg-yellow-50 hover:border-yellow-300 focus:ring-yellow-200',
      ghost:
        'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-200',
    };

    // Size styles (with border radius and padding)
    const sizeStyles = {
      xs: 'px-3 py-1 text-xs rounded-md',
      sm: 'px-4 py-1.5 text-sm rounded-lg',
      md: 'px-4 py-1.5 text-sm rounded-lg',
      lg: 'px-6 py-2 text-base rounded-lg',
    };

    // Icon sizes
    const iconSizes = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };

    // Determine if button is disabled
    const isDisabled = disabled || loading;

    // Build classes
    const baseClasses =
      'inline-flex cursor-pointer items-center justify-center font-medium border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    const disabledClasses =
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50';

    const buttonClasses = `
      ${baseClasses}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${disabledClasses}
      ${className}
    `
      .trim()
      .replace(/\s+/g, ' ');

    const renderIcon = (position: 'left' | 'right') => {
      if (!Icon || iconPosition !== position) return null;

      const iconClasses = `${iconSizes[size]} ${position === 'left' ? 'mr-2' : 'ml-2'}`;

      return <Icon className={iconClasses} />;
    };

    const renderContent = () => {
      if (loading) {
        // Determine spinner color based on variant
        const spinnerColor = variant === 'primary' ? 'white' : 'gray';

        return (
          <>
            <Loading size="sm" text="" centered={false} color={spinnerColor} />
            {loadingText && <span className="ml-2">{loadingText}</span>}
          </>
        );
      }

      return (
        <>
          {renderIcon('left')}
          {children}
          {renderIcon('right')}
        </>
      );
    };

    return (
      <button ref={ref} className={buttonClasses} disabled={isDisabled} {...props}>
        {renderContent()}
      </button>
    );
  },
);

AdminButton.displayName = 'AdminButton';

export default AdminButton;
