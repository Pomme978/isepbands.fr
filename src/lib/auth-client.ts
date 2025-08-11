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
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.error || 'Invalid credentials');
  }
  return res.json();
}

export async function signOut() {
  await fetch('/api/auth/logout', { method: 'POST' });
}

export type SessionUser = {
  id: string;
  email: string;
  username?: string;
  name?: string;
  surname?: string;
  band?: string | null;
} | null;

export function useSession(onAutoLogout?: () => void) {
  const [user, setUser] = useState<SessionUser>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchSession() {
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
    }
    fetchSession();
  }, [onAutoLogout, pathname]);
  return { user };
}

export function useAuth(onAutoLogout?: () => void) {
  const [user, setUser] = useState<SessionUser>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
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
    } catch {
      setUser(null);
      setError('Erreur de session');
    } finally {
      setLoading(false);
    }
  }, [onAutoLogout]);

  useEffect(() => {
    refresh();
  }, [refresh]);

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
  };
}
