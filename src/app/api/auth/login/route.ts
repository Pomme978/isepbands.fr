// Login API route for custom auth
import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, getUserByEmail, setSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = await getUserByEmail(email);

  if (!user || !(await verifyPassword(password, user.password))) {
    // Use simple error message to avoid i18n overhead
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Check user status and handle suspended/refused accounts
  if (user.status === 'REFUSED') {
    // Get rejection reason from RegistrationRequest
    const registrationRequest = await prisma.registrationRequest.findUnique({
      where: { userId: user.id },
      select: { rejectionReason: true },
    });

    const rejectionMessage =
      registrationRequest?.rejectionReason || "Votre demande d'inscription a été refusée.";

    return NextResponse.json(
      {
        error: 'account_suspended',
        message: `Compte suspendu: ${rejectionMessage}`,
        details: rejectionMessage,
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

  if (user.status === 'PENDING') {
    return NextResponse.json(
      {
        error: 'account_pending',
        message: "Votre demande d'inscription est en cours de validation.",
      },
      { status: 403 },
    );
  }

  const res = NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
  await setSession(res, { id: user.id, email: user.email });
  return res;
}
