import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getErrorMessage } from '@/lib/i18n-api';

export async function requireAuth(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) {
    const lang = req.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'fr';
    const error = await getErrorMessage('unauthorized', lang);
    return {
      ok: false,
      res: NextResponse.json({ error }, { status: 401 }),
    };
  }
  return { ok: true, user };
}
