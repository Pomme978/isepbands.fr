import { prisma } from '@/prisma';
import { defaultInstruments } from '@/data/instruments';
import { defaultPermissions } from '@/data/permissions';
import { defaultRoles } from '@/data/roles';
import { MUSIC_GENRES } from '@/data/musicGenres';
import { baseEmailTemplates } from '@/data/emailTemplates';

/**
 * Check and ensure database integrity by creating missing permissions, roles, and instruments
 */
export async function ensureDBIntegrity(executorUserId?: string) {
  console.log('🔍 Checking database integrity...');
  const startTime = Date.now();
  const actions = [];
  const stats = {
    created: 0,
    deleted: 0,
    checked: 0,
  };

  try {
    // Remove database duplicates first
    console.log('🧹 Cleaning up database duplicates...');

    // Remove duplicate instruments using safe Prisma queries
    const instrumentGroups = await prisma.instrument.groupBy({
      by: ['name'],
      _count: { id: true },
      having: { id: { _count: { gt: 1 } } },
    });

    const duplicateInstruments: Array<{ name: string; count: number; ids: number[] }> = [];

    for (const group of instrumentGroups) {
      const instruments = await prisma.instrument.findMany({
        where: { name: group.name },
        select: { id: true },
        orderBy: { id: 'asc' },
      });

      duplicateInstruments.push({
        name: group.name,
        count: group._count.id,
        ids: instruments.map((i) => i.id),
      });
    }

    for (const duplicate of duplicateInstruments) {
      const [keepId, ...deleteIds] = duplicate.ids;

      for (const deleteId of deleteIds) {
        await prisma.instrument.delete({ where: { id: deleteId } });
        console.log(`🗑️ Removed duplicate instrument with id: ${deleteId}`);
        actions.push(`Supprimé l'instrument dupliqué avec l'ID ${deleteId}`);
        stats.deleted++;
      }
    }

    // Remove duplicate permissions using safe Prisma queries
    const permissionGroups = await prisma.permission.groupBy({
      by: ['name'],
      _count: { id: true },
      having: { id: { _count: { gt: 1 } } },
    });

    const duplicatePermissions: Array<{ name: string; count: number; ids: number[] }> = [];

    for (const group of permissionGroups) {
      const permissions = await prisma.permission.findMany({
        where: { name: group.name },
        select: { id: true },
        orderBy: { id: 'asc' },
      });

      duplicatePermissions.push({
        name: group.name,
        count: group._count.id,
        ids: permissions.map((p) => p.id),
      });
    }

    for (const duplicate of duplicatePermissions) {
      const ids = duplicate.ids;
      const [keepId, ...deleteIds] = ids;

      for (const deleteId of deleteIds) {
        // Remove role permissions first
        await prisma.rolePermission.deleteMany({ where: { permissionId: deleteId } });
        await prisma.permission.delete({ where: { id: deleteId } });
        console.log(`🗑️ Removed duplicate permission with id: ${deleteId}`);
        actions.push(`Supprimé la permission dupliquée avec l'ID ${deleteId}`);
        stats.deleted++;
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
        stats.deleted++;
      }
    }

    // Remove duplicate music genres using safe Prisma queries
    const allGenres = await prisma.musicGenre.findMany({
      select: { id: true },
    });

    const seenIds = new Set<string>();
    const duplicateIds: string[] = [];

    for (const genre of allGenres) {
      if (seenIds.has(genre.id)) {
        duplicateIds.push(genre.id);
      } else {
        seenIds.add(genre.id);
      }
    }

    for (const duplicateId of duplicateIds) {
      await prisma.musicGenre.delete({ where: { id: duplicateId } });
      console.log(`🗑️ Removed duplicate music genre with id: ${duplicateId}`);
      actions.push(`Supprimé le genre musical dupliqué ${duplicateId}`);
      stats.deleted++;
    }
    // Ensure instruments exist
    console.log('🎵 Ensuring instruments exist...');
    for (const instrument of defaultInstruments) {
      const existing = await prisma.instrument.findFirst({
        where: { name: instrument.name },
      });

      stats.checked++;

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
        stats.created++;
      }
    }

    // Ensure permissions exist
    console.log('📝 Ensuring permissions exist...');
    for (const permission of defaultPermissions) {
      const existing = await prisma.permission.findFirst({
        where: { name: permission.name },
      });

      stats.checked++;

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
        stats.created++;
      }
    }

    // Ensure roles exist
    console.log('👑 Ensuring roles exist...');
    for (const roleData of defaultRoles) {
      let role = await prisma.role.findFirst({
        where: { name: roleData.name },
      });

      stats.checked++;

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
        stats.created++;

        // Add permissions for this role
        if (roleData.permissions.length > 0) {
          const permissions = await prisma.permission.findMany({
            where: {
              name: { in: roleData.permissions },
            },
            select: { id: true, name: true },
          });

          const rolePermissions = permissions.map((permission) => ({
            roleId: role!.id,
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

      stats.checked++;

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
        stats.created++;
      }
    }

    // Ensure email templates exist
    console.log('📧 Ensuring email templates exist...');

    for (const template of baseEmailTemplates) {
      const existingResult = await prisma.$queryRaw<
        Array<{
          id: number;
          name: string;
        }>
      >`SELECT id, name FROM EmailTemplate WHERE name = ${template.name} LIMIT 1`;

      const existing = existingResult[0] || null;

      stats.checked++;

      if (!existing) {
        // Vérifier si l'utilisateur existe, sinon utiliser null
        let createdById = null;
        if (executorUserId) {
          const userExists = await prisma.user.findUnique({
            where: { id: executorUserId },
            select: { id: true },
          });
          if (userExists) {
            createdById = executorUserId;
          }
        }

        await prisma.emailTemplate.create({
          data: {
            name: template.name,
            description: template.description,
            subject: template.subject,
            htmlContent: template.htmlContent,
            templateType: template.templateType,
            isDefault: template.isDefault,
            variables: JSON.stringify(template.variables),
            createdById: createdById,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        console.log(`✅ Created missing email template: ${template.name}`);
        actions.push(`Créé le template d'email manquant: ${template.name}`);
        stats.created++;
      }
    }

    // Calculer la durée d'exécution
    const duration = Date.now() - startTime;

    console.log('✅ Database integrity check completed successfully!');
    return { success: true, actions, stats: { ...stats, duration } };
  } catch (error) {
    console.error('❌ Error during database integrity check:', error);
    return {
      success: false,
      actions,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check for differences between email templates in database and source files
 */
export async function checkEmailTemplatesDifferences(executorUserId?: string) {
  const differences = [];

  // D'abord corriger les templates avec createdById null en utilisant raw SQL
  // Vérifier si l'utilisateur existe avant de l'utiliser
  let defaultUserId = null;
  if (executorUserId) {
    const userExists = await prisma.user.findUnique({
      where: { id: executorUserId },
      select: { id: true },
    });
    if (userExists) {
      defaultUserId = executorUserId;
    }
  }

  // Mettre à jour seulement si on a un utilisateur valide, sinon garder NULL
  if (defaultUserId) {
    await prisma.emailTemplate.updateMany({
      where: {
        OR: [{ createdById: null }, { createdById: '' }],
      },
      data: {
        createdById: defaultUserId,
      },
    });
  }

  // Utiliser raw SQL pour éviter les problèmes avec createdById null
  for (const template of baseEmailTemplates) {
    const existing = await prisma.emailTemplate.findFirst({
      where: { name: template.name },
      select: {
        id: true,
        name: true,
        description: true,
        subject: true,
        htmlContent: true,
        templateType: true,
        isDefault: true,
        variables: true,
      },
    });

    if (existing) {
      const hasChanged =
        existing.description !== template.description ||
        existing.subject !== template.subject ||
        existing.htmlContent !== template.htmlContent ||
        existing.templateType !== template.templateType ||
        existing.isDefault !== template.isDefault ||
        existing.variables !== JSON.stringify(template.variables);

      if (hasChanged) {
        differences.push({
          name: template.name,
          dbVersion: {
            description: existing.description,
            subject: existing.subject,
            htmlContent: existing.htmlContent,
            templateType: existing.templateType,
            isDefault: existing.isDefault,
            variables: existing.variables ? JSON.parse(existing.variables) : null,
          },
          sourceVersion: {
            description: template.description,
            subject: template.subject,
            htmlContent: template.htmlContent,
            templateType: template.templateType,
            isDefault: template.isDefault,
            variables: template.variables,
          },
        });
      }
    }
  }

  return differences;
}

/**
 * Update email templates from source files
 */
export async function updateEmailTemplatesFromSource(executorUserId?: string) {
  const actions = [];
  let updatedCount = 0;

  for (const template of baseEmailTemplates) {
    const existing = await prisma.emailTemplate.findFirst({
      where: { name: template.name },
      select: {
        id: true,
        name: true,
        description: true,
        subject: true,
        htmlContent: true,
        templateType: true,
        isDefault: true,
        variables: true,
      },
    });

    if (existing) {
      const hasChanged =
        existing.description !== template.description ||
        existing.subject !== template.subject ||
        existing.htmlContent !== template.htmlContent ||
        existing.templateType !== template.templateType ||
        existing.isDefault !== template.isDefault ||
        existing.variables !== JSON.stringify(template.variables);

      if (hasChanged) {
        await prisma.emailTemplate.update({
          where: { id: existing.id },
          data: {
            description: template.description,
            subject: template.subject,
            htmlContent: template.htmlContent,
            templateType: template.templateType,
            isDefault: template.isDefault,
            variables: JSON.stringify(template.variables),
            updatedAt: new Date(),
          },
        });
        console.log(`🔄 Updated email template: ${template.name}`);
        actions.push(`Mis à jour le template d'email: ${template.name}`);
        updatedCount++;
      }
    } else {
      // Créer un template manquant avec raw SQL
      // Vérifier si l'utilisateur existe, sinon utiliser null
      let createdById = null;
      if (executorUserId) {
        const userExists = await prisma.user.findUnique({
          where: { id: executorUserId },
          select: { id: true },
        });
        if (userExists) {
          createdById = executorUserId;
        }
      }

      await prisma.emailTemplate.create({
        data: {
          name: template.name,
          description: template.description,
          subject: template.subject,
          htmlContent: template.htmlContent,
          templateType: template.templateType,
          isDefault: template.isDefault,
          variables: JSON.stringify(template.variables),
          createdById: createdById,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      console.log(`✅ Created missing email template: ${template.name}`);
      actions.push(`Créé le template d'email manquant: ${template.name}`);
      updatedCount++;
    }
  }

  return { success: true, actions, updatedCount };
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

// Exécution directe si appelé depuis la ligne de commande
if (require.main === module) {
  ensureDBIntegrity()
    .then(() => {
      console.log('✅ Database integrity restored successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed to restore database:', error);
      process.exit(1);
    });
}
