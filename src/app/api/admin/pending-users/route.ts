import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middlewares/auth';
import { prisma } from '@/prisma';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;

  try {
    // Get all users with PENDING status
    const pendingUsers = await prisma.user.findMany({
      where: {
        status: 'PENDING',
      },
      include: {
        instruments: {
          include: {
            instrument: true,
          },
        },
        registrationRequest: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data to match the expected format
    const users = pendingUsers.map((user) => ({
      id: user.id,
      type: 'user',
      name: `${user.firstName} ${user.lastName}`,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      currentLevel: user.promotion || '',
      dateOfBirth: user.birthDate ? user.birthDate.toISOString().split('T')[0] : '',
      isOutOfSchool: user.status === 'GRADUATED' || user.status === 'ALUMNI',
      pronouns: user.pronouns,
      motivation: user.registrationRequest?.motivation || '',
      instruments: user.instruments.map((ui) => ({
        instrumentId: ui.instrument.id,
        instrumentName: ui.instrument.name,
        instrumentNameFr: ui.instrument.nameFr,
        instrumentNameEn: ui.instrument.nameEn,
        skillLevel: ui.skillLevel,
        yearsPlaying: ui.yearsPlaying,
        isPrimary: ui.isPrimary,
      })),
      preferredGenres: user.preferredGenres
        ? (() => {
            try {
              // Try to parse as JSON array first
              return JSON.parse(user.preferredGenres);
            } catch {
              // Fallback to comma-separated string
              return user.preferredGenres.split(',').map((g) => g.trim());
            }
          })()
        : [],
      profilePhoto: user.photoUrl,
      submittedAt: user.createdAt.toLocaleDateString('fr-FR'),
    }));

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Error fetching pending users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pending users' },
      { status: 500 },
    );
  }
}
