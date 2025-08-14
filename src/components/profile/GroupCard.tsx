// @components/profile/GroupCard.tsx
'use client';

import GroupRoles from './GroupRoles';
import StatusIndicator from './StatusIndicator';
import Image from 'next/image';

interface GroupRole {
  role: string;
  isPrimary: boolean;
}

interface Group {
  id: string;
  name: string;
  image: string;
  roles: GroupRole[];
  joinDate: string;
  isActive: boolean;
  inactiveSince?: string;
  memberCount: number;
  maxMembers: number;
  slug: string;
  genre?: string;
  concertCount: number; // Nouveau champ ajouté
  nextEvent?: {
    type: 'concert' | 'rehearsal' | 'jam';
    date: string;
    venue?: string;
  };
  isRecruiting?: boolean;
}

interface GroupCardProps {
  group: Group;
  onClick: () => void;
}

export default function GroupCard({ group, onClick }: GroupCardProps) {
  const cardClass = group.isActive
    ? 'bg-gradient-to-r from-white to-blue-50 border border-blue-200'
    : 'bg-white border border-gray-200 opacity-75';

  const imageClass = group.isActive ? '' : 'grayscale';
  const nameClass = group.isActive
    ? 'font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors'
    : 'font-bold text-gray-700 truncate group-hover:text-gray-900 transition-colors';

  return (
    <div
      className={`${cardClass} p-4 rounded-xl cursor-pointer hover:shadow-md transition-all group`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center overflow-hidden shadow-sm">
          <Image
            src={group.image}
            alt={group.name}
            width={128}
            height={128}
            className={`w-full h-full object-cover ${imageClass}`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className={nameClass}>{group.name}</h3>
            <StatusIndicator isActive={group.isActive} type="group" />
          </div>

          {/* Multiple roles */}
          <GroupRoles roles={group.roles} className="mb-2" />

          <div className="space-y-1 text-xs text-gray-600">
            <p>
              {group.isActive
                ? `Rejoint le ${group.joinDate}`
                : `Inactif depuis le ${group.inactiveSince}`}
            </p>
            <div className="flex items-center gap-2">
              <span>
                {group.memberCount}/{group.maxMembers} membres
              </span>
              {group.concertCount > 0 && (
                <span>
                  • {group.concertCount} concert{group.concertCount > 1 ? 's' : ''}
                </span>
              )}
              {group.genre && <span>• {group.genre}</span>}
            </div>
            {group.nextEvent && group.isActive && (
              <div className="flex items-center gap-1 mt-2">
                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  Prochain événement
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
