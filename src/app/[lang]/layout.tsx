'use client';

import { ReactNode, useEffect } from 'react';
import { Providers } from '@/providers';

export default function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params?: { locale?: string };
}) {
  useEffect(() => {
    const locale = params?.locale || window.location.pathname.split('/')[1];
    if (locale) {
      document.cookie = `NEXT_LOCALE=${locale}; path=/`;
    }
  }, [params?.locale]);
  return <Providers>{children}</Providers>;
}
