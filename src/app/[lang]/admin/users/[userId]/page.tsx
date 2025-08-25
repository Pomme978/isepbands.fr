'use client';

import AdminLayout from '@/components/layouts/AdminLayout';
import UserEditPage from '@/components/admin/users/UserEditPage';

interface AdminUserEditProps {
  params: {
    userId: string;
  };
}

export default function AdminUserEdit({ params }: AdminUserEditProps) {
  return (
    <AdminLayout>
      <UserEditPage userId={params.userId} />
    </AdminLayout>
  );
}