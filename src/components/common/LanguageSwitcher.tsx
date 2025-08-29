'use client';

import { Switch } from '@/components/ui/switch';
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

  const handleLangChange = (checked: boolean) => {
    const newLang = checked ? 'en' : 'fr';
    // Navigate without page reload
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    router.push(newPath);
  };

  const getTextClasses = (isActive: boolean) => {
    if (variant === 'transparent') {
      return isActive ? 'text-sm font-bold text-white' : 'text-sm text-white/60';
    }
    return isActive ? 'text-sm font-bold' : 'text-sm text-muted-foreground';
  };

  return (
    <div className="flex items-center gap-2">
      <span className={getTextClasses(isFr)}>FR</span>
      <Switch
        checked={!isFr}
        onCheckedChange={handleLangChange}
        aria-label="Switch language"
        variant={variant === 'transparent' ? 'transparent' : 'default'}
      />
      <span className={getTextClasses(!isFr)}>EN</span>
    </div>
  );
}
