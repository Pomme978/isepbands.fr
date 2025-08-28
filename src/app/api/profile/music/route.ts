import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { parsePreferredGenres } from '@/utils/genreUtils';

export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/profile/music - Starting request');

    const session = await getSessionUser(req);
    console.log('Session data:', session);

    if (!session?.id) {
      console.log('No session or session ID found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching user data for ID:', session.id);

    // Get user with instruments and preferred genres
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        preferredGenres: true,
        isLookingForGroup: true,
        instruments: {
          select: {
            instrumentId: true,
            skillLevel: true,
            yearsPlaying: true,
            isPrimary: true,
            instrument: {
              select: {
                id: true,
                name: true,
                nameFr: true,
                nameEn: true,
              },
            },
          },
        },
      },
    });

    console.log('Raw user data from DB:', user);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Transform data for frontend
    console.log('Transforming data for frontend...');
    console.log('User instruments:', user.instruments);
    console.log('User preferred genres:', user.preferredGenres);

    const musicData = {
      instruments: user.instruments.map((userInst) => ({
        id: userInst.instrument.id.toString(),
        name: userInst.instrument.nameFr,
        level: userInst.skillLevel.toLowerCase() as
          | 'beginner'
          | 'intermediate'
          | 'advanced'
          | 'expert',
        yearsPlaying: userInst.yearsPlaying || 0,
      })),
      primaryInstrumentId:
        user.instruments.find((inst) => inst.isPrimary)?.instrument.id.toString() || '',
      seekingBand: user.isLookingForGroup || false,
      styles: parsePreferredGenres(user.preferredGenres),
    };

    console.log('Final musicData being returned:', musicData);

    return NextResponse.json(musicData);
  } catch (error) {
    console.error('Error fetching user music data:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    console.log('=== PUT /api/profile/music - Starting request ===');
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    console.log('Request cookies:', req.cookies.getAll());

    const session = await getSessionUser(req);
    console.log('Session data received:', session);

    if (!session?.id) {
      console.log('❌ No session or session ID found - returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ Session validated, user ID:', session.id);

    const body = await req.json();
    console.log('Request body:', body);

    const { instruments, primaryInstrumentId, seekingBand, styles } = body;

    // Update user preferences
    console.log('Updating user preferences...');
    const updateData: { isLookingForGroup?: boolean; preferredGenres?: string } = {};

    if (seekingBand !== undefined) {
      updateData.isLookingForGroup = seekingBand;
      console.log('Setting seekingBand to:', seekingBand);
    }

    if (styles !== undefined) {
      updateData.preferredGenres = JSON.stringify(styles);
      console.log('Setting styles to:', styles);
    }

    console.log('Update data:', updateData);

    if (Object.keys(updateData).length > 0) {
      console.log('Updating user with data:', updateData);
      await prisma.user.update({
        where: { id: session.id },
        data: updateData,
      });
      console.log('User updated successfully');
    }

    // Handle instruments update if provided
    if (instruments !== undefined) {
      console.log('Updating instruments...');
      console.log('Instruments to save:', instruments);
      console.log('Primary instrument ID:', primaryInstrumentId);

      // Remove existing instruments
      console.log('Deleting existing instruments for user:', session.id);
      await prisma.userInstrument.deleteMany({
        where: { userId: session.id },
      });
      console.log('Existing instruments deleted');

      // Add new instruments
      if (instruments.length > 0) {
        console.log('Creating new instruments...');
        const instrumentsToCreate = await Promise.all(
          instruments.map(async (inst: { id: string; name: string; level: string }) => {
            console.log('Processing instrument:', inst);
            // Find instrument by ID or name
            const instrument = await prisma.instrument.findFirst({
              where: {
                OR: [{ id: parseInt(inst.id) }, { nameFr: inst.name }, { name: inst.name }],
              },
            });

            console.log('Found instrument in DB:', instrument);

            if (!instrument) {
              throw new Error(`Instrument not found: ${inst.name || inst.id}`);
            }

            const instrumentToCreate = {
              userId: session.id,
              instrumentId: instrument.id,
              skillLevel: inst.level.toUpperCase() as
                | 'BEGINNER'
                | 'INTERMEDIATE'
                | 'ADVANCED'
                | 'EXPERT',
              yearsPlaying: inst.yearsPlaying || 0,
              isPrimary: primaryInstrumentId === inst.id,
            };

            console.log('Instrument to create:', instrumentToCreate);
            return instrumentToCreate;
          }),
        );

        console.log('All instruments to create:', instrumentsToCreate);
        await prisma.userInstrument.createMany({
          data: instrumentsToCreate,
        });
        console.log('Instruments created successfully');
      }
    }

    console.log('PUT /api/profile/music - Successfully completed');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user music data:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
