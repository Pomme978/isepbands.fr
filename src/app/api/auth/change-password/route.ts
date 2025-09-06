import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middlewares/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { clearSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  // Skip password change verification for this endpoint
  const auth = await requireAuth(req, false);
  if (!auth.ok) {
    return auth.res;
  }

  try {
    const { currentPassword, newPassword, confirmPassword } = await req.json();

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'Les nouveaux mots de passe ne correspondent pas' },
        { status: 400 },
      );
    }

    // Password strength validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe ne respecte pas les critères de sécurité' },
        { status: 400 },
      );
    }

    // Get user with password from database
    const user = await prisma.user.findUnique({
      where: { id: auth.user.id },
      select: {
        id: true,
        email: true,
        password: true,
        requirePasswordChange: true,
      },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 400 });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update user password and remove requirePasswordChange flag
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
        requirePasswordChange: false,
      },
    });

    // Log the password change activity
    try {
      const { logActivity } = await import('@/services/activityLogService');
      await logActivity(
        user.id,
        'password_change',
        'Changement de mot de passe',
        'Mot de passe modifié avec succès',
        null,
        { forced: user.requirePasswordChange || false },
      );
    } catch (logError) {
      console.error('Error logging password change activity:', logError);
      // Don't fail the password change if logging fails
    }

    // Create response and clear session to force re-authentication
    const response = NextResponse.json({
      success: true,
      message: 'Mot de passe modifié avec succès',
    });

    // Clear the session cookie to force logout after password change
    clearSession(response);

    return response;
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: 'Erreur lors du changement de mot de passe' },
      { status: 500 },
    );
  }
}
