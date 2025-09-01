import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/utils/authMiddleware';

// PUT - Update badge definition
export async function PUT(req: NextRequest) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const url = new URL(req.url);
    const id = parseInt(url.pathname.split('/').pop() || '0');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID du badge manquant' }, { status: 400 });
    }

    const body = await req.json();
    const {
      key,
      labelFr,
      labelEn,
      description,
      color,
      colorEnd,
      gradientDirection,
      textColor,
      isActive,
    } = body;

    // Validation
    if (!key || !labelFr || !labelEn) {
      return NextResponse.json(
        { success: false, error: 'Les champs clé, label français et label anglais sont requis' },
        { status: 400 },
      );
    }

    // Check if badge exists
    const existingBadge = await prisma.badgeDefinition.findUnique({
      where: { id },
    });

    if (!existingBadge) {
      return NextResponse.json({ success: false, error: 'Badge non trouvé' }, { status: 404 });
    }

    // Check if key already exists (excluding current badge)
    if (key !== existingBadge.key) {
      const duplicateKey = await prisma.badgeDefinition.findUnique({
        where: { key },
      });

      if (duplicateKey) {
        return NextResponse.json(
          { success: false, error: 'Cette clé de badge existe déjà' },
          { status: 400 },
        );
      }
    }

    const badge = await prisma.badgeDefinition.update({
      where: { id },
      data: {
        key: key.trim(),
        labelFr: labelFr.trim(),
        labelEn: labelEn.trim(),
        description: description?.trim() || null,
        color: color || '#4ECDC4',
        colorEnd: colorEnd || null,
        gradientDirection: gradientDirection || 'to right',
        textColor: textColor || 'white',
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    // Log admin action
    try {
      const { logAdminAction } = await import('@/services/activityLogService');
      const changes = [];
      if (key !== existingBadge.key) changes.push(`Clé: ${existingBadge.key} → ${key}`);
      if (labelFr !== existingBadge.labelFr) changes.push(`Label FR: ${existingBadge.labelFr} → ${labelFr}`);
      if (labelEn !== existingBadge.labelEn) changes.push(`Label EN: ${existingBadge.labelEn} → ${labelEn}`);
      if (description !== existingBadge.description) changes.push(`Description modifiée`);
      if (color !== existingBadge.color) changes.push(`Couleur: ${existingBadge.color} → ${color}`);
      if (isActive !== existingBadge.isActive) changes.push(`Status: ${existingBadge.isActive ? 'Actif' : 'Inactif'} → ${isActive ? 'Actif' : 'Inactif'}`);
      
      await logAdminAction(
        authResult.user.id,
        'badge_updated',
        'Badge modifié',
        `Badge **${labelFr}** (${key}) a été modifié${changes.length > 0 ? '\n\n' + changes.join('\n') : ''}`,
        null,
        {
          badgeId: badge.id,
          badgeKey: key,
          previousData: existingBadge,
          newData: badge,
          changes: changes
        }
      );
    } catch (err) {
      // Activity log error
    }

    return NextResponse.json({
      success: true,
      badge,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la modification du badge' },
      { status: 500 },
    );
  }
}

// DELETE - Delete badge definition
export async function DELETE(req: NextRequest) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const url = new URL(req.url);
    const id = parseInt(url.pathname.split('/').pop() || '0');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID du badge manquant' }, { status: 400 });
    }

    // Check if badge is assigned to any users
    const assignedBadges = await prisma.badge.findMany({
      where: { badgeDefinitionId: id },
    });

    if (assignedBadges.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Ce badge est assigné à ${assignedBadges.length} utilisateur(s). Supprimez d'abord ces assignations.`,
        },
        { status: 400 },
      );
    }

    // Get badge info before deletion
    const badgeToDelete = await prisma.badgeDefinition.findUnique({
      where: { id }
    });

    await prisma.badgeDefinition.delete({
      where: { id },
    });

    // Log admin action
    try {
      const { logAdminAction } = await import('@/services/activityLogService');
      await logAdminAction(
        authResult.user.id,
        'badge_deleted',
        'Badge supprimé',
        `Badge **${badgeToDelete?.labelFr || 'Inconnu'}** (${badgeToDelete?.key || 'Inconnu'}) a été supprimé définitivement`,
        null,
        {
          deletedBadge: badgeToDelete
        }
      );
    } catch (err) {
      // Activity log error
    }

    return NextResponse.json({
      success: true,
      message: 'Badge supprimé avec succès',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression du badge' },
      { status: 500 },
    );
  }
}
