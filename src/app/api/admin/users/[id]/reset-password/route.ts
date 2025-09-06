import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/utils/authMiddleware';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check authentication and permissions
    const authResult = await requireAdminAuth(request);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id: userId } = await params;

    // Validate request body
    const body = await request.json();
    const { password, sendEmail = false, requireChange = true } = body;

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 },
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        requirePasswordChange: requireChange,
        updatedAt: new Date(), // Force session invalidation
      },
    });

    // Logger le reset de mot de passe
    try {
      const { logAdminAction } = await import('@/services/activityLogService');
      await logAdminAction(
        authResult.user.id,
        'user_password_reset',
        'Mot de passe réinitialisé',
        `Le mot de passe de **${user.firstName} ${user.lastName}** (${user.email}) a été réinitialisé`,
        userId,
        {
          userEmail: user.email,
          sendEmail: sendEmail,
          resetAt: new Date().toISOString(),
        },
      );
    } catch (err) {
      // Activity log error
    }

    // Send email notification if requested
    if (sendEmail) {
      try {
        console.log('Sending admin password reset email to', user.email);
        const { EmailService } = await import('@/services/emailService');
        const resetToken = `${user.id}.${Date.now()}.${crypto.randomUUID()}`;

        await EmailService.sendAdminPasswordResetEmail(
          user.email,
          `${user.firstName} ${user.lastName}`,
          resetToken,
          `${authResult.user.firstName} ${authResult.user.lastName}`,
        );
        console.log('Admin password reset email sent successfully to', user.email);
      } catch (emailError) {
        console.error('Error sending admin password reset email:', emailError);
        // Don't block password reset if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
