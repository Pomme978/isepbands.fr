import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EmailService } from '@/services/emailService';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Token de vérification requis' }, { status: 400 });
    }

    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationTokenExpires: {
          gt: new Date(), // Token not expired
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: 'Token de vérification invalide ou expiré',
        },
        { status: 400 },
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        {
          error: 'Email déjà vérifié',
        },
        { status: 400 },
      );
    }

    // Update user to mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
        emailVerificationToken: null,
        emailVerificationTokenExpires: null,
      },
    });

    // Send confirmation email
    try {
      await EmailService.sendEmailVerifiedEmail(user.email, user.firstName);
    } catch (emailError) {
      console.error('Failed to send email verified confirmation:', emailError);
      // Don't fail the verification if email sending fails
    }

    return NextResponse.json({
      success: true,
      message: 'Email vérifié avec succès',
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      {
        error: "Erreur lors de la vérification de l'email",
      },
      { status: 500 },
    );
  }
}
