import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/admin';
import { prisma } from '@/prisma';
import { getInstrumentDisplayName } from '@/utils/instrumentUtils';

export async function GET(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) {
    return authResult.res;
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'firstName';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause: Record<string, unknown> = {};

    if (search) {
      whereClause.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (status && status !== 'all') {
      if (status === 'DELETED' || status === 'ARCHIVED') {
        // Only show deleted/archived users when explicitly requested
        whereClause.status = status;
      } else {
        // For all other statuses, set the specific status (deleted/archived are already excluded by design)
        whereClause.status = status;
      }
    } else if (!status || status === 'all') {
      // Exclude archived/deleted users from normal user lists
      whereClause.status = {
        notIn: ['ARCHIVED', 'DELETED'],
      };
    }

    // Get total count for pagination
    const totalUsers = await prisma.user.count({ where: whereClause });

    // Get users with related data
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        promotion: true,
        birthDate: true,
        status: true,
        photoUrl: true,
        createdAt: true,
        pronouns: true,
        biography: true,
        phone: true,
        preferredGenres: true,
        instruments: {
          include: {
            instrument: {
              select: {
                id: true,
                name: true,
                nameFr: true,
                nameEn: true,
              },
            },
          },
        },
        roles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
                nameFrMale: true,
                nameFrFemale: true,
                nameEnMale: true,
                nameEnFemale: true,
                weight: true,
                isCore: true,
              },
            },
          },
        },
        groupMemberships: {
          include: {
            group: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        badges: {
          select: {
            name: true,
          },
        },
        registrationRequest: {
          select: {
            motivation: true,
            experience: true,
            status: true,
            rejectionReason: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder as 'asc' | 'desc',
      },
      skip: offset,
      take: limit,
    });

    // Transform data for frontend
    const transformedUsers = users.map((user) => ({
      id: user.id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      promotion: user.promotion || '',
      birthDate: user.birthDate || null,
      status: user.status,
      photoUrl: user.photoUrl || null,
      createdAt: user.createdAt,
      pronouns: user.pronouns || null,
      biography: user.biography || '',
      phone: user.phone || '',
      preferredGenres: user.preferredGenres || null,
      instruments: (user.instruments || []).map((ui) => ({
        name: getInstrumentDisplayName(ui.instrument, 'fr'),
        skillLevel: ui.skillLevel || '',
        yearsPlaying: ui.yearsPlaying || null,
        isPrimary: ui.isPrimary || false,
      })),
      roles: (user.roles || []).map((ur) => ({
        role: {
          id: ur.role?.id || 0,
          name: ur.role?.name || '',
          nameFrMale: ur.role?.nameFrMale || '',
          nameFrFemale: ur.role?.nameFrFemale || '',
          nameEnMale: ur.role?.nameEnMale || '',
          nameEnFemale: ur.role?.nameEnFemale || '',
          weight: ur.role?.weight || 0,
          isCore: ur.role?.isCore || false,
        },
      })),
      groups: (user.groupMemberships || []).map((gm) => ({
        id: gm.group?.id || 0,
        name: gm.group?.name || '',
        role: gm.role || '',
        isAdmin: gm.isAdmin || false,
      })),
      badges: (user.badges || []).map((b) => b.name),
      registrationRequest: user.registrationRequest
        ? {
            motivation: user.registrationRequest.motivation || '',
            experience: user.registrationRequest.experience || '',
            status: user.registrationRequest.status || '',
            rejectionReason: user.registrationRequest.rejectionReason || '',
          }
        : null,
    }));

    return NextResponse.json({
      users: transformedUsers || [],
      pagination: {
        page,
        limit,
        total: totalUsers || 0,
        totalPages: Math.max(1, Math.ceil((totalUsers || 0) / limit)),
        hasNext: page * limit < (totalUsers || 0),
        hasPrevious: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
