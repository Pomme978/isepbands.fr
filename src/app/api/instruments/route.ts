import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middlewares/auth';
import { prisma } from '@/prisma';
import { z } from 'zod';
// import { ensureDBIntegrity } from '@/utils/dbIntegrity'; // Removed for performance

const createInstrumentSchema = z.object({
  name: z.string().min(1),
  nameFr: z.string().min(1),
  nameEn: z.string().min(1),
  imageUrl: z.string().optional(),
});

const updateInstrumentSchema = z.object({
  name: z.string().min(1).optional(),
  nameFr: z.string().min(1).optional(),
  nameEn: z.string().min(1).optional(),
  imageUrl: z.string().optional(),
});

// GET: Liste tous les instruments
export async function GET() {
  try {
    const instruments = await prisma.instrument.findMany({
      select: {
        id: true,
        name: true,
        nameFr: true,
        nameEn: true,
        imageUrl: true,
        _count: {
          select: {
            users: true,
            groupRequirements: true,
          },
        },
      },
      orderBy: {
        nameFr: 'asc',
      },
    });
    return NextResponse.json({ instruments });
  } catch (error) {
    console.error('Error fetching instruments:', error);
    return NextResponse.json({ error: 'Failed to fetch instruments' }, { status: 500 });
  }
}

// POST: Crée un nouvel instrument
export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (!authResult.ok) {
    return authResult.res;
  }
  const user = authResult.user;

  try {
    const body = await req.json();
    const validatedData = createInstrumentSchema.parse(body);

    // Check if instrument with this name already exists
    const existingInstrument = await prisma.instrument.findFirst({
      where: {
        OR: [
          { name: validatedData.name },
          { nameFr: validatedData.nameFr },
          { nameEn: validatedData.nameEn },
        ],
      },
    });

    if (existingInstrument) {
      return NextResponse.json(
        {
          error: 'An instrument with this name already exists',
        },
        { status: 400 },
      );
    }

    const instrument = await prisma.instrument.create({
      data: validatedData,
      select: {
        id: true,
        name: true,
        nameFr: true,
        nameEn: true,
        imageUrl: true,
      },
    });

    // Logger l'action de création d'instrument
    try {
      const { createActivityLog } = await import('@/services/activityLogService');
      await createActivityLog({
        userId: String(instrument.id),
        type: 'instrument_created',
        title: 'Instrument créé',
        description: `Instrument ${instrument.name} créé par ${user?.firstName || 'inconnu'}`,
        metadata: {},
        createdBy: user?.id ? String(user.id) : undefined,
      });
    } catch (err) {
      console.log('Activity log error:', err);
    }

    return NextResponse.json(
      {
        instrument,
        message: 'Instrument created successfully',
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.issues,
        },
        { status: 400 },
      );
    }

    console.error('Error creating instrument:', error);
    return NextResponse.json({ error: 'Failed to create instrument' }, { status: 500 });
  }
}
