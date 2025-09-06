import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

const validatePassword = (password: string): string[] => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial');
  }

  return errors;
};

export async function POST(request: NextRequest) {
  try {
    // TODO: Add rate limiting in production

    const { token, email, password } = await request.json();

    if (!token || !email || !password) {
      return NextResponse.json({ success: false, message: 'Données manquantes' }, { status: 400 });
    }

    // Validate password strength
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Mot de passe non conforme', errors: passwordErrors },
        { status: 400 },
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        status: true,
      },
    });

    if (!user || user.status !== 'CURRENT') {
      return NextResponse.json(
        { success: false, message: 'Token invalide ou expiré' },
        { status: 400 },
      );
    }

    // Parse and validate token (simplified approach)
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        return NextResponse.json({ success: false, message: 'Token invalide' }, { status: 400 });
      }

      const [tokenUserId, timestamp, uuid] = tokenParts;

      // Check if token is for this user
      if (tokenUserId !== user.id) {
        return NextResponse.json({ success: false, message: 'Token invalide' }, { status: 400 });
      }

      // Check if token is not expired (1 hour)
      const tokenTime = parseInt(timestamp);
      const now = Date.now();
      const hourInMs = 60 * 60 * 1000;

      if (now - tokenTime > hourInMs) {
        return NextResponse.json({ success: false, message: 'Token expiré' }, { status: 400 });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Update user password
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          requirePasswordChange: false, // Reset this flag if it was set
        },
      });

      // Create response and clear any active session to force re-authentication
      const response = NextResponse.json({
        success: true,
        message: 'Mot de passe mis à jour avec succès',
      });

      // Clear the session cookie to force logout after password reset
      const { clearSession } = await import('@/lib/auth');
      clearSession(response);

      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      return NextResponse.json(
        { success: false, message: 'Token invalide ou expiré' },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 },
    );
  }
}
