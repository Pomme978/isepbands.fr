import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middlewares/auth';
import { prisma } from '@/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;

  try {
    const userId = params.id;

    // Get user registration details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        registrationRequest: true,
        instruments: {
          include: {
            instrument: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const details = {
      motivation: user.registrationRequest?.motivation || null,
      experience: user.registrationRequest?.experience || null,
      createdAt: user.createdAt.toISOString(),
      instruments: user.instruments.map((ui) => ({
        instrumentName: ui.instrument.name,
        skillLevel: ui.skillLevel,
      })),
    };

    return NextResponse.json({
      success: true,
      details,
    });
  } catch (error) {
    console.error('Error fetching registration details:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch registration details' },
      { status: 500 },
    );
  }
}
