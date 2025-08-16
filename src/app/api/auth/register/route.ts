import { NextRequest, NextResponse } from 'next/server';
import { uploadToStorage } from '@/lib/storageService';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
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

    // Validation des champs requis
    if (!firstName || !lastName || !email || !password || !cycle || !birthDate) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis.' },
        { status: 400 },
      );
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà.' },
        { status: 400 },
      );
    }

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
      try {
        const parsedInstruments = JSON.parse(instruments) as Array<{
          instrumentId: number;
          skillLevel: string;
        }>;

        for (const inst of parsedInstruments) {
          // Vérifier que l'instrument existe
          const exists = await prisma.instrument.findUnique({ where: { id: inst.instrumentId } });
          if (!exists) {
            return NextResponse.json(
              { error: `Instrument ID ${inst.instrumentId} n'existe pas.` },
              { status: 400 },
            );
          }
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
      } catch (error) {
        console.error('Error parsing instruments:', error);
        return NextResponse.json({ error: 'Format des instruments invalide.' }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: "Erreur lors de l'inscription. Veuillez réessayer." },
      { status: 500 },
    );
  }
}
