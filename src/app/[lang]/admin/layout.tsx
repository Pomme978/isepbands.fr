import { ReactNode } from 'react';
import FullLayout from '@/components/layouts/FullLayout';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <FullLayout
      showNavbar={false}
      showFooter={false}
      className="h-screen overflow-hidden bg-gray-100"
    >
      {children}
    </FullLayout>
  );
}
