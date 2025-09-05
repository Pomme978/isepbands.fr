import { useI18n } from '@/locales/client';
import LangLink from '@/components/common/LangLink';

interface LoginFormLinksProps {
  lang: string;
}

export default function LoginFormLinks({ lang }: LoginFormLinksProps) {
  const t = useI18n();
  return (
    <div className="text-center text-sm space-y-3">
      <div>
        <LangLink href="/register" className="text-primary hover:underline">
          {t('auth.login.noAccount')} {t('auth.login.register')}
        </LangLink>
      </div>
    </div>
  );
}
