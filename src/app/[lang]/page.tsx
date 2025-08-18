'use client';

import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSession, useAuth } from '@/lib/auth-client';
import { useI18n } from '@/locales/client';
import LangLink from '@/components/common/LangLink';
import BasicLayout from '@/components/layouts/BasicLayout';
import HeroBanner from '@/components/home/HomeHero';

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
    <BasicLayout navbarMode="scroll">
      <main className="flex flex-col items-center justify-center min-h-screen">
        <HeroBanner />
        <div className="bg-gray-100 w-screen z-50">
          <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center items-center flex-col">
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
        </div>
      </main>
    </BasicLayout>
  );
}
