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
      password: await hashPassword(ROOT_USER.password),
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
  console.log('getSessionUser called');
  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  console.log('Session cookie found:', !!cookie);
  if (!cookie) {
    console.log('No session cookie found');
    return null;
  }
  try {
    const { payload } = await jwtVerify(cookie, new TextEncoder().encode(JWT_SECRET));
    console.log('JWT payload:', payload);

    // Check if it's the root user
    if (payload.id === 'root') {
      console.log('Root user detected');
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
    console.log('Searching for user in database with ID:', payload.id);
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
        groupMemberships: {
          select: {
            group: {
              select: { name: true },
            },
          },
        },
      },
    });
    console.log('Database user query result:', user ? 'User found' : 'User not found');
    if (!user) {
      console.log('User not found in database, returning null');
      return null;
    }

    // Check if the session token was issued before the user's last update (password reset)
    // NOTE: Only invalidate if there's a significant time difference (more than 5 minutes)
    // to avoid invalidating sessions during normal profile updates
    const tokenIssuedAt = payload.iat as number;
    const userUpdatedAt = Math.floor(new Date(user.updatedAt || 0).getTime() / 1000);
    const timeDifferenceMinutes = (userUpdatedAt - tokenIssuedAt) / 60;

    console.log('Token issued at:', tokenIssuedAt, new Date(tokenIssuedAt * 1000));
    console.log('User updated at:', userUpdatedAt, new Date(userUpdatedAt * 1000));
    console.log('Time difference (minutes):', timeDifferenceMinutes);

    if (timeDifferenceMinutes > 5) {
      // Token was issued more than 5 minutes before the user update (likely password reset)
      console.log('Token is significantly older than user update - invalidating session');
      return null;
    }

    console.log('Token is valid, proceeding with session creation');
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

    console.log('Returning session user:', sessionUser.id, sessionUser.email);
    return sessionUser;
  } catch (error) {
    console.error('Error in getSessionUser:', error);
    return null;
  }
}

export async function clearSession(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, '', { maxAge: 0, path: '/' });
}
