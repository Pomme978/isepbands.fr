import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/utils/authMiddleware';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id: postId } = await params;

    // First try to archive from adminActivity table
    let updated = false;
    try {
      await prisma.adminActivity.update({
        where: { id: postId },
        data: {
          isArchived: true,
          archivedAt: new Date(),
          archivedBy: authResult.user.id,
          archiveReason: reason,
        },
      });
      updated = true;
    } catch (adminActivityError) {
      console.log('Not found in adminActivity table, trying publicFeed...');
    }

    // If not found in adminActivity, try publicFeed table
    if (!updated) {
      try {
        await prisma.publicFeed.update({
          where: { id: postId },
          data: {
            isArchived: true,
            archivedAt: new Date(),
            archivedBy: authResult.user.id,
            archiveReason: reason,
          },
        });
        updated = true;
      } catch (publicFeedError) {
        console.log('Not found in publicFeed table either');
      }
    }

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Post non trouvé' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Post archivé avec succès',
    });
  } catch (error) {
    console.error('Error archiving post:', error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'archivage du post" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult instanceof NextResponse) return authResult;

    const { id: postId } = await params;

    // First try to unarchive from adminActivity table
    let updated = false;
    try {
      await prisma.adminActivity.update({
        where: { id: postId },
        data: {
          isArchived: false,
          archivedAt: null,
          archivedBy: null,
          archiveReason: null,
        },
      });
      updated = true;
    } catch (adminActivityError) {
      console.log('Not found in adminActivity table, trying publicFeed...');
    }

    // If not found in adminActivity, try publicFeed table
    if (!updated) {
      try {
        await prisma.publicFeed.update({
          where: { id: postId },
          data: {
            isArchived: false,
            archivedAt: null,
            archivedBy: null,
            archiveReason: null,
          },
        });
        updated = true;
      } catch (publicFeedError) {
        console.log('Not found in publicFeed table either');
      }
    }

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Post non trouvé' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Post désarchivé avec succès',
    });
  } catch (error) {
    console.error('Error unarchiving post:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors du désarchivage du post' },
      { status: 500 },
    );
  }
}
