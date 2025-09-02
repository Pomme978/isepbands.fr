import { NextRequest, NextResponse } from 'next/server';
import { deletePublicFeedItem, getPublicFeedById } from '@/services/publicFeedService';
import { requireAuth } from '@/middlewares/auth';
import { checkAdminPermission } from '@/middlewares/admin';
import { logAdminAction } from '@/services/activityLogService';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const auth = await requireAuth(req);
    if (!auth.ok) return auth.res;

    // Get the post before deleting to check ownership
    const post = await getPublicFeedById(params.id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if user can delete: owner or full access admin
    const isOwner = post.userId === auth.user.id;
    const adminCheck = await checkAdminPermission(auth.user);
    const isFullAccess = adminCheck.hasPermission && auth.user.isFullAccess;

    if (!isOwner && !isFullAccess) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Delete the post
    await deletePublicFeedItem(params.id);

    // Log admin action
    await logAdminAction(
      auth.user.id,
      'post_deleted',
      'Publication supprimée',
      `**${post.title || 'Post sans titre'}** a été supprimé${isOwner ? ' par son auteur' : ' par un administrateur'}`,
      post.userId,
      {
        postId: params.id,
        postTitle: post.title,
        deletedByOwner: isOwner,
        deletedByAdmin: isFullAccess
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}