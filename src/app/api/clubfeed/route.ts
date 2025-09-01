import { NextRequest, NextResponse } from 'next/server';
import { getPublicFeedItems } from '@/services/publicFeedService';

export async function GET() {
  try {
    console.log('🔍 [PUBLIC API] Fetching from PublicFeed...');
    
    // Fetch from secure PublicFeed table - no admin logs possible
    const publicFeedItems = await getPublicFeedItems(20);

    console.log(`📊 [PUBLIC API] Found ${publicFeedItems.length} items in PublicFeed`);
    
    if (publicFeedItems.length > 0) {
      console.log('📋 [PUBLIC API] Items:', publicFeedItems.map(a => ({ 
        id: a.id, 
        type: a.type, 
        title: a.title,
        user: a.user ? `${a.user.firstName} ${a.user.lastName}` : 'No user'
      })));
    } else {
      console.log('❌ [PUBLIC API] No items found in PublicFeed table');
    }

    // Transform public feed items for the frontend
    const transformedActivities = publicFeedItems.map((item) => {
      // Get the highest weight role (most important role)
      let userRole = null;
      if (item.user?.roles && item.user.roles.length > 0) {
        const sortedRoles = item.user.roles.sort((a, b) => b.role.weight - a.role.weight);
        const topRole = sortedRoles[0].role;
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
        metadata: item.metadata,
        createdAt: item.createdAt,
        createdBy: null, // Public feed has no createdBy field
      };
    });

    return NextResponse.json({ activities: transformedActivities });
  } catch (error) {
    console.error('Error fetching public feed:', error);
    // Return empty array if table doesn't exist yet
    return NextResponse.json({ activities: [] });
  }
}
