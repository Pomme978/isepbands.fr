import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/utils/authMiddleware';

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult instanceof NextResponse) return authResult;

    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const sortBy = url.searchParams.get('sortBy') || 'newest';
    const dateRange = url.searchParams.get('dateRange') || 'all';

    // Build where clause for archived users
    const whereClause: {
      status: 'DELETED';
      OR?: Array<{
        firstName?: { contains: string; mode: 'insensitive' };
        lastName?: { contains: string; mode: 'insensitive' };
        email?: { contains: string; mode: 'insensitive' };
      }>;
      archivedAt?: { gte: Date };
    } = {
      status: 'DELETED',
    };

    // Search filter
    if (search) {
      whereClause.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Date range filter
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      let startDate;

      switch (dateRange) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'quarter':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
      }

      if (startDate) {
        whereClause.archivedAt = {
          gte: startDate,
        };
      }
    }

    // Build order by clause
    let orderBy: { archivedAt: 'desc' | 'asc' } | { firstName: 'asc' } = { archivedAt: 'desc' };

    switch (sortBy) {
      case 'oldest':
        orderBy = { archivedAt: 'asc' };
        break;
      case 'alphabetical':
        orderBy = [{ firstName: 'asc' }, { lastName: 'asc' }];
        break;
      case 'newest':
      default:
        orderBy = { archivedAt: 'desc' };
        break;
    }

    console.log('Searching for archived users with clause:', whereClause);

    const archivedUsers = await prisma.user.findMany({
      where: whereClause,
      orderBy,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        photoUrl: true,
        promotion: true,
        status: true,
        archivedAt: true,
        archivedBy: true,
      },
    });

    console.log(`Found ${archivedUsers.length} archived users`);

    // Get unique archivedBy IDs to fetch user names
    const archivedByIds = [
      ...new Set(archivedUsers.map((user) => user.archivedBy).filter((id) => id !== null)),
    ] as string[];

    // Fetch the users who did the archiving
    const archivedByUsers = await prisma.user.findMany({
      where: {
        id: {
          in: archivedByIds,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    // Create a map for quick lookup
    const archivedByUserMap = new Map(
      archivedByUsers.map((user) => [user.id, `${user.firstName} ${user.lastName}`]),
    );

    const users = archivedUsers.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      promotion: user.promotion,
      photoUrl: user.photoUrl,
      archivedAt: user.archivedAt?.toISOString(),
      archivedBy: user.archivedBy
        ? archivedByUserMap.get(user.archivedBy) || 'Utilisateur inconnu'
        : 'Système',
      status: user.status,
    }));

    return NextResponse.json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error) {
    console.error('Error fetching archived users:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des utilisateurs archivés' },
      { status: 500 },
    );
  }
}
