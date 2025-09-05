import { useParams, useRouter, usePathname } from 'next/navigation';
import { LangContext } from '../contexts/LangContext';
import { useMemo, useEffect, useState } from 'react';

export function LangProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlLang = useMemo(() => {
    if (typeof params?.lang === 'string') return params.lang;
    if (Array.isArray(params?.lang)) return params.lang[0];

    // Fallback to cookie if no URL lang
    if (typeof window !== 'undefined') {
      const cookieLang = document.cookie
        .split('; ')
        .find((row) => row.startsWith('NEXT_LOCALE='))
        ?.split('=')[1];
      if (cookieLang === 'fr' || cookieLang === 'en') return cookieLang;
    }

    return 'fr';
  }, [params]);

  // Local state for immediate UI updates
  const [currentLang, setCurrentLang] = useState(urlLang);

  // Sync local state with URL changes
  useEffect(() => {
    setCurrentLang(urlLang);
  }, [urlLang]);

  useEffect(() => {
    const segments = pathname.split('/');
    if (segments[1] !== 'fr' && segments[1] !== 'en') {
      router.replace(`/${currentLang}${pathname.startsWith('/') ? pathname : '/' + pathname}`);
    }
  }, [pathname, currentLang, router]);

  const setLang = (newLang: string) => {
    if (newLang === currentLang) return;

    // Update local state immediately for instant UI feedback
    setCurrentLang(newLang);

    // Update cookie to persist language choice
    if (typeof window !== 'undefined') {
      document.cookie = `NEXT_LOCALE=${newLang}; path=/`;
    }

    // Update URL with Next.js router without refresh
    const segments = pathname.split('/');
    if (segments[1] === 'fr' || segments[1] === 'en') {
      segments[1] = newLang;
    } else {
      segments.splice(1, 0, newLang);
    }

    const newPath = segments.join('/') || '/';

    // Use window.history.pushState to update URL without refresh
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', newPath);
    }
  };

  return (
    <LangContext.Provider value={{ lang: currentLang, setLang }}>{children}</LangContext.Provider>
  );
}
