import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middlewares/auth';

import {
  getFromStorageById,
  getFileBuffer,
  uploadToStorage,
  deleteFromStorage,
} from '@/lib/storageService';

const STORAGE_CATEGORY = 'avatars';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
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
      error: 'File size must not exceed 5MB',
    };
  }

  return { valid: true };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing file ID' }, { status: 400 });
  }

  const file = await getFromStorageById(id);
  if (!file || file.category !== STORAGE_CATEGORY) {
    return NextResponse.json({ error: 'Avatar not found' }, { status: 404 });
  }

  try {
    const buffer = await getFileBuffer(file.key, file.category);
    if (!buffer || buffer.byteLength === 0) {
      return NextResponse.json({ error: 'Avatar file is empty or corrupted' }, { status: 404 });
    }

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': file.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Disposition': `inline; filename="${file.key}"`,
      },
    });
  } catch (error) {
    console.error('Error serving avatar:', error);
    return NextResponse.json({ error: 'Avatar file not found' }, { status: 404 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  const sessionUser = auth.user;
  if (!sessionUser) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 403 });
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
    const imageUrl = `/api/storage/avatars?id=${dbFile.id}`;

    return NextResponse.json({
      success: true,
      file: dbFile,
      url: imageUrl,
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    let userMessage;
    if (errorMessage.includes('ENOENT') || errorMessage.includes('EACCES')) {
      userMessage = 'File permissions error';
    } else if (errorMessage.includes('ENOSPC')) {
      userMessage = 'Insufficient disk space';
    } else if (errorMessage.includes('EMFILE') || errorMessage.includes('ENFILE')) {
      userMessage = 'Too many open files';
    } else {
      userMessage = 'Unable to save file';
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
    return NextResponse.json({ error: 'Missing file ID' }, { status: 400 });
  }

  const file = await getFromStorageById(id);
  if (!file || file.category !== STORAGE_CATEGORY) {
    return NextResponse.json({ error: 'Avatar not found' }, { status: 404 });
  }

  // Check ownership - user IDs are strings, not numbers
  const isOwner = sessionUser.id && file.userId && sessionUser.id === file.userId;

  // Check admin status
  const hasAdminRole = sessionUser.roles?.some((r: { role?: { name: string } }) =>
    ['president', 'vice_president', 'secretary', 'treasurer'].includes(r.role?.name),
  );
  const isAdmin = sessionUser.isFullAccess || sessionUser.isRoot || hasAdminRole;

  if (!isOwner && !isAdmin) {
    return NextResponse.json(
      { error: 'Forbidden - You do not have permission to delete this avatar' },
      { status: 403 },
    );
  }

  try {
    await deleteFromStorage(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting avatar:', error);
    return NextResponse.json({ error: 'Avatar file not found' }, { status: 404 });
  }
}
