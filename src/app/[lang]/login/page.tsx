'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { loginSchema } from '@/validation/auth';
import { useI18n } from '@/locales/client';
import { useAuth, useSession } from '@/lib/auth-client';
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
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Use useSession for faster auth check, useAuth only for signIn function
  const { user, loading } = useSession();
  const { signIn } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      router.push('/' + lang);
    }
  }, [user, loading, router, lang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = loginSchema.safeParse({ username: email, password });
    if (!parsed.success) return;

    setIsLoggingIn(true);
    setLoginError(null);

    try {
      await signIn(email, password, () => router.push('/' + lang));
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Show loading screen while checking authentication status
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't show login form if user is authenticated (during redirect)
  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <PendingValidationOnLogin />
      <div className="flex min-h-screen items-center flex-col justify-center relative">
        <div className="absolute top-6 left-6">
          <BackButton variant="ghost" />
        </div>
        <LoginFormCard>
          <div className="text-center h-20 mt-5 mb-0">
            <h1 className="text-3xl font-bold">{t('title')}</h1>
            <h2 className="text-1xl">{t('auth.login.title')}</h2>
            <h2 className="text-sm">{t('auth.login.subtitle')}</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 mt-3">
            <LoginFormFields
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
              lang={lang}
            />
            <LoginFormActions loading={isLoggingIn} error={loginError} />
          </form>
          <LoginFormLinks lang={lang} />
        </LoginFormCard>
        <p className="text-xs text-gray-500 mt-4 w-80 text-center">
          By clicking continue, you agree to our{' '}
          <a href={`/${lang}/terms`} className="hover:text-gray-700 underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href={`/${lang}/privacy`} className="hover:text-gray-700 underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </>
  );
}
