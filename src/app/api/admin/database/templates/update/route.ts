import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/admin';
import { updateEmailTemplatesFromSource } from '@/utils/dbIntegrity';

export async function POST(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) {
    return authResult.res;
  }

  try {
    const result = await updateEmailTemplatesFromSource(authResult.user.id);

    // Log admin action
    try {
      const { logAdminAction } = await import('@/services/activityLogService');
      await logAdminAction(
        authResult.user.id,
        'email_templates_update',
        "Mise à jour des templates d'email",
        `Mise à jour des templates d'email depuis les fichiers source - ${result.updatedCount} template(s) mis à jour`,
        null,
        {
          success: result.success,
          updatedCount: result.updatedCount,
          actions: result.actions,
        },
      );
    } catch (err) {
      // Activity log error
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `${result.updatedCount} template(s) mis à jour avec succès`,
        updatedCount: result.updatedCount,
        actions: result.actions,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to update email templates',
        },
        { status: 500 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update email templates',
      },
      { status: 500 },
    );
  }
}
