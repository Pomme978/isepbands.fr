'use client';

import Image from 'next/image';
import { cn } from '@/utils/utils';
import { useState, useEffect } from 'react';

interface AvatarProps {
  src?: string | null;
  name: string; // Full name for generating initials and alt text
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: { container: 'w-8 h-8', text: 'text-xs' },
  md: { container: 'w-10 h-10', text: 'text-sm' },
  lg: { container: 'w-16 h-16', text: 'text-lg' },
  xl: { container: 'w-32 h-32', text: 'text-2xl' },
};

export default function Avatar({ src, name, size = 'xl', className = '' }: AvatarProps) {
  const getInitials = (fullName: string): string => {
    if (!fullName || fullName.trim().length === 0) return '??';
    return fullName
      .trim()
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2); // Limit to 2 characters
  };

  // Validate if src is a valid URL
  const isValidImageSrc = (url: string | null): boolean => {
    if (!url || url.trim() === '' || url === 'PENDING_UPLOAD') return false;

    try {
      // Check if it's a valid URL (absolute or relative)
      if (
        url.startsWith('/') ||
        url.startsWith('http://') ||
        url.startsWith('https://') ||
        url.startsWith('data:')
      ) {
        return true;
      }
      // Try to construct URL to validate
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const sizeClasses = sizeMap[size];
  const shouldShowImage = src && isValidImageSrc(src);
  const [imageError, setImageError] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    setImageError(false);
  }, [src]);

  const resetImageError = () => setImageError(false);

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center overflow-hidden',
        sizeClasses.container,
        className,
      )}
    >
      {shouldShowImage && !imageError ? (
        <Image
          src={src}
          alt={`Photo de ${name}`}
          width={size === 'xl' ? 128 : size === 'lg' ? 64 : size === 'md' ? 40 : 32}
          height={size === 'xl' ? 128 : size === 'lg' ? 64 : size === 'md' ? 40 : 32}
          className="w-full h-full object-cover"
          style={{ imageOrientation: 'from-image' }}
          onError={() => setImageError(true)}
          onLoad={resetImageError}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <span className={cn('text-gray-600 font-medium', sizeClasses.text)}>
            {getInitials(name)}
          </span>
        </div>
      )}
    </div>
  );
}
