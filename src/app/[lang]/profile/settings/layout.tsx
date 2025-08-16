import { ReactNode } from 'react';
import BasicLayout from '@/components/layouts/BasicLayout';

export default function ProfileSettingsLayout({ children }: { children: ReactNode }) {
  return (
    <BasicLayout showNavbar={false} navbarMode="static" showFooter={false}>
      {children}
    </BasicLayout>
  );
}
