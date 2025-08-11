'use client';

import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSession, useAuth } from '@/lib/auth-client';
import { useI18n } from '@/locales/client';
import LangLink from '@/components/common/LangLink';

export default function Home() {
  const t = useI18n();
  const router = useRouter();
  const params = useParams();
  const lang =
    typeof params.lang === 'string'
      ? params.lang
      : Array.isArray(params.lang)
        ? params.lang[0]
        : 'fr';
  const { user } = useSession();
  const { signOut, loading } = useAuth();

  const handleLogout = async () => {
    await signOut(() => router.push(`/${lang}/login`));
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('page.home.title')}</h1>
        <p className="text-gray-700 text-center mb-4">{t('navigation.home')}</p>
        <div className="flex gap-4">
          {user ? (
            <Button type="button" onClick={handleLogout} disabled={loading}>
              {t('auth.logOut')}
            </Button>
          ) : (
            <Button asChild>
              <LangLink href={`/${lang}/login`}>{t('auth.logIn')}</LangLink>
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
