import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/utils/authMiddleware';

// GET - Get all badge definitions
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const badges = await prisma.badgeDefinition.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      badges,
    });
  } catch (error) {
    console.error('Error fetching badge definitions:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors du chargement des badges' },
      { status: 500 },
    );
  }
}

// POST - Create new badge definition
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = await req.json();
    const { key, labelFr, labelEn, description, color } = body;

    // Validation
    if (!key || !labelFr || !labelEn) {
      return NextResponse.json(
        { success: false, error: 'Les champs clé, label français et label anglais sont requis' },
        { status: 400 },
      );
    }

    // Check if key already exists
    const existingBadge = await prisma.badgeDefinition.findUnique({
      where: { key },
    });

    if (existingBadge) {
      return NextResponse.json(
        { success: false, error: 'Cette clé de badge existe déjà' },
        { status: 400 },
      );
    }

    const badge = await prisma.badgeDefinition.create({
      data: {
        key: key.trim(),
        labelFr: labelFr.trim(),
        labelEn: labelEn.trim(),
        description: description?.trim() || null,
        color: color || '#4ECDC4',
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      badge,
    });
  } catch (error) {
    console.error('Error creating badge definition:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création du badge' },
      { status: 500 },
    );
  }
}
