'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { loginSchema } from '@/validation/auth';
import { useI18n } from '@/locales/client';
import { useAuth } from '@/lib/auth-client';
import BackButton from '@/components/ui/back-button';
import LoginFormCard from '@/components/login/LoginFormCard';
import LoginFormFields from '@/components/login/LoginFormFields';
import LoginFormActions from '@/components/login/LoginFormActions';

import { PendingValidationOnLogin } from '@/components/login/PendingValidationOnLogin';
import LoginFormLinks from '@/components/login/LoginFormLinks';

export default function LoginPage() {
  const t = useI18n();
  const params = useParams();
  const lang =
    typeof params.lang === 'string'
      ? params.lang
      : Array.isArray(params.lang)
        ? params.lang[0]
        : 'fr';
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const { signIn, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = loginSchema.safeParse({ username: email, password });
    if (!parsed.success) return;
    await signIn(email, password, () => router.push('/' + lang));
  };

  return (
    <>
      <PendingValidationOnLogin />
      <div className="flex min-h-screen items-center justify-center md:bg-gray-50 bg-white relative">
        <div className="absolute top-6 left-6">
          <BackButton variant="ghost" />
        </div>
        <LoginFormCard>
          <div className="text-center h-50 md:h-20 md:mt-5 -mb-10 md:mb-0">
            <h1 className="md:text-2xl text-3xl font-bold">{t('title')}</h1>
            <h2 className="text-1xl">{t('auth.login.title')}</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <LoginFormFields
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
            />
            <LoginFormActions loading={loading} error={error} />
          </form>
          <LoginFormLinks lang={lang} />
        </LoginFormCard>
      </div>
    </>
  );
}
