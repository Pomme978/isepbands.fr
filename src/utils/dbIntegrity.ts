import { prisma } from '@/prisma';
import { defaultInstruments } from '@/data/instruments';
import { defaultPermissions } from '@/data/permissions';
import { defaultRoles } from '@/data/roles';
import { MUSIC_GENRES } from '@/data/musicGenres';

/**
 * Check and ensure database integrity by creating missing permissions, roles, and instruments
 */
export async function ensureDBIntegrity() {
  console.log('🔍 Checking database integrity...');
  const actions = [];

  try {
    // Remove database duplicates first
    console.log('🧹 Cleaning up database duplicates...');

    // Remove duplicate instruments (keep the first occurrence)
    const duplicateInstruments = await prisma.$queryRaw<
      Array<{ name: string; count: number; ids: string }>
    >`
      SELECT name, COUNT(*) as count, GROUP_CONCAT(id) as ids
      FROM Instrument 
      GROUP BY name 
      HAVING count > 1
    `;

    for (const duplicate of duplicateInstruments) {
      const ids = duplicate.ids.split(',').map((id) => parseInt(id));
      const [keepId, ...deleteIds] = ids;

      for (const deleteId of deleteIds) {
        await prisma.instrument.delete({ where: { id: deleteId } });
        console.log(`🗑️ Removed duplicate instrument with id: ${deleteId}`);
        actions.push(`Supprimé l'instrument dupliqué avec l'ID ${deleteId}`);
      }
    }

    // Remove duplicate permissions
    const duplicatePermissions = await prisma.$queryRaw<
      Array<{ name: string; count: number; ids: string }>
    >`
      SELECT name, COUNT(*) as count, GROUP_CONCAT(id) as ids
      FROM Permission 
      GROUP BY name 
      HAVING count > 1
    `;

    for (const duplicate of duplicatePermissions) {
      const ids = duplicate.ids.split(',').map((id) => parseInt(id));
      const [keepId, ...deleteIds] = ids;

      for (const deleteId of deleteIds) {
        // Remove role permissions first
        await prisma.rolePermission.deleteMany({ where: { permissionId: deleteId } });
        await prisma.permission.delete({ where: { id: deleteId } });
        console.log(`🗑️ Removed duplicate permission with id: ${deleteId}`);
        actions.push(`Supprimé la permission dupliquée avec l'ID ${deleteId}`);
      }
    }

    // Remove duplicate roles
    const duplicateRoles = await prisma.$queryRaw<
      Array<{ name: string; count: number; ids: string }>
    >`
      SELECT name, COUNT(*) as count, GROUP_CONCAT(id) as ids
      FROM Role 
      GROUP BY name 
      HAVING count > 1
    `;

    for (const duplicate of duplicateRoles) {
      const ids = duplicate.ids.split(',').map((id) => parseInt(id));
      const [keepId, ...deleteIds] = ids;

      for (const deleteId of deleteIds) {
        // Remove role permissions and user roles first
        await prisma.rolePermission.deleteMany({ where: { roleId: deleteId } });
        await prisma.userRole.deleteMany({ where: { roleId: deleteId } });
        await prisma.role.delete({ where: { id: deleteId } });
        console.log(`🗑️ Removed duplicate role with id: ${deleteId}`);
        actions.push(`Supprimé le rôle dupliqué avec l'ID ${deleteId}`);
      }
    }

    // Remove duplicate music genres
    const duplicateGenres = await prisma.$queryRaw<Array<{ id: string; count: number }>>`
      SELECT id, COUNT(*) as count
      FROM MusicGenre 
      GROUP BY id 
      HAVING count > 1
    `;

    for (const duplicate of duplicateGenres) {
      // Keep only one, delete the rest (this is unlikely but just in case)
      const existing = await prisma.musicGenre.findMany({ where: { id: duplicate.id } });
      for (let i = 1; i < existing.length; i++) {
        await prisma.musicGenre.delete({ where: { id: existing[i].id } });
        console.log(`🗑️ Removed duplicate music genre with id: ${existing[i].id}`);
        actions.push(`Supprimé le genre musical dupliqué ${existing[i].id}`);
      }
    }
    // Ensure instruments exist
    console.log('🎵 Ensuring instruments exist...');
    for (const instrument of defaultInstruments) {
      const existing = await prisma.instrument.findFirst({
        where: { name: instrument.name },
      });

      if (!existing) {
        await prisma.instrument.create({
          data: {
            name: instrument.name,
            nameFr: instrument.nameFr,
            nameEn: instrument.nameEn,
            imageUrl: instrument.imageUrl || null,
          },
        });
        console.log(`✅ Created missing instrument: ${instrument.name}`);
        actions.push(`Créé l'instrument manquant: ${instrument.nameFr}`);
      }
    }

    // Ensure permissions exist
    console.log('📝 Ensuring permissions exist...');
    for (const permission of defaultPermissions) {
      const existing = await prisma.permission.findFirst({
        where: { name: permission.name },
      });

      if (!existing) {
        await prisma.permission.create({
          data: {
            name: permission.name,
            nameFr: permission.nameFr,
            nameEn: permission.nameEn,
            description: permission.description,
          },
        });
        console.log(`✅ Created missing permission: ${permission.name}`);
        actions.push(`Créé la permission manquante: ${permission.nameFr}`);
      }
    }

    // Ensure roles exist
    console.log('👑 Ensuring roles exist...');
    for (const roleData of defaultRoles) {
      let role = await prisma.role.findFirst({
        where: { name: roleData.name },
      });

      if (!role) {
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
        console.log(`✅ Created missing role: ${roleData.name}`);
        actions.push(`Créé le rôle manquant: ${roleData.nameFrMale}`);

        // Add permissions for this role
        if (roleData.permissions.length > 0) {
          const permissions = await prisma.permission.findMany({
            where: {
              name: { in: roleData.permissions },
            },
            select: { id: true, name: true },
          });

          const rolePermissions = permissions.map((permission) => ({
            roleId: role.id,
            permissionId: permission.id,
          }));

          if (rolePermissions.length > 0) {
            await prisma.rolePermission.createMany({
              data: rolePermissions,
            });
            console.log(`✅ Added ${rolePermissions.length} permissions to role: ${roleData.name}`);
          }
        }
      }
    }

    // Ensure music genres exist
    console.log('🎶 Ensuring music genres exist...');
    for (const genre of MUSIC_GENRES) {
      const existing = await prisma.musicGenre.findFirst({
        where: { id: genre.id },
      });

      if (!existing) {
        await prisma.musicGenre.create({
          data: {
            id: genre.id,
            nameFr: genre.nameFr,
            nameEn: genre.nameEn,
          },
        });
        console.log(`✅ Created missing music genre: ${genre.nameFr}`);
        actions.push(`Créé le genre musical manquant: ${genre.nameFr}`);
      }
    }

    console.log('✅ Database integrity check completed successfully!');
    return { success: true, actions };
  } catch (error) {
    console.error('❌ Error during database integrity check:', error);
    return { success: false, actions, error: error.message };
  }
}

/**
 * Get all available roles
 */
export async function getAvailableRoles() {
  await ensureDBIntegrity();

  return await prisma.role.findMany({
    orderBy: { weight: 'desc' },
  });
}

/**
 * Get all available instruments
 */
export async function getAvailableInstruments() {
  await ensureDBIntegrity();

  return await prisma.instrument.findMany({
    orderBy: { nameFr: 'asc' },
  });
}

/**
 * Get all available permissions
 */
export async function getAvailablePermissions() {
  await ensureDBIntegrity();

  return await prisma.permission.findMany({
    orderBy: { name: 'asc' },
  });
}
