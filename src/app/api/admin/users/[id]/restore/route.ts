import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/admin';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) return authResult.res;

  try {
    const { id: userId } = await params;
    const currentUserId = authResult.user?.id; // Get the ID of the user performing the restore

    if (!userId) {
      return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    if (user.status !== 'DELETED') {
      return NextResponse.json({ error: "L'utilisateur n'est pas archivé" }, { status: 400 });
    }

    // Update user status to CURRENT (restored) and clear archive metadata
    await prisma.user.update({
      where: { id: userId },
      data: {
        status: 'CURRENT',
        archivedAt: null,
        archivedBy: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Utilisateur restauré avec succès',
    });
  } catch (error) {
    console.error('Error restoring user:', error);
    return NextResponse.json({ error: 'Erreur lors de la restauration' }, { status: 500 });
  }
}
