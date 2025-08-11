import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth';

export async function POST() {
  const res = NextResponse.json({ success: true });
  await clearSession(res);
  return res;
}
