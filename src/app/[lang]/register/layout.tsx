import { ReactNode } from 'react';
import BasicLayout from '@/components/layouts/BasicLayout';

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return (
    <BasicLayout showNavbar={false} showFooter={false}>
      {children}
    </BasicLayout>
  );
}
