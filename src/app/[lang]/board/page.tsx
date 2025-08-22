// page.tsx
import React from 'react';
import { VisionNote } from '@/components/board/VisionNote';
import { Garland } from '@/components/board/Garland';

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
  // TODO: Replace with actual API call
  // const { users, loading } = useUsers();

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
    { role: 'treasurer', displayName: 'TRÉSORIÈRE', section: 'other' },

    // Pole section
    { role: 'pole_bands', displayName: 'PÔLE BANDS', section: 'pole', variant: 'pole' },
    { role: 'pole_communication', displayName: 'PÔLE COM', section: 'pole', variant: 'pole' },
    { role: 'pole_creation', displayName: 'PÔLE CRÉA', section: 'pole', variant: 'pole' },
  ];

  // Function to get user by role
  const getUserByRole = (role: string): User | null => {
    return placeholderUsers.find((user) => user.role === role) || null;
    // TODO: Replace with: return users?.find(user => user.role === role) || null;
  };

  // Group roles by section
  const executiveRoles = roleMapping.filter((r) => r.section === 'executive');
  const otherRoles = roleMapping.filter((r) => r.section === 'other');
  const poleRoles = roleMapping.filter((r) => r.section === 'pole');

  return (
    <div className="min-h-screen bg-[#2E135F] relative overflow-hidden">
      {/* Header */}
      <div className="text-center py-12 relative z-10">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-wider">LE BUREAU</h1>
        <p className="text-2xl md:text-3xl text-white/80 font-light">2025 - 2026</p>
      </div>

      {/* Photo de groupe - TODO: Add actual group photo */}
      <div className="flex justify-center mb-16 px-4">
        <div className="relative">
          <div className="w-full max-w-4xl h-64 bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl flex items-center justify-center">
            <p className="text-white/70 text-lg">Photo de groupe à venir</p>
          </div>
        </div>
      </div>
      {/* Membres exécutifs */}
      <Garland users={placeholderUsers} roleInfos={executiveRoles} lightType="yellow" />

      {/* Autres membres */}
      <Garland users={placeholderUsers} roleInfos={otherRoles} lightType="yellow" />

      {/* Section "Sans oublier nos responsables pôles" */}
      <div className="text-center mb-8">
        <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
          <p className="text-white text-lg font-medium">→ Sans oublier nos responsables pôles ←</p>
        </div>
      </div>

      {/* Pôles */}
      <Garland users={placeholderUsers} roleInfos={poleRoles} lightType="blue" className="mb-20" />

      {/* Vision Note */}
      <div className="flex justify-center mb-20 px-4">
        <VisionNote />
      </div>
    </div>
  );
};

export default Page;
