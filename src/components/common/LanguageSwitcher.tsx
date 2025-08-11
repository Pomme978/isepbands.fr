'use client';

import { Switch } from '@/components/ui/switch';
import { useLang } from '@/hooks/useLang';
import { useRouter, usePathname } from 'next/navigation';

export function LanguageSwitcher() {
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

  return (
    <div className="flex items-center gap-2">
      <span className={isFr ? 'font-bold' : 'text-muted-foreground'}>FR</span>
      <Switch checked={!isFr} onCheckedChange={handleLangChange} aria-label="Switch language" />
      <span className={!isFr ? 'font-bold' : 'text-muted-foreground'}>EN</span>
    </div>
  );
}
