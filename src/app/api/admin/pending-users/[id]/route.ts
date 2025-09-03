import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middlewares/auth';
import { checkAdminPermission } from '@/middlewares/admin';
import { prisma } from '@/lib/prisma';
import { logAdminAction } from '@/services/activityLogService';
import { autoSubscribeUser } from '@/services/newsletterService';
import { EmailService } from '@/services/emailService';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;

  // Check admin permission
  const adminCheck = await checkAdminPermission(auth.user);
  if (!adminCheck.hasPermission) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const { action, reason } = body; // action: 'approve' | 'reject', reason: string (for rejection)

    // First check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, status: true, firstName: true, lastName: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Find the registration request by userId (since the id passed is the user ID)
    const registrationRequest = await prisma.registrationRequest.findUnique({
      where: { userId: id },
      include: { user: true },
    });

    if (!registrationRequest) {
      // Maybe the registration system has changed, let's check if we can approve without registration request
      if (user.status === 'PENDING') {
        // Continue to approval logic below
      } else {
        return NextResponse.json(
          {
            success: false,
            error: `Registration request not found for user ${user.email}. User status: ${user.status}`,
          },
          { status: 404 },
        );
      }
    }

    // Check user status
    const currentUser = registrationRequest ? registrationRequest.user : user;
    if (currentUser.status !== 'PENDING') {
      return NextResponse.json(
        { success: false, error: 'User is not in pending status' },
        { status: 400 },
      );
    }

    if (action === 'approve') {
      // Approve the user
      const transactionQueries = [
        // Always update user status to CURRENT
        prisma.user.update({
          where: { id: id },
          data: {
            status: 'CURRENT',
            emailVerified: true, // Automatically verify email when approved
          },
        }),
      ];

      // Only update registration request if it exists
      if (registrationRequest) {
        transactionQueries.push(
          prisma.registrationRequest.update({
            where: { userId: id },
            data: {
              status: 'ACCEPTED',
              rejectionReason: null,
            },
          }),
        );
      }

      await prisma.$transaction(transactionQueries);

      // Log admin action
      await logAdminAction(
        auth.user.id,
        'user_approved',
        'Utilisateur approuvé',
        `**${user.firstName} ${user.lastName}** (${user.email}) a été approuvé et peut maintenant accéder à la plateforme`,
        id,
        {
          userEmail: user.email,
          previousStatus: 'PENDING',
          newStatus: 'CURRENT',
          hadRegistrationRequest: !!registrationRequest,
        },
      );

      // Auto-subscribe to newsletter when user is approved
      await autoSubscribeUser(user.email, 'approved');

      // Send approval email
      try {
        await EmailService.sendAccountApprovedEmail(user.email, user.firstName, user.lastName);
      } catch (emailError) {
        console.error('Failed to send approval email:', emailError);
        // Don't fail the approval if email fails
      }

      return NextResponse.json({
        success: true,
        message: 'User approved successfully',
        data: {
          userId: id,
          status: 'CURRENT',
        },
      });
    } else if (action === 'reject') {
      if (!reason || reason.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: 'Rejection reason is required' },
          { status: 400 },
        );
      }

      // Reject the user
      const rejectTransactionQueries = [
        // Always update user status to REFUSED
        prisma.user.update({
          where: { id: id },
          data: {
            status: 'REFUSED', // Using REFUSED from the UserStatus enum
          },
        }),
      ];

      // Only update registration request if it exists
      if (registrationRequest) {
        rejectTransactionQueries.push(
          prisma.registrationRequest.update({
            where: { userId: id },
            data: {
              status: 'REJECTED',
              rejectionReason: reason.trim(),
            },
          }),
        );
      }

      await prisma.$transaction(rejectTransactionQueries);

      // Log admin action
      await logAdminAction(
        auth.user.id,
        'user_rejected',
        'Utilisateur rejeté',
        `**${user.firstName} ${user.lastName}** (${user.email}) a été rejeté\n\nRaison: ${reason}`,
        id,
        {
          userEmail: user.email,
          previousStatus: 'PENDING',
          newStatus: 'REFUSED',
          rejectionReason: reason,
          hadRegistrationRequest: !!registrationRequest,
        },
      );

      // Send rejection email
      try {
        await EmailService.sendAccountRejectedEmail(
          user.email,
          user.firstName,
          user.lastName,
          reason,
        );
      } catch (emailError) {
        console.error('Failed to send rejection email:', emailError);
        // Don't fail the rejection if email fails
      }

      return NextResponse.json({
        success: true,
        message: 'User rejected successfully',
        data: {
          userId: id,
          status: 'REFUSED',
          rejectionReason: reason,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Use "approve" or "reject"' },
        { status: 400 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 },
    );
  }
}
