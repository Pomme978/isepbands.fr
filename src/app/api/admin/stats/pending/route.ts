import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middlewares/auth';
import { prisma } from '@/prisma';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;

  try {
    // Count pending registration requests
    const pendingUsers = await prisma.registrationRequest.count({
      where: {
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      count: pendingUsers,
    });
  } catch (error) {
    console.error('Error fetching pending users count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pending users count' },
      { status: 500 },
    );
  }
}
