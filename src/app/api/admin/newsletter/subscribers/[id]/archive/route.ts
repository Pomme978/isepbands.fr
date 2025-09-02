import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/auth';
import { prisma } from '@/lib/prisma';
import { logAdminAction } from '@/services/activityLogService';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdminAuth(req);
  if (!auth.ok) return auth.res;

  try {
    const subscriberId = parseInt(params.id);

    if (!subscriberId) {
      return NextResponse.json(
        { success: false, error: 'ID de l\'abonné invalide' },
        { status: 400 }
      );
    }

    // Get current subscriber
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id: subscriberId },
    });

    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: 'Abonné non trouvé' },
        { status: 404 }
      );
    }

    // Check if subscriber has an associated user account
    const userAccount = await prisma.user.findUnique({
      where: { email: subscriber.email },
    });

    if (userAccount) {
      return NextResponse.json(
        { success: false, error: 'Impossible d\'archiver un abonné ayant un compte utilisateur' },
        { status: 403 }
      );
    }

    // Archive the subscriber (set as inactive and add archived timestamp)
    const archivedSubscriber = await prisma.newsletterSubscriber.update({
      where: { id: subscriberId },
      data: {
        isActive: false,
        unsubscribedAt: new Date(),
        // Note: We'd need to add an isArchived field to the schema for complete archiving
        // For now, we mark as inactive with unsubscribedAt timestamp
      },
    });

    // Log admin action
    await logAdminAction(
      auth.user.id,
      'newsletter_subscriber_archived',
      'Abonné newsletter archivé',
      `L'email **${subscriber.email}** a été archivé de la newsletter`,
      undefined,
      { email: subscriber.email, archivedAt: new Date() }
    );

    return NextResponse.json({
      success: true,
      subscriber: archivedSubscriber,
      message: 'Abonné archivé avec succès',
    });
  } catch (error) {
    console.error('Error archiving newsletter subscriber:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to archive subscriber' },
      { status: 500 }
    );
  }
}