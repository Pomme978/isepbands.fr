import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middlewares/auth';
import { prisma } from '@/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;

  const { id } = params;

  try {
    const body = await req.json();
    const { action, reason } = body; // action: 'approve' | 'reject', reason: string (for rejection)

    // Find the registration request by userId (since the id passed is the user ID)
    const registrationRequest = await prisma.registrationRequest.findUnique({
      where: { userId: id },
      include: { user: true },
    });

    if (!registrationRequest) {
      return NextResponse.json(
        { success: false, error: 'Registration request not found' },
        { status: 404 },
      );
    }

    // Check user status instead of registration request status
    if (registrationRequest.user.status !== 'PENDING') {
      return NextResponse.json(
        { success: false, error: 'User is not in pending status' },
        { status: 400 },
      );
    }

    if (action === 'approve') {
      // Approve the user
      await prisma.$transaction([
        // Update registration request status
        prisma.registrationRequest.update({
          where: { userId: id },
          data: {
            status: 'ACCEPTED',
            rejectionReason: null,
          },
        }),
        // Update user status to CURRENT
        prisma.user.update({
          where: { id: id },
          data: {
            status: 'CURRENT',
            emailVerified: true, // Automatically verify email when approved
          },
        }),
      ]);

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
      await prisma.$transaction([
        // Update registration request with rejection
        prisma.registrationRequest.update({
          where: { userId: id },
          data: {
            status: 'REJECTED',
            rejectionReason: reason.trim(),
          },
        }),
        // Update user status to REFUSED (suspended)
        prisma.user.update({
          where: { id: id },
          data: {
            status: 'REFUSED', // Using REFUSED from the UserStatus enum
          },
        }),
      ]);

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
    console.error('Error processing registration request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 },
    );
  }
}
