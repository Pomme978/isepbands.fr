import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getErrorMessage } from '@/lib/i18n-api';
import { prisma } from '@/prisma';

export async function requireAdminAuth(req: NextRequest) {
  const user = await getSessionUser(req);
  
  if (!user) {
    const lang = req.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'fr';
    const error = await getErrorMessage('unauthorized', lang);
    return {
      ok: false,
      res: NextResponse.json({ error }, { status: 401 }),
    };
  }

  // Root user has full access
  if (user.isRoot) {
    return { ok: true, user };
  }

  // Check if regular user has admin access
  if (!user.isFullAccess) {
    const lang = req.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'fr';
    const error = await getErrorMessage('forbidden', lang);
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
    const lang = req.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'fr';
    const error = await getErrorMessage('unauthorized', lang);
    return {
      ok: false,
      res: NextResponse.json({ error }, { status: 401 }),
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
                  permission: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!userWithPermissions) {
    const lang = req.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'fr';
    const error = await getErrorMessage('unauthorized', lang);
    return {
      ok: false,
      res: NextResponse.json({ error }, { status: 401 }),
    };
  }

  // Check full access override
  if (userWithPermissions.isFullAccess) {
    return { ok: true, user };
  }

  // Check if user has the required permission
  const hasPermission = userWithPermissions.roles.some(userRole =>
    userRole.role.permissions.some(rolePermission =>
      rolePermission.permission.name === permission
    )
  );

  if (!hasPermission) {
    const lang = req.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'fr';
    const error = await getErrorMessage('forbidden', lang);
    return {
      ok: false,
      res: NextResponse.json({ error }, { status: 403 }),
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
    }
  };
}