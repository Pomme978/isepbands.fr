import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/admin';
import { ensureDBIntegrity } from '@/utils/dbIntegrity';

export async function POST(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) {
    return authResult.res;
  }

  try {
    const result = await ensureDBIntegrity();

    // Log admin action
    try {
      const { logAdminAction } = await import('@/services/activityLogService');
      await logAdminAction(
        authResult.user.id,
        'database_integrity_check',
        'Vérification d\'intégrité BDD',
        `Vérification d'intégrité de la base de données exécutée${result.actions.length > 0 ? ` - ${result.actions.length} action(s) effectuée(s)` : ' - aucune action nécessaire'}`,
        null,
        {
          success: result.success,
          actionsCount: result.actions.length,
          actions: result.actions,
          error: result.error || null
        }
      );
    } catch (err) {
      // Activity log error
    }

    if (result.success) {
      if (result.actions.length === 0) {
        return NextResponse.json({
          success: true,
          message: 'Base de données intègre - aucune action nécessaire',
          details: [],
          stats: result.stats,
        });
      } else {
        return NextResponse.json({
          success: true,
          message: `Vérification terminée - ${result.actions.length} action(s) effectuée(s)`,
          details: result.actions,
          stats: result.stats,
        });
      }
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Database integrity check failed',
        },
        { status: 500 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to run database integrity check',
      },
      { status: 500 },
    );
  }
}
