import { ReactNode } from 'react';
import BasicLayout from '@/components/layouts/BasicLayout';

export default function ClubLayout({ children }: { children: ReactNode }) {
  return (
    <BasicLayout showNavbar={true} navbarMode={'static'} showFooter={true}>
      {children}
    </BasicLayout>
  );
}
