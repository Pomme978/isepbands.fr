import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Liste tous les instruments
export async function GET() {
  try {
    const instruments = await prisma.instrument.findMany();
    return NextResponse.json(instruments);
  } catch (error) {
    console.error('Error fetching instruments:', error);
    return NextResponse.json({ error: 'Failed to fetch instruments' }, { status: 500 });
  }
}

// POST: Crée un nouvel instrument
export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    if (!name) return NextResponse.json({ error: 'Le nom est requis.' }, { status: 400 });
    const instrument = await prisma.instrument.create({ data: { name, imageUrl } });
    return NextResponse.json(instrument);
  } catch (error) {
    console.error('Error creating instrument:', error);
    return NextResponse.json({ error: 'Failed to create instrument' }, { status: 500 });
  }
}
