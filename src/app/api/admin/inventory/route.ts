import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/admin';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createInventorySchema = z.object({
  category: z.string().min(1, 'Catégorie requise'),
  name: z.string().min(1, 'Nom requis'),
  brand: z.string().optional(),
  model: z.string().optional(),
  state: z
    .enum(['NEW', 'VERY_GOOD', 'GOOD', 'AVERAGE', 'DAMAGED', 'DEFECTIVE', 'OUT_OF_SERVICE'])
    .default('GOOD'),
  quantity: z.number().int().min(1, 'Quantité doit être positive').default(1),
  comment: z.string().optional(),
  images: z.array(z.string()).optional(),
  usable: z.boolean().default(true),
});

type InventoryState =
  | 'NEW'
  | 'VERY_GOOD'
  | 'GOOD'
  | 'AVERAGE'
  | 'DAMAGED'
  | 'DEFECTIVE'
  | 'OUT_OF_SERVICE';

export async function GET(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) return authResult.res;

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const state = searchParams.get('state');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: { category?: string; state?: InventoryState } = {};
    if (category) where.category = category;
    if (state) where.state = state as InventoryState;

    const [rawItems, total] = await Promise.all([
      prisma.inventory.findMany({
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.inventory.count({ where }),
    ]);

    // Désérialiser les images JSON
    const items = rawItems.map(item => ({
      ...item,
      images: item.images ? JSON.parse(item.images) : []
    }));

    const categories = await prisma.inventory.groupBy({
      by: ['category'],
      _count: { category: true },
    });

    return NextResponse.json({
      items,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      categories: categories.map((c) => ({ name: c.category, count: c._count.category })),
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) return authResult.res;

  try {
    const body = await req.json();
    const validatedData = createInventorySchema.parse(body);

    const item = await prisma.inventory.create({
      data: {
        ...validatedData,
        images: validatedData.images ? JSON.stringify(validatedData.images) : null,
        createdBy: authResult.user?.id,
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

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating inventory item:', error);
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}
