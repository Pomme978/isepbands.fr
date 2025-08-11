// Login API route for custom auth
import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, getUserByEmail, setSession } from '@/lib/auth';
import { getErrorMessage } from '@/lib/i18n-api';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = await getUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.password))) {
    const lang = req.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'fr';
    const error = await getErrorMessage('registrationError', lang);
    return NextResponse.json({ error }, { status: 401 });
  }
  const res = NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
  await setSession(res, { id: user.id, email: user.email });
  return res;
}
