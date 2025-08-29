import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '../../lib/prisma';

export async function requireAdminAuth(req: NextRequest) {
  const user = await getSessionUser(req);

  if (!user) {
    // Use simple error message to avoid i18n overhead
    return {
      ok: false,
      res: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  // Root user has full access
  if (user.isRoot) {
    return { ok: true, user };
  }

  // Check if regular user has admin access
  if (!user.isFullAccess) {
    return {
      ok: false,
      res: NextResponse.json({ error: 'Admin access required' }, { status: 403 }),
    };
  }

  return { ok: true, user };
}

export async function requireAdminPermission(req: NextRequest, permission: string) {
  const user = await getSessionUser(req);
  if (!user) {
    // Use simple error message to avoid i18n overhead
    return {
      ok: false,
      res: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  // Root user bypasses all permission checks
  if (user.isRoot) {
    return { ok: true, user };
  }

  // Get user with roles and permissions
  const userWithPermissions = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      status: true,
      isFullAccess: true,
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!userWithPermissions) {
    return {
      ok: false,
      res: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  // Check full access override
  if (userWithPermissions.isFullAccess) {
    return { ok: true, user };
  }

  // Check if user has the required permission
  const hasPermission = userWithPermissions.roles.some((userRole) =>
    userRole.role.permissions.some(
      (rolePermission) => rolePermission.permission.name === permission,
    ),
  );

  if (!hasPermission) {
    return {
      ok: false,
      res: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  return {
    ok: true,
    user: {
      id: userWithPermissions.id,
      firstName: userWithPermissions.firstName,
      lastName: userWithPermissions.lastName,
      email: userWithPermissions.email,
      status: userWithPermissions.status,
    },
  };
}

// Simple admin permission check (for basic admin tasks like club feed)
export async function checkAdminPermission(
  user: { isRoot?: boolean; isFullAccess?: boolean } | null,
) {
  if (!user) {
    return { hasPermission: false };
  }

  // Root user has full access
  if (user.isRoot || user.isFullAccess) {
    return { hasPermission: true };
  }

  // For now, allow any authenticated user to manage club feed
  // This can be enhanced later with specific permissions
  return { hasPermission: true };
}
