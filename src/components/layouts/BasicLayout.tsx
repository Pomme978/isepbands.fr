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
  navbarMode?: 'scroll' | 'static'; // Nouvelle propriété pour contrôler le mode de la navbar
}

export default function BasicLayout({
  children,
  showNavbar = true,
  showFooter = true,
  navbarMode = 'scroll', // Par défaut, comportement au scroll
}: BasicLayoutProps) {
  return (
    <Providers>
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto">
          {showNavbar && <Navbar mode={navbarMode} />}
          {children}
          {showFooter && <Footer />}
        </div>
      </div>
    </Providers>
  );
}
