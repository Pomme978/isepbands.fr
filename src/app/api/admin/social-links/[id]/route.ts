import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { standardAuth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const socialLink = await prisma.socialLink.findUnique({
      where: { id: parseInt(params.id) }
    });

    if (!socialLink) {
      return NextResponse.json(
        { error: 'Lien social non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(socialLink);
  } catch (error) {
    console.error('Error fetching social link:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du lien social' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await standardAuth(request);

    const body = await request.json();
    const { platform, url, isActive, sortOrder } = body;

    if (!platform || !url) {
      return NextResponse.json(
        { error: 'La plateforme et l\'URL sont obligatoires' },
        { status: 400 }
      );
    }

    const socialLink = await prisma.socialLink.update({
      where: { id: parseInt(params.id) },
      data: {
        platform: platform.toLowerCase(),
        url,
        isActive,
        sortOrder,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(socialLink);
  } catch (error: any) {
    console.error('Error updating social link:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Cette plateforme existe déjà' },
        { status: 409 }
      );
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Lien social non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du lien social' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await standardAuth(request);

    await prisma.socialLink.delete({
      where: { id: parseInt(params.id) }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting social link:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Lien social non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la suppression du lien social' },
      { status: 500 }
    );
  }
}