import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/admin';
import { ensureDBIntegrity } from '@/utils/dbIntegrity';

export async function POST(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) {
    return authResult.res;
  }

  try {
    console.log('🔧 Manual database integrity check initiated by admin');

    const result = await ensureDBIntegrity();

    if (result.success) {
      if (result.actions.length === 0) {
        return NextResponse.json({
          success: true,
          message: 'Base de données intègre - aucune action nécessaire',
          details: [],
        });
      } else {
        return NextResponse.json({
          success: true,
          message: `Vérification terminée - ${result.actions.length} action(s) effectuée(s)`,
          details: result.actions,
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
    console.error('Error during manual database integrity check:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to run database integrity check',
      },
      { status: 500 },
    );
  }
}
