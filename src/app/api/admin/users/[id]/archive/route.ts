import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middlewares/auth';
import { prisma } from '@/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;

  try {
    const userId = params.id;
    const currentUserId = auth.user?.id; // Get the ID of the user performing the archive

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

    if (user.status === 'DELETED') {
      return NextResponse.json({ error: "L'utilisateur est déjà archivé" }, { status: 400 });
    }

    // Update user status to DELETED (archived) with archive metadata
    await prisma.user.update({
      where: { id: userId },
      data: { 
        status: 'DELETED',
        archivedAt: new Date(),
        archivedBy: currentUserId || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Utilisateur archivé avec succès',
    });
  } catch (error) {
    console.error('Error archiving user:', error);
    return NextResponse.json({ error: "Erreur lors de l'archivage" }, { status: 500 });
  }
}
