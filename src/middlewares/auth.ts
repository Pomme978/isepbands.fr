import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { checkAdminPermission } from './admin';
import { prisma } from '@/lib/prisma';

export async function requireAuth(req: NextRequest, checkPasswordChange = true) {
  const user = await getSessionUser(req);
  if (!user) {
    // Use simple error message to avoid i18n overhead
    return {
      ok: false,
      res: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  // Check if user needs to change password (skip for password change endpoints)
  if (checkPasswordChange && user.id !== 'root') {
    const userWithPasswordFlag = await prisma.user.findUnique({
      where: { id: user.id },
      select: { requirePasswordChange: true, email: true },
    });

    if (userWithPasswordFlag?.requirePasswordChange) {
      // Generate secure token for password change
      let passwordChangeToken = null;
      try {
        const crypto = await import('crypto');
        const tokenValue = crypto.randomBytes(64).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        // Clean up old tokens
        await prisma.passwordChangeToken.deleteMany({
          where: {
            userId: user.id,
            OR: [{ used: true }, { expiresAt: { lt: new Date() } }],
          },
        });

        // Create new token
        passwordChangeToken = await prisma.passwordChangeToken.create({
          data: {
            token: tokenValue,
            userId: user.id,
            expiresAt,
          },
        });
      } catch (tokenError) {
        console.error('Error creating password change token:', tokenError);
      }

      return {
        ok: false,
        res: NextResponse.json(
          {
            error: 'Password change required',
            requirePasswordChange: true,
            email: userWithPasswordFlag.email,
            passwordChangeToken: passwordChangeToken?.token || null,
          },
          { status: 403 },
        ),
      };
    }
  }

  return { ok: true, user };
}

export async function requireAdminAuth(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth;

  // Check admin permission
  const adminCheck = await checkAdminPermission(auth.user);
  if (!adminCheck.hasPermission) {
    return {
      ok: false,
      res: NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 }),
    };
  }

  return { ok: true, user: auth.user };
}
