import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { standardAuth } from '@/utils/authMiddleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const socialLink = await prisma.socialLink.findUnique({
      where: { id: parseInt(id) },
    });

    if (!socialLink) {
      return NextResponse.json({ error: 'Lien social non trouvé' }, { status: 404 });
    }

    return NextResponse.json(socialLink);
  } catch (error) {
    console.error('Error fetching social link:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du lien social' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await standardAuth(request);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = await request.json();
    const { platform, url, isActive, sortOrder } = body;

    if (!platform || !url) {
      return NextResponse.json(
        { error: "La plateforme et l'URL sont obligatoires" },
        { status: 400 },
      );
    }

    const { id } = await params;
    const socialLink = await prisma.socialLink.update({
      where: { id: parseInt(id) },
      data: {
        platform: platform.toLowerCase(),
        url,
        isActive,
        sortOrder,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(socialLink);
  } catch (error: unknown) {
    console.error('Error updating social link:', error);

    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return NextResponse.json({ error: 'Cette plateforme existe déjà' }, { status: 409 });
      }

      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Lien social non trouvé' }, { status: 404 });
      }
    }

    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du lien social' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await standardAuth(request);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = await params;
    await prisma.socialLink.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error deleting social link:', error);

    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Lien social non trouvé' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Erreur lors de la suppression du lien social' },
      { status: 500 },
    );
  }
}
