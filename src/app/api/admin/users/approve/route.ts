import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middlewares/admin';
import { prisma } from '@/prisma';

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.res;

  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 });
    }

    // Check if user exists and is pending
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { registrationRequest: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    if (user.status !== 'PENDING') {
      return NextResponse.json({ error: 'L\'utilisateur n\'est pas en attente d\'approbation' }, { status: 400 });
    }

    // Update user status to CURRENT and registration request to ACCEPTED
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { status: 'CURRENT' }
      });

      if (user.registrationRequest) {
        await tx.registrationRequest.update({
          where: { userId },
          data: { status: 'ACCEPTED' }
        });
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Utilisateur approuvé avec succès' 
    });

  } catch (error) {
    console.error('Error approving user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'approbation' },
      { status: 500 }
    );
  }
}