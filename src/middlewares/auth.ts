import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

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
