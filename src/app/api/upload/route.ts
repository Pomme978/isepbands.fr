import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middlewares/auth';
import { uploadToStorage } from '@/lib/storageService';

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;

  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files.length) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      if (typeof file === 'string') return null;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error(`Le fichier ${file.name} n'est pas une image`);
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error(`Le fichier ${file.name} est trop volumineux (max 10MB)`);
      }

      const dbFile = await uploadToStorage(file, auth.user.id);
      return dbFile.url;
    });

    const urls = await Promise.all(uploadPromises);
    const validUrls = urls.filter(Boolean) as string[];

    return NextResponse.json({
      urls: validUrls,
      count: validUrls.length,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur lors de l'upload" },
      { status: 500 },
    );
  }
}
