import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma';

export async function GET(req: NextRequest) {
  try {
    // Fetch public activities (no auth required for reading)
    // For now, return mock data until Activity table is properly set up
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20, // Limit to recent activities
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
    console.error('Error fetching public activities:', error);
    // Return empty array if table doesn't exist yet
    return NextResponse.json({ activities: [] });
  }
}