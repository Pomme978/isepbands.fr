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
  } catch {
    const lang = detectLangFromRequest(req);
    return NextResponse.json(
      { error: await getErrorMessage('unableToWrite', lang) },
      { status: 500 },
    );
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
  const isOwner = sessionUser.id && file.userId && Number(sessionUser.id) === Number(file.userId);
  if (!isOwner) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    await deleteFromStorage(id);
    return NextResponse.json({ success: true });
  } catch {
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
  const isOwner = sessionUser.id && file.userId && Number(sessionUser.id) === Number(file.userId);
  if (!isOwner) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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
