import { prisma } from '../lib/prisma';

const INITIAL_BADGES = [
  {
    key: 'founding_member',
    labelFr: 'Membre Fondateur',
    labelEn: 'Founding Member',
    description: "Membre original d'ISEP Bands",
    color: '#FF6B35',
  },
  {
    key: 'former_board_2024',
    labelFr: 'Ancien Bureau 2024-25',
    labelEn: 'Former Board 2024-25',
    description: "Membre du bureau pendant l'année académique 2024-25",
    color: '#4ECDC4',
  },
  {
    key: 'concert_performer',
    labelFr: 'Artiste de Concert',
    labelEn: 'Concert Performer',
    description: "A participé aux concerts officiels d'ISEP Bands",
    color: '#45B7D1',
  },
  {
    key: 'jam_regular',
    labelFr: 'Habitué des Jams',
    labelEn: 'Jam Session Regular',
    description: 'Participant actif des sessions jam',
    color: '#96CEB4',
  },
  {
    key: 'studio_artist',
    labelFr: 'Artiste Studio',
    labelEn: 'Studio Recording Artist',
    description: 'A enregistré des morceaux en studio',
    color: '#FFEAA7',
  },
  {
    key: 'event_organizer',
    labelFr: "Organisateur d'Événements",
    labelEn: 'Event Organizer',
    description: "A aidé à organiser des événements de l'association",
    color: '#DDA0DD',
  },
];

async function migrateBadges() {
  try {
    console.log('🚀 Starting badge migration...');

    // Check if BadgeDefinition table exists and is empty
    const existingBadges = await prisma.badgeDefinition.count();

    if (existingBadges > 0) {
      console.log(`⚠️  Found ${existingBadges} existing badge definitions. Skipping migration.`);
      return;
    }

    // Create badge definitions
    console.log('📝 Creating badge definitions...');

    for (const badge of INITIAL_BADGES) {
      await prisma.badgeDefinition.create({
        data: badge,
      });
      console.log(`✅ Created badge: ${badge.labelFr} (${badge.key})`);
    }

    // Now migrate existing user badges to the new system
    console.log('🔄 Migrating existing user badges...');

    const existingUserBadges = await prisma.badge.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (existingUserBadges.length > 0) {
      console.log(`Found ${existingUserBadges.length} user badges to migrate`);

      // For each existing badge, try to match it with a badge definition
      for (const userBadge of existingUserBadges) {
        // The old Badge model only had 'name' field
        const badgeName = (userBadge as { name?: string }).name;

        if (badgeName) {
          // Try to find matching badge definition
          const badgeDefinition = await prisma.badgeDefinition.findFirst({
            where: {
              OR: [{ key: badgeName }, { labelEn: badgeName }, { labelFr: badgeName }],
            },
          });

          if (badgeDefinition) {
            // Update the existing badge to reference the badge definition
            await prisma.badge.update({
              where: { id: userBadge.id },
              data: {
                badgeDefinitionId: badgeDefinition.id,
              },
            });
            console.log(
              `✅ Migrated badge for ${userBadge.user.firstName} ${userBadge.user.lastName}: ${badgeName} -> ${badgeDefinition.labelFr}`,
            );
          } else {
            console.log(`⚠️  Could not find badge definition for: ${badgeName}`);
          }
        }
      }
    }

    console.log('✅ Badge migration completed successfully!');
  } catch (error) {
    console.error('❌ Badge migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateBadges()
    .then(() => {
      console.log('Migration finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export { migrateBadges };
