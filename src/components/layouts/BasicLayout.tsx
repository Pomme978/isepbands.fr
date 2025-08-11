'use client';

import { ReactNode } from 'react';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import { Providers } from '../../providers';
import '../../styles/globals.css';

interface BasicLayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
}

export default function BasicLayout({
  children,
  showNavbar = true,
  showFooter = true,
}: BasicLayoutProps) {
  return (
    <Providers>
      {showNavbar && <Navbar />}
      {children}
      {showFooter && <Footer />}
    </Providers>
  );
}
