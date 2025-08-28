import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getErrorMessage } from '@/lib/i18n-api';

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isFullAccess?: boolean;
  isRoot?: boolean;
  roles?: Array<{
    role: {
      id: number;
      name: string;
      weight: number;
      isCore: boolean;
    };
  }>;
}

interface AuthSuccess {
  user: AuthUser;
}

/**
 * Standard authentication middleware for API routes
 * Returns either a NextResponse (error) or user data (success)
 */
export async function standardAuth(req: NextRequest): Promise<NextResponse | AuthSuccess> {
  const user = await getSessionUser(req);

  if (!user) {
    const lang = req.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'fr';
    const error = await getErrorMessage('unauthorized', lang);
    return NextResponse.json({ error }, { status: 401 });
  }

  return { user };
}

/**
 * Admin authentication middleware - requires full access or root permissions
 */
export async function requireAdminAuth(req: NextRequest): Promise<NextResponse | AuthSuccess> {
  const authResult = await standardAuth(req);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  if (!user.isFullAccess && !user.isRoot) {
    const lang = req.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'fr';
    const error = (await getErrorMessage('admin_required', lang)) || 'Admin access required';
    return NextResponse.json({ error }, { status: 403 });
  }

  return { user };
}

/**
 * Root authentication middleware - requires root permissions only
 */
export async function requireRootAuth(req: NextRequest): Promise<NextResponse | AuthSuccess> {
  const authResult = await standardAuth(req);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  if (!user.isRoot) {
    const lang = req.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'fr';
    const error = (await getErrorMessage('root_required', lang)) || 'Root access required';
    return NextResponse.json({ error }, { status: 403 });
  }

  return { user };
}

/**
 * Permission-based authentication middleware
 */
export async function requirePermission(
  req: NextRequest,
  permission: string,
): Promise<NextResponse | AuthSuccess> {
  const authResult = await standardAuth(req);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  // Root users have all permissions
  if (user.isRoot) {
    return { user };
  }

  // Check if user has the required permission through their roles
  const hasPermission = user.roles?.some(
    (userRole) =>
      userRole.role.isCore || // Core roles have broad permissions
      // Add specific permission checking logic here if needed
      user.isFullAccess, // Full access users get most permissions
  );

  if (!hasPermission) {
    const lang = req.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'fr';
    const error = (await getErrorMessage('permission_denied', lang)) || 'Permission denied';
    return NextResponse.json({ error }, { status: 403 });
  }

  return { user };
}
