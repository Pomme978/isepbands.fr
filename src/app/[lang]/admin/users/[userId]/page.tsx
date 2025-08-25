'use client';

import { use } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import UserEditPage from '@/components/admin/users/UserEditPage';

interface AdminUserEditProps {
  params: Promise<{
    userId: string;
  }>;
}

export default function AdminUserEdit({ params }: AdminUserEditProps) {
  const { userId } = use(params);
  
  return (
    <AdminLayout>
      <UserEditPage userId={userId} />
    </AdminLayout>
  );
}