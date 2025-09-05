import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/admin';
import { prisma } from '@/lib/prisma';
import { z, ZodIssue } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { logAdminAction } from '@/services/activityLogService';
import { autoUnsubscribeUser, autoSubscribeUser } from '@/services/newsletterService';
import { EmailService } from '@/services/emailService';

// Schema pour la validation des données utilisateur
const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  promotion: z.string().optional(),
  birthDate: z
    .string()
    .optional()
    .transform((str) => (str ? new Date(str) : undefined)),
  biography: z.string().optional(),
  phone: z.string().nullable().optional(),
  pronouns: z.string().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  status: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return val;
      const uppercased = val.toUpperCase();
      if (
        ['CURRENT', 'FORMER', 'GRADUATED', 'PENDING', 'REFUSED', 'SUSPENDED', 'DELETED'].includes(
          uppercased,
        )
      ) {
        return uppercased as
          | 'CURRENT'
          | 'FORMER'
          | 'GRADUATED'
          | 'PENDING'
          | 'REFUSED'
          | 'SUSPENDED'
          | 'DELETED';
      }
      throw new Error(`Invalid status: ${val}`);
    }),
  isLookingForGroup: z.boolean().optional(),
  isFullAccess: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  rejectionReason: z.string().nullable().optional(),
  // Relations
  instruments: z
    .array(
      z.object({
        instrumentId: z.number(),
        skillLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
        yearsPlaying: z.number().nullable().optional(),
        isPrimary: z.boolean().optional(),
      }),
    )
    .optional(),
  roleIds: z.array(z.number()).optional(),
  badges: z
    .array(
      z.object({
        badgeDefinitionId: z.number(),
      }),
    )
    .optional(),
  preferredGenres: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((val) => {
      if (!val) return val;
      if (typeof val === 'string') {
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
      return val;
    }),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) {
    return authResult.res;
  }

  try {
    const { id: userId } = await params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        promotion: true,
        birthDate: true,
        biography: true,
        phone: true,
        pronouns: true,
        photoUrl: true,
        status: true,
        isLookingForGroup: true,
        isFullAccess: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
        preferredGenres: true,
        registrationRequest: {
          select: {
            motivation: true,
            experience: true,
            rejectionReason: true,
          },
        },
        instruments: {
          include: {
            instrument: {
              select: {
                id: true,
                name: true,
                nameFr: true,
                nameEn: true,
                imageUrl: true,
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
                imageUrl: true,
              },
            },
          },
        },
        badges: {
          select: {
            id: true,
            name: true,
            badgeDefinitionId: true,
            badgeDefinition: {
              select: {
                id: true,
                key: true,
                labelFr: true,
                labelEn: true,
                color: true,
                colorEnd: true,
                gradientDirection: true,
                textColor: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Transform the user data to include registrationRequest data at the root level
    const transformedUser = {
      ...user,
      joinDate: user.createdAt.toISOString().split('T')[0], // Map createdAt to joinDate as date string
      rejectionReason: user.registrationRequest?.rejectionReason || null,
      registrationRequest: user.registrationRequest
        ? {
            motivation: user.registrationRequest.motivation,
            experience: user.registrationRequest.experience,
            rejectionReason: user.registrationRequest.rejectionReason,
          }
        : null,
    };

    return NextResponse.json({ user: transformedUser });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) {
    return authResult.res;
  }

  try {
    const { id: userId } = await params;
    const body = await req.json();

    // Validate input
    const validatedData = updateUserSchema.parse(body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check for email uniqueness if email is being updated
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });
      if (emailExists) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
      }
    }

    // Use transaction to update user and relations
    await prisma.$transaction(async (tx) => {
      // Update basic user data
      const baseUpdateData: Record<string, unknown> = {};

      if (validatedData.firstName !== undefined) baseUpdateData.firstName = validatedData.firstName;
      if (validatedData.lastName !== undefined) baseUpdateData.lastName = validatedData.lastName;
      if (validatedData.email !== undefined) baseUpdateData.email = validatedData.email;
      if (validatedData.promotion !== undefined) baseUpdateData.promotion = validatedData.promotion;
      if (validatedData.birthDate !== undefined) baseUpdateData.birthDate = validatedData.birthDate;
      if (validatedData.biography !== undefined) baseUpdateData.biography = validatedData.biography;
      if (validatedData.phone !== undefined) baseUpdateData.phone = validatedData.phone;
      if (validatedData.pronouns !== undefined) baseUpdateData.pronouns = validatedData.pronouns;
      // Handle photo URL changes and cleanup
      if (validatedData.photoUrl !== undefined) {
        // If we're removing/changing the photo, clean up the old one
        // Only clean up if we're explicitly removing (null/'') OR changing to a different URL
        if (
          existingUser.photoUrl &&
          (validatedData.photoUrl === null ||
            validatedData.photoUrl === '' ||
            (validatedData.photoUrl && validatedData.photoUrl !== existingUser.photoUrl))
        ) {
          try {
            // Find the storage object for the old photo
            const oldStorageObject = await tx.storageObject.findFirst({
              where: {
                userId,
                url: existingUser.photoUrl,
              },
            });

            if (oldStorageObject) {
              // Delete the storage object record
              await tx.storageObject.delete({
                where: { id: oldStorageObject.id },
              });

              // Delete the physical file
              const filePath = path.join(
                process.cwd(),
                'public',
                'storage',
                'uploads',
                oldStorageObject.key,
              );
              try {
                await fs.unlink(filePath);
              } catch (fileError) {
                console.warn(
                  `Failed to delete old profile picture file ${oldStorageObject.key}:`,
                  fileError,
                );
              }
            }
          } catch (cleanupError) {
            console.warn('Failed to cleanup old profile picture:', cleanupError);
            // Continue with the update even if cleanup fails
          }
        }
        baseUpdateData.photoUrl = validatedData.photoUrl;
      }
      if (validatedData.status !== undefined) baseUpdateData.status = validatedData.status;
      if (validatedData.isLookingForGroup !== undefined)
        baseUpdateData.isLookingForGroup = validatedData.isLookingForGroup;
      if (validatedData.isFullAccess !== undefined)
        baseUpdateData.isFullAccess = validatedData.isFullAccess;
      if (validatedData.emailVerified !== undefined)
        baseUpdateData.emailVerified = validatedData.emailVerified;
      if (validatedData.preferredGenres !== undefined)
        baseUpdateData.preferredGenres = JSON.stringify(validatedData.preferredGenres);

      const user = await tx.user.update({
        where: { id: userId },
        data: {
          ...baseUpdateData,
          updatedAt: new Date(),
        },
      });

      // Update instruments
      if (validatedData.instruments !== undefined) {
        // Delete existing instruments
        await tx.userInstrument.deleteMany({
          where: { userId },
        });

        // Add new instruments
        if (validatedData.instruments.length > 0) {
          // Remove duplicates by instrumentId (keep the last one)
          const uniqueInstruments = validatedData.instruments.reduce(
            (acc: typeof validatedData.instruments, inst) => {
              const existingIndex = acc.findIndex(
                (existing) => existing.instrumentId === inst.instrumentId,
              );
              if (existingIndex >= 0) {
                // Replace existing with new one
                acc[existingIndex] = inst;
              } else {
                // Add new one
                acc.push(inst);
              }
              return acc;
            },
            [],
          );

          await tx.userInstrument.createMany({
            data: uniqueInstruments.map((inst) => ({
              userId,
              instrumentId: inst.instrumentId,
              skillLevel: inst.skillLevel,
              yearsPlaying: inst.yearsPlaying,
              isPrimary: inst.isPrimary || false,
            })),
          });
        }
      }

      // Update roles
      if (validatedData.roleIds !== undefined) {
        // Validate role limits before assignment
        if (validatedData.roleIds.length > 0) {
          // Get role details for validation
          const rolesToAssign = await tx.role.findMany({
            where: { id: { in: validatedData.roleIds } },
            select: { id: true, name: true },
          });

          // Check role limits for each role being assigned
          for (const role of rolesToAssign) {
            // Get current users with this role (excluding current user)
            const currentUsersWithRole = await tx.userRole.count({
              where: {
                roleId: role.id,
                userId: { not: userId },
              },
            });

            // Define role limits
            let maxUsers = 1; // Default: 1 user per role
            if (role.name === 'vice_president') {
              maxUsers = 2; // VP can have 2 users
            } else if (['member', 'former_member'].includes(role.name)) {
              maxUsers = 999; // No limit for member roles
            }

            // Debug logging

            // Check if assigning this role would exceed the limit
            if (currentUsersWithRole >= maxUsers) {
              throw new Error(
                `Role "${role.name}" is limited to ${maxUsers} user${maxUsers > 1 ? 's' : ''}. Current count: ${currentUsersWithRole}`,
              );
            }
          }
        }

        // Delete existing roles
        await tx.userRole.deleteMany({
          where: { userId },
        });

        // Add new roles
        if (validatedData.roleIds.length > 0) {
          await tx.userRole.createMany({
            data: validatedData.roleIds.map((roleId) => ({
              userId,
              roleId,
            })),
          });
        }
      }

      // Update badges
      if (validatedData.badges !== undefined) {
        // Delete existing badges
        await tx.badge.deleteMany({
          where: { userId },
        });

        // Add new badges with badgeDefinitionId
        if (validatedData.badges.length > 0) {
          // Fetch badge definitions to get the key for the name field
          const badgeDefinitions = await tx.badgeDefinition.findMany({
            where: {
              id: { in: validatedData.badges.map((b) => b.badgeDefinitionId) },
            },
            select: {
              id: true,
              key: true,
            },
          });

          const badgeDefMap = new Map(badgeDefinitions.map((bd) => [bd.id, bd.key]));

          await tx.badge.createMany({
            data: validatedData.badges.map((badge) => ({
              userId,
              badgeDefinitionId: badge.badgeDefinitionId,
              name: badgeDefMap.get(badge.badgeDefinitionId) || 'unknown',
            })),
          });
        }
      }

      // Handle rejection/suspension reason for refused, suspended, or deleted status
      if (
        validatedData.rejectionReason !== undefined &&
        (validatedData.status === 'REFUSED' ||
          validatedData.status === 'SUSPENDED' ||
          validatedData.status === 'DELETED')
      ) {
        // Find or create RegistrationRequest to store the reason
        const existingRequest = await tx.registrationRequest.findUnique({
          where: { userId },
        });

        if (existingRequest) {
          // Update existing request
          await tx.registrationRequest.update({
            where: { userId },
            data: {
              rejectionReason: validatedData.rejectionReason,
              status:
                validatedData.status === 'REFUSED'
                  ? 'REJECTED'
                  : validatedData.status === 'SUSPENDED'
                    ? 'SUSPENDED'
                    : 'DELETED',
            },
          });
        } else {
          // Create new request
          await tx.registrationRequest.create({
            data: {
              userId,
              motivation: '',
              rejectionReason: validatedData.rejectionReason,
              status:
                validatedData.status === 'REFUSED'
                  ? 'REJECTED'
                  : validatedData.status === 'SUSPENDED'
                    ? 'SUSPENDED'
                    : 'DELETED',
            },
          });
        }
      }

      return user;
    });

    // Fetch the updated user with all relations
    const fullUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        promotion: true,
        birthDate: true,
        biography: true,
        phone: true,
        pronouns: true,
        photoUrl: true,
        status: true,
        isLookingForGroup: true,
        isFullAccess: true,
        emailVerified: true,
        updatedAt: true,
        preferredGenres: true,
        registrationRequest: {
          select: {
            motivation: true,
            experience: true,
            rejectionReason: true,
          },
        },
        instruments: {
          include: {
            instrument: {
              select: {
                id: true,
                name: true,
                nameFr: true,
                nameEn: true,
                imageUrl: true,
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
        badges: {
          select: {
            id: true,
            name: true,
            badgeDefinitionId: true,
            badgeDefinition: {
              select: {
                id: true,
                key: true,
                labelFr: true,
                labelEn: true,
                color: true,
                colorEnd: true,
                gradientDirection: true,
                textColor: true,
                description: true,
              },
            },
          },
        },
      },
    });

    // Transform the user data to include rejectionReason at the root level
    const transformedUser = {
      ...fullUser,
      joinDate: fullUser?.createdAt
        ? fullUser.createdAt.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0], // Map createdAt to joinDate as date string
      rejectionReason: fullUser?.registrationRequest?.rejectionReason || null,
    };

    // Logger la modification d'utilisateur
    try {
      if (!transformedUser.id) {
        throw new Error('transformedUser.id is undefined');
      }

      // Build detailed change description
      const changes = [];
      const metadata: Record<string, unknown> = {
        updatedFields: Object.keys(validatedData),
        userEmail: transformedUser.email,
        previousData: {},
        newData: {},
      };

      // Track specific changes
      if (
        validatedData.firstName !== undefined &&
        validatedData.firstName !== existingUser.firstName
      ) {
        changes.push(`Prénom: ${existingUser.firstName} → ${validatedData.firstName}`);
        metadata.previousData = {
          ...(metadata.previousData as object),
          firstName: existingUser.firstName,
        };
        metadata.newData = { ...(metadata.newData as object), firstName: validatedData.firstName };
      }
      if (
        validatedData.lastName !== undefined &&
        validatedData.lastName !== existingUser.lastName
      ) {
        changes.push(`Nom: ${existingUser.lastName} → ${validatedData.lastName}`);
        metadata.previousData = {
          ...(metadata.previousData as object),
          lastName: existingUser.lastName,
        };
        metadata.newData = { ...(metadata.newData as object), lastName: validatedData.lastName };
      }
      if (validatedData.email !== undefined && validatedData.email !== existingUser.email) {
        changes.push(`Email: ${existingUser.email} → ${validatedData.email}`);
        metadata.previousData = { ...(metadata.previousData as object), email: existingUser.email };
        metadata.newData = { ...(metadata.newData as object), email: validatedData.email };
      }
      if (
        validatedData.photoUrl !== undefined &&
        validatedData.photoUrl !== existingUser.photoUrl
      ) {
        const oldPhoto = existingUser.photoUrl ? 'Photo existante' : 'Aucune photo';
        const newPhoto = validatedData.photoUrl ? 'Nouvelle photo' : 'Photo supprimée';
        changes.push(`Photo de profil: ${oldPhoto} → ${newPhoto}`);
        metadata.previousPhotoUrl = existingUser.photoUrl;
        metadata.newPhotoUrl = validatedData.photoUrl;
      }
      if (validatedData.status !== undefined && validatedData.status !== existingUser.status) {
        const statusLabels: Record<string, string> = {
          PENDING: 'En attente',
          CURRENT: 'Actuel',
          DELETED: 'Archivé',
          REFUSED: 'Refusé',
          FORMER: 'Ancien',
          GRADUATED: 'Diplômé',
          SUSPENDED: 'Suspendu',
        };
        const oldStatus = statusLabels[existingUser.status] || existingUser.status;
        const newStatus = statusLabels[validatedData.status] || validatedData.status;
        changes.push(`Statut: ${oldStatus} → ${newStatus}`);
        metadata.previousStatus = existingUser.status;
        metadata.newStatus = validatedData.status;
      }
      if (
        validatedData.promotion !== undefined &&
        validatedData.promotion !== existingUser.promotion
      ) {
        changes.push(
          `Promotion: ${existingUser.promotion || 'Aucune'} → ${validatedData.promotion || 'Aucune'}`,
        );
        metadata.previousData = {
          ...(metadata.previousData as object),
          promotion: existingUser.promotion,
        };
        metadata.newData = { ...(metadata.newData as object), promotion: validatedData.promotion };
      }

      const changeDescription = changes.length > 0 ? `\n\n${changes.join('\n')}` : '';

      await logAdminAction(
        authResult.user.id,
        'user_edited',
        'Utilisateur modifié',
        `**${transformedUser.firstName} ${transformedUser.lastName}** (${transformedUser.email}) a été modifié${changeDescription}`,
        String(transformedUser.id),
        metadata,
      );
    } catch {
      // ignore logger errors
    }

    // Send email notifications based on status changes
    if (validatedData.status !== undefined && validatedData.status !== existingUser.status) {
      try {
        const userFullName = `${transformedUser.firstName} ${transformedUser.lastName}`;

        // Handle different status changes
        switch (validatedData.status) {
          case 'CURRENT':
            // User was approved (from PENDING) or restored (from REFUSED/SUSPENDED/DELETED)
            if (existingUser.status === 'PENDING') {
              // Send approval email
              await EmailService.sendAccountApprovedEmail(
                transformedUser.email,
                transformedUser.firstName,
                transformedUser.lastName,
              );
              // Auto-subscribe to newsletter
              await autoSubscribeUser(transformedUser.email, 'approved');
            } else if (existingUser.status === 'SUSPENDED') {
              // Send suspended account restored email
              await EmailService.sendSuspendedAccountRestoredEmail(
                transformedUser.email,
                transformedUser.firstName,
                transformedUser.lastName,
              );
            } else if (existingUser.status === 'REFUSED') {
              // Send refused member restored email
              await EmailService.sendRefusedMemberRestoredEmail(
                transformedUser.email,
                transformedUser.firstName,
                transformedUser.lastName,
              );
            }
            // For DELETED users, no email needed as they were archived
            break;

          case 'REFUSED':
            // User was rejected
            if (existingUser.status === 'PENDING') {
              const reason =
                validatedData.rejectionReason ||
                'Votre demande ne correspond pas aux critères actuels.';
              await EmailService.sendAccountRejectedEmail(
                transformedUser.email,
                transformedUser.firstName,
                transformedUser.lastName,
                reason,
              );
            }
            break;

          case 'SUSPENDED':
            // User was suspended
            if (existingUser.status === 'CURRENT' || existingUser.status === 'FORMER') {
              const reason =
                validatedData.rejectionReason || "Violation des conditions d'utilisation.";
              await EmailService.sendAccountSuspendedEmail(
                transformedUser.email,
                transformedUser.firstName,
                transformedUser.lastName,
                reason,
              );
            }
            break;

          case 'DELETED':
            // User was deleted/archived - no email needed
            break;

          default:
            // No email for other status changes
            break;
        }
      } catch (emailError) {
        console.error('Failed to send status change email:', emailError);
        // Don't fail the update if email fails
      }
    }

    return NextResponse.json({
      user: transformedUser,
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Error updating user:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.issues,
          message:
            error.issues?.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ') ||
            'Validation failed',
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to update user',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) {
    return authResult.res;
  }

  try {
    const { id: userId } = await params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // First, get user's storage objects before deletion
    const userStorageObjects = await prisma.storageObject.findMany({
      where: { userId },
      select: { id: true, key: true },
    });

    // Logger la suppression d'utilisateur AVANT de supprimer
    try {
      console.log('🔍 Attempting to log user deletion for:', existingUser.email);
      const { logAdminAction } = await import('@/services/activityLogService');
      console.log('📝 logAdminAction imported successfully');

      await logAdminAction(
        authResult.user.id,
        'user_deleted',
        'Utilisateur supprimé',
        `**${existingUser.firstName} ${existingUser.lastName}** (${existingUser.email}) a été supprimé définitivement`,
        userId,
        {
          userEmail: existingUser.email,
          deletedAt: new Date().toISOString(),
          deletedByAdmin: authResult.user.id,
        },
      );
      console.log('✅ User deletion logged successfully');
    } catch (err) {
      // Log error but don't fail the deletion
      console.error('❌ Failed to log user deletion:', err);
      console.error('Stack trace:', err instanceof Error ? err.stack : 'No stack trace');
    }

    // Delete related data in multiple smaller transactions to avoid timeout
    await prisma.userInstrument.deleteMany({ where: { userId } });
    await prisma.userRole.deleteMany({ where: { userId } });
    await prisma.groupMembership.deleteMany({ where: { userId } });
    await prisma.badge.deleteMany({ where: { userId } });
    await prisma.registrationRequest.deleteMany({ where: { userId } });
    await prisma.vote.deleteMany({ where: { userId } });
    await prisma.news.deleteMany({ where: { authorId: userId } });
    await prisma.storageObject.deleteMany({ where: { userId } });

    // Finally delete the user
    await prisma.user.delete({ where: { id: userId } });

    // Auto-unsubscribe from newsletter when user is deleted
    await autoUnsubscribeUser(existingUser.email);

    // After successful database deletion, clean up physical files
    for (const storageObj of userStorageObjects) {
      try {
        const filePath = path.join(process.cwd(), 'public', 'storage', 'uploads', storageObj.key);
        await fs.unlink(filePath);
      } catch (error) {
        console.warn(`Failed to delete storage file ${storageObj.key}:`, error);
        // Continue even if file cleanup fails - the user is already deleted
      }
    }

    return NextResponse.json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
