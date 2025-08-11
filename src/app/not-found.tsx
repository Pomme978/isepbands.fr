'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import LangLink from '@/components/common/LangLink';

export default function NotFound() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const segments = pathname.split('/');
    if (segments[1] !== 'fr' && segments[1] !== 'en') {
      let lang = 'fr';
      if (typeof window !== 'undefined') {
        const navLang = navigator.language.split('-')[0];
        lang = ['fr', 'en'].includes(navLang) ? navLang : 'fr';
      }
      router.replace(`/${lang}${pathname.startsWith('/') ? pathname : '/' + pathname}`);
    }
  }, [pathname, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">Page non trouvée</p>
      <LangLink href="/fr" className="text-blue-600 underline">
        Retour à l&apos;accueil
      </LangLink>
    </div>
  );
}
