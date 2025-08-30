import { ReactNode } from 'react';
import FullLayout from '@/components/layouts/FullLayout';

export default function BandsLayout({ children }: { children: ReactNode }) {
  return (
    <FullLayout showNavbar={true} navbarMode={'static'} showFooter={true}>
      {children}
    </FullLayout>
  );
}