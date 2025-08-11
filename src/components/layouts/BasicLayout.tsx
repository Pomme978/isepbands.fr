'use client';
import { ReactNode } from 'react';
import Navbar from '../navbar/Navbar';
import { Providers } from '../../providers';
import '../../styles/globals.css';

export default function BasicLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <Navbar />
      {children}
    </Providers>
  );
}
