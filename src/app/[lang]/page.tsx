'use client';

import { useRouter, useParams } from 'next/navigation';
import { useSession, useAuth } from '@/lib/auth-client';
import BasicLayout from '@/components/layouts/BasicLayout';
import HeroBanner from '@/components/home/HomeHero';
import { Home } from '@/components/home/Home';
import HomeLoggedIn from '@/components/home/HomeLoggedIn';
import { PendingValidationBanner } from '@/components/home/PendingValidationBanner';

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

  // Use fixed navbar when user is connected, scroll when not connected
  const navbarMode = user ? 'fixed' : 'scroll';

  return (
    <BasicLayout navbarMode={navbarMode} offsetContent={false}>
      <main className="flex flex-col items-center justify-center min-h-screen">
        <HeroBanner />

        {user ? (
          user.status === 'PENDING' ? (
            <div className="w-full max-w-7xl mx-auto px-4 py-8">
              <PendingValidationBanner />
              <Home lang={lang} />
            </div>
          ) : (
            <HomeLoggedIn user={user} lang={lang} onLogout={handleLogout} loading={loading} />
          )
        ) : (
          <Home lang={lang} />
        )}
      </main>
    </BasicLayout>
  );
}
