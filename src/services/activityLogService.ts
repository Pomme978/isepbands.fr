import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import type { AdminActivityLogType } from '@/types/adminActivity';

// Fonction pour formater les descriptions pour l'affichage public
export function formatActivityDescription(
  activity: any,
  currentViewerId?: string
): string {
  // Toujours retourner la description originale - plus de messages personnalisés
  return activity.description;
}

export interface CreateAdminActivityLogOptions {
  userId?: string | null; // Optional for system logs
  type?: AdminActivityLogType;
  title?: string;
  description?: string;
  metadata?: Prisma.InputJsonValue;
  createdBy?: string | null;
}

export interface UpdateAdminActivityLogOptions {
  id: string;
  title?: string;
  description?: string;
  metadata?: Prisma.InputJsonValue;
}

export async function createAdminActivityLog({
  userId = null,
  type = 'custom',
  title = '',
  description = '',
  metadata = {},
  createdBy = null,
}: CreateAdminActivityLogOptions) {
  return prisma.adminActivity.create({
    data: {
      userId,
      type,
      title,
      description,
      metadata,
      createdBy,
    },
  });
}

export async function getAdminActivityLogById(id: string) {
  if (!id) throw new Error('id is required');
  return prisma.adminActivity.findUnique({ where: { id } });
}

export async function getUserAdminActivityLogs(userId: string, limit = 100) {
  if (!userId) throw new Error('userId is required');
  return prisma.adminActivity.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getAllAdminActivityLogs(limit = 50) {
  return prisma.adminActivity.findMany({
    where: {
      isArchived: false,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          photoUrl: true,
          pronouns: true,
          roles: {
            include: {
              role: {
                select: {
                  nameFrFemale: true,
                  nameFrMale: true,
                  weight: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function updateAdminActivityLog({
  id,
  title,
  description,
  metadata,
}: UpdateAdminActivityLogOptions) {
  if (!id) throw new Error('id is required');
  return prisma.adminActivity.update({
    where: { id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(metadata !== undefined ? { metadata } : {}),
    },
  });
}

export async function deleteAdminActivityLog(id: string) {
  if (!id) throw new Error('id is required');
  return prisma.adminActivity.delete({ where: { id } });
}

export async function archiveAdminActivityLog(id: string, archivedBy: string, reason?: string) {
  if (!id) throw new Error('id is required');
  return prisma.adminActivity.update({
    where: { id },
    data: {
      isArchived: true,
      archivedAt: new Date(),
      archivedBy,
      archiveReason: reason || 'Archivé par un administrateur',
    },
  });
}

// Helper function standardisée pour logger les actions admin
export async function logAdminAction(
  adminId: string,
  type: AdminActivityLogType,
  title: string,
  description: string,
  targetUserId?: string | null,
  metadata?: Prisma.InputJsonValue
) {
  try {
    // Un seul log : action générale visible par tous
    await createAdminActivityLog({
      userId: targetUserId || null,
      type,
      title,
      description,
      metadata: metadata || {},
      createdBy: adminId
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
    // Ne pas faire échouer l'opération principale
  }
}
