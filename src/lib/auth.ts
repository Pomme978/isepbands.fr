import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_COOKIE = 'session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

// Hardcoded root user for emergency admin access
const ROOT_USER = {
  id: 'root',
  email: 'root@admin.local',
  firstName: 'Root',
  lastName: 'Admin',
  password: 'ROOTPASS25*',
  // Pre-hashed password to avoid bcrypt on each call
  hashedPassword: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // hash of 'ROOTPASS25*'
  isFullAccess: true,
};

export async function getUserByEmail(email: string) {
  // Check if it's the root user
  if (email === ROOT_USER.email) {
    return {
      id: ROOT_USER.id,
      email: ROOT_USER.email,
      firstName: ROOT_USER.firstName,
      lastName: ROOT_USER.lastName,
      password: ROOT_USER.hashedPassword, // Use pre-hashed password
      isFullAccess: true,
      status: 'CURRENT',
    };
  }

  return prisma.user.findUnique({
    where: { email },
    include: {
      roles: {
        include: {
          role: {
            select: {
              name: true,
              weight: true,
            },
          },
        },
      },
    },
  });
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function setSession(res: NextResponse, user: { id: string; email: string }) {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    iat: Math.floor(Date.now() / 1000), // Add issued at time for session validation
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(new TextEncoder().encode(JWT_SECRET));
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function getSessionUser(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  if (!cookie) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(cookie, new TextEncoder().encode(JWT_SECRET));

    // Check if it's the root user
    if (payload.id === 'root') {
      return {
        id: ROOT_USER.id,
        email: ROOT_USER.email,
        firstName: ROOT_USER.firstName,
        lastName: ROOT_USER.lastName,
        band: null,
        status: 'CURRENT',
        isFullAccess: true,
        isRoot: true,
      };
    }

    // Regular database user
    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        photoUrl: true,
        pronouns: true,
        status: true,
        isFullAccess: true,
        updatedAt: true, // Add updatedAt for session validation
        roles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
                nameFrMale: true,
                nameFrFemale: true,
                nameEnMale: true,
                nameEnFemale: true,
                weight: true,
                isCore: true,
              },
            },
          },
        },
        // Simplify group query - only get first group name if needed
        groupMemberships: {
          take: 1,
          select: {
            group: {
              select: { name: true },
            },
          },
        },
      },
    });
    if (!user) {
      return null;
    }

    // Check if user account is suspended/refused
    if (user.status === 'REFUSED' || user.status === 'DELETED') {
      return null; // Force logout for suspended/refused users
    }

    // Quick token validation - only check if token is significantly old
    const tokenIssuedAt = payload.iat as number;
    const userUpdatedAt = Math.floor(new Date(user.updatedAt || 0).getTime() / 1000);
    const timeDifferenceMinutes = (userUpdatedAt - tokenIssuedAt) / 60;

    if (timeDifferenceMinutes > 5) {
      // Token was issued more than 5 minutes before user update - likely password reset
      return null;
    }
    const band = user.groupMemberships[0]?.group?.name || null;

    // Check if user has admin permissions
    const hasAdminRole = user.roles.some((r) =>
      ['president', 'vice_president', 'secretary', 'treasurer', 'communications'].includes(
        r.role.name,
      ),
    );

    const sessionUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      photoUrl: user.photoUrl,
      pronouns: user.pronouns,
      roles: user.roles,
      band,
      status: user.status,
      isFullAccess: user.isFullAccess || hasAdminRole,
      isRoot: false,
    };

    return sessionUser;
  } catch (error) {
    console.error('Error in getSessionUser:', error);
    return null;
  }
}

export async function clearSession(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, '', { maxAge: 0, path: '/' });
}
