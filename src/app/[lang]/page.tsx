'use client';

import { useRouter, useParams } from 'next/navigation';
import { useSession, useAuth } from '@/lib/auth-client';
import BasicLayout from '@/components/layouts/BasicLayout';
import HeroBanner from '@/components/home/HomeHero';
import { Home } from '@/components/home/Home';
import HomeLoggedIn from '@/components/home/HomeLoggedIn';

export default function HomePage() {
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

        {user ? (
          <HomeLoggedIn user={user} lang={lang} onLogout={handleLogout} loading={loading} />
        ) : (
          <Home lang={lang} />
        )}
      </main>
    </BasicLayout>
  );
}
