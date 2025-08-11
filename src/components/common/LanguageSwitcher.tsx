'use client';

import { Switch } from '@/components/ui/switch';
import { useLang } from '@/hooks/useLang';

export function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const isFr = lang === 'fr';
  return (
    <div className="flex items-center gap-2">
      <span className={isFr ? 'font-bold' : 'text-muted-foreground'}>FR</span>
      <Switch
        checked={!isFr}
        onCheckedChange={(checked) => {
          setLang(checked ? 'en' : 'fr');
        }}
        aria-label="Switch language"
      />
      <span className={!isFr ? 'font-bold' : 'text-muted-foreground'}>EN</span>
    </div>
  );
}
