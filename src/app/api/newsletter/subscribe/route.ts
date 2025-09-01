import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source = 'footer' } = body;

    // Validation
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email requis' },
        { status: 400 }
      );
    }

    if (!email.includes('@') || email.length < 5) {
      return NextResponse.json(
        { success: false, error: 'Email invalide' },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    // Check if subscriber already exists
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: emailLower },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { success: false, error: 'Cet email est déjà inscrit à la newsletter' },
          { status: 409 }
        );
      } else {
        // Reactivate subscriber
        const subscriber = await prisma.newsletterSubscriber.update({
          where: { email: emailLower },
          data: {
            isActive: true,
            unsubscribedAt: null,
            source,
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Votre abonnement à la newsletter a été réactivé avec succès !',
          subscriber: {
            id: subscriber.id,
            email: subscriber.email,
          },
        });
      }
    }

    // Create new subscriber
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: emailLower,
        source,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Vous avez été inscrit à la newsletter avec succès !',
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
      },
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { success: false, error: 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token'); // For future unsubscribe links

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email requis' },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    // Find and deactivate subscriber
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: emailLower },
    });

    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: 'Email non trouvé dans la newsletter' },
        { status: 404 }
      );
    }

    if (!subscriber.isActive) {
      return NextResponse.json(
        { success: false, error: 'Cet email n\'est déjà plus abonné' },
        { status: 409 }
      );
    }

    await prisma.newsletterSubscriber.update({
      where: { email: emailLower },
      data: {
        isActive: false,
        unsubscribedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Vous avez été désabonné de la newsletter avec succès',
    });
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return NextResponse.json(
      { success: false, error: 'Une erreur est survenue lors de la désinscription' },
      { status: 500 }
    );
  }
}