import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/users/[id]/activity-log
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: userId } = await params;
  try {
    const activities = await prisma.adminActivity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        // Inclure les informations de l'utilisateur concerné par l'activité
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Récupérer les noms des utilisateurs ayant créé les activités
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
      })
    );

    return NextResponse.json({ success: true, activities: activitiesWithCreatorNames });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activity log.' },
      { status: 500 },
    );
  }
}

// POST /api/admin/users/[id]/activity-log
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: userId } = await params;
  const body = await req.json();
  try {
    const activity = await prisma.adminActivity.create({
      data: {
        userId,
        type: body.type || 'custom',
        title: body.title || '',
        description: body.description || '',
        metadata: body.metadata || {},
        createdBy: body.createdBy || null,
      },
    });
    return NextResponse.json({ success: true, activity });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create activity log.' },
      { status: 500 },
    );
  }
}
