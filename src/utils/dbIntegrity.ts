import { prisma } from '@/prisma';
import { defaultInstruments } from '@/data/instruments';
import { defaultPermissions } from '@/data/permissions';
import { defaultRoles } from '@/data/roles';

/**
 * Check and ensure database integrity by creating missing permissions, roles, and instruments
 */
export async function ensureDBIntegrity() {
  console.log('🔍 Checking database integrity...');

  try {
    // Ensure instruments exist
    console.log('🎵 Ensuring instruments exist...');
    for (const instrument of defaultInstruments) {
      const existing = await prisma.instrument.findFirst({
        where: { name: instrument.name }
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
      }
    }

    // Ensure permissions exist
    console.log('📝 Ensuring permissions exist...');
    for (const permission of defaultPermissions) {
      const existing = await prisma.permission.findFirst({
        where: { name: permission.name }
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
      }
    }

    // Ensure roles exist
    console.log('👑 Ensuring roles exist...');
    for (const roleData of defaultRoles) {
      let role = await prisma.role.findFirst({
        where: { name: roleData.name }
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

        // Add permissions for this role
        if (roleData.permissions.length > 0) {
          const permissions = await prisma.permission.findMany({
            where: {
              name: { in: roleData.permissions }
            },
            select: { id: true, name: true }
          });

          const rolePermissions = permissions.map(permission => ({
            roleId: role.id,
            permissionId: permission.id
          }));

          if (rolePermissions.length > 0) {
            await prisma.rolePermission.createMany({
              data: rolePermissions
            });
            console.log(`✅ Added ${rolePermissions.length} permissions to role: ${roleData.name}`);
          }
        }
      }
    }

    console.log('✅ Database integrity check completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error during database integrity check:', error);
    return false;
  }
}

/**
 * Get all available roles
 */
export async function getAvailableRoles() {
  await ensureDBIntegrity();
  
  return await prisma.role.findMany({
    orderBy: { weight: 'desc' }
  });
}

/**
 * Get all available instruments
 */
export async function getAvailableInstruments() {
  await ensureDBIntegrity();
  
  return await prisma.instrument.findMany({
    orderBy: { nameFr: 'asc' }
  });
}

/**
 * Get all available permissions
 */
export async function getAvailablePermissions() {
  await ensureDBIntegrity();
  
  return await prisma.permission.findMany({
    orderBy: { name: 'asc' }
  });
}