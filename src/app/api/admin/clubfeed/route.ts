import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
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
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Fetch admin activities - includes ALL activity types including system logs
    const activities = await prisma.adminActivity
      .findMany({
        where: {
          isArchived: false, // Exclure les posts archivés
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              photoUrl: true,
              pronouns: true,
              roles: {
                include: {
                  role: {
                    select: {
                      nameFrFemale: true,
                      nameFrMale: true,
                      weight: true,
                    },
                  },
                },
              },
            },
          },
        },
      })
      .catch(() => []);

    // Transform activities for the frontend
    const transformedActivities = activities.map((activity) => {
      // Get the highest weight role (most important role)
      let userRole = null;
      if (activity.user?.roles && activity.user.roles.length > 0) {
        const sortedRoles = activity.user.roles.sort((a, b) => b.role.weight - a.role.weight);
        const topRole = sortedRoles[0].role;
        // Use appropriate gender version based on user pronouns
        const useFeminine =
          activity.user.pronouns &&
          (activity.user.pronouns.toLowerCase().includes('she') ||
            activity.user.pronouns.toLowerCase().includes('elle'));
        userRole = useFeminine ? topRole.nameFrFemale : topRole.nameFrMale;
      }

      return {
        id: activity.id,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        userId: activity.userId,
        userName: activity.user ? `${activity.user.firstName} ${activity.user.lastName}` : null,
        userAvatar: activity.user?.photoUrl,
        userRole: userRole,
        metadata: activity.metadata,
        createdAt: activity.createdAt,
        createdBy: activity.createdBy,
      };
    });

    return NextResponse.json({ activities: transformedActivities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    // Return empty array if table doesn't exist yet
    return NextResponse.json({ activities: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/admin/clubfeed - Starting...');

    // Check authentication
    const auth = await requireAuth(req);
    if (!auth.ok) {
      console.log('Authentication failed');
      return auth.res;
    }
    console.log('User authenticated:', { id: auth.user.id, email: auth.user.email });

    // Check admin permission
    const adminCheck = await checkAdminPermission(auth.user);
    if (!adminCheck.hasPermission) {
      console.log('Admin permission check failed');
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }
    console.log('Admin permission granted');

    const body = await req.json();
    const { type, title, description } = body;

    console.log('Creating activity with:', { type, title, description, userId: auth.user.id });

    // First, verify the user exists in the database
    const userExists = await prisma.user.findUnique({
      where: { id: auth.user.id },
      select: { id: true, firstName: true, lastName: true },
    });

    if (!userExists) {
      console.error('User not found in database:', auth.user.id);
      return NextResponse.json({ error: 'User not found in database' }, { status: 400 });
    }

    console.log('User verified in database:', userExists);

    if (!title) {
      console.log('Title validation failed');
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    console.log('About to create activity in database...');
    console.log('Data to be inserted:', {
      type: type || 'custom',
      title,
      description: description || null,
      createdBy: auth.user.id,
      userId: auth.user.id,
      metadata: {},
    });

    // Create admin activity - can include system logs
    let activity;
    try {
      console.log('Creating admin activity with user information...');
      activity = await prisma.adminActivity.create({
        data: {
          type: type || 'custom',
          title,
          description: description || null,
          createdBy: auth.user.id,
          userId: auth.user.id,
          metadata: {},
        },
      });
      console.log('Admin activity created successfully:', activity);
    } catch (error) {
      console.error('Activity creation failed:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        code: (error as Error & { code?: string })?.code,
        meta: (error as Error & { meta?: unknown })?.meta,
        name: (error as Error & { name?: string })?.name,
        fullError: error,
      });
      throw error;
    }

    console.log('Activity created successfully:', activity);

    // Fetch user info separately to avoid relation issues
    let userName = 'Admin';
    let userRole = null;
    try {
      const user = await prisma.user.findUnique({
        where: { id: auth.user.id },
        select: {
          firstName: true,
          lastName: true,
          photoUrl: true,
          pronouns: true,
          roles: {
            include: {
              role: {
                select: {
                  nameFrFemale: true,
                  nameFrMale: true,
                  weight: true,
                },
              },
            },
          },
        },
      });
      if (user) {
        userName = `${user.firstName} ${user.lastName}`;
        // Get the highest weight role
        if (user.roles && user.roles.length > 0) {
          const sortedRoles = user.roles.sort((a, b) => b.role.weight - a.role.weight);
          const topRole = sortedRoles[0].role;
          // Use appropriate gender version based on user pronouns
          const useFeminine =
            user.pronouns &&
            (user.pronouns.toLowerCase().includes('she') ||
              user.pronouns.toLowerCase().includes('elle'));
          userRole = useFeminine ? topRole.nameFrFemale : topRole.nameFrMale;
        }
      }
    } catch {
      console.warn('Could not fetch user details, using default name');
    }

    return NextResponse.json({
      activity: {
        id: activity.id,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        userId: activity.userId,
        userName: userName,
        userAvatar: null, // Will be fetched if needed
        userRole: userRole,
        metadata: activity.metadata,
        createdAt: activity.createdAt,
        createdBy: activity.createdBy,
      },
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      {
        error: 'Failed to create activity',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
