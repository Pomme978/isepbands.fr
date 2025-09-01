import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middlewares/auth';
import { checkAdminPermission } from '@/middlewares/admin';
import { prisma } from '@/lib/prisma';
import { logAdminAction } from '@/services/activityLogService';
import { z } from 'zod';

const createPermissionSchema = z.object({
  name: z.string().min(1),
  nameFr: z.string().min(1),
  nameEn: z.string().min(1),
  description: z.string().optional(),
});

export async function GET(req: NextRequest) {
  // TODO: Re-enable auth check once we have test users
  // const authResult = await requireAuth(req);
  // if (!authResult.ok) {
  //   return authResult.res;
  // }

  try {
    const permissions = await prisma.permission.findMany({
      select: {
        id: true,
        name: true,
        nameFr: true,
        nameEn: true,
        description: true,
        _count: {
          select: {
            roles: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const transformedPermissions = permissions.map((permission) => ({
      id: permission.id,
      name: permission.name,
      nameFr: permission.nameFr,
      nameEn: permission.nameEn,
      description: permission.description,
      rolesCount: permission._count.roles,
    }));

    return NextResponse.json({ permissions: transformedPermissions });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json({ error: 'Failed to fetch permissions' }, { status: 500 });
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
    const validatedData = createPermissionSchema.parse(body);

    // Check if permission with this name already exists
    const existingPermission = await prisma.permission.findFirst({
      where: {
        OR: [
          { name: validatedData.name },
          { nameFr: validatedData.nameFr },
          { nameEn: validatedData.nameEn },
        ],
      },
    });

    if (existingPermission) {
      return NextResponse.json(
        {
          error: 'A permission with this name already exists',
        },
        { status: 400 },
      );
    }

    const permission = await prisma.permission.create({
      data: validatedData,
      select: {
        id: true,
        name: true,
        nameFr: true,
        nameEn: true,
        description: true,
      },
    });

    // Log admin action
    await logAdminAction(
      authResult.user.id,
      'permission_created',
      'Nouvelle permission créée',
      `**${validatedData.nameFr}** (${validatedData.name}) créée`,
      null, // No specific user targeted
      {
        permissionName: validatedData.name,
        nameFr: validatedData.nameFr,
        nameEn: validatedData.nameEn,
        description: validatedData.description || null
      }
    );

    return NextResponse.json(
      {
        permission,
        message: 'Permission created successfully',
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

    console.error('Error creating permission:', error);
    return NextResponse.json({ error: 'Failed to create permission' }, { status: 500 });
  }
}
