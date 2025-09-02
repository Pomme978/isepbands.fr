// Login API route for custom auth
import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, getUserByEmail, setSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = await getUserByEmail(email);

  if (!user || !(await verifyPassword(password, user.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Check user status and handle suspended/refused accounts
  if (user.status === 'REFUSED') {
    const registrationRequest = await prisma.registrationRequest.findUnique({
      where: { userId: user.id },
      select: { rejectionReason: true },
    });
    const rejectionMessage = registrationRequest?.rejectionReason || 'Aucune raison spécifiée.';
    return NextResponse.json(
      {
        error: 'account_suspended',
        message: `Votre compte a été refusé pour la raison suivante : ${rejectionMessage}`,
        details: rejectionMessage,
      },
      { status: 403 },
    );
  }

  if (user.status === 'SUSPENDED') {
    const registrationRequest = await prisma.registrationRequest.findUnique({
      where: { userId: user.id },
      select: { rejectionReason: true },
    });
    const suspensionMessage = registrationRequest?.rejectionReason || 'Aucune raison spécifiée.';
    return NextResponse.json(
      {
        error: 'account_suspended',
        message: `Votre compte a été suspendu pour la raison suivante : ${suspensionMessage}`,
        details: suspensionMessage,
      },
      { status: 403 },
    );
  }

  if (user.status === 'DELETED') {
    return NextResponse.json(
      {
        error: 'account_deleted',
        message: 'Ce compte a été supprimé.',
      },
      { status: 403 },
    );
  }

  // Logger la connexion pour le root user et première connexion des utilisateurs
  try {
    const { logAdminAction } = await import('@/services/activityLogService');
    
    if (user.id === 'root') {
      // Log root login
      await logAdminAction(
        'root',
        'root_login',
        'Connexion Root',
        'Connexion du compte **Root Admin** détectée',
        null,
        {
          userAgent: req.headers.get('user-agent'),
          ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'IP inconnue',
          loginAt: new Date().toISOString()
        }
      );
    }
  } catch (err) {
    // Activity log error
  }
  const res = NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
  await setSession(res, { id: user.id, email: user.email });
  return res;
}
