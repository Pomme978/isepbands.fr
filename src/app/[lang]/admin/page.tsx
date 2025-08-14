'use client';

import AdminLayout from '@/components/layouts/AdminLayout';
import DashboardStats from '@/components/admin/dashboard/DashboardStats';
import RecentActivity from '@/components/admin/dashboard/RecentActivity';
import PendingApprovals from '@/components/admin/dashboard/PendingApprovals';
import UpcomingEventCard from '@/components/admin/dashboard/UpcomingEventCard';

export default function Admin() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="border-b border-border pb-4">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Bienvenue NOM PRENOM, nous somme le DD/MM/YYYY.
          </p>
        </div>

        {/* Stats Cards */}
        <DashboardStats />

        <UpcomingEventCard />

        {/* Pending Approvals */}
        <PendingApprovals />

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </AdminLayout>
  );
}
