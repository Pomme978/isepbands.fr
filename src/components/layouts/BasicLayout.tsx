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
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {showNavbar && <Navbar />}
          {children}
          {showFooter && <Footer />}
        </div>
      </div>
    </Providers>
  );
}
