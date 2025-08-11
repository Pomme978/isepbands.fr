'use client';

import { ReactNode } from 'react';
import Navbar from '../navbar/Navbar';
import { Providers } from '../../providers';
import '../../styles/globals.css';

interface BasicLayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
}

export default function BasicLayout({ children, showNavbar = true }: BasicLayoutProps) {
  return (
    <Providers>
      {showNavbar && <Navbar />}
      {children}
    </Providers>
  );
}
