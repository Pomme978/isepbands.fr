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
  navbarMode?: 'scroll' | 'static' | 'fixed'; // Added 'fixed' mode
  offsetContent?: boolean; // Controls if content should be offset when navbar is fixed
}

export default function BasicLayout({
  children,
  showNavbar = true,
  showFooter = true,
  navbarMode = 'scroll',
  offsetContent = true,
}: BasicLayoutProps) {
  // Add top padding when using fixed navbar to prevent content overlap (only if offsetContent is true)
  const getContentClasses = () => {
    if (navbarMode === 'fixed' && showNavbar && offsetContent) {
      return 'pt-16'; // Adjust this value based on your navbar height
    }
    return '';
  };

  return (
    <Providers>
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto">
          {showNavbar && <Navbar mode={navbarMode} />}
          <div className={getContentClasses()}>{children}</div>
          {showFooter && <Footer />}
        </div>
      </div>
    </Providers>
  );
}
