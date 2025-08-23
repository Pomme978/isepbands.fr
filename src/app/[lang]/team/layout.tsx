import { ReactNode } from 'react';
import FullLayout from '@/components/layouts/FullLayout';

export default function TeamLayout({ children }: { children: ReactNode }) {
  return (
    <FullLayout
      showNavbar={true}
      navbarMode="static"
      showFooter={true}
      className="z-0 bg-[#2E135F] relative before:absolute before:inset-0 before:bg-[radial-gradient(circle,transparent,rgba(0,0,0,0.2))] before:pointer-events-none"
    >
      {children}
    </FullLayout>
  );
}
