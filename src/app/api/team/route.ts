import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRoleDisplayName } from '@/utils/roleUtils';

export async function GET(request: NextRequest) {
  try {
    // Récupérer tous les utilisateurs avec leurs rôles ayant un poids élevé (bureau)
    const bureauUsers = await prisma.user.findMany({
      where: {
        status: 'CURRENT',
        roles: {
          some: {
            role: {
              weight: {
                gte: 70, // Poids 70+ pour les membres du bureau
              },
            },
          },
        },
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    // Transformer les données pour correspondre au format attendu par la page
    const transformedUsers = bureauUsers.map((user) => {
      const highestRole = user.roles.find((ur) => ur.role.weight >= 70);

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        motto: user.bureauQuote || undefined,
        profilePhoto: user.photoUrl || undefined,
        role: highestRole?.role.name || 'member',
        roleDisplayName: highestRole
          ? getRoleDisplayName(highestRole.role, user.pronouns)
          : 'Membre',
      };
    });

    return NextResponse.json(transformedUsers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}
