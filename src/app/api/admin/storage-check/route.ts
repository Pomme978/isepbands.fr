import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';

export async function GET() {
  try {
    // Get all storage objects
    const storageObjects = await prisma.storageObject.findMany({
      select: {
        id: true,
        key: true,
        url: true,
        size: true,
        contentType: true,
        uploadedAt: true,
        userId: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            photoUrl: true,
          },
        },
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });

    // Check which storage objects are actually being used as profile pictures
    const usedUrls = new Set();
    const users = await prisma.user.findMany({
      where: {
        photoUrl: { not: null },
      },
      select: {
        photoUrl: true,
      },
    });

    users.forEach((user) => {
      if (user.photoUrl) {
        usedUrls.add(user.photoUrl);
      }
    });

    const analysis = storageObjects.map((obj) => ({
      ...obj,
      isUsed: usedUrls.has(obj.url),
      sizeMB: (obj.size / 1024 / 1024).toFixed(2),
    }));

    const totalSize = storageObjects.reduce((sum, obj) => sum + obj.size, 0);
    const unusedObjects = analysis.filter((obj) => !obj.isUsed);
    const unusedSize = unusedObjects.reduce((sum, obj) => sum + obj.size, 0);

    return NextResponse.json({
      totalFiles: storageObjects.length,
      totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
      usedFiles: analysis.filter((obj) => obj.isUsed).length,
      unusedFiles: unusedObjects.length,
      unusedSizeMB: (unusedSize / 1024 / 1024).toFixed(2),
      files: analysis,
      unusedObjects: unusedObjects.map((obj) => ({
        id: obj.id,
        key: obj.key,
        url: obj.url,
        sizeMB: obj.sizeMB,
        uploadedAt: obj.uploadedAt,
        userId: obj.userId,
        user: obj.user,
      })),
    });
  } catch (error) {
    console.error('Error checking storage:', error);
    return NextResponse.json(
      {
        error: 'Failed to check storage',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
