import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EmailService } from '@/services/emailService';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // TODO: Add rate limiting in production

    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, message: 'Email requis' }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
      },
    });

    // Return different messages for different cases
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Aucun compte associé à cette adresse email.',
        },
        { status: 404 },
      );
    }

    if (user.status !== 'CURRENT') {
      return NextResponse.json(
        {
          success: false,
          message: 'Ce compte est inactif. Contactez un administrateur.',
        },
        { status: 403 },
      );
    }

    // Generate reset token (valid for 1 hour)
    // For now, we create a simple token. In production, you should use the PasswordReset table
    const resetToken = `${user.id}.${Date.now()}.${crypto.randomUUID()}`;

    // Send reset email
    await EmailService.sendPasswordResetEmail(
      user.email,
      `${user.firstName} ${user.lastName}`,
      resetToken,
    );

    return NextResponse.json({
      success: true,
      message: 'Un lien de réinitialisation a été envoyé à votre adresse email.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 },
    );
  }
}
