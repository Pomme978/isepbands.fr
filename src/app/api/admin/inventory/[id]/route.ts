import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/admin';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateInventorySchema = z.object({
  category: z.string().min(1, 'Catégorie requise').optional(),
  name: z.string().min(1, 'Nom requis').optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  state: z
    .enum(['NEW', 'VERY_GOOD', 'GOOD', 'AVERAGE', 'DAMAGED', 'DEFECTIVE', 'OUT_OF_SERVICE'])
    .optional(),
  quantity: z.number().int().min(1, 'Quantité doit être positive').optional(),
  comment: z.string().optional(),
  images: z.array(z.string()).optional(),
  usable: z.boolean().optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) return authResult.res;

  try {
    const { id } = await params;

    const item = await prisma.inventory.findUnique({
      where: { id },
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

    if (!item) {
      return NextResponse.json({ error: 'Article non trouvé' }, { status: 404 });
    }

    // Désérialiser les images JSON
    const itemWithImages = {
      ...item,
      images: item.images ? JSON.parse(item.images) : []
    };

    return NextResponse.json({ item: itemWithImages });
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) return authResult.res;

  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = updateInventorySchema.parse(body);

    const item = await prisma.inventory.update({
      where: { id },
      data: {
        ...validatedData,
        images: validatedData.images ? JSON.stringify(validatedData.images) : undefined,
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

    // Désérialiser les images JSON
    const itemWithImages = {
      ...item,
      images: item.images ? JSON.parse(item.images) : []
    };

    return NextResponse.json({ item: itemWithImages });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating inventory item:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) return authResult.res;

  try {
    const { id } = await params;

    await prisma.inventory.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Article supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
