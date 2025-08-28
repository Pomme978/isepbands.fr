import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

import { randomUUID } from 'crypto';
import { prisma } from '../../lib/prisma';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'storage', 'uploads');
export async function getFromStorageById(id: string) {
  return prisma.storageObject.findUnique({ where: { id } });
}
export async function getAllStorage() {
  return prisma.storageObject.findMany();
}
export async function getFileBuffer(key: string) {
  const filePath = path.join(UPLOADS_DIR, key);
  return fs.readFile(filePath);
}
export async function uploadToStorage(file: File, userId?: string) {
  try {
    const originalBuffer = Buffer.from(await file.arrayBuffer());
    const originalSize = originalBuffer.length;
    let contentType = file.type;
    const key = randomUUID();
    const filePath = path.join(UPLOADS_DIR, key);
    const url = `/storage/uploads/${key}`;

    // Validate original file size (max 10MB)
    if (originalSize > 10 * 1024 * 1024) {
      throw new Error('File size exceeds 10MB limit');
    }

    // Validate content type
    if (!contentType.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    console.log(`Processing image: ${file.name} (${originalSize} bytes)`);

    let processedBuffer = originalBuffer;

    // Process image if it's an image file
    if (contentType.startsWith('image/')) {
      try {
        // Get image metadata
        const metadata = await sharp(originalBuffer).metadata();
        console.log('Original image dimensions:', {
          width: metadata.width,
          height: metadata.height,
        });

        // Resize and compress the image
        const maxDimension = 800; // Max width or height
        const quality = 85; // JPEG quality

        let sharpInstance = sharp(originalBuffer);

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
        console.log(
          `Image processed: ${originalSize} -> ${processedBuffer.length} bytes (${compressionRatio}% reduction)`,
        );
      } catch (imageError) {
        console.warn('Image processing failed, using original:', imageError);
        processedBuffer = originalBuffer;
      }
    }

    const finalSize = processedBuffer.length;

    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    await fs.writeFile(filePath, processedBuffer);

    console.log('File written successfully, creating database record');

    const baseData = { key, url, size: finalSize, contentType };
    const dbRecord = await prisma.storageObject.create({
      data: userId ? { ...baseData, userId: userId } : baseData,
    });

    console.log('Database record created:', dbRecord.id);

    return dbRecord;
  } catch (error) {
    console.error('uploadToStorage error:', error);
    throw error;
  }
}

export async function deleteFromStorage(id: string) {
  const file = await prisma.storageObject.findUnique({ where: { id } });
  if (!file) return false;
  const filePath = path.join(UPLOADS_DIR, file.key);
  await fs.unlink(filePath);
  await prisma.storageObject.delete({ where: { id } });
  return true;
}

export async function updateStorageFile(id: string, data: ArrayBuffer) {
  const file = await prisma.storageObject.findUnique({ where: { id } });
  if (!file) return false;
  const filePath = path.join(UPLOADS_DIR, file.key);
  await fs.writeFile(filePath, Buffer.from(data));
  return true;
}
