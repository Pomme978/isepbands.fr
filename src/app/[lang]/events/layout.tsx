import { ReactNode } from 'react';
import FullLayout from '@/components/layouts/FullLayout';

export default function EventsLayout({ children }: { children: ReactNode }) {
  return (
    <FullLayout
      showNavbar={true}
      navbarMode="static"
      navbarStyle="transparent"
      showFooter={true}
      className="bg-[#0C0E12]"
    >
      {children}
    </FullLayout>
  );
}
