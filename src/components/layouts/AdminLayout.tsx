'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminFooter from '@/components/admin/AdminFooter';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { Loader2 } from 'lucide-react';
import Loading from '@/components/ui/Loading';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  pronouns?: string;
  isFullAccess?: boolean;
  isRoot?: boolean;
  roles?: Array<{
    role: {
      id: number;
      name: string;
      nameFrMale: string;
      nameFrFemale: string;
      nameEnMale: string;
      nameEnFemale: string;
      weight: number;
      isCore: boolean;
    };
  }>;
}

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (!response.ok) {
          throw new Error('Not authenticated');
        }

        const sessionData = await response.json();
        if (!sessionData?.user) {
          throw new Error('No user session');
        }

        const user = sessionData.user;

        // Check if user has admin access
        if (!user.isFullAccess && !user.isRoot) {
          throw new Error('Admin access required');
        }

        setUser(user);
      } catch (err) {
        console.error('Admin auth check failed:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        // Redirect to login with language support
        router.push('/fr/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <>
        <div className="lg:hidden">
          <AdminNavbar />
        </div>
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <Loading text="Vérification des permissions..." size="lg" />
        </div>
      </>
    );
  }

  if (error || !user) {
    return (
      <>
        <div className="lg:hidden">
          <AdminNavbar />
        </div>
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="text-center max-w-md mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h2>
            <p className="text-base md:text-sm text-gray-600 mb-6">
              Vous devez être administrateur pour accéder à cette section.
            </p>
            <button
              onClick={() => router.push('/fr/login')}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Se connecter
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Mobile Navbar - Only visible on mobile */}
      <div className="lg:hidden">
        <AdminNavbar />
      </div>

      <div className="flex h-screen bg-gray-100">
        {/* Desktop Sidebar - Only visible on desktop */}
        <div className="hidden lg:block">
          <AdminSidebar user={user} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
          {/* Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
            <div className="w-full min-w-0">{children}</div>
          </main>

          {/* Footer */}
          <AdminFooter />
        </div>
      </div>
    </>
  );
}
