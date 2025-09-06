import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/admin';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const legalMentionsSchema = z.object({
  contactEmail: z.string().email('Email de contact invalide'),
  associationAddress: z.string().optional(),
  hostingProvider: z.string().optional(),
  hostingAddress: z.string().optional(),
  hostingPhone: z.string().optional(),
  hostingEmail: z.string().optional(),
  domainProvider: z.string().optional(),
  domainAddress: z.string().optional(),
  domainPhone: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) return authResult.res;

  try {
    // Récupérer le président actuel depuis la base de données (rôle id=1)
    const presidentUser = await prisma.userRole.findFirst({
      where: { roleId: 1 },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const presidentName = presidentUser?.user
      ? `${presidentUser.user.firstName} ${presidentUser.user.lastName}`
      : '';

    const legalMentions = await prisma.legalMentions.findFirst();

    if (!legalMentions) {
      // Retourner des valeurs par défaut avec le président automatique
      const defaultMentions = {
        presidentName,
        contactEmail: 'contact@isepbands.fr',
        technicalEmail: 'tech@isepbands.fr',
        associationAddress: 'Campus de l\'ISEP, 28 rue Notre-Dame des Champs, 75006 Paris, France',
        hostingProvider: '',
        hostingAddress: '',
        hostingPhone: '',
        hostingEmail: '',
        domainProvider: '',
        domainAddress: '',
        domainPhone: '',
        developmentTeam: 'Armand OCTEAU, Sarah LÉVY',
        designTeam: 'Armand OCTEAU, Sarah LÉVY',
      };
      return NextResponse.json(defaultMentions);
    }

    // Toujours utiliser le président, l'email technique et l'équipe fixes
    const result = {
      ...legalMentions,
      presidentName,
      technicalEmail: 'tech@isepbands.fr',
      developmentTeam: 'Armand OCTEAU, Sarah LÉVY',
      designTeam: 'Armand OCTEAU, Sarah LÉVY',
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching legal mentions:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const authResult = await requireAdminAuth(req);
  if (!authResult.ok) return authResult.res;

  try {
    const body = await req.json();
    const validatedData = legalMentionsSchema.parse(body);

    // Récupérer le président actuel depuis la base de données (rôle id=1)
    const presidentUser = await prisma.userRole.findFirst({
      where: { roleId: 1 },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const presidentName = presidentUser?.user
      ? `${presidentUser.user.firstName} ${presidentUser.user.lastName}`
      : '';

    // Essayer de trouver un enregistrement existant
    const existingRecord = await prisma.legalMentions.findFirst();

    let legalMentions;
    if (existingRecord) {
      // Mettre à jour l'enregistrement existant
      legalMentions = await prisma.legalMentions.update({
        where: { id: existingRecord.id },
        data: validatedData,
      });
    } else {
      // Créer un nouvel enregistrement avec presidentName inclus
      legalMentions = await prisma.legalMentions.create({
        data: {
          ...validatedData,
          presidentName, // Ajouter le nom du président récupéré
        },
      });
    }

    // Retourner avec le président, l'email technique et l'équipe fixes
    const result = {
      ...legalMentions,
      presidentName,
      technicalEmail: 'tech@isepbands.fr',
      developmentTeam: 'Armand OCTEAU, Sarah LÉVY',
      designTeam: 'Armand OCTEAU, Sarah LÉVY',
    };

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error updating legal mentions:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}
