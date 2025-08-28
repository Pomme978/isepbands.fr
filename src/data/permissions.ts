export interface DefaultPermission {
  name: string;
  nameFr: string;
  nameEn: string;
  description?: string;
}

export const defaultPermissions: DefaultPermission[] = [
  {
    name: 'admin.dashboard',
    nameFr: 'Accès au tableau de bord admin',
    nameEn: 'Admin dashboard access',
    description: 'Access to the administrative dashboard',
  },
  {
    name: 'admin.users.view',
    nameFr: 'Voir les utilisateurs',
    nameEn: 'View users',
    description: 'View user profiles and information',
  },
  {
    name: 'admin.users.edit',
    nameFr: 'Modifier les utilisateurs',
    nameEn: 'Edit users',
    description: 'Edit user profiles and information',
  },
  {
    name: 'admin.users.create',
    nameFr: 'Créer des utilisateurs',
    nameEn: 'Create users',
    description: 'Create new user accounts',
  },
  {
    name: 'admin.users.delete',
    nameFr: 'Supprimer des utilisateurs',
    nameEn: 'Delete users',
    description: 'Delete user accounts',
  },
  {
    name: 'admin.bands.view',
    nameFr: 'Voir les groupes',
    nameEn: 'View bands',
    description: 'View band information',
  },
  {
    name: 'admin.bands.edit',
    nameFr: 'Modifier les groupes',
    nameEn: 'Edit bands',
    description: 'Edit band information and management',
  },
  {
    name: 'admin.events.view',
    nameFr: 'Voir les événements',
    nameEn: 'View events',
    description: 'View event information',
  },
  {
    name: 'admin.events.create',
    nameFr: 'Créer des événements',
    nameEn: 'Create events',
    description: 'Create new events',
  },
  {
    name: 'admin.events.edit',
    nameFr: 'Modifier les événements',
    nameEn: 'Edit events',
    description: 'Edit event information',
  },
  {
    name: 'admin.content.edit',
    nameFr: 'Modifier le contenu',
    nameEn: 'Edit content',
    description: 'Edit site content and pages',
  },
  {
    name: 'admin.media.manage',
    nameFr: 'Gérer les médias',
    nameEn: 'Manage media',
    description: 'Manage media library',
  },
  {
    name: 'admin.communication',
    nameFr: 'Communication',
    nameEn: 'Communication',
    description: 'Send newsletters and communications',
  },
  {
    name: 'admin.files.access',
    nameFr: 'Accès aux fichiers',
    nameEn: 'Files access',
    description: 'Access to restricted files',
  },
];
