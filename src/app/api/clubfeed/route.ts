import { NextRequest, NextResponse } from 'next/server';
import { getPublicFeedItems } from '@/services/publicFeedService';

export async function GET() {
  try {
    // Fetch from secure PublicFeed table - no admin logs possible
    const publicFeedItems = await getPublicFeedItems(20);
    console.log('PublicFeed items récupérés:', publicFeedItems.length);

    // Transform public feed items for the frontend
    const transformedActivities = publicFeedItems.map((item) => {
      // Get the highest weight role (most important role)
      let userRole = null;
      let sortedRoles = null;

      if (item.user?.roles && item.user.roles.length > 0) {
        sortedRoles = item.user.roles.sort((a, b) => b.role.weight - a.role.weight);
        const topRole = sortedRoles[0].role;
        console.log('Role data pour', item.user.firstName, ':', topRole);
        // Use appropriate gender version based on user pronouns
        const useFeminine =
          item.user.pronouns &&
          (item.user.pronouns.toLowerCase().includes('she') ||
            item.user.pronouns.toLowerCase().includes('elle'));
        userRole = useFeminine ? topRole.nameFrFemale : topRole.nameFrMale;
      }

      return {
        id: item.id,
        type: item.type,
        title: item.title,
        description: item.description,
        userId: item.userId,
        userName: item.user ? `${item.user.firstName} ${item.user.lastName}` : null,
        userAvatar: item.user?.photoUrl,
        userRole: userRole,
        userRoleColors: sortedRoles
          ? {
              gradientStart: sortedRoles[0].role.gradientStart,
              gradientEnd: sortedRoles[0].role.gradientEnd,
            }
          : null,
        metadata: item.metadata ? JSON.parse(item.metadata) : {},
        createdAt: item.createdAt,
        createdBy: item.userId, // User who created this public feed item
      };
    });

    console.log('Activités transformées:', transformedActivities.length);
    console.log(
      "Exemple d'activité avec couleurs:",
      JSON.stringify(transformedActivities[0], null, 2),
    );
    return NextResponse.json({ activities: transformedActivities });
  } catch (error) {
    console.error('Erreur dans GET /api/clubfeed:', error);
    // Return empty array if table doesn't exist yet
    return NextResponse.json({ activities: [] });
  }
}
