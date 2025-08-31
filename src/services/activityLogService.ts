import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export interface CreateActivityLogOptions {
  userId: string;
  type?: string;
  title?: string;
  description?: string;
  metadata?: Prisma.InputJsonValue;
  createdBy?: string | null;
}

export interface UpdateActivityLogOptions {
  id: string;
  title?: string;
  description?: string;
  metadata?: Prisma.InputJsonValue;
}

export async function createActivityLog({
  userId,
  type = 'custom',
  title = '',
  description = '',
  metadata = {},
  createdBy = null,
}: CreateActivityLogOptions) {
  if (!userId) throw new Error('userId is required');
  return prisma.activity.create({
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

export async function getActivityLogById(id: string) {
  if (!id) throw new Error('id is required');
  return prisma.activity.findUnique({ where: { id } });
}

export async function getUserActivityLogs(userId: string, limit = 100) {
  if (!userId) throw new Error('userId is required');
  return prisma.activity.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function updateActivityLog({
  id,
  title,
  description,
  metadata,
}: UpdateActivityLogOptions) {
  if (!id) throw new Error('id is required');
  return prisma.activity.update({
    where: { id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(metadata !== undefined ? { metadata } : {}),
    },
  });
}

export async function deleteActivityLog(id: string) {
  if (!id) throw new Error('id is required');
  return prisma.activity.delete({ where: { id } });
}
