import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/admin';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema for venue updates
const updateVenueSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  venueType: z
    .enum([
      'CAMPUS',
      'CONCERT_HALL',
      'REHEARSAL_ROOM',
      'RECORDING_STUDIO',
      'BAR',
      'RESTAURANT',
      'NIGHTCLUB',
      'EXTERNAL',
      'OTHER',
    ])
    .optional(),
  address: z.string().min(1, 'Address is required').optional(),
  city: z.string().min(1, 'City is required').optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  photoUrl: z.string().optional(),
  metroLine: z.string().optional(),
  accessInstructions: z.string().optional(),
  staffNotes: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'AVOID']).optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ venueId: string }> }) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) {
    return authResult.res;
  }

  try {
    const { venueId } = await params;

    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      include: {
        events: {
          select: {
            id: true,
            name: true,
            date: true,
            type: true,
          },
        },
      },
    });

    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      venue: {
        ...venue,
        eventsCount: venue.events.length,
      },
    });
  } catch (error) {
    console.error('Error fetching venue:', error);
    return NextResponse.json({ error: 'Failed to fetch venue' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ venueId: string }> }) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) {
    return authResult.res;
  }

  try {
    const { venueId } = await params;
    const body = await req.json();
    const validatedData = updateVenueSchema.parse(body);

    const venue = await prisma.venue.update({
      where: { id: venueId },
      data: validatedData,
      include: {
        events: {
          select: {
            id: true,
            name: true,
            date: true,
            type: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      venue: {
        ...venue,
        eventsCount: venue.events.length,
      },
      message: 'Venue updated successfully',
    });
  } catch (error) {
    console.error('Error updating venue:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: 'Failed to update venue' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ venueId: string }> },
) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) {
    return authResult.res;
  }

  try {
    const { venueId } = await params;

    // Check if venue has any events
    const venueWithEvents = await prisma.venue.findUnique({
      where: { id: venueId },
      include: {
        events: {
          select: { id: true },
        },
      },
    });

    if (!venueWithEvents) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    }

    if (venueWithEvents.events.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete venue with existing events' },
        { status: 400 },
      );
    }

    await prisma.venue.delete({
      where: { id: venueId },
    });

    return NextResponse.json({
      success: true,
      message: 'Venue deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting venue:', error);
    return NextResponse.json({ error: 'Failed to delete venue' }, { status: 500 });
  }
}
