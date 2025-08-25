import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/admin';
import { prisma } from '@/prisma';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

// Schema pour la validation des données utilisateur
const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  promotion: z.string().optional(),
  birthDate: z.string().optional().transform(str => str ? new Date(str) : undefined),
  biography: z.string().optional(),
  phone: z.string().nullable().optional(),
  pronouns: z.string().nullable().optional(),
  isOutOfSchool: z.boolean().optional(),
  photoUrl: z.string().nullable().optional(),
  status: z.string().optional().transform(val => {
    if (!val) return val;
    const uppercased = val.toUpperCase();
    if (['CURRENT', 'FORMER', 'GRADUATED', 'PENDING'].includes(uppercased)) {
      return uppercased as 'CURRENT' | 'FORMER' | 'GRADUATED' | 'PENDING';
    }
    throw new Error(`Invalid status: ${val}`);
  }),
  isLookingForGroup: z.boolean().optional(),
  isFullAccess: z.boolean().optional(),
  // Relations
  instruments: z.array(z.object({
    instrumentId: z.number(),
    skillLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
    yearsPlaying: z.number().nullable().optional(),
    isPrimary: z.boolean().optional()
  })).optional(),
  roleIds: z.array(z.number()).optional(),
  badges: z.array(z.object({
    name: z.string()
  })).optional(),
  preferredGenres: z.array(z.string()).optional()
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
        isOutOfSchool: true,
        photoUrl: true,
        status: true,
        isLookingForGroup: true,
        isFullAccess: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
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
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
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
    
    console.log('API received body:', JSON.stringify(body, null, 2));
    console.log('roleIds in body:', body.roleIds, typeof body.roleIds);

    // Validate input
    console.log('About to validate data...');
    const validatedData = updateUserSchema.parse(body);
    console.log('Data validation successful:', validatedData);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check for email uniqueness if email is being updated
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email }
      });
      if (emailExists) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
      }
    }

    // Use transaction to update user and relations
    const updatedUser = await prisma.$transaction(async (tx) => {
      // Update basic user data
      const baseUpdateData: any = {};
      
      if (validatedData.firstName !== undefined) baseUpdateData.firstName = validatedData.firstName;
      if (validatedData.lastName !== undefined) baseUpdateData.lastName = validatedData.lastName;
      if (validatedData.email !== undefined) baseUpdateData.email = validatedData.email;
      if (validatedData.promotion !== undefined) baseUpdateData.promotion = validatedData.promotion;
      if (validatedData.birthDate !== undefined) baseUpdateData.birthDate = validatedData.birthDate;
      if (validatedData.biography !== undefined) baseUpdateData.biography = validatedData.biography;
      if (validatedData.phone !== undefined) baseUpdateData.phone = validatedData.phone;
      if (validatedData.pronouns !== undefined) baseUpdateData.pronouns = validatedData.pronouns;
      if (validatedData.isOutOfSchool !== undefined) baseUpdateData.isOutOfSchool = validatedData.isOutOfSchool;
      // Handle photo URL changes and cleanup
      if (validatedData.photoUrl !== undefined) {
        // If we're removing/changing the photo, clean up the old one
        if (existingUser.photoUrl && (validatedData.photoUrl === null || validatedData.photoUrl === '' || validatedData.photoUrl !== existingUser.photoUrl)) {
          try {
            // Find the storage object for the old photo
            const oldStorageObject = await tx.storageObject.findFirst({
              where: { 
                userId,
                url: existingUser.photoUrl
              }
            });
            
            if (oldStorageObject) {
              // Delete the storage object record
              await tx.storageObject.delete({
                where: { id: oldStorageObject.id }
              });
              
              // Delete the physical file
              const filePath = path.join(process.cwd(), 'public', 'storage', 'uploads', oldStorageObject.key);
              try {
                await fs.unlink(filePath);
                console.log(`Deleted old profile picture: ${oldStorageObject.key}`);
              } catch (fileError) {
                console.warn(`Failed to delete old profile picture file ${oldStorageObject.key}:`, fileError);
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
      if (validatedData.isLookingForGroup !== undefined) baseUpdateData.isLookingForGroup = validatedData.isLookingForGroup;
      if (validatedData.isFullAccess !== undefined) baseUpdateData.isFullAccess = validatedData.isFullAccess;

      const user = await tx.user.update({
        where: { id: userId },
        data: {
          ...baseUpdateData,
          updatedAt: new Date(),
        }
      });

      // Update instruments
      if (validatedData.instruments !== undefined) {
        // Delete existing instruments
        await tx.userInstrument.deleteMany({
          where: { userId }
        });
        
        // Add new instruments
        if (validatedData.instruments.length > 0) {
          // Remove duplicates by instrumentId (keep the last one)
          const uniqueInstruments = validatedData.instruments.reduce((acc: any[], inst) => {
            const existingIndex = acc.findIndex(existing => existing.instrumentId === inst.instrumentId);
            if (existingIndex >= 0) {
              // Replace existing with new one
              acc[existingIndex] = inst;
            } else {
              // Add new one
              acc.push(inst);
            }
            return acc;
          }, []);

          console.log('Original instruments:', validatedData.instruments);
          console.log('Unique instruments after deduplication:', uniqueInstruments);

          await tx.userInstrument.createMany({
            data: uniqueInstruments.map(inst => ({
              userId,
              instrumentId: inst.instrumentId,
              skillLevel: inst.skillLevel,
              yearsPlaying: inst.yearsPlaying,
              isPrimary: inst.isPrimary || false
            }))
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
            select: { id: true, name: true }
          });

          // Check role limits for each role being assigned
          for (const role of rolesToAssign) {
            // Get current users with this role (excluding current user)
            const currentUsersWithRole = await tx.userRole.count({
              where: { 
                roleId: role.id,
                userId: { not: userId }
              }
            });

            // Define role limits
            let maxUsers = 1; // Default: 1 user per role
            if (role.name === 'vice_president') {
              maxUsers = 2; // VP can have 2 users
            } else if (['member', 'former_member'].includes(role.name)) {
              maxUsers = 999; // No limit for member roles
            }

            // Debug logging
            console.log(`Role validation: ${role.name}, current: ${currentUsersWithRole}, max: ${maxUsers}`);
            
            // Check if assigning this role would exceed the limit
            if (currentUsersWithRole >= maxUsers) {
              throw new Error(`Role "${role.name}" is limited to ${maxUsers} user${maxUsers > 1 ? 's' : ''}. Current count: ${currentUsersWithRole}`);
            }
          }
        }

        // Delete existing roles
        await tx.userRole.deleteMany({
          where: { userId }
        });
        
        // Add new roles
        if (validatedData.roleIds.length > 0) {
          await tx.userRole.createMany({
            data: validatedData.roleIds.map(roleId => ({
              userId,
              roleId
            }))
          });
        }
      }

      // Update badges
      if (validatedData.badges !== undefined) {
        // Delete existing badges
        await tx.badge.deleteMany({
          where: { userId }
        });
        
        // Add new badges
        if (validatedData.badges.length > 0) {
          await tx.badge.createMany({
            data: validatedData.badges.map(badge => ({
              userId,
              name: badge.name
            }))
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
        isOutOfSchool: true,
        photoUrl: true,
        status: true,
        isLookingForGroup: true,
        isFullAccess: true,
        updatedAt: true,
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
          },
        },
      },
    });

    return NextResponse.json({ 
      user: fullUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error instanceof z.ZodError) {
      console.log('Zod validation error:', JSON.stringify(error.errors, null, 2));
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.errors,
        message: error.errors?.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') || 'Validation failed'
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to update user', 
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
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
      where: { id: userId }
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // First, get user's storage objects before deletion
    const userStorageObjects = await prisma.storageObject.findMany({ 
      where: { userId },
      select: { id: true, key: true }
    });
    
    // Use transaction to delete user and all related data
    await prisma.$transaction(async (tx) => {
      // Delete user instruments
      await tx.userInstrument.deleteMany({ where: { userId } });
      
      // Delete user roles
      await tx.userRole.deleteMany({ where: { userId } });
      
      // Delete group memberships
      await tx.groupMembership.deleteMany({ where: { userId } });
      
      // Delete badges
      await tx.badge.deleteMany({ where: { userId } });
      
      // Delete storage objects database records
      await tx.storageObject.deleteMany({ where: { userId } });
      
      // Delete registration request
      await tx.registrationRequest.deleteMany({ where: { userId } });
      
      // Delete votes
      await tx.vote.deleteMany({ where: { userId } });
      
      // Delete news authored by user
      await tx.news.deleteMany({ where: { authorId: userId } });
      
      // Finally delete the user
      await tx.user.delete({ where: { id: userId } });
    });
    
    // After successful database deletion, clean up physical files
    for (const storageObj of userStorageObjects) {
      try {
        const filePath = path.join(process.cwd(), 'public', 'storage', 'uploads', storageObj.key);
        await fs.unlink(filePath);
        console.log(`Deleted storage file: ${storageObj.key}`);
      } catch (error) {
        console.warn(`Failed to delete storage file ${storageObj.key}:`, error);
        // Continue even if file cleanup fails - the user is already deleted
      }
    }

    return NextResponse.json({ 
      message: 'User deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}