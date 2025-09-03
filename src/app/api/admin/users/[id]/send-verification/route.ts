import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/admin';
import { prisma } from '@/lib/prisma';
import { EmailService } from '@/services/emailService';
import crypto from 'crypto';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) return authResult.res;

  try {
    const { id: userId } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        emailVerified: true,
        emailVerificationToken: true,
        emailVerificationTokenExpires: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email déjà vérifié' }, { status: 400 });
    }

    // Check if there's a recent verification email sent (within 5 minutes)
    if (
      user.emailVerificationTokenExpires &&
      user.emailVerificationTokenExpires > new Date(Date.now() - 5 * 60 * 1000)
    ) {
      const timeRemaining = Math.ceil(
        (user.emailVerificationTokenExpires.getTime() - (Date.now() - 5 * 60 * 1000)) / 1000 / 60,
      );
      return NextResponse.json(
        {
          error: `Un email de vérification a déjà été envoyé récemment. Veuillez attendre ${timeRemaining} minute(s) avant de réessayer.`,
        },
        { status: 429 },
      );
    }

    // Generate new verification token
    const verificationToken = crypto.randomUUID();
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new verification token
    await prisma.user.update({
      where: { id: userId },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpires: tokenExpires,
      },
    });

    // Send verification email
    await EmailService.sendEmailVerificationEmail(user.email, user.firstName, verificationToken);

    return NextResponse.json({
      success: true,
      message: 'Email de vérification envoyé avec succès',
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email de vérification" },
      { status: 500 },
    );
  }
}
