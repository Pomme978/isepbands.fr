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

    // Toggle status
    const updatedSubscriber = await prisma.newsletterSubscriber.update({
      where: { id: subscriberId },
      data: {
        isActive: !subscriber.isActive,
      },
    });

    // Log admin action
    await logAdminAction(
      auth.user.id,
      updatedSubscriber.isActive ? 'newsletter_subscriber_activated' : 'newsletter_subscriber_deactivated',
      `Abonné newsletter ${updatedSubscriber.isActive ? 'activé' : 'désactivé'}`,
      `L'email **${subscriber.email}** a été ${updatedSubscriber.isActive ? 'activé' : 'désactivé'} dans la newsletter`,
      undefined,
      { email: subscriber.email, newStatus: updatedSubscriber.isActive }
    );

    return NextResponse.json({
      success: true,
      subscriber: updatedSubscriber,
      message: `Abonné ${updatedSubscriber.isActive ? 'activé' : 'désactivé'} avec succès`,
    });
  } catch (error) {
    console.error('Error toggling newsletter subscriber status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle subscriber status' },
      { status: 500 }
    );
  }
}