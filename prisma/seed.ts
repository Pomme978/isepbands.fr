import { PrismaClient } from '@prisma/client';
import { baseEmailTemplates } from '../src/data/emailTemplates';

const prisma = new PrismaClient();

const defaultInstruments = [
  { name: 'electric_guitar', nameFr: 'Guitare électrique', nameEn: 'Electric Guitar' },
  { name: 'acoustic_guitar', nameFr: 'Guitare acoustique', nameEn: 'Acoustic Guitar' },
  { name: 'electric_bass', nameFr: 'Basse électrique', nameEn: 'Electric Bass' },
  { name: 'drums', nameFr: 'Batterie', nameEn: 'Drums' },
  { name: 'piano', nameFr: 'Piano', nameEn: 'Piano' },
  { name: 'keyboard', nameFr: 'Clavier/Synthétiseur', nameEn: 'Keyboard/Synthesizer' },
  { name: 'violin', nameFr: 'Violon', nameEn: 'Violin' },
  { name: 'saxophone', nameFr: 'Saxophone', nameEn: 'Saxophone' },
  { name: 'trumpet', nameFr: 'Trompette', nameEn: 'Trumpet' },
  { name: 'flute', nameFr: 'Flûte', nameEn: 'Flute' },
  { name: 'harmonica', nameFr: 'Harmonica', nameEn: 'Harmonica' },
  { name: 'ukulele', nameFr: 'Ukulélé', nameEn: 'Ukulele' },
  { name: 'accordion', nameFr: 'Accordéon', nameEn: 'Accordion' },
  { name: 'cello', nameFr: 'Violoncelle', nameEn: 'Cello' },
  { name: 'trombone', nameFr: 'Trombone', nameEn: 'Trombone' },
  { name: 'clarinet', nameFr: 'Clarinette', nameEn: 'Clarinet' },
  { name: 'djembe', nameFr: 'Djembé', nameEn: 'Djembe' },
  { name: 'cajon', nameFr: 'Cajon', nameEn: 'Cajon' },
  { name: 'vocals', nameFr: 'Chant', nameEn: 'Vocals' },
  { name: 'beatbox', nameFr: 'Beatbox', nameEn: 'Beatbox' },
];

const defaultPermissions = [
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

const defaultRoles = [
  {
    name: 'president',
    nameFrMale: 'Président',
    nameFrFemale: 'Présidente',
    nameEnMale: 'President',
    nameEnFemale: 'President',
    weight: 100,
    isCore: true,
    permissions: [], // President gets all permissions by default via full access
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
    permissions: [],
  },
];

async function seedInstruments() {
  console.log('🎵 Seeding instruments...');

  for (const instrument of defaultInstruments) {
    const existing = await prisma.instrument.findFirst({
      where: { name: instrument.name },
    });

    if (existing) {
      await prisma.instrument.update({
        where: { id: existing.id },
        data: {
          nameFr: instrument.nameFr,
          nameEn: instrument.nameEn,
        },
      });
    } else {
      await prisma.instrument.create({
        data: {
          name: instrument.name,
          nameFr: instrument.nameFr,
          nameEn: instrument.nameEn,
          imageUrl: null,
        },
      });
    }
  }

  console.log(`✅ Successfully seeded ${defaultInstruments.length} instruments!`);
}

async function seedPermissions() {
  console.log('🔐 Seeding permissions...');

  for (const permission of defaultPermissions) {
    const existing = await prisma.permission.findFirst({
      where: { name: permission.name },
    });

    if (existing) {
      await prisma.permission.update({
        where: { id: existing.id },
        data: {
          nameFr: permission.nameFr,
          nameEn: permission.nameEn,
          description: permission.description,
        },
      });
    } else {
      await prisma.permission.create({
        data: {
          name: permission.name,
          nameFr: permission.nameFr,
          nameEn: permission.nameEn,
          description: permission.description,
        },
      });
    }
  }

  console.log(`✅ Successfully seeded ${defaultPermissions.length} permissions!`);
}

async function seedRoles() {
  console.log('👑 Seeding roles...');

  for (const roleData of defaultRoles) {
    let role = await prisma.role.findFirst({
      where: { name: roleData.name },
    });

    if (role) {
      role = await prisma.role.update({
        where: { id: role.id },
        data: {
          nameFrMale: roleData.nameFrMale,
          nameFrFemale: roleData.nameFrFemale,
          nameEnMale: roleData.nameEnMale,
          nameEnFemale: roleData.nameEnFemale,
          weight: roleData.weight,
          isCore: roleData.isCore,
        },
      });
    } else {
      role = await prisma.role.create({
        data: {
          name: roleData.name,
          nameFrMale: roleData.nameFrMale,
          nameFrFemale: roleData.nameFrFemale,
          nameEnMale: roleData.nameEnMale,
          nameEnFemale: roleData.nameEnFemale,
          weight: roleData.weight,
          isCore: roleData.isCore,
        },
      });
    }

    // Handle permissions for this role
    if (roleData.permissions.length > 0) {
      // Delete existing permissions for this role
      await prisma.rolePermission.deleteMany({
        where: { roleId: role.id },
      });

      // Get permission IDs
      const permissions = await prisma.permission.findMany({
        where: {
          name: { in: roleData.permissions },
        },
        select: { id: true, name: true },
      });

      // Create new role-permission relationships
      const rolePermissions = permissions.map((permission) => ({
        roleId: role.id,
        permissionId: permission.id,
      }));

      if (rolePermissions.length > 0) {
        await prisma.rolePermission.createMany({
          data: rolePermissions,
        });
      }
    }
  }

  console.log(`✅ Successfully seeded ${defaultRoles.length} roles!`);
}

async function seedEmailTemplates() {
  console.log('📧 Seeding email templates...');

  // Chercher un utilisateur admin pour créer les templates
  const adminUser = await prisma.user.findFirst({
    where: {
      roles: {
        some: {
          role: {
            name: 'admin'
          }
        }
      }
    }
  });

  if (!adminUser) {
    console.log('⚠️  No admin user found, skipping email templates seeding');
    return;
  }

  for (const template of baseEmailTemplates) {
    // Vérifier si le template existe déjà
    const existingTemplate = await prisma.emailTemplate.findUnique({
      where: { name: template.name }
    });

    if (!existingTemplate) {
      await prisma.emailTemplate.create({
        data: {
          name: template.name,
          description: template.description,
          subject: template.subject,
          htmlContent: template.htmlContent,
          variables: template.variables,
          templateType: template.templateType,
          isActive: true,
          isDefault: template.isDefault,
          createdById: adminUser.id,
        }
      });
      console.log(`   ✓ Created template: ${template.name}`);
    } else {
      console.log(`   - Template already exists: ${template.name}`);
    }
  }

  console.log(`✅ Successfully processed ${baseEmailTemplates.length} email templates!`);
}

async function main() {
  try {
    await seedInstruments();
    await seedPermissions();
    await seedRoles();
    await seedEmailTemplates();

    console.log('🎉 All seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
