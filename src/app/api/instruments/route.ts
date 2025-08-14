import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET: Liste tous les instruments
export async function GET() {
  const instruments = await prisma.instrument.findMany();
  return NextResponse.json(instruments);
}

// POST: Crée un nouvel instrument
export async function POST(req: Request) {
  const { name, imageUrl } = await req.json();
  if (!name) return NextResponse.json({ error: 'Le nom est requis.' }, { status: 400 });
  const instrument = await prisma.instrument.create({ data: { name, imageUrl } });
  return NextResponse.json(instrument);
}
