'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export async function register(formData: FormData) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.error || 'Registration failed');
  }
  return res.json();
}

export async function getMe(): Promise<SessionUser> {
  const res = await fetch('/api/auth/me');
  if (!res.ok) return null;
  const data = await res.json();
  return data && data.user ? data.user : null;
}

export async function signIn(email: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Use message field first, then error field, then default
    throw new Error(data?.message || data?.error || 'Invalid credentials');
  }

  // Check if password change is required
  if (data?.requirePasswordChange) {
    const error = new Error(data.message || 'Password change required') as Error & {
      requirePasswordChange: boolean;
      userData: unknown;
    };
    error.requirePasswordChange = true;
    error.userData = data.user;
    throw error;
  }

  return data;
}

export async function signOut() {
  await fetch('/api/auth/logout', { method: 'POST' });
}

export type SessionUser = {
  id: string;
  email: string;
  name?: string;
  surname?: string;
  firstName?: string;
  lastName?: string;
  band?: string | null;
  status?: 'CURRENT' | 'FORMER' | 'PENDING';
  isFullAccess?: boolean;
} | null;

export function useSession(onAutoLogout?: () => void) {
  const [user, setUser] = useState<SessionUser>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchSession = useCallback(async () => {
    if (!mounted) return;

    try {
      const res = await fetch('/api/auth/session');
      if (res.status === 401) {
        setUser(null);
        if (onAutoLogout) onAutoLogout();
        return;
      }

      if (res.status === 403) {
        const data = await res.json().catch(() => ({}));
        if (data.requirePasswordChange) {
          // User needs to change password - redirect to change password page
          if (typeof window !== 'undefined' && !pathname.includes('/change-password')) {
            const currentLang = pathname.split('/')[1] || 'fr';
            const token = data.passwordChangeToken;
            const email = data.email;

            if (token) {
              window.location.href = `/${currentLang}/change-password?token=${encodeURIComponent(token)}`;
            } else if (email) {
              window.location.href = `/${currentLang}/change-password?email=${encodeURIComponent(email)}`;
            } else {
              // Force logout if we can't redirect properly
              setUser(null);
              if (onAutoLogout) onAutoLogout();
            }
          }
          return;
        }
        setUser(null);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setUser(data && data.user ? data.user : null);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Session fetch error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [mounted, onAutoLogout, pathname]);

  useEffect(() => {
    if (mounted) {
      fetchSession();
    }
  }, [fetchSession, pathname, mounted]);

  return { user, loading, isLoading: loading };
}

export function useAuth(onAutoLogout?: () => void) {
  const [user, setUser] = useState<SessionUser>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const refresh = useCallback(async () => {
    if (!mounted) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/session');
      if (res.status === 401) {
        setUser(null);
        if (onAutoLogout) onAutoLogout();
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setUser(data && data.user ? data.user : null);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Auth refresh error:', err);
      setUser(null);
      setError('Erreur de session');
    } finally {
      setLoading(false);
    }
  }, [onAutoLogout, mounted]);

  useEffect(() => {
    if (mounted) {
      refresh();
    }
  }, [refresh, mounted]);

  const wrappedSignIn = useCallback(
    async (email: string, password: string, cb?: () => void) => {
      setLoading(true);
      setError(null);
      try {
        await signIn(email, password);
        await refresh();
        if (cb) cb();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de connexion');
        // Re-throw the error so the calling code can handle it
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refresh],
  );

  const wrappedSignOut = useCallback(
    async (cb?: () => void) => {
      setLoading(true);
      setError(null);
      try {
        await signOut();
        await refresh();
        if (cb) cb();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de déconnexion');
      } finally {
        setLoading(false);
      }
    },
    [refresh],
  );

  const wrappedRegister = useCallback(
    async (formData: FormData, cb?: () => void) => {
      setLoading(true);
      setError(null);
      try {
        await register(formData);
        await refresh();
        if (cb) cb();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur d'inscription");
      } finally {
        setLoading(false);
      }
    },
    [refresh],
  );

  return {
    user,
    loading,
    error,
    signIn: wrappedSignIn,
    signOut: wrappedSignOut,
    register: wrappedRegister,
    refresh,
    getMe,
    isLoading: loading,
  };
}
