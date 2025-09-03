'use client';

import { useRouter, useParams } from 'next/navigation';
import { useSession, useAuth } from '@/lib/auth-client';
import FullLayout from '@/components/layouts/FullLayout';
import HeroBanner from '@/components/home/HomeHero';
import { Home } from '@/components/home/Home';
import HomeLoggedIn from '@/components/home/HomeLoggedIn';
import { PendingValidationBanner } from '@/components/home/PendingValidationBanner';
import EmailVerificationAlert from '@/components/common/EmailVerificationAlert';

export default function HomePage() {
  const router = useRouter();
  const params = useParams();
  const lang =
    typeof params.lang === 'string'
      ? params.lang
      : Array.isArray(params.lang)
        ? params.lang[0]
        : 'fr';

  const { user, loading } = useSession();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut(() => router.push(`/${lang}/login`));
  };

  // Use fixed navbar when user is connected, scroll when not connected
  // Show scroll mode only when we're sure user is not connected (not during loading)
  const navbarMode = user ? 'fixed' : loading ? 'static' : 'scroll';

  return (
    <FullLayout navbarMode={navbarMode}>
      {/* Hero Banner - Full width */}
      <HeroBanner />

      {/* Email verification alert - Full width, right after hero */}
      {user && !user.emailVerified && (
        <div className="w-full">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <EmailVerificationAlert userEmail={user.email} />
          </div>
        </div>
      )}

      {/* Page content with max-w-7xl constraint */}
      <div className="max-w-7xl mx-auto">
        <main className="flex flex-col items-center justify-center">
          {user ? (
            user.status === 'PENDING' ? (
              <div className="w-full px-4 py-8">
                <PendingValidationBanner />
                <Home lang={lang} />
              </div>
            ) : (
              <div className="w-full">
                <HomeLoggedIn user={user} lang={lang} onLogout={handleLogout} loading={loading} />
              </div>
            )
          ) : (
            <Home lang={lang} />
          )}
        </main>
      </div>
    </FullLayout>
  );
}
