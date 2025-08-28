import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middlewares/auth';
import { prisma } from '@/prisma';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;

  try {
    // Count only current members
    const totalMembers = await prisma.user.count({
      where: {
        status: 'CURRENT',
      },
    });

    return NextResponse.json({
      success: true,
      count: totalMembers,
    });
  } catch (error) {
    console.error('Error fetching member count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch member count' },
      { status: 500 },
    );
  }
}
