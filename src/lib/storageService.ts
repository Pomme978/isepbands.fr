import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

import { randomUUID } from 'crypto';
import { prisma } from '../../lib/prisma';

const STORAGE_BASE_DIR = path.join(process.cwd(), 'public', 'storage');
const UPLOADS_DIR = path.join(STORAGE_BASE_DIR, 'uploads'); // Legacy folder

function getCategoryDir(category?: string): string {
  if (!category) return UPLOADS_DIR; // Fallback to legacy
  return path.join(STORAGE_BASE_DIR, category);
}

export async function getFromStorageById(id: string) {
  return prisma.storageObject.findUnique({ where: { id } });
}
export async function getAllStorage(limit: number = 100, offset: number = 0) {
  // Protect against loading too much data
  const safeLimit = Math.min(Math.max(limit, 1), 1000);

  return prisma.storageObject.findMany({
    take: safeLimit,
    skip: offset,
    orderBy: { uploadedAt: 'desc' },
  });
}
export async function getFileBuffer(key: string, category?: string) {
  const categoryDir = getCategoryDir(category);
  const filePath = path.join(categoryDir, key);
  return fs.readFile(filePath);
}
export async function uploadToStorage(file: File, userId?: string, category?: string) {
  try {
    const originalBuffer = Buffer.from(await file.arrayBuffer());
    const originalSize = originalBuffer.length;
    let contentType = file.type;
    const key = randomUUID();
    const categoryDir = getCategoryDir(category);
    const filePath = path.join(categoryDir, key);
    const url = category ? `/storage/${category}/${key}` : `/storage/uploads/${key}`;

    // Validate original file size (max 10MB)
    if (originalSize > 10 * 1024 * 1024) {
      throw new Error('File size exceeds 10MB limit');
    }

    // Validate content type
    if (!contentType.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    let processedBuffer = originalBuffer;

    // Process image if it's an image file
    if (contentType.startsWith('image/')) {
      try {
        // Get image metadata
        const metadata = await sharp(originalBuffer).metadata();

        // Resize and compress the image
        const maxDimension = 800; // Max width or height
        const quality = 85; // JPEG quality

        let sharpInstance = sharp(originalBuffer)
          // Corriger automatiquement l'orientation EXIF
          .rotate();

        // Resize if image is larger than maxDimension
        if (
          (metadata.width && metadata.width > maxDimension) ||
          (metadata.height && metadata.height > maxDimension)
        ) {
          sharpInstance = sharpInstance.resize(maxDimension, maxDimension, {
            fit: 'inside',
            withoutEnlargement: true,
          });
        }

        // Convert to JPEG for better compression (unless it's PNG with transparency)
        if (contentType !== 'image/png' || !metadata.hasAlpha) {
          processedBuffer = await sharpInstance.jpeg({ quality, progressive: true }).toBuffer();
          contentType = 'image/jpeg';
        } else {
          // Keep as PNG but optimize
          processedBuffer = await sharpInstance.png({ compressionLevel: 9 }).toBuffer();
        }

        const compressionRatio = (
          ((originalSize - processedBuffer.length) / originalSize) *
          100
        ).toFixed(1);
      } catch (imageError) {
        console.warn('Image processing failed, using original:', imageError);
        processedBuffer = originalBuffer;
      }
    }

    const finalSize = processedBuffer.length;

    await fs.mkdir(categoryDir, { recursive: true });
    await fs.writeFile(filePath, processedBuffer);

    const baseData = { key, url, size: finalSize, contentType, category };

    // Vérifier si l'utilisateur existe avant de l'associer
    let validUserId = null;
    if (userId) {
      const userExists = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });
      if (userExists) {
        validUserId = userId;
      }
    }

    const dbRecord = await prisma.storageObject.create({
      data: validUserId ? { ...baseData, userId: validUserId } : baseData,
    });

    return dbRecord;
  } catch (error) {
    console.error('uploadToStorage error:', error);
    throw error;
  }
}

export async function deleteFromStorage(id: string) {
  const file = await prisma.storageObject.findUnique({ where: { id } });
  if (!file) return false;
  const categoryDir = getCategoryDir(file.category);
  const filePath = path.join(categoryDir, file.key);
  await fs.unlink(filePath);
  await prisma.storageObject.delete({ where: { id } });
  return true;
}

export async function updateStorageFile(id: string, data: ArrayBuffer) {
  const file = await prisma.storageObject.findUnique({ where: { id } });
  if (!file) return false;
  const categoryDir = getCategoryDir(file.category);
  const filePath = path.join(categoryDir, file.key);
  await fs.writeFile(filePath, Buffer.from(data));
  return true;
}
