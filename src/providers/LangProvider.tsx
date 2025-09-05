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
    return 'fr';
  }, [params]);

  // Initialize with stored language or URL language
  const [currentLang, setCurrentLang] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('preferred-language');
      return storedLang && ['fr', 'en'].includes(storedLang) ? storedLang : urlLang;
    }
    return urlLang;
  });

  // Sync local state with URL changes, but prioritize stored preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('preferred-language');
      if (storedLang && ['fr', 'en'].includes(storedLang) && storedLang !== urlLang) {
        // If there's a stored preference different from URL, redirect to stored preference
        const segments = pathname.split('/');
        if (segments[1] === 'fr' || segments[1] === 'en') {
          segments[1] = storedLang;
        } else {
          segments.splice(1, 0, storedLang);
        }
        const newPath = segments.join('/') || '/';
        router.replace(newPath);
        return;
      }
    }
    setCurrentLang(urlLang);
  }, [urlLang, pathname, router]);

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

    // Store language preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', newLang);
    }

    // Update URL without page reload
    const segments = pathname.split('/');
    if (segments[1] === 'fr' || segments[1] === 'en') {
      segments[1] = newLang;
    } else {
      segments.splice(1, 0, newLang);
    }

    const newPath = segments.join('/') || '/';

    // Use Next.js router for proper navigation
    router.replace(newPath);
  };

  return (
    <LangContext.Provider value={{ lang: currentLang, setLang }}>{children}</LangContext.Provider>
  );
}
