import { requireAuth } from '@/middlewares/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return NextResponse.json(null, { status: 200 });
  return NextResponse.json({ user: auth.user });
}
