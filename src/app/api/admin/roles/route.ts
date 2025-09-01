import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middlewares/auth';
import { checkAdminPermission } from '@/middlewares/admin';
import { prisma } from '@/lib/prisma';
import { logAdminAction } from '@/services/activityLogService';
import { z } from 'zod';
// import { ensureDBIntegrity } from '@/utils/dbIntegrity'; // Moved to manual DB admin page

const createRoleSchema = z.object({
  name: z.string().min(1),
  nameFrMale: z.string().min(1),
  nameFrFemale: z.string().min(1),
  nameEnMale: z.string().min(1),
  nameEnFemale: z.string().min(1),
  weight: z.number().int().min(0),
  isCore: z.boolean().default(false),
  permissionIds: z.array(z.number().int()).default([]),
});

export async function GET(req: NextRequest) {
  // TODO: Re-enable auth check once we have test users
  // const authResult = await requireAuth(req);
  // if (!authResult.ok) {
  //   return authResult.res;
  // }

  try {
    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
        nameFrMale: true,
        nameFrFemale: true,
        nameEnMale: true,
        nameEnFemale: true,
        weight: true,
        isCore: true,
        permissions: {
          select: {
            permission: {
              select: {
                id: true,
                name: true,
                nameFr: true,
                nameEn: true,
                description: true,
              },
            },
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: {
        weight: 'desc',
      },
    });

    // Transform the data to flatten permissions and calculate availability
    const transformedRoles = roles.map((role) => {
      // Define role limits (same logic as in user creation API)
      let maxUsers = 1; // Default: 1 user per role
      if (role.name === 'vice_president') {
        maxUsers = 2; // VP can have 2 users
      } else if (['member', 'former_member'].includes(role.name)) {
        maxUsers = 999; // No limit for member roles
      }

      const currentCount = role._count.users;
      const isAvailable = currentCount < maxUsers;
      const spotsLeft = maxUsers === 999 ? 999 : maxUsers - currentCount;

      return {
        id: role.id,
        name: role.name,
        nameFrMale: role.nameFrMale,
        nameFrFemale: role.nameFrFemale,
        nameEnMale: role.nameEnMale,
        nameEnFemale: role.nameEnFemale,
        weight: role.weight,
        isCore: role.isCore,
        userCount: currentCount,
        maxUsers: maxUsers,
        isAvailable: isAvailable,
        spotsLeft: spotsLeft,
        permissions: role.permissions.map((rp) => rp.permission),
      };
    });

    return NextResponse.json({ roles: transformedRoles });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Check authentication
  const authResult = await requireAuth(req);
  if (!authResult.ok) {
    return authResult.res;
  }

  // Check admin permission
  const adminCheck = await checkAdminPermission(authResult.user);
  if (!adminCheck.hasPermission) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validatedData = createRoleSchema.parse(body);

    // Check if role with this name already exists
    const existingRole = await prisma.role.findFirst({
      where: {
        OR: [
          { name: validatedData.name },
          { nameFrMale: validatedData.nameFrMale },
          { nameFrFemale: validatedData.nameFrFemale },
          { nameEnMale: validatedData.nameEnMale },
          { nameEnFemale: validatedData.nameEnFemale },
        ],
      },
    });

    if (existingRole) {
      return NextResponse.json(
        {
          error: 'A role with this name already exists',
        },
        { status: 400 },
      );
    }

    // Create role with transaction to include permissions
    const role = await prisma.$transaction(async (tx) => {
      const newRole = await tx.role.create({
        data: {
          name: validatedData.name,
          nameFrMale: validatedData.nameFrMale,
          nameFrFemale: validatedData.nameFrFemale,
          nameEnMale: validatedData.nameEnMale,
          nameEnFemale: validatedData.nameEnFemale,
          weight: validatedData.weight,
          isCore: validatedData.isCore,
        },
      });

      // Add permissions if provided
      if (validatedData.permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: validatedData.permissionIds.map((permissionId) => ({
            roleId: newRole.id,
            permissionId,
          })),
        });
      }

      return newRole;
    });

    // Fetch the complete role with permissions
    const completeRole = await prisma.role.findUnique({
      where: { id: role.id },
      select: {
        id: true,
        name: true,
        nameFrMale: true,
        nameFrFemale: true,
        nameEnMale: true,
        nameEnFemale: true,
        weight: true,
        isCore: true,
        permissions: {
          select: {
            permission: {
              select: {
                id: true,
                name: true,
                nameFr: true,
                nameEn: true,
                description: true,
              },
            },
          },
        },
      },
    });

    // Log admin action
    await logAdminAction(
      authResult.user.id,
      'role_created',
      'Nouveau rôle créé',
      `**${validatedData.nameFrMale}** (${validatedData.name}) créé avec ${validatedData.permissionIds.length} permission(s)`,
      null, // No specific user targeted
      {
        roleName: validatedData.name,
        nameFrMale: validatedData.nameFrMale,
        nameFrFemale: validatedData.nameFrFemale,
        weight: validatedData.weight,
        isCore: validatedData.isCore,
        permissionCount: validatedData.permissionIds.length,
        permissionIds: validatedData.permissionIds
      }
    );

    return NextResponse.json(
      {
        role: {
          ...completeRole,
          permissions: completeRole?.permissions.map((rp) => rp.permission) || [],
        },
        message: 'Role created successfully',
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 },
      );
    }

    console.error('Error creating role:', error);
    return NextResponse.json({ error: 'Failed to create role' }, { status: 500 });
  }
}
