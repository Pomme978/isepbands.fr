import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/utils/authMiddleware';

export async function POST(req: NextRequest, { params }: { params: Promise<{ venueId: string }> }) {
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

    const { venueId } = await params;

    // Archive the venue
    await prisma.venue.update({
      where: { id: venueId },
      data: {
        isArchived: true,
        archivedAt: new Date(),
        archivedBy: authResult.user.id,
        archiveReason: reason,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Venue archivé avec succès',
    });
  } catch (error) {
    console.error('Error archiving venue:', error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'archivage du venue" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ venueId: string }> }) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult instanceof NextResponse) return authResult;

    const { venueId } = await params;

    // Unarchive the venue
    await prisma.venue.update({
      where: { id: venueId },
      data: {
        isArchived: false,
        archivedAt: null,
        archivedBy: null,
        archiveReason: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Venue désarchivé avec succès',
    });
  } catch (error) {
    console.error('Error unarchiving venue:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors du désarchivage du venue' },
      { status: 500 },
    );
  }
}
