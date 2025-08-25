import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middlewares/auth';
import { prisma } from '@/prisma';
import { z } from 'zod';

const updateInstrumentSchema = z.object({
  name: z.string().min(1).optional(),
  nameFr: z.string().min(1).optional(),
  nameEn: z.string().min(1).optional(),
  imageUrl: z.string().optional()
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const instrumentId = parseInt(params.id);
    
    if (isNaN(instrumentId)) {
      return NextResponse.json({ error: 'Invalid instrument ID' }, { status: 400 });
    }

    const instrument = await prisma.instrument.findUnique({
      where: { id: instrumentId },
      select: {
        id: true,
        name: true,
        nameFr: true,
        nameEn: true,
        imageUrl: true,
        users: {
          select: {
            skillLevel: true,
            yearsPlaying: true,
            isPrimary: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                photoUrl: true,
              }
            }
          }
        },
        groupRequirements: {
          select: {
            requiredCount: true,
            currentCount: true,
            group: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              }
            }
          }
        },
        _count: {
          select: {
            users: true,
            groupRequirements: true
          }
        }
      }
    });

    if (!instrument) {
      return NextResponse.json({ error: 'Instrument not found' }, { status: 404 });
    }

    return NextResponse.json({ instrument });
  } catch (error) {
    console.error('Error fetching instrument:', error);
    return NextResponse.json({ error: 'Failed to fetch instrument' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and permissions
  const authResult = await requireAuth(req);
  if (!authResult.ok) {
    return authResult.res;
  }

  try {
    const instrumentId = parseInt(params.id);
    
    if (isNaN(instrumentId)) {
      return NextResponse.json({ error: 'Invalid instrument ID' }, { status: 400 });
    }

    const body = await req.json();
    const validatedData = updateInstrumentSchema.parse(body);

    // Check if instrument exists
    const existingInstrument = await prisma.instrument.findUnique({
      where: { id: instrumentId }
    });

    if (!existingInstrument) {
      return NextResponse.json({ error: 'Instrument not found' }, { status: 404 });
    }

    // Check for name conflicts (exclude current instrument)
    if (validatedData.name || validatedData.nameFr || validatedData.nameEn) {
      const conflictConditions = [];
      if (validatedData.name) conflictConditions.push({ name: validatedData.name });
      if (validatedData.nameFr) conflictConditions.push({ nameFr: validatedData.nameFr });
      if (validatedData.nameEn) conflictConditions.push({ nameEn: validatedData.nameEn });

      const conflictingInstrument = await prisma.instrument.findFirst({
        where: {
          AND: [
            { id: { not: instrumentId } },
            { OR: conflictConditions }
          ]
        }
      });

      if (conflictingInstrument) {
        return NextResponse.json({ 
          error: 'An instrument with this name already exists' 
        }, { status: 400 });
      }
    }

    const updatedInstrument = await prisma.instrument.update({
      where: { id: instrumentId },
      data: validatedData,
      select: {
        id: true,
        name: true,
        nameFr: true,
        nameEn: true,
        imageUrl: true,
        _count: {
          select: {
            users: true,
            groupRequirements: true
          }
        }
      }
    });

    return NextResponse.json({ 
      instrument: updatedInstrument,
      message: 'Instrument updated successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.errors 
      }, { status: 400 });
    }
    
    console.error('Error updating instrument:', error);
    return NextResponse.json({ error: 'Failed to update instrument' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and permissions
  const authResult = await requireAuth(req);
  if (!authResult.ok) {
    return authResult.res;
  }

  try {
    const instrumentId = parseInt(params.id);
    
    if (isNaN(instrumentId)) {
      return NextResponse.json({ error: 'Invalid instrument ID' }, { status: 400 });
    }

    // Check if instrument exists
    const existingInstrument = await prisma.instrument.findUnique({
      where: { id: instrumentId },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            users: true,
            groupRequirements: true
          }
        }
      }
    });

    if (!existingInstrument) {
      return NextResponse.json({ error: 'Instrument not found' }, { status: 404 });
    }

    // Check if instrument is in use
    if (existingInstrument._count.users > 0 || existingInstrument._count.groupRequirements > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete instrument that is currently in use by users or groups',
        usersCount: existingInstrument._count.users,
        groupsCount: existingInstrument._count.groupRequirements
      }, { status: 400 });
    }

    await prisma.instrument.delete({
      where: { id: instrumentId }
    });

    return NextResponse.json({ 
      message: 'Instrument deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting instrument:', error);
    return NextResponse.json({ error: 'Failed to delete instrument' }, { status: 500 });
  }
}