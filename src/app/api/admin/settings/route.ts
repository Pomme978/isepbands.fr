import { NextRequest, NextResponse } from 'next/server';
import { standardAuth } from '@/utils/authMiddleware';
import { prisma } from '@/lib/prisma';
import { logAdminAction } from '@/services/activityLogService';
import fs from 'fs';
import path from 'path';

interface SystemSettings {
  currentYear: string;
  primaryColor: string;
  association: {
    name: string;
    legalStatus: string;
    address: string;
    siret?: string;
    email: string;
  };
  publicationDirector: {
    name: string;
  };
}

// GET /api/admin/settings - Get current system settings
export async function GET(request: NextRequest) {
  const authResult = await standardAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  // Check admin permissions
  if (!user.isFullAccess && !user.isRoot) {
    return NextResponse.json({ error: 'Permissions administrateur requises' }, { status: 403 });
  }

  try {
    // Get settings from database
    const settings = (await prisma.systemSettings.findFirst()) || {
      currentYear: new Date().getFullYear().toString(),
      primaryColor: 'oklch(0.559 0.238 307.331)',
      associationName: 'ISEP Bands',
      associationLegalStatus: 'Association loi 1901',
      associationAddress: '',
      associationSiret: null,
      associationEmail: 'contact@isepbands.fr',
      publicationDirectorName: '',
    };

    // Format response
    const response: SystemSettings = {
      currentYear: settings.currentYear || new Date().getFullYear().toString(),
      primaryColor: settings.primaryColor || 'oklch(0.559 0.238 307.331)',
      association: {
        name: settings.associationName || 'ISEP Bands',
        legalStatus: settings.associationLegalStatus || 'Association loi 1901',
        address: settings.associationAddress || '',
        siret: settings.associationSiret || undefined,
        email: settings.associationEmail || 'contact@isepbands.fr',
      },
      publicationDirector: {
        name: settings.publicationDirectorName || '',
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des paramètres' },
      { status: 500 },
    );
  }
}

// PUT /api/admin/settings - Update system settings
export async function PUT(request: NextRequest) {
  const authResult = await standardAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  // Check admin permissions
  if (!user.isFullAccess && !user.isRoot) {
    return NextResponse.json({ error: 'Permissions administrateur requises' }, { status: 403 });
  }

  try {
    const body = (await request.json()) as SystemSettings;

    // Validate required fields
    const requiredFields = [
      body.association.name,
      body.association.legalStatus,
      body.association.address,
      body.association.email,
      body.publicationDirector.name,
    ];

    if (requiredFields.some((field) => !field?.trim())) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.association.email)) {
      return NextResponse.json({ error: "Format d'email invalide" }, { status: 400 });
    }

    // Validate OKLCH color format
    const oklchRegex = /^oklch\([\d.]+\s+[\d.]+\s+[\d.]+\)$/;
    if (!oklchRegex.test(body.primaryColor)) {
      return NextResponse.json({ error: 'Format de couleur OKLCH invalide' }, { status: 400 });
    }

    // Update or create settings
    const settingsData = {
      currentYear: body.currentYear,
      primaryColor: body.primaryColor,
      associationName: body.association.name.trim(),
      associationLegalStatus: body.association.legalStatus.trim(),
      associationAddress: body.association.address.trim(),
      associationSiret: body.association.siret?.trim() || null,
      associationEmail: body.association.email.trim().toLowerCase(),
      publicationDirectorName: body.publicationDirector.name.trim(),
    };

    const settings = await prisma.systemSettings.upsert({
      where: { id: 1 },
      update: settingsData,
      create: { id: 1, ...settingsData },
    });

    // Update CSS file if primary color changed
    if (body.primaryColor) {
      await updatePrimaryColorInCSS(body.primaryColor);
    }

    // Log admin action
    await logAdminAction(
      user.id,
      'system_settings_updated',
      'Paramètres système modifiés',
      `Paramètres de l'association mis à jour par **${user.firstName} ${user.lastName}**`,
      null, // No specific user targeted
      {
        changes: {
          associationName: body.association.name !== (settings.associationName || 'ISEP Bands'),
          associationLegalStatus: body.association.legalStatus !== (settings.associationLegalStatus || 'Association loi 1901'),
          associationAddress: body.association.address !== (settings.associationAddress || ''),
          associationEmail: body.association.email !== (settings.associationEmail || 'contact@isepbands.fr'),
          publicationDirectorName: body.publicationDirector.name !== (settings.publicationDirectorName || ''),
          primaryColor: body.primaryColor !== (settings.primaryColor || 'oklch(0.559 0.238 307.331)'),
          currentYear: body.currentYear !== (settings.currentYear || new Date().getFullYear().toString()),
        },
        newValues: {
          associationName: body.association.name,
          associationEmail: body.association.email,
          primaryColor: body.primaryColor,
          currentYear: body.currentYear
        }
      }
    );

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde des paramètres' },
      { status: 500 },
    );
  }
}

async function updatePrimaryColorInCSS(primaryColor: string) {
  try {
    const cssPath = path.join(process.cwd(), 'src/styles/globals.css');
    let cssContent = fs.readFileSync(cssPath, 'utf8');

    // Update the --primary CSS variable
    const primaryRegex = /--primary:\s*[^;]+;/;
    const replacement = `--primary: ${primaryColor};`;

    if (primaryRegex.test(cssContent)) {
      cssContent = cssContent.replace(primaryRegex, replacement);
    } else {
      // If not found, add after the :root { line
      cssContent = cssContent.replace(/:root\s*\{/, `:root {\n  ${replacement}`);
    }

    fs.writeFileSync(cssPath, cssContent, 'utf8');
  } catch (error) {
    console.error('Error updating CSS file:', error);
    // Don't throw error, just log it - settings are still saved in DB
  }
}
