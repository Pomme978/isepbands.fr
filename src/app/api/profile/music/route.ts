import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionUser(request);
    if (!session?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Detect language from URL or headers
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const locale = pathSegments[1] === 'en' ? 'en' : 'fr';

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: {
        instruments: {
          include: {
            instrument: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Parse preferred genres
    let preferredGenres: string[] = [];
    if (user.preferredGenres) {
      try {
        preferredGenres = JSON.parse(user.preferredGenres);
      } catch (e) {
        console.error('Error parsing preferred genres:', e);
        preferredGenres = [];
      }
    }

    // Transform instruments to match expected format
    const instruments = user.instruments.map((ui) => ({
      id: ui.instrumentId.toString(),
      name: locale === 'en' ? ui.instrument.nameEn : ui.instrument.nameFr,
      level: ui.skillLevel.toLowerCase() as 'beginner' | 'intermediate' | 'advanced' | 'expert',
      yearsPlaying: ui.yearsPlaying || 0,
      isPrimary: ui.isPrimary,
    }));

    // Find primary instrument
    const primaryInstrument = user.instruments.find((ui) => ui.isPrimary);
    const primaryInstrumentId = primaryInstrument ? primaryInstrument.instrumentId.toString() : '';

    return NextResponse.json({
      instruments,
      primaryInstrumentId,
      seekingBand: user.isLookingForGroup,
      styles: preferredGenres,
    });
  } catch (error) {
    console.error('Music profile fetch error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await req.json();
    const { instruments, primaryInstrumentId, seekingBand, styles } = body;

    // Update user preferences
    await prisma.user.update({
      where: { id: session.id },
      data: {
        isLookingForGroup: seekingBand || false,
        preferredGenres: JSON.stringify(styles || []),
      },
    });

    // Update instruments if provided
    if (instruments && Array.isArray(instruments)) {
      // Delete existing user instruments
      await prisma.userInstrument.deleteMany({
        where: { userId: session.id },
      });

      // Create new user instruments
      for (const inst of instruments) {
        await prisma.userInstrument.create({
          data: {
            userId: session.id,
            instrumentId: parseInt(inst.id),
            skillLevel: inst.level.toUpperCase() as
              | 'BEGINNER'
              | 'INTERMEDIATE'
              | 'ADVANCED'
              | 'EXPERT',
            yearsPlaying: inst.yearsPlaying || null,
            isPrimary: inst.id === primaryInstrumentId,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Music profile update error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
