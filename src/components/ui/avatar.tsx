'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { cn } from '@/utils/utils';

function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  );
}

function AvatarImage({ src, className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  // Validate if src is a valid URL before passing it to the image component
  const isValidImageSrc = (url: string | undefined): boolean => {
    if (!url || url.trim() === '' || url === 'PENDING_UPLOAD') return false;
    
    try {
      // Check if it's a valid URL (absolute or relative)
      if (url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return true;
      }
      // Try to construct URL to validate
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Only render if src is valid
  if (!isValidImageSrc(src)) {
    return null;
  }

  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('aspect-square size-full', className)}
      src={src}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn('bg-muted flex size-full items-center justify-center rounded-full', className)}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
