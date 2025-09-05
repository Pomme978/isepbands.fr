import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/middlewares/admin';

// POST /api/admin/activity
export async function POST(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const body = await req.json();
    const { user: currentUser } = authResult;

    const activity = await prisma.adminActivity.create({
      data: {
        type: body.type || 'custom',
        title: body.title || '',
        description: body.description || '',
        metadata: body.metadata || {},
        userId: body.userId || null,
        createdBy: currentUser.id,
      },
    });

    return NextResponse.json({ success: true, activity });
  } catch (error) {
    console.error('Failed to create activity log:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create activity log.' },
      { status: 500 },
    );
  }
}

// GET /api/admin/activity
export async function GET(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const excludeLoginLogs = searchParams.get('excludeLoginLogs') === 'true';

    // Build where condition
    const whereCondition: Record<string, unknown> = {};
    if (type) {
      whereCondition.type = type;
    }
    if (excludeLoginLogs) {
      whereCondition.type = {
        notIn: ['user_login', 'root_login'],
      };
    }

    const activities = await prisma.adminActivity.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100),
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Get creator names
    const activitiesWithCreatorNames = await Promise.all(
      activities.map(async (activity) => {
        let createdByName = null;
        if (activity.createdBy) {
          try {
            const creator = await prisma.user.findUnique({
              where: { id: activity.createdBy },
              select: { firstName: true, lastName: true },
            });
            if (creator) {
              createdByName = `${creator.firstName} ${creator.lastName}`;
            }
          } catch (error) {
            // Error fetching creator name
          }
        }

        return {
          ...activity,
          createdByName,
        };
      }),
    );

    return NextResponse.json({ success: true, activities: activitiesWithCreatorNames });
  } catch (error) {
    console.error('Failed to fetch activity log:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activity log.' },
      { status: 500 },
    );
  }
}
