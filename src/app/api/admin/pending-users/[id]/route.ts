import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middlewares/auth';
import { prisma } from '@/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;

  const { id } = params;
  const { action, reason } = await req.json();

  if (!action) {
    return NextResponse.json({ success: false, error: 'Action is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { registrationRequest: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (action === 'approve') {
      // Approve the user - change status to CURRENT
      await prisma.user.update({
        where: { id },
        data: { status: 'CURRENT' },
      });

      // Update registration request status if exists
      if (user.registrationRequest) {
        await prisma.registrationRequest.update({
          where: { userId: id },
          data: { status: 'APPROVED' },
        });
      }

      return NextResponse.json({
        success: true,
        message: 'User approved successfully',
      });
    } else if (action === 'reject') {
      if (!reason) {
        return NextResponse.json(
          { success: false, error: 'Rejection reason is required' },
          { status: 400 },
        );
      }

      // Reject the user - change status to REFUSED
      await prisma.user.update({
        where: { id },
        data: { status: 'REFUSED' },
      });

      // Update registration request with rejection reason
      if (user.registrationRequest) {
        await prisma.registrationRequest.update({
          where: { userId: id },
          data: {
            status: 'REJECTED',
            rejectionReason: reason,
          },
        });
      } else {
        // Create registration request if it doesn't exist
        await prisma.registrationRequest.create({
          data: {
            userId: id,
            status: 'REJECTED',
            rejectionReason: reason,
            motivation: '',
            experience: '',
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: 'User rejected successfully',
      });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user status' },
      { status: 500 },
    );
  }
}
