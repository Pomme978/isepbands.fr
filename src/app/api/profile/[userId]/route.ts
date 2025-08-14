import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(req: NextRequest) {
  const urlParts = req.nextUrl.pathname.split('/');
  const userId = urlParts[urlParts.length - 1];
  if (!userId) {
    return NextResponse.json({
      success: false,
      code: 'missing_user_id',
      message: 'Missing userId',
      data: null,
    });
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      badges: true,
      instruments: true,
      roles: { include: { role: true } },
      groupMemberships: {
        include: {
          group: {
            include: {
              members: true,
              events: { include: { event: true } },
            },
          },
        },
      },
    },
  });
  if (!user) {
    return NextResponse.json({
      success: false,
      code: 'user_not_found',
      message: 'User not found',
      data: null,
    });
  }

  // Calculs des champs supplémentaires
  const totalGroups = user.groupMemberships.length;
  const instrumentCount = user.instruments.length;
  const activeGroups = user.groupMemberships.filter((gm) => gm.group && gm.group.isVerified).length;
  // Événements auxquels l'utilisateur a participé (tous les events des groupes où il est membre)
  const eventsAttended = user.groupMemberships.reduce(
    (acc, gm) => acc + (gm.group?.events.length || 0),
    0,
  );
  // Concerts joués (type = CONCERT)
  const concertsPlayed = user.groupMemberships.reduce(
    (acc, gm) => acc + (gm.group?.events.filter((e) => e.event.type === 'CONCERT').length || 0),
    0,
  );
  // Rôle principal (le plus haut weight)
  const primaryRole = user.roles.reduce(
    (prev, current) => (current.role.weight > prev.role.weight ? current : prev),
    user.roles[0],
  );

  // Formatage de la réponse
  const response = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    promotion: user.isOutOfSchool ? null : user.promotion,
    birthDate: user.isOutOfSchool ? null : user.birthDate,
    biography: user.biography,
    phone: user.phone,
    email: user.email,
    photoUrl: user.photoUrl,
    status: user.status,
    createdAt: user.createdAt,
    emailVerified: user.emailVerified,
    pronouns: user.pronouns,
    isLookingForGroup: user.isLookingForGroup,
    isOutOfSchool: user.isOutOfSchool,
    badges: user.badges.map((b) => b.name),
    instruments: user.instruments,
    roles: user.roles.map((r) => r.role.name),
    totalGroups,
    instrumentCount,
    activeGroups,
    eventsAttended,
    concertsPlayed,
    primaryRole: primaryRole?.role?.name || null,
    groupMemberships: user.groupMemberships.map((gm) => ({
      id: gm.group.id,
      name: gm.group.name,
      imageUrl: gm.group.imageUrl,
      genre: gm.group.genre,
      isVerified: gm.group.isVerified,
      isLookingForMembers: gm.group.isLookingForMembers,
      memberCount: gm.group.members.length,
      events: gm.group.events.map((e) => ({
        id: e.event.id,
        name: e.event.name,
        type: e.event.type,
        date: e.event.date,
        location: e.event.location,
      })),
    })),
  };
  return NextResponse.json({
    success: true,
    code: 'user_found',
    message: 'User found',
    data: response,
  });
}
