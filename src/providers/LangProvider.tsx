import { useParams, useRouter, usePathname } from 'next/navigation';
import { LangContext } from '../contexts/LangContext';
import { useMemo, useEffect } from 'react';

export function LangProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const lang = useMemo(() => {
    if (typeof params?.lang === 'string') return params.lang;
    if (Array.isArray(params?.lang)) return params.lang[0];
    return 'fr';
  }, [params]);

  useEffect(() => {
    const segments = pathname.split('/');
    if (segments[1] !== 'fr' && segments[1] !== 'en') {
      router.replace(`/${lang}${pathname.startsWith('/') ? pathname : '/' + pathname}`);
    }
  }, [pathname, lang, router]);

  const setLang = (newLang: string) => {
    if (newLang === lang) return;
    const segments = pathname.split('/');
    if (segments[1] === 'fr' || segments[1] === 'en') {
      segments[1] = newLang;
    } else {
      segments.splice(1, 0, newLang);
    }
    router.push(segments.join('/') || '/');
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}
