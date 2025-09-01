import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/auth';
import { prisma } from '@/lib/prisma';
import { logAdminAction } from '@/services/activityLogService';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.ok) return auth.res;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status'); // Filter by status
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (status) {
      where.status = status;
    }

    const [newsletters, total] = await Promise.all([
      prisma.newsletter.findMany({
        where,
        include: {
          template: {
            select: {
              name: true,
              templateType: true,
            },
          },
          createdBy: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.newsletter.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      newsletters,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch newsletters' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.ok) return auth.res;

  try {
    const body = await req.json();
    const {
      title,
      description,
      templateId,
      subject,
      variables,
      scheduledAt,
    } = body;

    // Validation
    if (!title || !templateId || !subject) {
      return NextResponse.json(
        { success: false, error: 'Titre, template et sujet sont requis' },
        { status: 400 }
      );
    }

    // Verify template exists
    const template = await prisma.emailTemplate.findUnique({
      where: { id: parseInt(templateId) },
    });

    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template non trouvé' },
        { status: 404 }
      );
    }

    if (!template.isActive) {
      return NextResponse.json(
        { success: false, error: 'Le template sélectionné n\'est pas actif' },
        { status: 400 }
      );
    }

    // Get recipient count
    const recipientCount = await prisma.newsletterSubscriber.count({
      where: { isActive: true },
    });

    const newsletter = await prisma.newsletter.create({
      data: {
        title,
        description,
        templateId: parseInt(templateId),
        subject,
        variables,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        recipientCount,
        status: scheduledAt ? 'SCHEDULED' : 'DRAFT',
        createdById: auth.user.id,
      },
      include: {
        template: {
          select: {
            name: true,
            templateType: true,
          },
        },
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Log admin action
    await logAdminAction(
      auth.user.id,
      'newsletter_created',
      'Newsletter créée',
      `La newsletter **${title}** a été créée${scheduledAt ? ' et programmée' : ''}`,
      undefined,
      { 
        newsletterId: newsletter.id,
        title,
        templateId,
        recipientCount,
        status: newsletter.status
      }
    );

    return NextResponse.json({
      success: true,
      newsletter,
      message: 'Newsletter créée avec succès',
    });
  } catch (error) {
    console.error('Error creating newsletter:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create newsletter' },
      { status: 500 }
    );
  }
}