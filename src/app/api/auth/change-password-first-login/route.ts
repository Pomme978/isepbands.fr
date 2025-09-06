import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { verifyPassword, setSession } from '@/lib/auth';
import { logAdminAction } from '@/services/activityLogService';

// Schema for secure password change with token
const changePasswordSchema = z
  .object({
    token: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
    currentPassword: z.string().optional(), // Optional when using token
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
  })
  .refine((data) => data.token || data.email, { message: 'Either token or email must be provided' })
  .refine((data) => data.token || (data.email && data.currentPassword), {
    message: 'Current password is required when using email authentication',
  });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = changePasswordSchema.parse(body);

    let user = null;
    let tokenRecord = null;

    // First try to find user by secure token
    if (validatedData.token) {
      tokenRecord = await prisma.passwordChangeToken.findUnique({
        where: { token: validatedData.token },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              password: true,
              firstName: true,
              lastName: true,
              requirePasswordChange: true,
            },
          },
        },
      });

      if (tokenRecord) {
        // Check if token is valid
        if (tokenRecord.used) {
          return NextResponse.json({ error: 'Token has already been used' }, { status: 400 });
        }

        if (tokenRecord.expiresAt < new Date()) {
          return NextResponse.json({ error: 'Token has expired' }, { status: 400 });
        }

        user = tokenRecord.user;
      } else {
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
      }
    }
    // Fallback to email-based lookup (less secure)
    else if (validatedData.email) {
      user = await prisma.user.findUnique({
        where: { email: validatedData.email },
        select: {
          id: true,
          email: true,
          password: true,
          firstName: true,
          lastName: true,
          requirePasswordChange: true,
        },
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password only if using email authentication (not token)
    if (!validatedData.token && validatedData.currentPassword) {
      const isCurrentPasswordValid = await verifyPassword(
        validatedData.currentPassword,
        user.password,
      );

      if (!isCurrentPasswordValid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }
    }

    // Check if user actually needs to change password
    if (!user.requirePasswordChange) {
      return NextResponse.json(
        { error: 'Password change is not required for this user' },
        { status: 400 },
      );
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 10);

    // Update user password and reset flags (in transaction with token update)
    await prisma.$transaction(async (tx) => {
      // Update user password
      await tx.user.update({
        where: { id: user.id },
        data: {
          password: hashedNewPassword,
          requirePasswordChange: false,
        },
      });

      // Mark token as used if it was provided
      if (tokenRecord) {
        await tx.passwordChangeToken.update({
          where: { id: tokenRecord.id },
          data: { used: true },
        });
      }
    });

    // Log the password change activity
    try {
      await logAdminAction(
        'system',
        'password_changed',
        'Changement de mot de passe',
        `**${user.firstName} ${user.lastName}** (${user.email}) a changé son mot de passe lors de la première connexion`,
        user.id.toString(),
        {
          userEmail: user.email,
          usedSecureToken: !!tokenRecord,
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
