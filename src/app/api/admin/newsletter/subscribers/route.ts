import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/auth';
import { prisma } from '@/lib/prisma';
import { logAdminAction } from '@/services/activityLogService';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.ok) return auth.res;

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all'; // 'all', 'active', 'inactive'

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.email = { contains: search, mode: 'insensitive' };
    }
    
    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        orderBy: { subscribedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.newsletterSubscriber.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      subscribers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.ok) return auth.res;

  try {
    const body = await req.json();
    const { email, source = 'admin' } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Email valide requis' },
        { status: 400 }
      );
    }

    // Check if subscriber already exists
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { success: false, error: 'Cet email est déjà abonné' },
          { status: 409 }
        );
      } else {
        // Reactivate subscriber
        const subscriber = await prisma.newsletterSubscriber.update({
          where: { email },
          data: {
            isActive: true,
            unsubscribedAt: null,
            source,
          },
        });

        // Log admin action
        await logAdminAction(
          auth.user.id,
          'newsletter_subscriber_reactivated',
          'Abonné newsletter réactivé',
          `L'email **${email}** a été réactivé dans la newsletter`,
          undefined,
          { email, source }
        );

        return NextResponse.json({
          success: true,
          subscriber,
          message: 'Abonné réactivé avec succès',
        });
      }
    }

    // Create new subscriber
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        source,
        isActive: true,
      },
    });

    // Log admin action
    await logAdminAction(
      auth.user.id,
      'newsletter_subscriber_added',
      'Nouvel abonné newsletter',
      `L'email **${email}** a été ajouté à la newsletter`,
      undefined,
      { email, source }
    );

    return NextResponse.json({
      success: true,
      subscriber,
      message: 'Abonné ajouté avec succès',
    });
  } catch (error) {
    console.error('Error adding newsletter subscriber:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add subscriber' },
      { status: 500 }
    );
  }
}