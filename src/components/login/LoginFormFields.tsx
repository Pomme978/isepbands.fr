import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/locales/client';

interface LoginFormFieldsProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  rememberMe: boolean;
  setRememberMe: (v: boolean) => void;
  lang: string;
}

export default function LoginFormFields({
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  lang,
}: LoginFormFieldsProps) {
  const t = useI18n();
  return (
    <>
      <div>
        <Label htmlFor="email">{t('auth.login.email')}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="email@isep.fr"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mt-8">
        <div className="flex flew-row justify-between">
          <Label htmlFor="password">{t('auth.login.password')}</Label>
          <a href={`/${lang}/reset-password`} className="text-sm hover:underline">
            {t('auth.login.forgot')}
          </a>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2 mt-4">
        <input
          id="rememberMe"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="accent-primary"
        />
        <Label className="mt-4" htmlFor="rememberMe">
          {t('auth.login.remember')}
        </Label>
      </div>
    </>
  );
}
