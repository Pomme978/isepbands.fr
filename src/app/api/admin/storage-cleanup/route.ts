import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import fs from 'fs/promises';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'storage', 'uploads');

export async function DELETE() {
  try {
    // Get all storage objects
    const storageObjects = await prisma.storageObject.findMany();

    // Check which storage objects are actually being used as profile pictures
    const usedIds = new Set<string>();
    const users = await prisma.user.findMany({
      where: {
        photoUrl: { not: null },
      },
      select: {
        photoUrl: true,
      },
    });

    users.forEach((user) => {
      if (user.photoUrl && user.photoUrl.includes('/api/storage?id=')) {
        const id = user.photoUrl.split('/api/storage?id=')[1];
        if (id) usedIds.add(id);
      }
    });

    // Find unused objects
    const unusedObjects = storageObjects.filter((obj) => !usedIds.has(obj.id));

    if (unusedObjects.length === 0) {
      return NextResponse.json({
        message: 'No unused files to clean up',
        cleanedFiles: 0,
        freedSpaceMB: 0,
      });
    }

    // Calculate freed space
    const freedSpace = unusedObjects.reduce((sum, obj) => sum + obj.size, 0);

    // Delete files from filesystem
    let deletedFiles = 0;
    const errors: string[] = [];

    for (const obj of unusedObjects) {
      try {
        const filePath = path.join(UPLOADS_DIR, obj.key);
        await fs.unlink(filePath);
        deletedFiles++;
      } catch (error) {
        console.warn(`Failed to delete file ${obj.key}:`, error);
        errors.push(obj.key);
      }
    }

    // Delete unused objects from database
    const deletedIds = unusedObjects.map((obj) => obj.id);
    await prisma.storageObject.deleteMany({
      where: {
        id: { in: deletedIds },
      },
    });

    return NextResponse.json({
      message: 'Storage cleanup completed',
      cleanedFiles: unusedObjects.length,
      deletedFromFilesystem: deletedFiles,
      freedSpaceMB: (freedSpace / 1024 / 1024).toFixed(2),
      errors: errors.length > 0 ? errors : undefined,
      deletedObjects: unusedObjects.map((obj) => ({
        id: obj.id,
        key: obj.key,
        sizeMB: (obj.size / 1024 / 1024).toFixed(2),
        uploadedAt: obj.uploadedAt,
      })),
    });
  } catch (error) {
    console.error('Error cleaning up storage:', error);
    return NextResponse.json(
      {
        error: 'Failed to clean up storage',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
