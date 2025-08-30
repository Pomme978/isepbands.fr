import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Get all active badge definitions (public API for forms)
export async function GET() {
  try {
    const badges = await prisma.badgeDefinition.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        labelFr: 'asc',
      },
      select: {
        id: true,
        key: true,
        labelFr: true,
        labelEn: true,
        description: true,
        color: true,
      },
    });

    return NextResponse.json({
      success: true,
      badges,
    });
  } catch (error) {
    console.error('Error fetching active badges:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors du chargement des badges' },
      { status: 500 },
    );
  }
}
