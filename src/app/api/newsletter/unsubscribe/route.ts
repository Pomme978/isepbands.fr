import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EmailService } from '@/services/emailService';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  if (!email || !token) {
    return NextResponse.json(
      { success: false, error: 'Email et token requis' },
      { status: 400 }
    );
  }

  try {
    // Vérifier si l'abonné existe
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: 'Adresse email non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier le token (simple hash de l'email pour la sécurité)
    const expectedToken = Buffer.from(email).toString('base64');
    if (token !== expectedToken) {
      return NextResponse.json(
        { success: false, error: 'Token invalide' },
        { status: 401 }
      );
    }

    // Si déjà inactif, pas besoin de faire quoi que ce soit
    if (!subscriber.isActive) {
      return NextResponse.json({
        success: true,
        message: 'Vous êtes déjà désabonné(e)',
        alreadyUnsubscribed: true,
      });
    }

    // Désactiver l'abonnement
    await prisma.newsletterSubscriber.update({
      where: { email },
      data: { 
        isActive: false,
        updatedAt: new Date(),
      },
    });

    // Envoyer email de confirmation de désabonnement
    try {
      await EmailService.sendTemplateEmail('unsubscribe_confirmation', email, {
        email,
      });
    } catch (emailError) {
      console.error('Error sending unsubscribe confirmation email:', emailError);
      // Ne pas faire échouer la désabonnement si l'email échoue
    }

    return NextResponse.json({
      success: true,
      message: 'Désabonnement effectué avec succès',
    });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors du désabonnement' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Email valide requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'abonné existe
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: 'Adresse email non trouvée' },
        { status: 404 }
      );
    }

    // Si déjà inactif
    if (!subscriber.isActive) {
      return NextResponse.json({
        success: true,
        message: 'Vous êtes déjà désabonné(e)',
        alreadyUnsubscribed: true,
      });
    }

    // Désactiver l'abonnement
    await prisma.newsletterSubscriber.update({
      where: { email },
      data: { 
        isActive: false,
        updatedAt: new Date(),
      },
    });

    // Envoyer email de confirmation
    try {
      await EmailService.sendTemplateEmail('unsubscribe_confirmation', email, {
        email,
      });
    } catch (emailError) {
      console.error('Error sending unsubscribe confirmation email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Désabonnement effectué avec succès',
    });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors du désabonnement' },
      { status: 500 }
    );
  }
}