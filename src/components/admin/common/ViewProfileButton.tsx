'use client';

import { Eye } from 'lucide-react';
import LangLink from '@/components/common/LangLink';

interface ViewProfileButtonProps {
  userId: string;
  variant?: 'button' | 'link';
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export default function ViewProfileButton({
  userId,
  variant = 'button',
  className = '',
  children,
  onClick,
}: ViewProfileButtonProps) {
  const defaultButtonClass =
    'inline-flex cursor-pointer items-center px-4 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors';
  const defaultLinkClass =
    'inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors';

  const buttonClass = variant === 'button' ? defaultButtonClass : defaultLinkClass;

  if (onClick) {
    return (
      <button onClick={onClick} className={`${buttonClass} ${className}`}>
        <Eye className="w-4 h-4 mr-2" />
        {children || 'View Profile'}
      </button>
    );
  }

  return (
    <LangLink href={`/profile/${userId}`} className={`${buttonClass} ${className}`}>
      <Eye className="w-4 h-4 mr-2" />
      {children || 'View Profile'}
    </LangLink>
  );
}
