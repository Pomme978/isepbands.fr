import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EmailService } from '@/services/emailService';
import { passwordResetLimiter } from '@/lib/rateLimiter';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Apply strict rate limiting for password resets
    const rateLimitResult = await passwordResetLimiter(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

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

    // Always return the same message to prevent email enumeration
    const standardResponse = {
      success: true,
      message:
        'Si un compte existe avec cette adresse email, un lien de réinitialisation vous sera envoyé.',
    };

    // If user doesn't exist, return success to avoid enumeration
    if (!user) {
      return NextResponse.json(standardResponse, { status: 200 });
    }

    // If account is inactive, still send success but don't send email
    if (user.status !== 'CURRENT') {
      return NextResponse.json(standardResponse, { status: 200 });
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

    // Return the same standardized response
    return NextResponse.json(standardResponse);
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 },
    );
  }
}
