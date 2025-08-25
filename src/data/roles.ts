export interface DefaultRole {
  name: string;
  nameFrMale: string;
  nameFrFemale: string;
  nameEnMale: string;
  nameEnFemale: string;
  weight: number;
  isCore: boolean;
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
    permissions: [] // President gets all permissions by default via full access
  },
  {
    name: 'vice_president',
    nameFrMale: 'Vice-Président',
    nameFrFemale: 'Vice-Présidente',
    nameEnMale: 'Vice-President',
    nameEnFemale: 'Vice-President',
    weight: 90,
    isCore: true,
    permissions: [
      'admin.dashboard', 'admin.users.view', 'admin.users.edit', 'admin.users.create',
      'admin.bands.view', 'admin.bands.edit', 'admin.events.view', 'admin.events.create', 
      'admin.events.edit', 'admin.content.edit', 'admin.media.manage', 'admin.communication'
    ]
  },
  {
    name: 'treasurer',
    nameFrMale: 'Trésorier',
    nameFrFemale: 'Trésorière',
    nameEnMale: 'Treasurer',
    nameEnFemale: 'Treasurer',
    weight: 80,
    isCore: true,
    permissions: ['admin.dashboard', 'admin.users.view', 'admin.files.access']
  },
  {
    name: 'secretary',
    nameFrMale: 'Secrétaire Général',
    nameFrFemale: 'Secrétaire Générale',
    nameEnMale: 'General Secretary',
    nameEnFemale: 'General Secretary',
    weight: 80,
    isCore: true,
    permissions: [
      'admin.dashboard', 'admin.users.view', 'admin.users.edit', 'admin.events.view',
      'admin.events.create', 'admin.events.edit', 'admin.files.access'
    ]
  },
  {
    name: 'head_of_communication',
    nameFrMale: 'Responsable Communication',
    nameFrFemale: 'Responsable Communication',
    nameEnMale: 'Head of Communication',
    nameEnFemale: 'Head of Communication',
    weight: 70,
    isCore: true,
    permissions: [
      'admin.dashboard', 'admin.users.view', 'admin.content.edit', 'admin.media.manage', 
      'admin.communication'
    ]
  },
  {
    name: 'head_of_creation',
    nameFrMale: 'Responsable Création',
    nameFrFemale: 'Responsable Création',
    nameEnMale: 'Head of Creation',
    nameEnFemale: 'Head of Creation',
    weight: 70,
    isCore: true,
    permissions: [
      'admin.dashboard', 'admin.bands.view', 'admin.bands.edit', 'admin.events.view',
      'admin.events.create', 'admin.events.edit', 'admin.media.manage'
    ]
  },
  {
    name: 'member',
    nameFrMale: 'Membre',
    nameFrFemale: 'Membre',
    nameEnMale: 'Member',
    nameEnFemale: 'Member',
    weight: 10,
    isCore: true,
    permissions: []
  },
  {
    name: 'former_member',
    nameFrMale: 'Ancien Membre',
    nameFrFemale: 'Ancienne Membre',
    nameEnMale: 'Former Member',
    nameEnFemale: 'Former Member',
    weight: 0,
    isCore: true,
    permissions: []
  }
];