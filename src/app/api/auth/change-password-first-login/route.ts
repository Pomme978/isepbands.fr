import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { verifyPassword, setSession } from '@/lib/auth';
import { logAdminAction } from '@/services/activityLogService';

// Schema for password change
const changePasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine(
      (password) => /[a-z]/.test(password),
      'Password must contain at least one lowercase letter',
    )
    .refine(
      (password) => /[A-Z]/.test(password),
      'Password must contain at least one uppercase letter',
    )
    .refine((password) => /\d/.test(password), 'Password must contain at least one number')
    .refine(
      (password) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      'Password must contain at least one special character',
    ),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = changePasswordSchema.parse(body);

    // Get user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        mustChangePasswordOnLogin: true,
        hasTemporaryPassword: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(
      validatedData.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    // Check if user actually needs to change password
    if (!user.mustChangePasswordOnLogin) {
      return NextResponse.json(
        { error: 'Password change is not required for this user' },
        { status: 400 },
      );
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 10);

    // Update user password and reset flags
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
        mustChangePasswordOnLogin: false,
        hasTemporaryPassword: false,
        firstLoginAt: user.hasTemporaryPassword ? new Date() : undefined, // Set first login time if it was temporary
      },
    });

    // Log the password change activity
    try {
      await logAdminAction(
        'system',
        'password_changed',
        'Changement de mot de passe',
        `**${user.firstName} ${user.lastName}** (${user.email}) a changé son mot de passe${user.hasTemporaryPassword ? ' temporaire' : ''} lors de la première connexion`,
        user.id.toString(),
        {
          userEmail: user.email,
          wasTemporaryPassword: user.hasTemporaryPassword,
          changedAt: new Date().toISOString(),
          userAgent: req.headers.get('user-agent'),
          ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'IP inconnue',
        },
      );
    } catch (logError) {
      console.error('Failed to log password change:', logError);
      // Continue with success response even if logging fails
    }

    // Create session after successful password change
    const res = NextResponse.json({
      success: true,
      message: 'Password changed successfully',
      user: { id: user.id, email: user.email },
    });

    await setSession(res, { id: user.id.toString(), email: user.email });
    return res;
  } catch (error) {
    console.error('Password change error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
