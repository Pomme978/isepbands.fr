import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/utils/authMiddleware';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult instanceof NextResponse) return authResult;

    let reason = 'Archivé par un administrateur';

    try {
      const body = await req.json();
      reason = body.reason || reason;
    } catch (e) {
      // No JSON body provided, use default reason
    }

    const userId = params.id;

    // Archive the user by changing status to ARCHIVED
    await prisma.user.update({
      where: { id: userId },
      data: {
        status: 'ARCHIVED',
        isArchived: true,
        archivedAt: new Date(),
        archivedBy: authResult.user.id,
        archiveReason: reason,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Utilisateur archivé avec succès',
    });
  } catch (error) {
    console.error('Error archiving user:', error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'archivage de l'utilisateur" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult instanceof NextResponse) return authResult;

    const userId = params.id;

    // Unarchive the user by restoring to CURRENT status
    await prisma.user.update({
      where: { id: userId },
      data: {
        status: 'CURRENT',
        isArchived: false,
        archivedAt: null,
        archivedBy: null,
        archiveReason: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Utilisateur désarchivé avec succès',
    });
  } catch (error) {
    console.error('Error unarchiving user:', error);
    return NextResponse.json(
      { success: false, error: "Erreur lors du désarchivage de l'utilisateur" },
      { status: 500 },
    );
  }
}
