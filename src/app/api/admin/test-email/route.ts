import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/auth';
import { EmailService } from '@/services/emailService';

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.ok) return auth.res;

  try {
    const body = await req.json();
    const { to, type, ...testData } = body;

    if (!to || !to.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Email destinataire requis et valide' },
        { status: 400 },
      );
    }

    let result;

    switch (type) {
      case 'welcome':
        result = await EmailService.sendWelcomeEmail(
          to,
          testData.name || 'Utilisateur Test',
          testData.temporaryPassword,
        );
        break;

      case 'password-reset':
        result = await EmailService.sendPasswordResetEmail(
          to,
          testData.name || 'Utilisateur Test',
          testData.resetToken || 'test-token-123',
        );
        break;

      case 'approval':
        result = await EmailService.sendApprovalEmail(to, testData.name || 'Utilisateur Test');
        break;

      case 'rejection':
        result = await EmailService.sendRejectionEmail(
          to,
          testData.name || 'Utilisateur Test',
          testData.reason,
        );
        break;

      case 'test':
      default:
        result = await EmailService.sendTestEmail(to);
        break;
    }

    return NextResponse.json({
      success: true,
      message: `Email de test (${type}) envoyé avec succès à ${to}`,
      data: result,
    });
  } catch (error: unknown) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de l'envoi de l'email de test",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
