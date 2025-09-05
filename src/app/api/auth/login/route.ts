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
      where: { userId: typeof user.id === 'string' ? parseInt(user.id, 10) : user.id },
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
      where: { userId: typeof user.id === 'string' ? parseInt(user.id, 10) : user.id },
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

  // Logger toutes les connexions utilisateur
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
          loginAt: new Date().toISOString(),
        },
      );
    } else {
      // Log user login - l'utilisateur se connecte à son propre compte
      console.log('Logging user login for:', user.id, user.email);
      await logAdminAction(
        typeof user.id === 'string' ? user.id : user.id.toString(), // createdBy - qui fait l'action (l'utilisateur lui-même)
        'user_login',
        'Connexion utilisateur',
        `Connexion de **${user.firstName || ''} ${user.lastName || ''}** (${user.email})`,
        typeof user.id === 'string' ? user.id : user.id.toString(), // userId - sur quel utilisateur porte l'action
        {
          userAgent: req.headers.get('user-agent'),
          ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'IP inconnue',
          loginAt: new Date().toISOString(),
        },
      );
      console.log('User login logged successfully');
    }
  } catch (err) {
    // Activity log error - don't fail login for this
    console.error('Failed to log user login:', err);
  }
  // Check if user needs to change password
  const userWithPasswordChangeFlag = await prisma.user.findUnique({
    where: { id: typeof user.id === 'string' ? parseInt(user.id, 10) : user.id },
    select: {
      requirePasswordChange: true,
      firstName: true,
      lastName: true,
    },
  });

  const res = NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      firstName: userWithPasswordChangeFlag?.firstName,
      lastName: userWithPasswordChangeFlag?.lastName,
      requirePasswordChange: userWithPasswordChangeFlag?.requirePasswordChange || false,
    },
  });
  await setSession(res, {
    id: typeof user.id === 'string' ? user.id : user.id.toString(),
    email: user.email,
  });
  return res;
}
