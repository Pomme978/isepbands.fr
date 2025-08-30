import { NextResponse } from 'next/server';
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

async function loadSettings(): Promise<TeamSettings> {
  try {
    const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
    return { ...defaultSettings, ...JSON.parse(data) };
  } catch {
    return defaultSettings;
  }
}

export async function GET() {
  try {
    const settings = await loadSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching team settings:', error);
    return NextResponse.json(defaultSettings);
  }
}
