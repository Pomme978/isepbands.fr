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
}

interface UserRole {
  role: string;
  displayName: string;
  section: 'executive' | 'other' | 'pole';
  variant?: 'president' | 'executive' | 'pole';
}

const Page = () => {
  // PLACEHOLDER DATA - Remove when backend is ready
  const placeholderUsers: User[] = [
    {
      id: '1',
      firstName: 'Sarah',
      lastName: 'LEVY',
      email: 'sarah.levy@student.isep.fr',
      motto: 'Toujours prête à relever les défis !',
      profilePhoto: '/placeholder/maere.jpg',
      role: 'vice_president_1',
    },
    {
      id: '2',
      firstName: 'Maxime',
      lastName: 'LE ROY-MEUNIER',
      email: 'maxime@eleve.isep.fr',
      motto: 'Leader par passion, innovateur par nature',
      profilePhoto: '/placeholder-photos/maxime.jpg',
      role: 'president',
    },
    {
      id: '3',
      firstName: 'Armand',
      lastName: 'OCTEAU',
      email: 'armand@eleve.isep.fr',
      motto: 'La musique unit les cœurs',
      profilePhoto: '/placeholder-photos/armand.jpg',
      role: 'vice_president_2',
    },
    {
      id: '4',
      firstName: 'Maéva',
      lastName: 'RONCEY',
      email: 'maeva@eleve.isep.fr',
      motto: 'Organisation et créativité',
      profilePhoto: '/placeholder-photos/maeva.jpg',
      role: 'secretary_general',
    },
    {
      id: '5',
      firstName: 'Shane',
      lastName: 'PRADGER',
      email: 'shane@eleve.isep.fr',
      motto: 'Les chiffres et la musique en harmonie',
      profilePhoto: '/placeholder-photos/shane.jpg',
      role: 'treasurer',
    },
    {
      id: '6',
      firstName: 'Aurélia',
      lastName: 'HUISSE--DALBOUSSIERE',
      email: 'aurelia@eleve.isep.fr',
      motto: "Communiquer c'est créer du lien",
      profilePhoto: '/placeholder-photos/aurelia.jpg',
      role: 'pole_communication',
    },
  ];

  // Define role mappings
  const roleMapping: UserRole[] = [
    // Executive section
    {
      role: 'vice_president_1',
      displayName: 'VICE-PRÉSIDENTE',
      section: 'executive',
      variant: 'executive',
    },
    { role: 'president', displayName: 'PRÉSIDENT', section: 'executive', variant: 'president' },
    {
      role: 'vice_president_2',
      displayName: 'VICE-PRÉSIDENT',
      section: 'executive',
      variant: 'executive',
    },

    // Other members section
    { role: 'secretary_general', displayName: 'SECRÉTAIRE GÉNÉRALE', section: 'other' },
    { role: 'treasurer', displayName: 'TRÉSORIER', section: 'other' },

    // Pole section
    { role: 'pole_bands', displayName: 'PÔLE BANDS', section: 'pole', variant: 'pole' },
    { role: 'pole_communication', displayName: 'PÔLE COM', section: 'pole', variant: 'pole' },
    { role: 'pole_creation', displayName: 'PÔLE CRÉA', section: 'pole', variant: 'pole' },
  ];

  // Group roles by section
  const executiveRoles = roleMapping.filter((r) => r.section === 'executive');
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
        users={placeholderUsers}
        roleInfos={executiveRoles}
        lightType="yellow"
        className="mb-0"
      />

      {/* Autres membres */}
      <Garland
        users={placeholderUsers}
        roleInfos={otherRoles}
        lightType="yellow"
        className="mb-100"
      />

      {/* Section "Sans oublier nos responsables pôles" */}
      <div className="text-center mb-8 w-full text-4xl md:text-3xl text-white font-bold text-glow text-glow-[#F4E0FF]">
        Sans oublier nos responsables pôles
      </div>

      {/* Pôles */}
      <Garland users={placeholderUsers} roleInfos={poleRoles} lightType="blue" className="mb-100" />

      {/* Vision Note */}
      <div className="flex justify-center mb-20 px-4">
        <VisionNote />
      </div>

      <h5 className="text-xs text-white/50 relative max-w-7xl flex justify-center md:justify-end mx-auto py-4">
        Design de page réalisé par Sarah LEVY
      </h5>
    </main>
  );
};

export default Page;
