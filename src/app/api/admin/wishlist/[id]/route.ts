import { NextRequest, NextResponse } from 'next/server';
import { standardAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
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
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 },
      );
    }

    const item = await prisma.wishlistItem.update({
      where: { id: params.id },
      data: {
        name,
        category,
        brand: brand || null,
        model: model || null,
        estimatedPrice: estimatedPrice || null,
        priority,
        status,
        productUrl: productUrl || null,
        description: description || null,
        imageUrl: imageUrl || null,
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
    console.error('Error updating wishlist item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const authResult = await standardAuth();
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { user } = authResult;
    if (user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    await prisma.wishlistItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting wishlist item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}