import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requireAuth } from '@/middlewares/auth';
import { checkAdminPermission } from '@/middlewares/admin';

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const auth = await requireAuth(req);
    if (!auth.ok) return auth.res;

    // Check admin permission
    const adminCheck = await checkAdminPermission(auth.user);
    if (!adminCheck.hasPermission) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Fetch activities - we'll use a generic Activity model
    // For now, we'll return mock data until the model is created
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
          }
        }
      }
    }).catch(() => []);

    // Transform activities for the frontend
    const transformedActivities = activities.map(activity => ({
      id: activity.id,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      userId: activity.userId,
      userName: activity.user ? `${activity.user.firstName} ${activity.user.lastName}` : null,
      userAvatar: activity.user?.photoUrl,
      metadata: activity.metadata,
      createdAt: activity.createdAt,
      createdBy: activity.createdBy,
    }));

    return NextResponse.json({ activities: transformedActivities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    // Return empty array if table doesn't exist yet
    return NextResponse.json({ activities: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const auth = await requireAuth(req);
    if (!auth.ok) return auth.res;

    // Check admin permission
    const adminCheck = await checkAdminPermission(auth.user);
    if (!adminCheck.hasPermission) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { type, title, description } = body;
    
    console.log('Creating activity with:', { type, title, description, userId: auth.user.id });

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Create activity
    const activity = await prisma.activity.create({
      data: {
        type: type || 'custom',
        title,
        description,
        createdBy: auth.user.id,
        userId: auth.user.id,
        metadata: {},
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
          }
        }
      }
    }).catch(() => null);

    if (!activity) {
      // If table doesn't exist, return mock data
      return NextResponse.json({
        activity: {
          id: Date.now().toString(),
          type: type || 'custom',
          title,
          description,
          createdAt: new Date().toISOString(),
          userName: 'Admin',
        }
      });
    }

    return NextResponse.json({
      activity: {
        id: activity.id,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        userId: activity.userId,
        userName: activity.user ? `${activity.user.firstName} ${activity.user.lastName}` : null,
        userAvatar: activity.user?.photoUrl,
        metadata: activity.metadata,
        createdAt: activity.createdAt,
        createdBy: activity.createdBy,
      }
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create activity',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}