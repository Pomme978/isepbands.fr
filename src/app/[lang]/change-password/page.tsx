'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { useI18n } from '@/locales/client';
import BackButton from '@/components/ui/back-button';
import Loading from '@/components/ui/Loading';
import LoginFormCard from '@/components/login/LoginFormCard';
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm';
import BasicLayout from '@/components/layouts/BasicLayout';

export default function ChangePasswordPage() {
  const t = useI18n();
  const params = useParams();
  const lang =
    typeof params.lang === 'string'
      ? params.lang
      : Array.isArray(params.lang)
        ? params.lang[0]
        : 'fr';
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [changeToken, setChangeToken] = useState<string | null>(null);
  const [hasTemporaryPassword, setHasTemporaryPassword] = useState(true);

  useEffect(() => {
    // Get user data from URL params (passed from login)
    const email = searchParams.get('email');
    const token = searchParams.get('token');
    const tempPassword = searchParams.get('temp');

    // Secure token takes priority over email
    if (token) {
      setChangeToken(token);
      setHasTemporaryPassword(true); // Always true for forced changes
    } else if (email) {
      setUserEmail(email);
      setHasTemporaryPassword(tempPassword === 'true');
    } else {
      // Redirect back to login if neither token nor email provided
      router.push(`/${lang}/login`);
      return;
    }
  }, [searchParams, router, lang]);

  const handlePasswordChangeSuccess = async () => {
    // User successfully changed password - keep them logged in
    // Force a page reload to refresh session and bypass requirePasswordChange middleware
    window.location.href = `/${lang}`;
  };

  const handleBackButton = async () => {
    // Logout user when going back - they can't access anything else anyway
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }

    // Redirect to login page
    router.push(`/${lang}/login`);
  };

  if (!userEmail && !changeToken) {
    return (
      <BasicLayout showNavbar={false} showFooter={false}>
        <div className="flex min-h-screen items-center justify-center">
          <Loading text="Chargement..." size="lg" />
        </div>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout showNavbar={false} showFooter={false}>
      <div className="flex min-h-screen items-center flex-col justify-center relative">
        <div className="absolute md:top-6 top-3 md:left-6 left-0">
          <BackButton variant="ghost" onClick={handleBackButton} />
        </div>
        <LoginFormCard>
          <div className="text-center h-20 mt-5 mb-0">
            <h1 className="text-3xl font-bold">{t('title')}</h1>
            <h2 className="text-1xl">Changement de mot de passe</h2>
            <h2 className="text-sm">Vous devez changer votre mot de passe pour continuer</h2>
          </div>
          <ChangePasswordForm
            userEmail={userEmail}
            changeToken={changeToken}
            hasTemporaryPassword={hasTemporaryPassword}
            onSuccess={handlePasswordChangeSuccess}
            lang={lang}
          />
        </LoginFormCard>
      </div>
    </BasicLayout>
  );
}
