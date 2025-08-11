'use client';
import ToastProvider from '@/components/ui/toast-provider';
import { I18nProviderClient } from '@/locales/client';
import { LangProvider } from './LangProvider';
import { useLang } from '@/hooks/useLang';

function I18nWithLang({ children }: { children: React.ReactNode }) {
  const { lang } = useLang();
  return <I18nProviderClient locale={lang}>{children}</I18nProviderClient>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <LangProvider>
        <I18nWithLang>{children}</I18nWithLang>
      </LangProvider>
    </ToastProvider>
  );
}
