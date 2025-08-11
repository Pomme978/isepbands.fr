import { NextRequest, NextResponse } from 'next/server';
import { uploadToStorage } from '@/lib/storageService';
import { prisma } from '../../../../../lib/prisma';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const cycle = formData.get('cycle') as string;
  const birthDate = formData.get('birthDate') as string;
  const phone = formData.get('phone') as string | null;
  // motivation et experience non utilisés car non présents dans RegistrationRequest
  const instruments = formData.get('instruments') as string | null;
  const profilePhoto = formData.get('profilePhoto') as File | null;

  let photoUrl: string | undefined = undefined;
  if (profilePhoto) {
    const storage = await uploadToStorage(profilePhoto);
    photoUrl = storage.url;
  }

  // Hash password before storing
  const { hashPassword } = await import('@/lib/auth');
  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      promotion: cycle,
      birthDate: new Date(birthDate),
      phone: phone || null,
      biography: '',
      password: hashedPassword,
      email,
      emailVerified: true, // TODO: temporaire, bypass vérification email
      photoUrl: photoUrl || null,
      isLookingForGroup: false,
    },
  });

  await prisma.registrationRequest.create({
    data: {
      userId: user.id,
      status: 'PENDING',
    },
  });

  if (instruments) {
    const parsedInstruments = JSON.parse(instruments) as Array<{
      instrumentId: number;
      skillLevel: string;
    }>;
    for (const inst of parsedInstruments) {
      await prisma.userInstrument.create({
        data: {
          userId: user.id,
          instrumentId: inst.instrumentId,
          skillLevel: inst.skillLevel.toUpperCase() as
            | 'BEGINNER'
            | 'INTERMEDIATE'
            | 'ADVANCED'
            | 'EXPERT',
        },
      });
    }
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
