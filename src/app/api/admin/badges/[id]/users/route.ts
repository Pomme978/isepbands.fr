import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/utils/authMiddleware';

// GET - Get all users with a specific badge
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const badgeIdIndex = pathParts.indexOf('badges') + 1;
    const id = parseInt(pathParts[badgeIdIndex] || '0');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID du badge manquant' }, { status: 400 });
    }

    // Check if badge exists
    const badgeDefinition = await prisma.badgeDefinition.findUnique({
      where: { id },
    });

    if (!badgeDefinition) {
      return NextResponse.json({ success: false, error: 'Badge non trouvé' }, { status: 404 });
    }

    // Get all users who have this badge
    const usersWithBadge = await prisma.badge.findMany({
      where: {
        badgeDefinitionId: id,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            photoUrl: true,
          },
        },
      },
      orderBy: {
        assignedAt: 'desc',
      },
    });

    // Format the response
    const users = usersWithBadge.map((badge) => ({
      id: badge.user.id,
      firstName: badge.user.firstName,
      lastName: badge.user.lastName,
      email: badge.user.email,
      photoUrl: badge.user.photoUrl,
      assignedAt: badge.assignedAt,
    }));

    return NextResponse.json({
      success: true,
      badge: {
        id: badgeDefinition.id,
        key: badgeDefinition.key,
        labelFr: badgeDefinition.labelFr,
        labelEn: badgeDefinition.labelEn,
      },
      users,
      count: users.length,
    });
  } catch (error) {
    console.error('Error fetching users with badge:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 },
    );
  }
}
