import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/admin';
import { checkEmailTemplatesDifferences } from '@/utils/dbIntegrity';

export async function GET(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) {
    return authResult.res;
  }

  try {
    const differences = await checkEmailTemplatesDifferences(authResult.user.id);

    // Log admin action
    try {
      const { logAdminAction } = await import('@/services/activityLogService');
      await logAdminAction(
        authResult.user.id,
        'email_templates_check',
        "Vérification des templates d'email",
        `Vérification des différences entre templates DB et fichiers source - ${differences.length} différence(s) trouvée(s)`,
        null,
        {
          differencesCount: differences.length,
          templatesChecked: differences.map((d) => d.name),
        },
      );
    } catch (err) {
      // Activity log error
    }

    return NextResponse.json({
      success: true,
      differences,
      count: differences.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check email templates differences',
      },
      { status: 500 },
    );
  }
}
