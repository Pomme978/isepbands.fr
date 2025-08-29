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

    // Build where clause for archived venues
    const whereClause: {
      isArchived: boolean;
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        address?: { contains: string; mode: 'insensitive' };
        city?: { contains: string; mode: 'insensitive' };
      }>;
      archivedAt?: { gte: Date };
    } = {
      isArchived: true,
    };

    // Search filter
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
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
    let orderBy: { archivedAt: 'desc' | 'asc' } | { name: 'asc' } = { archivedAt: 'desc' };

    switch (sortBy) {
      case 'oldest':
        orderBy = { archivedAt: 'asc' };
        break;
      case 'alphabetical':
        orderBy = { name: 'asc' };
        break;
      case 'newest':
      default:
        orderBy = { archivedAt: 'desc' };
        break;
    }

    const archivedVenues = await prisma.venue.findMany({
      where: whereClause,
      orderBy,
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        venueType: true,
        photoUrl: true,
        archivedAt: true,
        archivedBy: true,
      },
    });

    // Get unique archivedBy IDs to fetch user names
    const archivedByIds = [
      ...new Set(archivedVenues.map((venue) => venue.archivedBy).filter((id) => id !== null)),
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

    const venues = archivedVenues.map((venue) => ({
      id: venue.id,
      name: venue.name,
      address: venue.address,
      city: venue.city,
      type: venue.venueType,
      photoUrl: venue.photoUrl,
      archivedAt: venue.archivedAt?.toISOString(),
      archivedBy: venue.archivedBy
        ? archivedByUserMap.get(venue.archivedBy) || 'Utilisateur inconnu'
        : 'Système',
    }));

    return NextResponse.json({
      success: true,
      venues,
      total: venues.length,
    });
  } catch (error) {
    console.error('Error fetching archived venues:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des venues archivés' },
      { status: 500 },
    );
  }
}
