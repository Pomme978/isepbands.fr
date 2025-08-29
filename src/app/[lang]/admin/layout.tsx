import { ReactNode } from 'react';
import FullLayout from '@/components/layouts/FullLayout';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <FullLayout showNavbar={false} showFooter={false}>
      {children}
    </FullLayout>
  );
}
