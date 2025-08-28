import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/middlewares/auth';
import { z } from 'zod';
import { getBadgeDisplayName } from '@/utils/badgeUtils';

// Schema for profile updates (limited fields for non-admin users)
const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  biography: z.string().optional(),
  photoUrl: z.string().nullable().optional(),
  isLookingForGroup: z.boolean().optional(),
  pronouns: z.string().nullable().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const urlParts = req.nextUrl.pathname.split('/');
    const userId = urlParts[urlParts.length - 1];
    if (!userId) {
      return NextResponse.json({
        success: false,
        code: 'missing_user_id',
        message: 'Missing userId',
        data: null,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        badges: true,
        instruments: { include: { instrument: true } },
        roles: { include: { role: true } },
        groupMemberships: {
          include: {
            group: {
              include: {
                members: true,
                events: { include: { event: true } },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        code: 'user_not_found',
        message: 'User not found',
        data: null,
      });
    }

    console.log('User data retrieved:', {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      promotion: user.promotion,
      birthDate: user.birthDate,
      status: user.status,
      badgesCount: user.badges?.length,
      instrumentsCount: user.instruments?.length,
      rolesCount: user.roles?.length,
    });

    // Calculs des champs supplémentaires avec sécurité
    const totalGroups = (user.groupMemberships || []).length;
    const instrumentCount = (user.instruments || []).length;
    const activeGroups = (user.groupMemberships || []).filter(
      (gm) => gm.group && gm.group.isVerified,
    ).length;
    // Événements auxquels l'utilisateur a participé (tous les events des groupes où il est membre)
    const eventsAttended = (user.groupMemberships || []).reduce(
      (acc, gm) => acc + (gm.group?.events?.length || 0),
      0,
    );
    // Concerts joués (type = CONCERT)
    const concertsPlayed = (user.groupMemberships || []).reduce(
      (acc, gm) =>
        acc +
        ((gm.group?.events || []).filter((e) => e.event && e.event.type === 'CONCERT').length || 0),
      0,
    );
    // Rôle principal (le plus haut weight)
    const primaryRole =
      (user.roles || []).length > 0
        ? (user.roles || []).reduce((prev, current) =>
            (current.role?.weight || 0) > (prev.role?.weight || 0) ? current : prev,
          )
        : null;

    // Get role display name based on user pronouns
    const getRoleDisplayName = (
      role: { nameFrMale?: string; nameFrFemale?: string } | null,
      pronouns: string | null,
    ) => {
      if (!role || !role.nameFrMale || !role.nameFrFemale) return null;
      const isFeminine = pronouns === 'she/her';
      return isFeminine ? role.nameFrFemale : role.nameFrMale;
    };

    // Formatage de la réponse avec valeurs sécurisées
    const response = {
      id: user.id || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      promotion: user.promotion || '',
      birthDate: user.birthDate || null,
      biography: user.biography || '',
      phone: user.phone || '',
      email: user.email || '',
      photoUrl: user.photoUrl || null,
      status: user.status || 'PENDING',
      createdAt: user.createdAt || new Date(),
      emailVerified: user.emailVerified || false,
      pronouns: user.pronouns || null,
      isLookingForGroup: user.isLookingForGroup || false,
      preferredGenres: user.preferredGenres || null,
      badges: (user.badges || []).map((b) => getBadgeDisplayName(b.name, 'fr')).filter(Boolean),
      instruments: user.instruments || [],
      roles: (user.roles || []).map((r) => r.role?.name).filter(Boolean),
      totalGroups,
      instrumentCount,
      activeGroups,
      eventsAttended,
      concertsPlayed,
      primaryRole: getRoleDisplayName(primaryRole?.role, user.pronouns) || null,
      groupMemberships: user.groupMemberships
        .filter((gm) => gm.group)
        .map((gm) => ({
          id: gm.group.id,
          name: gm.group.name,
          imageUrl: gm.group.imageUrl,
          genre: gm.group.genre,
          isVerified: gm.group.isVerified,
          isLookingForMembers: gm.group.isLookingForMembers,
          memberCount: gm.group.members?.length || 0,
          events: gm.group.events
            .filter((e) => e.event)
            .map((e) => ({
              id: e.event.id,
              name: e.event.name,
              type: e.event.type,
              date: e.event.date,
              location: e.event.location,
            })),
        })),
    };
    return NextResponse.json({
      success: true,
      code: 'user_found',
      message: 'User found',
      data: response,
    });
  } catch (error) {
    console.error('Error in GET /api/profile/[userId]:', error);
    return NextResponse.json(
      {
        success: false,
        code: 'server_error',
        message: 'Internal server error',
        data: null,
      },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const urlParts = req.nextUrl.pathname.split('/');
  const userId = urlParts[urlParts.length - 1];

  if (!userId) {
    return NextResponse.json({
      success: false,
      code: 'missing_user_id',
      message: 'Missing userId',
      data: null,
    });
  }

  // Check authentication
  const auth = await requireAuth(req);
  if (!auth.ok) {
    return NextResponse.json(
      {
        success: false,
        code: 'unauthorized',
        message: 'Authentication required',
        data: null,
      },
      { status: 401 },
    );
  }

  // Users can only update their own profile (unless they have admin access)
  if (auth.user?.id !== userId && !auth.user?.isFullAccess) {
    return NextResponse.json(
      {
        success: false,
        code: 'forbidden',
        message: 'You can only update your own profile',
        data: null,
      },
      { status: 403 },
    );
  }

  try {
    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          code: 'user_not_found',
          message: 'User not found',
          data: null,
        },
        { status: 404 },
      );
    }

    // Update the user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        biography: true,
        photoUrl: true,
        isLookingForGroup: true,
        pronouns: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      code: 'profile_updated',
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          code: 'validation_error',
          message: 'Validation error',
          data: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        code: 'update_failed',
        message: 'Failed to update profile',
        data: null,
      },
      { status: 500 },
    );
  }
}
