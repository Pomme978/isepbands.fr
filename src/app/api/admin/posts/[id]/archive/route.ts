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

    // First try to get post details for logging
    let postDetails = null;
    try {
      const adminActivityPost = await prisma.adminActivity.findUnique({
        where: { id: postId },
        select: { title: true, type: true },
      });
      if (adminActivityPost) {
        postDetails = { title: adminActivityPost.title, source: 'adminActivity' };
      } else {
        const publicFeedPost = await prisma.publicFeed.findUnique({
          where: { id: postId },
          select: { title: true, type: true },
        });
        if (publicFeedPost) {
          postDetails = { title: publicFeedPost.title, source: 'publicFeed' };
        }
      }
    } catch (error) {
      console.log('Error getting post details:', error);
    }

    if (!postDetails) {
      return NextResponse.json({ success: false, error: 'Post non trouvé' }, { status: 404 });
    }

    // Now archive the post in the appropriate table
    let updated = false;
    if (postDetails.source === 'adminActivity') {
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
        console.log('Failed to archive from adminActivity table');
      }
    } else {
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
        console.log('Failed to archive from publicFeed table');
      }
    }

    if (!updated) {
      return NextResponse.json({ success: false, error: "Échec de l'archivage" }, { status: 500 });
    }

    // Create admin log for the archive action
    try {
      const adminUser = await prisma.user.findUnique({
        where: { id: authResult.user.id },
        select: { firstName: true, lastName: true },
      });

      const adminName = adminUser ? `${adminUser.firstName} ${adminUser.lastName}` : 'Admin';

      await prisma.adminActivity.create({
        data: {
          type: 'post_archived',
          title: 'Publication archivée',
          description: `${adminName} a archivé la publication **"${postDetails.title}"**${reason !== 'Archivé par un administrateur' ? `\n\nRaison: ${reason}` : ''}`,
          createdBy: authResult.user.id,
          userId: authResult.user.id,
          metadata: JSON.stringify({
            action: 'archive_post',
            postId: postId,
            postTitle: postDetails.title,
            postSource: postDetails.source,
            reason: reason,
          }),
        },
      });
    } catch (logError) {
      console.error('Failed to create admin log:', logError);
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

    // First try to get post details for logging
    let postDetails = null;
    try {
      const adminActivityPost = await prisma.adminActivity.findUnique({
        where: { id: postId },
        select: { title: true, type: true },
      });
      if (adminActivityPost) {
        postDetails = { title: adminActivityPost.title, source: 'adminActivity' };
      } else {
        const publicFeedPost = await prisma.publicFeed.findUnique({
          where: { id: postId },
          select: { title: true, type: true },
        });
        if (publicFeedPost) {
          postDetails = { title: publicFeedPost.title, source: 'publicFeed' };
        }
      }
    } catch (error) {
      console.log('Error getting post details:', error);
    }

    if (!postDetails) {
      return NextResponse.json({ success: false, error: 'Post non trouvé' }, { status: 404 });
    }

    // Now unarchive the post in the appropriate table
    let updated = false;
    if (postDetails.source === 'adminActivity') {
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
        console.log('Failed to unarchive from adminActivity table');
      }
    } else {
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
        console.log('Failed to unarchive from publicFeed table');
      }
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Échec de la restauration' },
        { status: 500 },
      );
    }

    // Create admin log for the restore action
    try {
      const adminUser = await prisma.user.findUnique({
        where: { id: authResult.user.id },
        select: { firstName: true, lastName: true },
      });

      const adminName = adminUser ? `${adminUser.firstName} ${adminUser.lastName}` : 'Admin';

      await prisma.adminActivity.create({
        data: {
          type: 'post_restored',
          title: 'Publication restaurée',
          description: `${adminName} a restauré la publication **"${postDetails.title}"** depuis les archives`,
          createdBy: authResult.user.id,
          userId: authResult.user.id,
          metadata: JSON.stringify({
            action: 'restore_post',
            postId: postId,
            postTitle: postDetails.title,
            postSource: postDetails.source,
          }),
        },
      });
    } catch (logError) {
      console.error('Failed to create admin log:', logError);
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
