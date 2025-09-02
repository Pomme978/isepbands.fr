import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { checkAdminPermission } from './admin';

export async function requireAuth(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) {
    // Use simple error message to avoid i18n overhead
    return {
      ok: false,
      res: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
  return { ok: true, user };
}

export async function requireAdminAuth(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth;

  // Check admin permission
  const adminCheck = await checkAdminPermission(auth.user);
  if (!adminCheck.hasPermission) {
    return {
      ok: false,
      res: NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 }),
    };
  }

  return { ok: true, user: auth.user };
}
