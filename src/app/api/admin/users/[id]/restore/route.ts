import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/admin';
import { prisma } from '@/lib/prisma';
import { logAdminAction } from '@/services/activityLogService';
import { EmailService } from '@/services/emailService';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) return authResult.res;

  try {
    const { id: userId } = await params;
    const currentUserId = authResult.user?.id; // Get the ID of the user performing the restore

    if (!userId) {
      return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Check if user can be restored
    if (!['DELETED', 'SUSPENDED', 'REFUSED'].includes(user.status)) {
      return NextResponse.json(
        { error: "L'utilisateur ne peut pas être restauré depuis ce statut" },
        { status: 400 },
      );
    }

    // Store the original status for email logic
    const wasRefused = user.status === 'REFUSED';
    const wasSuspended = user.status === 'SUSPENDED';
    const wasDeleted = user.status === 'DELETED';

    // Update user status to CURRENT (restored) and clear archive metadata
    await prisma.user.update({
      where: { id: userId },
      data: {
        status: 'CURRENT',
        archivedAt: null,
        archivedBy: null,
      },
    });

    // Log the restore action
    try {
      await logAdminAction(
        authResult.user.id,
        'user_restored',
        'Utilisateur restauré',
        `**${user.firstName} ${user.lastName}** (${user.email}) a été restauré depuis le statut ${user.status}`,
        userId,
        {
          userEmail: user.email,
          previousStatus: user.status,
          newStatus: 'CURRENT',
          restoredAt: new Date().toISOString(),
        },
      );
    } catch (logError) {
      console.error('Failed to log user restore action:', logError);
      // Don't fail the restore if logging fails
    }

    // Send appropriate restoration email
    try {
      if (wasSuspended) {
        await EmailService.sendSuspendedAccountRestoredEmail(
          user.email,
          user.firstName,
          user.lastName,
        );
      } else if (wasRefused) {
        await EmailService.sendRefusedMemberRestoredEmail(
          user.email,
          user.firstName,
          user.lastName,
        );
      }
      // For DELETED users, no email is sent as they were archived
    } catch (emailError) {
      console.error('Failed to send restoration email:', emailError);
      // Don't fail the restore if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Utilisateur restauré avec succès',
    });
  } catch (error) {
    console.error('Error restoring user:', error);
    return NextResponse.json({ error: 'Erreur lors de la restauration' }, { status: 500 });
  }
}
