'use client';

import { Loader2 } from 'lucide-react';

interface LoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  className?: string;
  centered?: boolean;
}

export default function Loading({ 
  text = 'Loading...', 
  size = 'md',
  variant = 'spinner',
  className = '',
  centered = true
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const containerClasses = centered 
    ? `flex items-center justify-center space-x-2 ${className}`
    : `flex items-center space-x-2 ${className}`;

  if (variant === 'spinner') {
    return (
      <div className={containerClasses}>
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        {text && (
          <span className={`text-gray-600 ${textSizeClasses[size]}`}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={containerClasses}>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        {text && (
          <span className={`text-gray-600 ml-2 ${textSizeClasses[size]}`}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={containerClasses}>
        <div className={`${sizeClasses[size]} bg-primary rounded-full animate-pulse`}></div>
        {text && (
          <span className={`text-gray-600 ${textSizeClasses[size]}`}>
            {text}
          </span>
        )}
      </div>
    );
  }

  return null;
}