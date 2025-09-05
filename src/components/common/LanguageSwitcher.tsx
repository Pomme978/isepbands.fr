'use client';

import { useLang } from '@/hooks/useLang';

interface LanguageSwitcherProps {
  variant?: 'default' | 'transparent' | 'compact';
  className?: string;
}

export function LanguageSwitcher({ variant = 'default', className = '' }: LanguageSwitcherProps) {
  const { lang, setLang } = useLang();
  const isFr = lang === 'fr';

  const handleLangChange = () => {
    const newLang = isFr ? 'en' : 'fr';
    // Use the context setLang function for smooth navigation
    setLang(newLang);
  };

  const getContainerClasses = () => {
    let baseClasses =
      'relative inline-flex items-center p-1 cursor-pointer transition-all duration-300';

    if (variant === 'transparent') {
      baseClasses += ' bg-white/10 backdrop-blur hover:bg-white/20';
    } else if (variant === 'compact') {
      baseClasses += ' bg-gray-100 hover:bg-gray-200';
      // For compact variant, always use custom styling
      return `${baseClasses} ${className}`;
    } else {
      baseClasses += ' bg-gray-100 hover:bg-gray-200';
    }

    // For default and transparent, always use rounded-full unless overridden
    if (!className.includes('rounded-')) {
      baseClasses += ' rounded-full';
    }

    return `${baseClasses} ${className}`;
  };

  const getSliderClasses = () => {
    let roundedClass = 'rounded-full';
    let widthAndPosition = '';

    if (variant === 'compact') {
      // For compact variant, match container's border radius and use custom width
      if (className.includes('rounded-sm')) {
        roundedClass = 'rounded-sm';
      } else if (className.includes('rounded-md')) {
        roundedClass = 'rounded-md';
      } else if (className.includes('rounded-lg')) {
        roundedClass = 'rounded-lg';
      }

      // Calculate width and position for full-width compact variant
      widthAndPosition = isFr ? 'w-[calc(50%-2px)] left-1' : 'w-[calc(50%-2px)] right-1';
    } else {
      // For default and transparent variants, use original fixed width
      widthAndPosition = isFr ? 'w-11 left-1' : 'w-11 left-[calc(50%+2px)]';
    }

    const baseClasses = `absolute top-1/2 -translate-y-1/2 h-7 ${roundedClass} transition-all duration-300 ease-in-out transform shadow-md`;

    if (variant === 'transparent') {
      return `${baseClasses} ${widthAndPosition} bg-white`;
    }
    return `${baseClasses} ${widthAndPosition} bg-white`;
  };

  const getTextClasses = (isActive: boolean) => {
    let roundedClass = 'rounded-full';
    let widthClass = 'w-11';

    if (variant === 'compact') {
      // For compact variant, match container's border radius and use flex
      if (className.includes('rounded-sm')) {
        roundedClass = 'rounded-sm';
      } else if (className.includes('rounded-md')) {
        roundedClass = 'rounded-md';
      } else if (className.includes('rounded-lg')) {
        roundedClass = 'rounded-lg';
      }
      widthClass = 'flex-1';
    }

    const baseClasses = `relative z-10 flex items-center justify-center ${widthClass} h-7 text-xs font-semibold transition-all duration-300 ${roundedClass}`;
    if (variant === 'transparent') {
      return `${baseClasses} ${isActive ? 'text-gray-900' : 'text-white'}`;
    }
    return `${baseClasses} ${isActive ? 'text-gray-900' : 'text-gray-500'}`;
  };

  return (
    <button
      onClick={handleLangChange}
      className={getContainerClasses()}
      aria-label={`Switch to ${isFr ? 'English' : 'French'}`}
    >
      {/* Background slider */}
      <div className={getSliderClasses()} />

      {/* Language options */}
      <span className={getTextClasses(isFr)}>FR</span>
      <span className={getTextClasses(!isFr)}>EN</span>
    </button>
  );
}
