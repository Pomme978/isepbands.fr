// page.tsx
import React from 'react';
import { VisionNote } from '@/components/team/VisionNote';
import { Garland } from '@/components/team/Garland';
import DecoratedText from '@/components/team/DecoratedText';
import GroupPhoto from '@/components/team/GroupPhoto';
import wallpaperImage from '../../../../public/placeholder/wallpaper.jpeg';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  motto?: string;
  profilePhoto?: string;
  role: string;
  roleDisplayName?: string;
}

interface UserRole {
  role: string;
  displayName: string;
  section: 'executive' | 'other' | 'pole';
  variant?: 'president' | 'executive' | 'pole';
}

const Page = async () => {
  // Fetch team members from API
  let teamUsers: User[] = [];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/team`,
      {
        cache: 'no-store', // Always fetch fresh data
      },
    );

    if (response.ok) {
      teamUsers = await response.json();
    } else {
      console.error('Failed to fetch team members');
    }
  } catch (error) {
    console.error('Error fetching team members:', error);
  }

  // Define role mappings - utilise le roleDisplayName de l'API au lieu du displayName hardcodé
  const roleMapping: UserRole[] = [
    // Executive section
    { role: 'vice_president', displayName: '', section: 'executive', variant: 'executive' },
    { role: 'president', displayName: '', section: 'executive', variant: 'president' },

    // Other members section
    { role: 'secretary', displayName: '', section: 'other' },
    { role: 'treasurer', displayName: '', section: 'other' },

    // Pole section
    { role: 'head_of_communication', displayName: '', section: 'pole', variant: 'pole' },
    { role: 'head_of_creation', displayName: '', section: 'pole', variant: 'pole' },
  ];

  // Group roles by section with custom ordering for executives
  const executiveRoles = roleMapping.filter((r) => r.section === 'executive');

  // Custom sort for executive section to put president in middle
  const sortedExecutiveUsers = () => {
    const vpUsers = teamUsers.filter((u) => u.role === 'vice_president');
    const presidentUsers = teamUsers.filter((u) => u.role === 'president');

    // Arrange as: VP1, President, VP2 (if 2 VPs exist)
    if (vpUsers.length === 2 && presidentUsers.length === 1) {
      return [vpUsers[0], presidentUsers[0], vpUsers[1]];
    } else if (vpUsers.length === 1 && presidentUsers.length === 1) {
      return [vpUsers[0], presidentUsers[0]];
    } else {
      // Fallback to original order
      return [...vpUsers, ...presidentUsers];
    }
  };

  const executiveUsersOrdered = sortedExecutiveUsers();

  const otherRoles = roleMapping.filter((r) => r.section === 'other');
  const poleRoles = roleMapping.filter((r) => r.section === 'pole');

  return (
    <main className="min-h-screen">
      {/* Header */}
      <DecoratedText lightType="yellow" garlandWidth={1000} textClassName="">
        <div className="text-center py-12 relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-wider text-glow text-glow-[#F4E0FF]">
            LE BUREAU
          </h1>
          <h2 className="text-5xl md:text-3xl text-white font-bold text-glow text-glow-[#F4E0FF]">
            2025 - 2026
          </h2>
        </div>
      </DecoratedText>

      {/* Group Photo - Using imported image */}
      <GroupPhoto
        src={wallpaperImage}
        alt="Bureau ISEP 2025-2026"
        scotchCount={2}
        className="mt-10"
      />

      {/* Membres exécutifs */}
      <Garland
        users={executiveUsersOrdered}
        roleInfos={executiveRoles}
        lightType="yellow"
        className="mb-0"
        preserveUserOrder={true}
      />

      {/* Autres membres */}
      <Garland users={teamUsers} roleInfos={otherRoles} lightType="yellow" className="mb-100" />

      {/* Section "Sans oublier nos responsables pôles" */}
      <div className="text-center mb-8 w-full text-4xl md:text-3xl text-white font-bold text-glow text-glow-[#F4E0FF]">
        Sans oublier nos responsables pôles
      </div>

      {/* Pôles */}
      <Garland users={teamUsers} roleInfos={poleRoles} lightType="blue" className="mb-100" />

      {/* Vision Note */}
      <div className="flex justify-center mb-20 px-4">
        <VisionNote />
      </div>

      <h5 className="text-sm text-white/50 relative max-w-7xl flex font-handrawn justify-center md:justify-end mx-auto py-4">
        Design de page réalisé par Sarah LEVY
      </h5>
    </main>
  );
};

export default Page;
