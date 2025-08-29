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

    // Build where clause for archived posts
    const whereClause: {
      isArchived: boolean;
      OR?: Array<{
        title?: { contains: string; mode: 'insensitive' };
        description?: { contains: string; mode: 'insensitive' };
      }>;
      archivedAt?: { gte: Date };
    } = {
      isArchived: true,
    };

    // Search filter
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
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
    let orderBy: { archivedAt: 'desc' | 'asc' } | { title: 'asc' } = { archivedAt: 'desc' };

    switch (sortBy) {
      case 'oldest':
        orderBy = { archivedAt: 'asc' };
        break;
      case 'alphabetical':
        orderBy = { title: 'asc' };
        break;
      case 'newest':
      default:
        orderBy = { archivedAt: 'desc' };
        break;
    }

    const archivedPosts = await prisma.activity.findMany({
      where: whereClause,
      orderBy,
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        createdAt: true,
        archivedAt: true,
        archivedBy: true,
        archiveReason: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Get unique archivedBy IDs to fetch user names
    const archivedByIds = [
      ...new Set(archivedPosts.map((post) => post.archivedBy).filter((id) => id !== null)),
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

    const posts = archivedPosts.map((post) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      type: post.type,
      createdAt: post.createdAt?.toISOString(),
      archivedAt: post.archivedAt?.toISOString(),
      archivedBy: post.archivedBy
        ? archivedByUserMap.get(post.archivedBy) || 'Utilisateur inconnu'
        : 'Système',
      archiveReason: post.archiveReason,
      author: post.user ? `${post.user.firstName} ${post.user.lastName}` : 'Utilisateur supprimé',
    }));

    return NextResponse.json({
      success: true,
      posts,
      total: posts.length,
    });
  } catch (error) {
    console.error('Error fetching archived posts:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des posts archivés' },
      { status: 500 },
    );
  }
}
