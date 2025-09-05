import { NextRequest, NextResponse } from 'next/server';
import { detectLangFromRequest, getErrorMessage } from '@/lib/i18n-api';
import { requireAuth } from '@/middlewares/auth';

import {
  getFromStorageById,
  getFileBuffer,
  uploadToStorage,
  deleteFromStorage,
} from '@/lib/storageService';

const STORAGE_CATEGORY = 'events';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB for event photos
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif',
];

function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type (including HEIC for iPhone)
  const isValidType =
    ALLOWED_TYPES.includes(file.type.toLowerCase()) ||
    file.name.toLowerCase().endsWith('.heic') ||
    file.name.toLowerCase().endsWith('.heif');

  if (!isValidType) {
    return {
      valid: false,
      error: 'Please select a valid image file (JPEG, PNG, GIF, WebP, HEIC)',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size must not exceed 10MB',
    };
  }

  return { valid: true };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    const lang = detectLangFromRequest(req);
    return NextResponse.json({ error: await getErrorMessage('missingId', lang) }, { status: 400 });
  }

  const file = await getFromStorageById(id);
  if (!file || file.category !== STORAGE_CATEGORY) {
    const lang = detectLangFromRequest(req);
    return NextResponse.json({ error: await getErrorMessage('notFound', lang) }, { status: 404 });
  }

  try {
    const buffer = await getFileBuffer(file.key, file.category);
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': file.contentType,
        'Cache-Control': 'public, max-age=86400', // 1 day cache for events
        'Content-Disposition': `inline; filename="${file.key}"`,
      },
    });
  } catch {
    const lang = detectLangFromRequest(req);
    return NextResponse.json(
      { error: await getErrorMessage('fileNotFound', lang) },
      { status: 404 },
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  const sessionUser = auth.user;
  if (!sessionUser) {
    const lang = detectLangFromRequest(req);
    return NextResponse.json({ error: await getErrorMessage('forbidden', lang) }, { status: 403 });
  }

  // Only admins can upload event photos
  const hasAdminRole = sessionUser.roles?.some((r: { role?: { name: string } }) =>
    ['president', 'vice_president', 'secretary', 'treasurer'].includes(r.role?.name),
  );
  const isAdmin = sessionUser.isFullAccess || sessionUser.isRoot || hasAdminRole;

  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Forbidden - Only admins can upload event photos' },
      { status: 403 },
    );
  }

  const contentType = req.headers.get('content-type') || '';
  if (!contentType.startsWith('multipart/form-data')) {
    return NextResponse.json({ error: 'Invalid content-type' }, { status: 400 });
  }

  const formData = await req.formData();
  const file = formData.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // Validate file
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    const dbFile = await uploadToStorage(file, Number(sessionUser.id), STORAGE_CATEGORY);
    const imageUrl = `/api/storage/events?id=${dbFile.id}`;

    return NextResponse.json({
      success: true,
      file: dbFile,
      url: imageUrl,
    });
  } catch (error) {
    console.error('Event photo upload error:', error);
    const lang = detectLangFromRequest(req);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    let userMessage;
    if (errorMessage.includes('ENOENT') || errorMessage.includes('EACCES')) {
      userMessage = 'Erreur de permissions fichier';
    } else if (errorMessage.includes('ENOSPC')) {
      userMessage = 'Espace disque insuffisant';
    } else if (errorMessage.includes('EMFILE') || errorMessage.includes('ENFILE')) {
      userMessage = 'Trop de fichiers ouverts';
    } else {
      userMessage = await getErrorMessage('unableToWrite', lang);
    }

    return NextResponse.json({ error: userMessage, details: errorMessage }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;
  const sessionUser = auth.user!;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    const lang = detectLangFromRequest(req);
    return NextResponse.json({ error: await getErrorMessage('missingId', lang) }, { status: 400 });
  }

  const file = await getFromStorageById(id);
  if (!file || file.category !== STORAGE_CATEGORY) {
    const lang = detectLangFromRequest(req);
    return NextResponse.json({ error: await getErrorMessage('notFound', lang) }, { status: 404 });
  }

  // Only admins can delete event photos
  const hasAdminRole = sessionUser.roles?.some((r: { role?: { name: string } }) =>
    ['president', 'vice_president', 'secretary', 'treasurer'].includes(r.role?.name),
  );
  const isAdmin = sessionUser.isFullAccess || sessionUser.isRoot || hasAdminRole;

  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Forbidden - Only admins can delete event photos' },
      { status: 403 },
    );
  }

  try {
    await deleteFromStorage(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event photo:', error);
    const lang = detectLangFromRequest(req);
    return NextResponse.json(
      { error: await getErrorMessage('fileNotFound', lang) },
      { status: 404 },
    );
  }
}
