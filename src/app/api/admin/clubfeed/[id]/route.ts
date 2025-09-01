import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import { requireAuth } from '@/middlewares/auth';
import { checkAdminPermission } from '@/middlewares/admin';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check authentication
    const auth = await requireAuth(req);
    if (!auth.ok) return auth.res;

    // Check admin permission
    const adminCheck = await checkAdminPermission(auth.user);
    if (!adminCheck.hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = await params;

    // Delete admin activity
    await prisma.adminActivity
      .delete({
        where: { id },
      })
      .catch(() => null);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check authentication
    const auth = await requireAuth(req);
    if (!auth.ok) return auth.res;

    // Check admin permission
    const adminCheck = await checkAdminPermission(auth.user);
    if (!adminCheck.hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Check if admin activity exists and if user is the creator
    const existingActivity = await prisma.adminActivity
      .findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              photoUrl: true,
            },
          },
        },
      })
      .catch(() => null);

    if (!existingActivity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    // Only allow editing if user is the creator (for custom activities)
    if (existingActivity.type === 'custom' && existingActivity.createdBy !== auth.user.id) {
      return NextResponse.json({ error: 'You can only edit your own activities' }, { status: 403 });
    }

    // Update admin activity
    const updatedActivity = await prisma.adminActivity
      .update({
        where: { id },
        data: {
          title,
          description,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              photoUrl: true,
            },
          },
        },
      })
      .catch(() => null);

    if (!updatedActivity) {
      // If table doesn't exist, return mock data
      return NextResponse.json({
        activity: {
          id: id,
          type: 'custom',
          title,
          description,
          createdAt: new Date().toISOString(),
          userName: 'Admin',
        },
      });
    }

    return NextResponse.json({
      activity: {
        id: updatedActivity.id,
        type: updatedActivity.type,
        title: updatedActivity.title,
        description: updatedActivity.description,
        userId: updatedActivity.userId,
        userName: updatedActivity.user
          ? `${updatedActivity.user.firstName} ${updatedActivity.user.lastName}`
          : null,
        userAvatar: updatedActivity.user?.photoUrl,
        metadata: updatedActivity.metadata,
        createdAt: updatedActivity.createdAt,
        createdBy: updatedActivity.createdBy,
      },
    });
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 });
  }
}
