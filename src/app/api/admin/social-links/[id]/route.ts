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
    const socialLinkId = parseInt(id);
    
    // Get existing data for comparison
    const existingLink = await prisma.socialLink.findUnique({
      where: { id: socialLinkId }
    });
    
    if (!existingLink) {
      return NextResponse.json({ error: 'Lien social non trouvé' }, { status: 404 });
    }
    
    const socialLink = await prisma.socialLink.update({
      where: { id: socialLinkId },
      data: {
        platform: platform.toLowerCase(),
        url,
        isActive,
        sortOrder,
        updatedAt: new Date(),
      },
    });

    // Log admin action
    try {
      const { logAdminAction } = await import('@/services/activityLogService');
      const changes = [];
      if (platform !== existingLink.platform) changes.push(`Plateforme: ${existingLink.platform} → ${platform}`);
      if (url !== existingLink.url) changes.push(`URL: ${existingLink.url} → ${url}`);
      if (isActive !== existingLink.isActive) changes.push(`Status: ${existingLink.isActive ? 'Actif' : 'Inactif'} → ${isActive ? 'Actif' : 'Inactif'}`);
      if (sortOrder !== existingLink.sortOrder) changes.push(`Ordre: ${existingLink.sortOrder} → ${sortOrder}`);
      
      await logAdminAction(
        authResult.user.id,
        'social_link_updated',
        'Lien social modifié',
        `Lien social **${platform}** modifié${changes.length > 0 ? '\n\n' + changes.join('\n') : ''}`,
        null,
        {
          socialLinkId: socialLink.id,
          previousData: existingLink,
          newData: socialLink,
          changes: changes
        }
      );
    } catch (err) {
      // Activity log error
    }

    return NextResponse.json(socialLink);
  } catch (error: unknown) {
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
    const socialLinkId = parseInt(id);
    
    // Get link info before deletion
    const linkToDelete = await prisma.socialLink.findUnique({
      where: { id: socialLinkId }
    });
    
    await prisma.socialLink.delete({
      where: { id: socialLinkId },
    });

    // Log admin action
    try {
      const { logAdminAction } = await import('@/services/activityLogService');
      await logAdminAction(
        authResult.user.id,
        'social_link_deleted',
        'Lien social supprimé',
        `Lien social **${linkToDelete?.platform || 'Inconnu'}** (${linkToDelete?.url || 'URL inconnue'}) a été supprimé définitivement`,
        null,
        {
          deletedLink: linkToDelete
        }
      );
    } catch (err) {
      // Activity log error
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Lien social non trouvé' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Erreur lors de la suppression du lien social' },
      { status: 500 },
    );
  }
}
