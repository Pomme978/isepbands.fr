import { NextRequest, NextResponse } from 'next/server';
import { createActivityLog } from '@/services/activityLogService';
import { requireAdminAuth } from '@/utils/authMiddleware';
import { promises as fs } from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'team');

async function ensureUploadsDir() {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Le fichier doit être une image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Le fichier ne doit pas dépasser 5MB' }, { status: 400 });
    }

    await ensureUploadsDir();

    // Logger l'upload de photo d'équipe
    try {
      const adminId = String(authResult.user?.id || '');
      await createActivityLog({
        userId: adminId,
        type: 'UPLOAD_TEAM_PHOTO',
        title: 'Upload photo équipe',
        description: `Photo ${file.name} uploadée par admin ${adminId}`,
        metadata: {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        },
        createdBy: adminId,
      });
    } catch {
      // ignore logger errors
    }

    // Generate unique filename
    const ext = path.extname(file.name);
    const timestamp = Date.now();
    const filename = `group-photo-${timestamp}${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/team/${filename}`;

    // Clean up old group photos (keep only the latest)
    try {
      const files = await fs.readdir(UPLOADS_DIR);
      const oldFiles = files
        .filter((f) => f.startsWith('group-photo-') && f !== filename)
        .map((f) => path.join(UPLOADS_DIR, f));

      await Promise.all(oldFiles.map((f) => fs.unlink(f).catch(() => {})));
    } catch (cleanupError) {
      console.error('Error cleaning up old files:', cleanupError);
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
    });
  } catch (error) {
    console.error('Error uploading team photo:', error);
    return NextResponse.json({ error: "Erreur lors de l'upload de la photo" }, { status: 500 });
  }
}
