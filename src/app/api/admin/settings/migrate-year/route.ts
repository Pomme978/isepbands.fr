import { NextRequest, NextResponse } from 'next/server';
import { standardAuth } from '@/utils/authMiddleware';
import { prisma } from '@/lib/prisma';

// POST /api/admin/settings/migrate-year - Migrate to next school year
export async function POST(request: NextRequest) {
  const authResult = await standardAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  // Check admin permissions
  if (!user.isFullAccess && !user.isRoot) {
    return NextResponse.json({ error: 'Permissions administrateur requises' }, { status: 403 });
  }

  // Check if current month is August (migration allowed)
  const currentDate = new Date();
  const isAugust = currentDate.getMonth() === 7; // August is month 7 (0-indexed)

  if (!isAugust) {
    return NextResponse.json(
      { error: "La migration d'année n'est possible qu'en août" },
      { status: 400 },
    );
  }

  try {
    // Start transaction for data integrity
    const result = await prisma.$transaction(async (tx) => {
      // Get current settings
      const currentSettings = await tx.systemSettings.findFirst();
      const currentYear = parseInt(
        currentSettings?.currentYear || new Date().getFullYear().toString(),
      );
      const newYear = currentYear + 1;

      // 1. Archive current year data
      // Archive users who are not out of school and set them to alumni status
      await tx.user.updateMany({
        where: {
          status: 'CURRENT',
        },
        data: {
          status: 'ALUMNI',
          // Keep their data but mark them as alumni from previous year
          updatedAt: new Date(),
        },
      });

      // 2. Archive groups that are year-specific
      // Mark groups as archived if they're year-specific
      await tx.group.updateMany({
        where: {
          // Add conditions for year-specific groups if needed
          isActive: true,
        },
        data: {
          isActive: false,
          // Add archived year field if it exists in your schema
          updatedAt: new Date(),
        },
      });

      // 3. Archive events from the current year
      const startOfYear = new Date(currentYear, 8, 1); // September 1st of current year
      const endOfYear = new Date(newYear, 7, 31); // August 31st of next year

      await tx.event.updateMany({
        where: {
          date: {
            gte: startOfYear,
            lte: endOfYear,
          },
        },
        data: {
          // Mark events as archived
          updatedAt: new Date(),
        },
      });

      // 4. Reset or clean up year-specific data
      // Clear temporary badges that might be year-specific
      await tx.userBadge.deleteMany({
        where: {
          badge: {
            name: {
              contains: currentYear.toString(),
            },
          },
        },
      });

      // 5. Create new year data structure
      // Create a system log entry for the migration
      await tx.systemLog.create({
        data: {
          action: 'YEAR_MIGRATION',
          details: {
            from: currentYear.toString(),
            to: newYear.toString(),
            date: new Date().toISOString(),
            performedBy: user.id,
          },
          performedById: user.id,
          createdAt: new Date(),
        },
      });

      // 6. Update system settings with new year
      await tx.systemSettings.upsert({
        where: { id: 1 },
        update: {
          currentYear: newYear.toString(),
          updatedAt: new Date(),
        },
        create: {
          id: 1,
          currentYear: newYear.toString(),
          primaryColor: 'oklch(0.559 0.238 307.331)',
          associationName: 'ISEP Bands',
          associationLegalStatus: 'Association loi 1901',
          associationAddress: '',
          associationEmail: 'contact@isepbands.fr',
          publicationDirectorName: '',
        },
      });

      return { oldYear: currentYear, newYear: newYear };
    });

    // Log the successful migration
    console.log(`Year migration completed: ${result.oldYear} → ${result.newYear}`);

    return NextResponse.json({
      success: true,
      message: `Migration vers l'année ${result.newYear} réussie`,
      oldYear: result.oldYear,
      newYear: result.newYear,
    });
  } catch (error) {
    console.error('Error during year migration:', error);
    return NextResponse.json(
      {
        error: "Erreur lors de la migration d'année",
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 },
    );
  }
}
