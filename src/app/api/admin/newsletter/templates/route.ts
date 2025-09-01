import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/auth';
import { prisma } from '@/lib/prisma';
import { logAdminAction } from '@/services/activityLogService';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.ok) return auth.res;

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // Filter by template type
    const active = searchParams.get('active'); // Filter by active status

    const where: any = {};
    
    if (type) {
      where.templateType = type;
    }
    
    if (active !== null) {
      where.isActive = active === 'true';
    }

    const templates = await prisma.emailTemplate.findMany({
      where,
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            newsletters: true,
            emailLogs: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      templates,
    });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch templates' },
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
      name,
      description,
      subject,
      htmlContent,
      cssContent,
      variables,
      templateType,
      isActive = true,
      isDefault = false,
    } = body;

    // Validation
    if (!name || !subject || !htmlContent || !templateType) {
      return NextResponse.json(
        { success: false, error: 'Nom, sujet, contenu HTML et type sont requis' },
        { status: 400 }
      );
    }

    // Check if template name already exists
    const existing = await prisma.emailTemplate.findUnique({
      where: { name },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Un template avec ce nom existe déjà' },
        { status: 409 }
      );
    }

    // If setting as default, unset other defaults of the same type
    if (isDefault) {
      await prisma.emailTemplate.updateMany({
        where: {
          templateType,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const template = await prisma.emailTemplate.create({
      data: {
        name,
        description,
        subject,
        htmlContent,
        cssContent,
        variables,
        templateType,
        isActive,
        isDefault,
        createdById: auth.user.id,
      },
      include: {
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
      'email_template_created',
      'Template email créé',
      `Le template **${name}** (${templateType}) a été créé`,
      undefined,
      { 
        templateId: template.id,
        templateName: name,
        templateType,
        isDefault 
      }
    );

    return NextResponse.json({
      success: true,
      template,
      message: 'Template créé avec succès',
    });
  } catch (error) {
    console.error('Error creating email template:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create template' },
      { status: 500 }
    );
  }
}