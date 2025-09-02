'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ForcePasswordChange } from '@/components/auth/ForcePasswordChange';
import Loading from '@/components/ui/Loading';
import BasicLayout from '@/components/layouts/BasicLayout';

export default function ChangePasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [hasTemporaryPassword, setHasTemporaryPassword] = useState(true);

  useEffect(() => {
    // Get user data from URL params (passed from login)
    const email = searchParams.get('email');
    const tempPassword = searchParams.get('temp');
    
    if (!email) {
      // Redirect back to login if no email provided
      router.push('/login');
      return;
    }

    setUserEmail(email);
    setHasTemporaryPassword(tempPassword === 'true');
  }, [searchParams, router]);

  const handlePasswordChangeSuccess = () => {
    // Redirect to home page after successful password change
    router.push('/');
  };

  if (!userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Chargement..." size="lg" />
      </div>
    );
  }

  return (
    <BasicLayout showNavbar={false} showFooter={false}>
      <ForcePasswordChange
        userEmail={userEmail}
        hasTemporaryPassword={hasTemporaryPassword}
        onSuccess={handlePasswordChangeSuccess}
      />
    </BasicLayout>
  );
}