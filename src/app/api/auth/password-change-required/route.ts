import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middlewares/auth';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) {
    return auth.res;
  }

  try {
    // Check if user has requirePasswordChange flag set
    // For now, we'll assume this information is stored in the user object
    // This should be modified based on your actual schema
    const required = auth.user.requirePasswordChange === true;

    return NextResponse.json({
      required,
      message: required ? 'Password change required' : 'No password change required',
    });
  } catch (error) {
    console.error('Error checking password change requirement:', error);
    return NextResponse.json({ error: 'Erreur lors de la vérification' }, { status: 500 });
  }
}
