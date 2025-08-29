// Login API route for custom auth
import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, getUserByEmail, setSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = await getUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.password))) {
    // Use simple error message to avoid i18n overhead
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const res = NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
  await setSession(res, { id: user.id, email: user.email });
  return res;
}
