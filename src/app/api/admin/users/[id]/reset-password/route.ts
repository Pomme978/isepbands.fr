import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
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
      },
    });

    // Logger le reset de mot de passe
    try {
      const { createActivityLog } = await import('@/services/activityLogService');
      await createActivityLog({
        userId,
        type: 'user_password_reset',
        title: 'Mot de passe réinitialisé',
        description: `Mot de passe réinitialisé pour ${user.firstName} ${user.lastName}`,
        metadata: { userId, sendEmail },
        createdBy: authResult.user?.id ? String(authResult.user.id) : undefined,
      });
    } catch (err) {
      console.log('Activity log error:', err);
    }

    // TODO: Implement email notification if sendEmail is true
    if (sendEmail) {
      console.log(`Would send email notification to ${user.email} about password reset`);
      // Here you would integrate with your email service
      // await sendPasswordResetNotification(user.email, user.firstName);
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
