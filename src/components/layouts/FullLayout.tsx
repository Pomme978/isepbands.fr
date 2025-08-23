'use client';

import { ReactNode } from 'react';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import { Providers } from '../../providers';
import '../../styles/globals.css';

interface FullLayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  navbarMode?: 'scroll' | 'static' | 'fixed';
  className?: string;
}

export default function FullLayout({
  children,
  showNavbar = true,
  showFooter = true,
  navbarMode = 'scroll',
  className = 'bg-gray-100 ml-5 mr-5',
}: FullLayoutProps) {
  // Add top padding when using fixed navbar to prevent content overlap
  const getContentClasses = () => {
    if (navbarMode === 'fixed' && showNavbar) {
      return 'pt-16'; // Adjust this value based on your navbar height
    }
    return '';
  };

  return (
    <Providers>
      <div className={className}>
        {showNavbar && <Navbar mode={navbarMode} />}
        <div className={getContentClasses()}>{children}</div>
        {showFooter && <Footer />}
      </div>
    </Providers>
  );
}
