import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/locales/client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <div>
        <Label htmlFor="email">{t('auth.login.email')}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="email@eleve.isep.fr"
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
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <input
          id="rememberMe"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="accent-primary"
        />
        <Label className="mt-3" htmlFor="rememberMe">
          {t('auth.login.remember')}
        </Label>
      </div>
    </>
  );
}
