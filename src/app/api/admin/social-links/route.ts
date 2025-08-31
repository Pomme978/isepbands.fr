import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { standardAuth } from '@/utils/authMiddleware';

export async function GET() {
  try {
    const socialLinks = await prisma.socialLink.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(socialLinks);
  } catch (error) {
    console.error('Error fetching social links:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des liens sociaux' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await standardAuth(request);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = await request.json();
    const { platform, url, isActive = true, sortOrder = 0 } = body;

    if (!platform || !url) {
      return NextResponse.json(
        { error: "La plateforme et l'URL sont obligatoires" },
        { status: 400 },
      );
    }

    const socialLink = await prisma.socialLink.create({
      data: {
        platform: platform.toLowerCase(),
        url,
        isActive,
        sortOrder,
      },
    });

    return NextResponse.json(socialLink, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating social link:', error);

    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'Cette plateforme existe déjà' }, { status: 409 });
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création du lien social' },
      { status: 500 },
    );
  }
}
