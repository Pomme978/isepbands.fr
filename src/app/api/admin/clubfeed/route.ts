import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { requireAuth } from '@/middlewares/auth';
import { checkAdminPermission } from '@/middlewares/admin';
import { getAllAdminActivityLogs } from '@/services/activityLogService';
import { createPublicFeedItem } from '@/services/publicFeedService';

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

    // Admin dashboard shows only admin activity logs (system logs)
    const activities = await getAllAdminActivityLogs(50);

    // Transform activities for the frontend
    const transformedActivities = await Promise.all(
      activities.map(async (activity) => {
        // Get the highest weight role (most important role) for target user
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

        // Get info about who performed the action
        let createdByName = null;
        let createdByRole = null;
        if (activity.createdBy) {
          try {
            const creator = await prisma.user.findUnique({
              where: { id: activity.createdBy },
              select: {
                firstName: true,
                lastName: true,
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
            if (creator) {
              createdByName = `${creator.firstName} ${creator.lastName}`;
              // Get the highest weight role for creator
              if (creator.roles && creator.roles.length > 0) {
                const sortedRoles = creator.roles.sort((a, b) => b.role.weight - a.role.weight);
                const topRole = sortedRoles[0].role;
                const useFeminine =
                  creator.pronouns &&
                  (creator.pronouns.toLowerCase().includes('she') ||
                    creator.pronouns.toLowerCase().includes('elle'));
                createdByRole = useFeminine ? topRole.nameFrFemale : topRole.nameFrMale;
              }
            }
          } catch (error) {
            // Error fetching creator info
          }
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
          createdByName: createdByName,
          createdByRole: createdByRole,
        };
      })
    );

    return NextResponse.json({ activities: transformedActivities });
  } catch (error) {
    // Return empty array if table doesn't exist yet
    return NextResponse.json({ activities: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const auth = await requireAuth(req);
    if (!auth.ok) {
      return auth.res;
    }

    // Check admin permission
    const adminCheck = await checkAdminPermission(auth.user);
    if (!adminCheck.hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    const { type, title, description } = body;

    // Determine if this should be a public post or admin log
    const publicTypes = ['new_member', 'post', 'event', 'announcement', 'custom'];
    const isPublicPost = publicTypes.includes(type || 'custom');

    // First, verify the user exists in the database
    const userExists = await prisma.user.findUnique({
      where: { id: auth.user.id },
      select: { id: true, firstName: true, lastName: true },
    });

    if (!userExists) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Create activity in appropriate table
    let activity;
    let activityLog;
    try {
      if (isPublicPost) {
        // 1. Create the public post
        activity = await createPublicFeedItem({
          userId: auth.user.id,
          type: type === 'custom' ? 'post' : type,
          title: title || '',
          description: description || '',
          metadata: {},
        });

        // 2. Create admin log of this action
        const userName = userExists ? `${userExists.firstName} ${userExists.lastName}` : 'Admin';
        const logTitle = `Publication sur le feed public`;
        const logDescription = `${userName} a publié "${title}"${description ? `\n\nContenu: ${description}` : ''}`;
        
        activityLog = await prisma.adminActivity.create({
          data: {
            type: 'system_announcement',
            title: logTitle,
            description: logDescription,
            createdBy: auth.user.id,
            userId: auth.user.id,
            metadata: { 
              publicPostId: activity.id,
              action: 'post_published',
              postType: activity.type,
              postTitle: title
            },
          },
        });
      } else {
        activity = await prisma.adminActivity.create({
          data: {
            type: type || 'system_announcement',
            title,
            description: description || null,
            createdBy: auth.user.id,
            userId: auth.user.id,
            metadata: {},
          },
        });
      }
    } catch (error) {
      throw error;
    }


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
      // Could not fetch user details, using default name
    }

    return NextResponse.json({
      activity: {
        id: activity.id,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        userId: activity.userId,
        userName: userName,
        userAvatar: userExists?.photoUrl || null,
        userRole: userRole,
        metadata: activity.metadata,
        createdAt: activity.createdAt,
        createdBy: isPublicPost ? null : activity.createdBy, // Public feed has no createdBy
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to create activity',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
