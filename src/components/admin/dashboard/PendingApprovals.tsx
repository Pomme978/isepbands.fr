'use client';

import { useState, useEffect } from 'react';
import PendingApprovalCard from './PendingApprovalCard';
import ApprovalModal from './ApprovalModal';
import { Users, Megaphone } from 'lucide-react';
import { formatPromotion } from '@/utils/schoolUtils';

type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
type Pronouns = 'he/him' | 'she/her' | 'they/them' | 'other';

interface RegistrationInstrument {
  instrumentId: number;
  instrumentName: string;
  instrumentNameFr: string;
  instrumentNameEn: string;
  skillLevel: SkillLevel;
  yearsPlaying?: number;
  isPrimary?: boolean;
}

interface PendingUser {
  id: string;
  type: 'user';
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentLevel: string; // I1, I2, A1, A2, A3, B1, B2, B3, P1, P2
  dateOfBirth: string;
  isOutOfSchool: boolean;
  pronouns?: Pronouns;
  motivation: string;
  experience: string;
  instruments: RegistrationInstrument[];
  preferredGenres?: string[];
  profilePhoto?: string;
  submittedAt: string;
}

interface BandMember {
  userId: string;
  name: string;
  roles: string[]; // Array of roles like ['Guitariste', 'Chœurs']
}

interface PendingBand {
  id: string;
  type: 'band';
  name: string;
  genre: string;
  description: string;
  motivation: string;
  members: BandMember[]; // Updated structure
  maxMembers: number;
  submittedAt: string;
  createdBy: string; // User ID who created the band
}

type PendingItem = PendingUser | PendingBand;

// Real data fetching functions
const fetchPendingUsers = async (): Promise<PendingUser[]> => {
  try {
    const response = await fetch('/api/admin/pending-users', {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch pending users');
    }
    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error('Error fetching pending users:', error);
    return [];
  }
};

// No more mock data - using real API data only

interface PendingApprovalsProps {
  onApproveUser?: (id: string) => void;
  onRejectUser?: (id: string, reason: string) => void;
  onApproveBand?: (id: string) => void;
  onRejectBand?: (id: string, reason: string) => void;
}

export default function PendingApprovals({
  onApproveUser,
  onRejectUser,
  onApproveBand = (id) => console.log('Approve band:', id),
  onRejectBand = (id, reason) => console.log('Reject band:', id, 'Reason:', reason),
}: PendingApprovalsProps) {
  const [selectedItem, setSelectedItem] = useState<PendingItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [pendingBands, setPendingBands] = useState<PendingBand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPendingItems = async () => {
      setIsLoading(true);
      try {
        const users = await fetchPendingUsers();
        setPendingUsers(users);
        // Groups will be implemented later
        setPendingBands([]);
      } catch (error) {
        console.error('Failed to load pending items:', error);
        // Show empty state if API fails
        setPendingUsers([]);
        setPendingBands([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPendingItems();
  }, []);

  const handleViewDetails = (item: PendingItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleApprove = async (id: string) => {
    if (selectedItem?.type === 'user') {
      try {
        const response = await fetch(`/api/admin/pending-users/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ action: 'approve' }),
        });

        if (response.ok) {
          // Remove the user from pending list
          setPendingUsers((prev) => prev.filter((user) => user.id !== id));
          onApproveUser?.(id);
          // Success - no alert needed, the user disappearing is enough feedback
        } else {
          const error = await response.text(); // Use text() instead of json() to avoid parsing errors
          console.error('Failed to approve user:', response.status, error);
          // No alert - just log the error
        }
      } catch (error) {
        console.error('Error approving user:', error);
        // No alert - just log the error
      }
    } else {
      onApproveBand?.(id);
    }
  };

  const handleReject = async (id: string, reason: string) => {
    if (selectedItem?.type === 'user') {
      try {
        const response = await fetch(`/api/admin/pending-users/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ action: 'reject', reason }),
        });

        if (response.ok) {
          // Remove the user from pending list
          setPendingUsers((prev) => prev.filter((user) => user.id !== id));
          onRejectUser?.(id, reason);
        } else {
          const error = await response.text();
          console.error('Failed to reject user:', response.status, error);
          // No alert - just log the error
        }
      } catch (error) {
        console.error('Error rejecting user:', error);
        // No alert - just log the error
      }
    } else {
      onRejectBand?.(id, reason);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  // Always render the approval cards, even if empty

  // Transform data for the cards
  const userItems = pendingUsers.map((user) => {
    const promotion = formatPromotion(user.currentLevel, user.dateOfBirth, user.isOutOfSchool);
    return {
      id: user.id,
      name: user.name,
      type: 'user' as const,
      email: `${promotion.split(',')[0]} - ${user.email}`, // Show promotion + email
      submittedAt: user.submittedAt,
      avatar: user.profilePhoto,
    };
  });

  const bandItems = pendingBands.map((band) => ({
    id: band.id,
    name: band.name,
    type: 'band' as const,
    genre: `${band.genre} • ${band.members.length}/${band.maxMembers} membres`,
    submittedAt: band.submittedAt,
  }));

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Users */}
        <PendingApprovalCard
          title="Nouveaux utilisateurs"
          items={userItems}
          onViewDetails={(item) => {
            const user = pendingUsers.find((u) => u.id === item.id);
            if (user) handleViewDetails(user);
          }}
          emptyMessage="Aucun utilisateur en attente"
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />

        {/* Pending Bands - Placeholder for future implementation */}
        <PendingApprovalCard
          title="Nouveaux groupes"
          items={[]} // Empty for now
          onViewDetails={() => {}}
          emptyMessage="Fonctionnalité sera implémentée prochainement"
          icon={Megaphone}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
        />
      </div>

      {/* Approval Modal */}
      <ApprovalModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </>
  );
}
