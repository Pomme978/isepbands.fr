import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middlewares/auth';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;
  return NextResponse.json({ user: auth.user });
}
