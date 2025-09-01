import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/auth';
import { prisma } from '@/lib/prisma';
import { logAdminAction } from '@/services/activityLogService';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(req);
  if (!auth.ok) return auth.res;

  const { id } = await params;

  try {
    const template = await prisma.emailTemplate.findUnique({
      where: { id: parseInt(id) },
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
    });

    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error('Error fetching email template:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch template' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(req);
  if (!auth.ok) return auth.res;

  const { id } = await params;

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
      isActive,
      isDefault,
    } = body;

    const existingTemplate = await prisma.emailTemplate.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { success: false, error: 'Template non trouvé' },
        { status: 404 }
      );
    }

    // Check if template name already exists (excluding current template)
    if (name && name !== existingTemplate.name) {
      const existing = await prisma.emailTemplate.findFirst({
        where: {
          name,
          id: { not: parseInt(id) },
        },
      });

      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Un template avec ce nom existe déjà' },
          { status: 409 }
        );
      }
    }

    // If setting as default, unset other defaults of the same type
    if (isDefault && !existingTemplate.isDefault) {
      await prisma.emailTemplate.updateMany({
        where: {
          templateType: templateType || existingTemplate.templateType,
          isDefault: true,
          id: { not: parseInt(id) },
        },
        data: {
          isDefault: false,
        },
      });
    }

    const template = await prisma.emailTemplate.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(subject && { subject }),
        ...(htmlContent && { htmlContent }),
        ...(cssContent !== undefined && { cssContent }),
        ...(variables !== undefined && { variables }),
        ...(templateType && { templateType }),
        ...(isActive !== undefined && { isActive }),
        ...(isDefault !== undefined && { isDefault }),
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
      'email_template_updated',
      'Template email modifié',
      `Le template **${template.name}** a été modifié`,
      undefined,
      { 
        templateId: template.id,
        templateName: template.name,
        templateType: template.templateType
      }
    );

    return NextResponse.json({
      success: true,
      template,
      message: 'Template mis à jour avec succès',
    });
  } catch (error) {
    console.error('Error updating email template:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update template' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(req);
  if (!auth.ok) return auth.res;

  const { id } = await params;

  try {
    const template = await prisma.emailTemplate.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            newsletters: true,
            emailLogs: true,
          },
        },
      },
    });

    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template non trouvé' },
        { status: 404 }
      );
    }

    // Check if template is being used
    if (template._count.newsletters > 0) {
      return NextResponse.json(
        { success: false, error: 'Ce template est utilisé par des newsletters et ne peut pas être supprimé' },
        { status: 409 }
      );
    }

    await prisma.emailTemplate.delete({
      where: { id: parseInt(id) },
    });

    // Log admin action
    await logAdminAction(
      auth.user.id,
      'email_template_deleted',
      'Template email supprimé',
      `Le template **${template.name}** a été supprimé`,
      undefined,
      { 
        templateId: template.id,
        templateName: template.name,
        templateType: template.templateType
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Template supprimé avec succès',
    });
  } catch (error) {
    console.error('Error deleting email template:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}