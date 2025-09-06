export interface DefaultRole {
  name: string;
  nameFrMale: string;
  nameFrFemale: string;
  nameEnMale: string;
  nameEnFemale: string;
  weight: number;
  isCore: boolean;
  gradientStart?: string;
  gradientEnd?: string;
  permissions: string[]; // Permission names
}

export const defaultRoles: DefaultRole[] = [
  {
    name: 'president',
    nameFrMale: 'Président',
    nameFrFemale: 'Présidente',
    nameEnMale: 'President',
    nameEnFemale: 'President',
    weight: 100,
    isCore: true,
    gradientStart: '#dc2626', // red-600
    gradientEnd: '#991b1b',   // red-800
    permissions: [
      'admin.dashboard',
      'admin.users.view',
      'admin.users.edit',
      'admin.users.create',
      'admin.users.delete',
      'admin.bands.view',
      'admin.bands.edit',
      'admin.bands.create',
      'admin.bands.delete',
      'admin.events.view',
      'admin.events.create',
      'admin.events.edit',
      'admin.events.delete',
      'admin.content.edit',
      'admin.media.manage',
      'admin.communication',
      'admin.database.manage',
      'admin.newsletter',
      'admin.settings',
      'admin.files.access',
    ], // Full administrative access
  },
  {
    name: 'vice_president',
    nameFrMale: 'Vice-Président',
    nameFrFemale: 'Vice-Présidente',
    nameEnMale: 'Vice-President',
    nameEnFemale: 'Vice-President',
    weight: 90,
    isCore: true,
    gradientStart: '#7c3aed', // purple-600
    gradientEnd: '#8b5cf6',   // violet-600
    permissions: [
      'admin.dashboard',
      'admin.users.view',
      'admin.users.edit',
      'admin.users.create',
      'admin.bands.view',
      'admin.bands.edit',
      'admin.events.view',
      'admin.events.create',
      'admin.events.edit',
      'admin.content.edit',
      'admin.media.manage',
      'admin.communication',
    ],
  },
  {
    name: 'treasurer',
    nameFrMale: 'Trésorier',
    nameFrFemale: 'Trésorière',
    nameEnMale: 'Treasurer',
    nameEnFemale: 'Treasurer',
    weight: 80,
    isCore: true,
    gradientStart: '#059669', // green-600
    gradientEnd: '#047857',   // emerald-600
    permissions: ['admin.dashboard', 'admin.users.view', 'admin.files.access'],
  },
  {
    name: 'secretary',
    nameFrMale: 'Secrétaire Général',
    nameFrFemale: 'Secrétaire Générale',
    nameEnMale: 'General Secretary',
    nameEnFemale: 'General Secretary',
    weight: 80,
    isCore: true,
    gradientStart: '#eab308', // yellow-500
    gradientEnd: '#f97316',   // orange-500
    permissions: [
      'admin.dashboard',
      'admin.users.view',
      'admin.users.edit',
      'admin.events.view',
      'admin.events.create',
      'admin.events.edit',
      'admin.files.access',
    ],
  },
  {
    name: 'head_of_communication',
    nameFrMale: 'Responsable Communication',
    nameFrFemale: 'Responsable Communication',
    nameEnMale: 'Head of Communication',
    nameEnFemale: 'Head of Communication',
    weight: 70,
    isCore: true,
    gradientStart: '#2563eb', // blue-600
    gradientEnd: '#0891b2',   // cyan-600
    permissions: [
      'admin.dashboard',
      'admin.users.view',
      'admin.content.edit',
      'admin.media.manage',
      'admin.communication',
    ],
  },
  {
    name: 'head_of_creation',
    nameFrMale: 'Responsable Création',
    nameFrFemale: 'Responsable Création',
    nameEnMale: 'Head of Creation',
    nameEnFemale: 'Head of Creation',
    weight: 70,
    isCore: true,
    gradientStart: '#2563eb', // blue-600 (même que communication)
    gradientEnd: '#0891b2',   // cyan-600
    permissions: [
      'admin.dashboard',
      'admin.bands.view',
      'admin.bands.edit',
      'admin.events.view',
      'admin.events.create',
      'admin.events.edit',
      'admin.media.manage',
    ],
  },
  {
    name: 'member',
    nameFrMale: 'Membre',
    nameFrFemale: 'Membre',
    nameEnMale: 'Member',
    nameEnFemale: 'Member',
    weight: 10,
    isCore: true,
    gradientStart: '#6b7280', // gray-600
    gradientEnd: '#475569',   // slate-600
    permissions: [],
  },
  {
    name: 'former_member',
    nameFrMale: 'Ancien Membre',
    nameFrFemale: 'Ancienne Membre',
    nameEnMale: 'Former Member',
    nameEnFemale: 'Former Member',
    weight: 0,
    isCore: true,
    gradientStart: '#6b7280', // gray-600 (même que membre)
    gradientEnd: '#475569',   // slate-600
    permissions: [],
  },
];
