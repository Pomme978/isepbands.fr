import { NextRequest, NextResponse } from 'next/server';
import { standardAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const authResult = await standardAuth();
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { user } = authResult;
    if (user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (priority && priority !== 'all') {
      where.priority = priority;
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    const items = await prisma.wishlistItem.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await standardAuth();
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { user } = authResult;
    if (user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      category,
      brand,
      model,
      estimatedPrice,
      priority,
      status,
      productUrl,
      description,
      imageUrl,
    } = body;

    if (!name || !category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 });
    }

    const item = await prisma.wishlistItem.create({
      data: {
        name,
        category,
        brand: brand || null,
        model: model || null,
        estimatedPrice: estimatedPrice || null,
        priority: priority || 'MEDIUM',
        status: status || 'WANTED',
        productUrl: productUrl || null,
        description: description || null,
        imageUrl: imageUrl || null,
        creatorId: user.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Error creating wishlist item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
