import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/utils/authMiddleware';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const sortBy = url.searchParams.get('sortBy') || 'newest';
    const dateRange = url.searchParams.get('dateRange') || 'all';

    // Build where clause for archived admin activities
    const whereClause: Prisma.AdminActivityWhereInput = {
      isArchived: true,
    };

    // Search filter - recherche dans titre, description ET nom d'utilisateur
    if (search && search.trim()) {
      whereClause.OR = [
        // Recherche dans le titre
        { title: { contains: search } },
        // Recherche dans la description
        { description: { contains: search } },
        // Recherche dans le nom de l'utilisateur
        {
          user: {
            OR: [{ firstName: { contains: search } }, { lastName: { contains: search } }],
          },
        },
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
    let orderBy: Prisma.AdminActivityOrderByWithRelationInput = { archivedAt: 'desc' };

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

    // Get archived posts from AdminActivity
    const archivedAdminPosts = await prisma.adminActivity.findMany({
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
            photoUrl: true,
            pronouns: true,
            roles: {
              include: {
                role: {
                  select: {
                    nameFrMale: true,
                    nameFrFemale: true,
                    gradientStart: true,
                    gradientEnd: true,
                    weight: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Build where clause for archived public feed posts
    const publicFeedWhereClause: Prisma.PublicFeedWhereInput = {
      isArchived: true,
    };

    // Apply same search filter to PublicFeed
    if (search && search.trim()) {
      publicFeedWhereClause.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        {
          user: {
            OR: [{ firstName: { contains: search } }, { lastName: { contains: search } }],
          },
        },
      ];
    }

    // Apply same date range filter to PublicFeed
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
        publicFeedWhereClause.archivedAt = {
          gte: startDate,
        };
      }
    }

    // Get archived posts from PublicFeed
    const archivedPublicPosts = await prisma.publicFeed.findMany({
      where: publicFeedWhereClause,
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
            photoUrl: true,
            pronouns: true,
            roles: {
              include: {
                role: {
                  select: {
                    nameFrMale: true,
                    nameFrFemale: true,
                    gradientStart: true,
                    gradientEnd: true,
                    weight: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Combine both arrays and sort by archivedAt
    const archivedPosts = [...archivedAdminPosts, ...archivedPublicPosts];

    // Sort combined results according to sortBy parameter
    archivedPosts.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return (a.archivedAt?.getTime() || 0) - (b.archivedAt?.getTime() || 0);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return (b.archivedAt?.getTime() || 0) - (a.archivedAt?.getTime() || 0);
      }
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

    const posts = archivedPosts.map((post) => {
      // Get the highest weight role for the author
      let userRole = null;
      let userRoleColors = null;

      if (post.user?.roles && post.user.roles.length > 0) {
        const sortedRoles = post.user.roles.sort((a, b) => b.role.weight - a.role.weight);
        const topRole = sortedRoles[0].role;

        // Use appropriate gender version based on user pronouns
        const useFeminine =
          post.user.pronouns &&
          (post.user.pronouns.toLowerCase().includes('she') ||
            post.user.pronouns.toLowerCase().includes('elle'));
        userRole = useFeminine ? topRole.nameFrFemale : topRole.nameFrMale;

        if (topRole.gradientStart && topRole.gradientEnd) {
          userRoleColors = {
            gradientStart: topRole.gradientStart,
            gradientEnd: topRole.gradientEnd,
          };
        }
      }

      return {
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
        authorAvatar: post.user?.photoUrl,
        authorRole: userRole,
        authorRoleColors: userRoleColors,
        authorPronouns: post.user?.pronouns || 'they/them',
      };
    });

    return NextResponse.json({
      success: true,
      posts,
      total: posts.length,
    });
  } catch (error) {
    console.error('Error fetching archived posts:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: error,
    });
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des posts archivés' },
      { status: 500 },
    );
  }
}
