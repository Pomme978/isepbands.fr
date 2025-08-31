import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin/users/[id]/activity-log
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = params.id;
  try {
    const activities = await prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return NextResponse.json({ success: true, activities });
  } catch (error) {
    console.log('Error fetching activity log:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activity log.' },
      { status: 500 },
    );
  }
}

// POST /api/admin/users/[id]/activity-log
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = params.id;
  const body = await req.json();
  try {
    const activity = await prisma.activity.create({
      data: {
        userId,
        type: body.type || 'custom',
        title: body.title || '',
        description: body.description || '',
        metadata: body.metadata || {},
        createdBy: body.createdBy || null,
      },
    });
    return NextResponse.json({ success: true, activity });
  } catch (error) {
    console.log('Error creating activity log:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create activity log.' },
      { status: 500 },
    );
  }
}
