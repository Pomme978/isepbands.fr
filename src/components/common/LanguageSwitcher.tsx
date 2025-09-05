'use client';

import { useLang } from '@/hooks/useLang';
import { useRouter, usePathname } from 'next/navigation';

interface LanguageSwitcherProps {
  variant?: 'default' | 'transparent';
}

export function LanguageSwitcher({ variant = 'default' }: LanguageSwitcherProps) {
  const { lang } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const isFr = lang === 'fr';

  const handleLangChange = () => {
    const newLang = isFr ? 'en' : 'fr';
    // Navigate without page reload
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    router.push(newPath);
  };

  const getContainerClasses = () => {
    if (variant === 'transparent') {
      return 'relative inline-flex items-center bg-white/10 backdrop-blur rounded-full p-1 cursor-pointer transition-all duration-300 hover:bg-white/20';
    }
    return 'relative inline-flex items-center bg-gray-100 rounded-full p-1 cursor-pointer transition-all duration-300 hover:bg-gray-200';
  };

  const getSliderClasses = () => {
    const baseClasses =
      'absolute top-1/2 -translate-y-1/2 w-11 h-7 rounded-full transition-all duration-300 ease-in-out transform shadow-md';
    if (variant === 'transparent') {
      return `${baseClasses} bg-white ${isFr ? 'left-1' : 'left-[calc(50%+2px)]'}`;
    }
    return `${baseClasses} bg-white ${isFr ? 'left-1' : 'left-[calc(50%+2px)]'}`;
  };

  const getTextClasses = (isActive: boolean) => {
    const baseClasses =
      'relative z-10 flex items-center justify-center w-11 h-7 text-xs font-semibold transition-all duration-300 rounded-full';
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
