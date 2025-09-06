import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getSessionUser(req);
    if (!session?.id) {
      return NextResponse.json(
        {
          success: false,
          code: 'unauthorized',
          message: 'Authentication required',
          data: null,
        },
        { status: 401 },
      );
    }

    console.log(
      `🚪 User ${session.id} (${session.firstName} ${session.lastName}) is leaving the association`,
    );

    // Get current user data for logging
    const currentUser = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        roles: {
          include: {
            role: {
              select: {
                name: true,
                nameFrMale: true,
                nameFrFemale: true,
              },
            },
          },
        },
      },
    });

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          code: 'user_not_found',
          message: 'User not found',
          data: null,
        },
        { status: 404 },
      );
    }

    if (currentUser.status === 'ARCHIVED') {
      return NextResponse.json(
        {
          success: false,
          code: 'already_archived',
          message: 'Compte déjà archivé',
          data: null,
        },
        { status: 400 },
      );
    }

    // Archive the user account (don't delete, just change status)
    await prisma.user.update({
      where: { id: session.id },
      data: {
        status: 'ARCHIVED',
        updatedAt: new Date(),
      },
    });

    // Create admin activity log
    const userRoles =
      currentUser.roles.map((ur) => ur.role.nameFrMale || ur.role.name).join(', ') || 'Aucun rôle';
    const logMessage = `${currentUser.firstName} ${currentUser.lastName} (${currentUser.email}) a quitté l'association. Rôles précédents: ${userRoles}. Compte archivé.`;

    await prisma.activity.create({
      data: {
        type: 'USER_LEFT_ASSOCIATION',
        title: "Départ d'un membre",
        description: logMessage,
        userId: session.id,
        metadata: JSON.stringify({
          userEmail: currentUser.email,
          userName: `${currentUser.firstName} ${currentUser.lastName}`,
          previousRoles: currentUser.roles.map((ur) => ({
            id: ur.role.name,
            name: ur.role.nameFrMale || ur.role.name,
          })),
          archivedAt: new Date().toISOString(),
        }),
        createdAt: new Date(),
      },
    });

    console.log(`✅ User ${session.id} successfully archived and admin log created`);

    return NextResponse.json({
      success: true,
      code: 'account_archived',
      message: 'Compte archivé avec succès. Les administrateurs ont été notifiés.',
      data: null,
    });
  } catch (error) {
    console.error('❌ Error archiving user account:', error);
    return NextResponse.json(
      {
        success: false,
        code: 'server_error',
        message: 'Erreur interne du serveur',
        data: null,
      },
      { status: 500 },
    );
  }
}
