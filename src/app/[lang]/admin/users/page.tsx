'use client';

import AdminLayout from '@/components/layouts/AdminLayout';
import UsersPage from '@/components/admin/users/UsersPage';

export default function AdminUsers() {
  return (
    <AdminLayout>
      <UsersPage />
    </AdminLayout>
  );
}