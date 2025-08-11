import { ReactNode } from 'react';
import BasicLayout from '@/components/layouts/BasicLayout';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <BasicLayout showNavbar={false} showFooter={false}>
      {children}
    </BasicLayout>
  );
}
