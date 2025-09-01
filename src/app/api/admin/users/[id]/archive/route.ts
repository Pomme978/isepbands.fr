import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/admin';
import { prisma } from '@/lib/prisma';
import { logAdminAction } from '@/services/activityLogService';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) return authResult.res;

  try {
    const userId = params.id;
    const currentUserId = authResult.user?.id; // Get the ID of the user performing the archive

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

    // Log admin action
    await logAdminAction(
      currentUserId || authResult.user.id,
      'user_archived',
      'Utilisateur archivé',
      `**${user.firstName} ${user.lastName}** (${user.email}) a été archivé`,
      userId,
      {
        userEmail: user.email,
        previousStatus: user.status,
        archivedAt: new Date().toISOString()
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Utilisateur archivé avec succès',
    });
  } catch (error) {
    console.error('Error archiving user:', error);
    return NextResponse.json({ error: "Erreur lors de l'archivage" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) return authResult.res;

  try {
    const userId = params.id;
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

    // Log admin action
    await logAdminAction(
      currentUserId || authResult.user.id,
      'user_restored',
      'Utilisateur restauré',
      `**${user.firstName} ${user.lastName}** (${user.email}) a été restauré depuis les archives`,
      userId,
      {
        userEmail: user.email,
        previousStatus: user.status,
        restoredAt: new Date().toISOString(),
        wasArchivedBy: user.archivedBy
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Utilisateur restauré avec succès',
    });
  } catch (error) {
    console.error('Error restoring user:', error);
    return NextResponse.json({ error: "Erreur lors de la restauration" }, { status: 500 });
  }
}
