import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { requireAuth } from '@/middlewares/auth';
import { checkAdminPermission } from '@/middlewares/admin';
import { logAdminAction } from '@/services/activityLogService';
import { autoSubscribeUser } from '@/services/newsletterService';
// import { ensureDBIntegrity } from '@/utils/dbIntegrity'; // Moved to manual DB admin page

// Schema for user creation
const createUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  birthDate: z
    .string()
    .min(1, 'Birth date is required')
    .transform((str) => new Date(str)),
  promotion: z.string().min(1, 'Promotion is required'),

  // Role and permissions
  primaryRole: z.string(),
  isFullAccess: z.boolean().optional(),

  // Instruments
  instruments: z
    .array(
      z.object({
        instrument: z.string(),
        level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
        isPrimary: z.boolean().optional(),
      }),
    )
    .optional(),

  // Badges
  achievementBadges: z.array(z.number()).optional(),

  // Profile
  bio: z.string().optional(),
  pronouns: z.string().optional(),
  preferredGenres: z.array(z.string()).optional(),
  photoUrl: z.string().nullable().optional(),

  // Account setup
  temporaryPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine(
      (password) => /[a-z]/.test(password),
      'Password must contain at least one lowercase letter',
    )
    .refine(
      (password) => /[A-Z]/.test(password),
      'Password must contain at least one uppercase letter',
    )
    .refine((password) => /\d/.test(password), 'Password must contain at least one number')
    .refine(
      (password) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      'Password must contain at least one special character',
    ),
  sendWelcomeEmail: z.boolean().optional(),
  requirePasswordChange: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const auth = await requireAuth(req);
    if (!auth.ok) return auth.res;

    // Check admin permission
    const adminCheck = await checkAdminPermission(auth.user);
    if (!adminCheck.hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = createUserSchema.parse(body);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: 'A user with this email already exists',
        },
        { status: 400 },
      );
    }

    // Hash the temporary password
    const hashedPassword = await bcrypt.hash(validatedData.temporaryPassword, 10);

    // Find the role by matching the French male name (which is sent from frontend)
    const role = await prisma.role.findFirst({
      where: {
        OR: [
          { nameFrMale: validatedData.primaryRole },
          { nameFrFemale: validatedData.primaryRole },
          { nameEnMale: validatedData.primaryRole },
          { nameEnFemale: validatedData.primaryRole },
          { name: validatedData.primaryRole.toLowerCase() }, // fallback for direct technical names
        ],
      },
    });

    if (!role) {
      return NextResponse.json(
        {
          error: `Role not found: ${validatedData.primaryRole}. Please check that the role exists in the database.`,
        },
        { status: 400 },
      );
    }

    // Validate role limits before assignment
    const currentUsersWithRole = await prisma.userRole.count({
      where: { roleId: role.id },
    });

    // Define role limits
    let maxUsers = 1; // Default: 1 user per role
    if (role.name === 'vice_president') {
      maxUsers = 2; // VP can have 2 users
    } else if (['member', 'former_member'].includes(role.name)) {
      maxUsers = 999; // No limit for member roles
    }

    // Check if assigning this role would exceed the limit
    if (currentUsersWithRole >= maxUsers) {
      return NextResponse.json(
        {
          error: `Role "${validatedData.primaryRole}" is limited to ${maxUsers} user${maxUsers > 1 ? 's' : ''}. Current count: ${currentUsersWithRole}. Please remove another user from this role first.`,
        },
        { status: 400 },
      );
    }

    // Create user in transaction
    const user = await prisma.$transaction(async (tx) => {
      // Create the user
      const newUser = await tx.user.create({
        data: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName.toUpperCase(), // Always uppercase
          email: validatedData.email,
          phone: validatedData.phone,
          password: hashedPassword,
          birthDate: validatedData.birthDate,
          promotion: validatedData.promotion,
          biography: validatedData.bio || '',
          pronouns: validatedData.pronouns,
          status: 'CURRENT',
          emailVerified: false,
          isFullAccess: validatedData.isFullAccess || false,
          photoUrl: validatedData.photoUrl || null,
          requirePasswordChange: validatedData.requirePasswordChange || false,
          preferredGenres: validatedData.preferredGenres
            ? JSON.stringify(validatedData.preferredGenres)
            : null,
        },
      });

      // Assign role
      await tx.userRole.create({
        data: {
          userId: newUser.id,
          roleId: role.id,
        },
      });

      // Add instruments if provided
      if (validatedData.instruments && validatedData.instruments.length > 0) {
        for (const inst of validatedData.instruments) {
          // Find instrument by name
          const instrument = await tx.instrument.findFirst({
            where: { name: inst.instrument },
          });

          if (instrument) {
            await tx.userInstrument.create({
              data: {
                userId: newUser.id,
                instrumentId: instrument.id,
                skillLevel: inst.level,
                isPrimary: inst.isPrimary || false,
              },
            });
          }
        }
      }

      // Add badges if provided
      if (validatedData.achievementBadges && validatedData.achievementBadges.length > 0) {
        // Fetch badge definitions to get the key for the name field
        const badgeDefinitions = await tx.badgeDefinition.findMany({
          where: {
            id: { in: validatedData.achievementBadges },
          },
          select: {
            id: true,
            key: true,
          },
        });

        for (const badgeDefId of validatedData.achievementBadges) {
          const badgeDef = badgeDefinitions.find((bd) => bd.id === badgeDefId);
          if (badgeDef) {
            await tx.badge.create({
              data: {
                name: badgeDef.key,
                badgeDefinitionId: badgeDefId,
                userId: newUser.id,
              },
            });
          }
        }
      }

      return newUser;
    });

    // Log admin action
    await logAdminAction(
      auth.user.id,
      'user_created',
      'Utilisateur créé',
      `**${user.firstName} ${user.lastName}** (${user.email}) a été créé avec le rôle **${validatedData.primaryRole}**`,
      user.id,
      {
        email: user.email,
        role: validatedData.primaryRole,
        promotion: validatedData.promotion,
        instrumentsCount: validatedData.instruments?.length || 0,
        badgesCount: validatedData.achievementBadges?.length || 0,
        hasTemporaryPassword: true,
        sendWelcomeEmail: validatedData.sendWelcomeEmail || false
      }
    );

    // Auto-subscribe to newsletter when user is created by admin
    await autoSubscribeUser(user.email, 'admin_created');

    // TODO: Send welcome email if requested
    if (validatedData.sendWelcomeEmail) {
      console.log('TODO: Send welcome email to', validatedData.email);
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          status: user.status,
          createdAt: user.createdAt,
        },
        message: 'User created successfully',
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error,
        },
        { status: 400 },
      );
    }

    console.error('Error creating user:', error);
    return NextResponse.json(
      {
        error: 'Failed to create user',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
