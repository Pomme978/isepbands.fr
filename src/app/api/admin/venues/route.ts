import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/admin';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema for venue creation
const createVenueSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  venueType: z.enum([
    'CAMPUS',
    'CONCERT_HALL',
    'REHEARSAL_ROOM',
    'RECORDING_STUDIO',
    'BAR',
    'RESTAURANT',
    'NIGHTCLUB',
    'EXTERNAL',
    'OTHER',
  ]),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().optional(),
  country: z.string().default('France'),
  photoUrl: z.string().optional(),
  metroLine: z.string().optional(),
  accessInstructions: z.string().optional(),
  staffNotes: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'AVOID']).default('ACTIVE'),
});

export async function GET(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) {
    return authResult.res;
  }

  try {
    const venues = await prisma.venue.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        events: {
          select: {
            id: true,
            name: true,
            date: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      venues,
    });
  } catch (error) {
    console.error('Error fetching venues:', error);
    return NextResponse.json({ error: 'Failed to fetch venues' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) {
    return authResult.res;
  }

  try {
    const body = await req.json();
    const validatedData = createVenueSchema.parse(body);

    const venue = await prisma.venue.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        venueType: validatedData.venueType,
        address: validatedData.address,
        city: validatedData.city,
        postalCode: validatedData.postalCode,
        country: validatedData.country,
        photoUrl: validatedData.photoUrl,
        metroLine: validatedData.metroLine,
        accessInstructions: validatedData.accessInstructions,
        staffNotes: validatedData.staffNotes,
        status: validatedData.status,
      },
      include: {
        events: {
          select: {
            id: true,
            name: true,
            date: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      venue,
      message: 'Venue created successfully',
    });
  } catch (error) {
    console.error('Error creating venue:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: 'Failed to create venue' }, { status: 500 });
  }
}
