import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/auth';
import { prisma } from '@/lib/prisma';
import { logAdminAction } from '@/services/activityLogService';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(req);
  if (!auth.ok) return auth.res;

  const { id } = await params;

  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id: parseInt(id) },
    });

    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: 'Abonné non trouvé' },
        { status: 404 }
      );
    }

    await prisma.newsletterSubscriber.delete({
      where: { id: parseInt(id) },
    });

    // Log admin action
    await logAdminAction(
      auth.user.id,
      'newsletter_subscriber_removed',
      'Abonné newsletter supprimé',
      `L'email **${subscriber.email}** a été supprimé de la newsletter`,
      undefined,
      { email: subscriber.email }
    );

    return NextResponse.json({
      success: true,
      message: 'Abonné supprimé avec succès',
    });
  } catch (error) {
    console.error('Error deleting newsletter subscriber:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete subscriber' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(req);
  if (!auth.ok) return auth.res;

  const { id } = await params;

  try {
    const body = await req.json();
    const { isActive } = body;

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id: parseInt(id) },
    });

    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: 'Abonné non trouvé' },
        { status: 404 }
      );
    }

    const updatedSubscriber = await prisma.newsletterSubscriber.update({
      where: { id: parseInt(id) },
      data: {
        isActive,
        unsubscribedAt: isActive ? null : new Date(),
      },
    });

    // Log admin action
    await logAdminAction(
      auth.user.id,
      isActive ? 'newsletter_subscriber_activated' : 'newsletter_subscriber_deactivated',
      isActive ? 'Abonné newsletter activé' : 'Abonné newsletter désactivé',
      `L'email **${subscriber.email}** a été ${isActive ? 'activé' : 'désactivé'}`,
      undefined,
      { email: subscriber.email, isActive }
    );

    return NextResponse.json({
      success: true,
      subscriber: updatedSubscriber,
      message: `Abonné ${isActive ? 'activé' : 'désactivé'} avec succès`,
    });
  } catch (error) {
    console.error('Error updating newsletter subscriber:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update subscriber' },
      { status: 500 }
    );
  }
}