import { useI18n } from '@/locales/client';

interface LoginFormLinksProps {
  lang: string;
}

export default function LoginFormLinks({ lang }: LoginFormLinksProps) {
  const t = useI18n();
  return (
    <div className="space-y-2 text-center text-sm">
      <div>
        <a href={`/${lang}/register`} className="text-primary hover:underline">
          {t('auth.login.noAccount')} {t('auth.login.register')}
        </a>
      </div>
      <div>
        <a href={`/${lang}/reset-password`} className="text-muted-foreground hover:underline">
          {t('auth.login.forgot')}
        </a>
      </div>
    </div>
  );
}
