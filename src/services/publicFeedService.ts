import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export interface CreatePublicFeedOptions {
  userId: string;
  type?: string;
  title?: string;
  description?: string;
  metadata?: Prisma.InputJsonValue;
}

export interface UpdatePublicFeedOptions {
  id: string;
  title?: string;
  description?: string;
  metadata?: Prisma.InputJsonValue;
}

export async function createPublicFeedItem({
  userId,
  type = 'post',
  title = '',
  description = '',
  metadata = {},
}: CreatePublicFeedOptions) {
  if (!userId) throw new Error('userId is required for public feed');
  
  // Ensure only allowed types in public feed
  const allowedTypes = ['new_member', 'post', 'event', 'announcement'];
  if (!allowedTypes.includes(type)) {
    throw new Error(`Type '${type}' not allowed in public feed. Use: ${allowedTypes.join(', ')}`);
  }

  return prisma.publicFeed.create({
    data: {
      userId,
      type,
      title,
      description,
      metadata,
    },
  });
}

export async function getPublicFeedItems(limit = 20) {
  return prisma.publicFeed.findMany({
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

export async function getPublicFeedById(id: string) {
  if (!id) throw new Error('id is required');
  return prisma.publicFeed.findUnique({ 
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          photoUrl: true,
        },
      },
    },
  });
}

export async function updatePublicFeedItem({
  id,
  title,
  description,
  metadata,
}: UpdatePublicFeedOptions) {
  if (!id) throw new Error('id is required');
  return prisma.publicFeed.update({
    where: { id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(metadata !== undefined ? { metadata } : {}),
    },
  });
}

export async function deletePublicFeedItem(id: string) {
  if (!id) throw new Error('id is required');
  return prisma.publicFeed.delete({ where: { id } });
}

export async function getUserPublicFeedItems(userId: string, limit = 100) {
  if (!userId) throw new Error('userId is required');
  return prisma.publicFeed.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}