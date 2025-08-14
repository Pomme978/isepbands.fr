import { prisma } from '@/prisma';
import { NextResponse } from 'next/server';

// GET: Récupère un instrument par son ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const instrument = await prisma.instrument.findUnique({ where: { id: Number(params.id) } });
  if (!instrument) return NextResponse.json({ error: 'Instrument non trouvé.' }, { status: 404 });
  return NextResponse.json(instrument);
}

// PUT: Modifie un instrument
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { name, imageUrl } = await req.json();
  const instrument = await prisma.instrument.update({
    where: { id: Number(params.id) },
    data: { name, imageUrl },
  });
  return NextResponse.json(instrument);
}

// DELETE: Supprime un instrument
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.instrument.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
}
