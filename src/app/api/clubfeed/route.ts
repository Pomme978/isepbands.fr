import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  try {
    // Fetch public activities (no auth required for reading)
    // For now, return mock data until Activity table is properly set up
    const activities = await prisma.activity
      .findMany({
        where: {
          isArchived: false, // Exclure les posts archivés
        },
        orderBy: { createdAt: 'desc' },
        take: 20, // Limit to recent activities
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
    console.error('Error fetching public activities:', error);
    // Return empty array if table doesn't exist yet
    return NextResponse.json({ activities: [] });
  }
}
