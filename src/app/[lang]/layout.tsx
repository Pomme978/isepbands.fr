'use client';

import { ReactNode } from 'react';
import '../../styles/globals.css';
import { Providers } from '@/providers';

export default function RootLayout({ children }: { children: ReactNode }) {
  return <Providers>{children}</Providers>;
}
