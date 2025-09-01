import { NextRequest, NextResponse } from 'next/server';
import { detectLangFromRequest, getErrorMessage } from '@/lib/i18n-api';
import { requireAuth } from '@/middlewares/auth';

import {
  getFromStorageById,
  getAllStorage,
  getFileBuffer,
  uploadToStorage,
  deleteFromStorage,
  updateStorageFile,
} from '@/lib/storageService';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (id) {
    const file = await getFromStorageById(id);
    if (!file) {
      const lang = detectLangFromRequest(req);
      return NextResponse.json({ error: await getErrorMessage('notFound', lang) }, { status: 404 });
    }
    try {
      const buffer = await getFileBuffer(file.key);
      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          'Content-Type': file.contentType,
          'Content-Disposition': `attachment; filename="${file.key}"`,
        },
      });
    } catch {
      const lang = detectLangFromRequest(req);
      return NextResponse.json(
        { error: await getErrorMessage('fileNotFound', lang) },
        { status: 404 },
      );
    }
  } else {
    const files = await getAllStorage();
    return NextResponse.json({ files });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  const sessionUser = auth.user;
  if (!sessionUser) {
    const lang = detectLangFromRequest(req);
    return NextResponse.json({ error: await getErrorMessage('forbidden', lang) }, { status: 403 });
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
  try {
    const dbFile = await uploadToStorage(file, Number(sessionUser.id));
    return NextResponse.json({ success: true, file: dbFile });
  } catch (error) {
    console.error('Storage upload error:', error);
    const lang = detectLangFromRequest(req);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Provide more specific error messages based on the error type
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
//

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
  if (!file) {
    const lang = detectLangFromRequest(req);
    return NextResponse.json({ error: await getErrorMessage('notFound', lang) }, { status: 404 });
  }
  // Check ownership - user IDs are strings, not numbers
  const isOwner = sessionUser.id && file.userId && sessionUser.id === file.userId;

  // Check admin status - multiple ways to be admin
  const hasAdminRole = sessionUser.roles?.some((r: { role?: { name: string } }) =>
    ['president', 'vice_president', 'secretary', 'treasurer'].includes(r.role?.name),
  );
  const isAdmin = sessionUser.isFullAccess || sessionUser.isRoot || hasAdminRole;


  if (!isOwner && !isAdmin) {
    return NextResponse.json(
      { error: 'Forbidden - You do not have permission to delete this file' },
      { status: 403 },
    );
  }

  try {
    await deleteFromStorage(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    const lang = detectLangFromRequest(req);
    return NextResponse.json(
      { error: await getErrorMessage('fileNotFound', lang) },
      { status: 404 },
    );
  }
}

export async function PUT(req: NextRequest) {
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
  if (!file) {
    const lang = detectLangFromRequest(req);
    return NextResponse.json({ error: await getErrorMessage('notFound', lang) }, { status: 404 });
  }
  // Check ownership - user IDs are strings, not numbers
  const isOwner = sessionUser.id && file.userId && sessionUser.id === file.userId;
  // Also allow admins to delete any file
  const isAdmin = sessionUser.isFullAccess || sessionUser.isRoot;

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const data = await req.arrayBuffer();
    await updateStorageFile(id, data);
    return NextResponse.json({ success: true });
  } catch {
    const lang = detectLangFromRequest(req);
    return NextResponse.json(
      { error: await getErrorMessage('unableToWrite', lang) },
      { status: 500 },
    );
  }
}
//
