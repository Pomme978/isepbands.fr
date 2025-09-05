import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { z } from 'zod';
import { getBadgeDisplayName } from '@/utils/badgeUtils';
import { parsePreferredGenres } from '@/utils/genreUtils';

// Schema for profile updates (limited fields for non-admin users)
const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  biography: z.string().optional(),
  bureauQuote: z
    .string()
    .refine(
      (val) => {
        if (!val) return true;
        const words = val
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0);
        return words.length <= 40;
      },
      { message: 'La citation bureau ne peut pas dépasser 40 mots' },
    )
    .optional(),
  photoUrl: z.string().nullable().optional(),
  isLookingForGroup: z.boolean().optional(),
  pronouns: z.string().nullable().optional(),
  birthDate: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
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
        badges: {
          include: {
            badgeDefinition: true,
          },
        },
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
        registrationRequest: {
          select: {
            motivation: true,
            experience: true,
            status: true,
            rejectionReason: true,
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

    // Block access to archived/deleted users
    if (user.status === 'DELETED') {
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

    console.log(
      'User badges with definitions:',
      user.badges?.map((badge) => ({
        id: badge.id,
        name: badge.name,
        badgeDefinitionId: badge.badgeDefinitionId,
        badgeDefinition: badge.badgeDefinition
          ? {
              id: badge.badgeDefinition.id,
              labelFr: badge.badgeDefinition.labelFr,
              color: badge.badgeDefinition.color,
              isActive: badge.badgeDefinition.isActive,
            }
          : null,
      })),
    );

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
      bureauQuote: user.bureauQuote || '',
      phone: user.phone || '',
      email: user.email || '',
      photoUrl: user.photoUrl || null,
      status: user.status || 'PENDING',
      createdAt: user.createdAt || new Date(),
      emailVerified: user.emailVerified || false,
      pronouns: user.pronouns || null,
      isLookingForGroup: user.isLookingForGroup || false,
      preferredGenres: parsePreferredGenres(user.preferredGenres),
      badges: (user.badges || [])
        .filter((badge) => {
          // Only include badges that:
          // 1. Have active badge definitions, OR
          // 2. Are legacy badges (no badgeDefinitionId)
          if (badge.badgeDefinition) {
            return badge.badgeDefinition.isActive === true;
          }
          return !badge.badgeDefinitionId; // Legacy badge
        })
        .map((badge) => {
          if (badge.badgeDefinition) {
            // System badge with full definition
            return {
              id: badge.id,
              name: badge.badgeDefinition.labelFr,
              description: badge.badgeDefinition.description,
              color: badge.badgeDefinition.color,
              isSystemBadge: true,
              assignedAt: badge.assignedAt,
              badgeDefinition: {
                id: badge.badgeDefinition.id,
                key: badge.badgeDefinition.key,
                labelFr: badge.badgeDefinition.labelFr,
                labelEn: badge.badgeDefinition.labelEn,
                color: badge.badgeDefinition.color,
                colorEnd: badge.badgeDefinition.colorEnd,
                gradientDirection: badge.badgeDefinition.gradientDirection,
                textColor: badge.badgeDefinition.textColor,
                description: badge.badgeDefinition.description,
              },
            };
          } else {
            // Legacy custom badge
            return {
              id: badge.id,
              name: getBadgeDisplayName(badge.name, 'fr') || badge.name,
              description: null,
              color: '#FF6B35', // Default color for legacy badges
              isSystemBadge: false,
              assignedAt: badge.assignedAt,
            };
          }
        })
        .filter(Boolean),
      instruments: user.instruments || [],
      roles: user.roles || [],
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
      registrationRequest: user.registrationRequest
        ? {
            motivation: user.registrationRequest.motivation,
            experience: user.registrationRequest.experience,
            status: user.registrationRequest.status,
            rejectionReason: user.registrationRequest.rejectionReason,
          }
        : null,
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
  const session = await getSessionUser(req);
  if (!session?.id) {
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
  if (session.id !== userId && !session.isFullAccess) {
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
    console.log('📝 Profile update request body:', body);

    const validatedData = updateProfileSchema.parse(body);
    console.log('✅ Validated data:', validatedData);

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
    console.log('🔄 Updating user profile with data:', {
      ...validatedData,
      updatedAt: new Date(),
    });

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
        bureauQuote: true,
        photoUrl: true,
        isLookingForGroup: true,
        pronouns: true,
        birthDate: true,
        updatedAt: true,
      },
    });

    console.log('✅ Profile updated successfully:', updatedUser);

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
