import fs from 'fs/promises';
import path from 'path';

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
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = file.type;
  const key = randomUUID();
  const filePath = path.join(UPLOADS_DIR, key);
  const url = `/storage/uploads/${key}`;
  const size = buffer.length;
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.writeFile(filePath, buffer);
  const baseData = { key, url, size, contentType };
  return prisma.storageObject.create({
    data: userId ? { ...baseData, userId: userId } : baseData,
  });
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
