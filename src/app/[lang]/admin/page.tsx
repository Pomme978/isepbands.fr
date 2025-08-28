'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import DashboardStats from '@/components/admin/dashboard/DashboardStats';
import RecentActivity from '@/components/admin/dashboard/RecentActivity';
import PendingApprovals from '@/components/admin/dashboard/PendingApprovals';
import { formatFullName } from '@/utils/nameUtils';

interface UserSession {
  user: {
    id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
  };
}

export default function Admin() {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Fetch current user session
    const fetchUserSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const session = await response.json();
          setUserSession(session);
        }
      } catch (error) {
        console.error('Failed to fetch user session:', error);
      }
    };

    // Set current date in French format
    setCurrentDate(
      new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    );

    fetchUserSession();
  }, []);

  const getWelcomeMessage = () => {
    if (!userSession?.user) return 'Bienvenue';

    const fullName = formatFullName(
      userSession.user.firstName || '',
      userSession.user.lastName || '',
      userSession.user.name || '',
    );

    return `Bienvenue ${fullName}`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="border-b border-border pb-4">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            {getWelcomeMessage()}, nous sommes le {currentDate}.
          </p>
        </div>

        {/* Stats Cards */}
        <DashboardStats />

        {/* Pending Approvals */}
        <PendingApprovals
          onApproveUser={async (userId) => {
            try {
              const response = await fetch('/api/admin/users/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
              });

              if (response.ok) {
                // Refresh the page to update the pending list
                window.location.reload();
              } else {
                const error = await response.json();
                console.error('Approval failed:', error.error);
                alert("Erreur lors de l'approbation: " + error.error);
              }
            } catch (error) {
              console.error('Approval error:', error);
              alert("Erreur lors de l'approbation");
            }
          }}
          onRejectUser={async (userId, reason) => {
            try {
              const response = await fetch('/api/admin/users/reject', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, reason }),
              });

              if (response.ok) {
                // Refresh the page to update the pending list
                window.location.reload();
              } else {
                const error = await response.json();
                console.error('Rejection failed:', error.error);
                alert('Erreur lors du refus: ' + error.error);
              }
            } catch (error) {
              console.error('Rejection error:', error);
              alert('Erreur lors du refus');
            }
          }}
        />

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </AdminLayout>
  );
}
