import React from 'react';
import '../styles/globals.css';

export const metadata = {
  title: 'ISEPBANDS',
  description: 'A website for ISEP bands',
};

import { moranga } from '@/lib/fonts';
import { outfit } from '@/lib/fonts';
import { ubuntu } from '@/lib/fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={moranga.variable + ' ' + outfit.variable + ' ' + ubuntu.variable}>
      <body>{children}</body>
    </html>
  );
}
