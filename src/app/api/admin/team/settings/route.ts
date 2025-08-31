import { NextRequest, NextResponse } from 'next/server';
import { createActivityLog } from '@/services/activityLogService';
import { requireAdminAuth } from '@/utils/authMiddleware';
import { promises as fs } from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'team-settings.json');

interface TeamSettings {
  vision: string;
  groupPhotoUrl?: string;
}

const defaultSettings: TeamSettings = {
  vision: `🎵 Rassembler les passionnés de musique
🎸 Créer des expériences musicales inoubliables
🤝 Renforcer les liens entre les étudiants
🎯 Développer les talents artistiques
🌟 Faire rayonner l'ISEP par la musique`,
};

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function loadSettings(): Promise<TeamSettings> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
    return { ...defaultSettings, ...JSON.parse(data) };
  } catch {
    return defaultSettings;
  }
}

async function saveSettings(settings: TeamSettings) {
  await ensureDataDir();
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const settings = await loadSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching team settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des paramètres' },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = await req.json();
    const { vision, groupPhotoUrl } = body;

    if (!vision || typeof vision !== 'string') {
      return NextResponse.json({ error: 'La vision est requise' }, { status: 400 });
    }

    const settings: TeamSettings = {
      vision: vision.trim(),
      groupPhotoUrl: groupPhotoUrl || undefined,
    };

    await saveSettings(settings);

    // Logger la modification des paramètres d'équipe
    try {
      const adminId = String(authResult.user?.id || '');
      await createActivityLog({
        userId: adminId,
        type: 'UPDATE_TEAM_SETTINGS',
        title: 'Modification paramètres équipe',
        description: `Paramètres équipe modifiés par admin ${adminId}`,
        metadata: {
          updatedFields: Object.keys(settings),
        },
        createdBy: adminId,
      });
    } catch {
      // ignore logger errors
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error saving team settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde des paramètres' },
      { status: 500 },
    );
  }
}
