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
  navbarStyle?: 'default' | 'transparent';
  className?: string;
}

export default function FullLayout({
  children,
  showNavbar = true,
  showFooter = true,
  navbarMode = 'scroll',
  navbarStyle = 'default',
  className = 'bg-gray-100',
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
        <div className="mx-auto">
          <div className="max-w-7xl mx-auto">
            {showNavbar && <Navbar mode={navbarMode} style={navbarStyle} />}
          </div>
          <div className={getContentClasses()}>{children}</div>
          <div className="max-w-7xl mx-auto pb-3">{showFooter && <Footer />}</div>
        </div>
      </div>
    </Providers>
  );
}
