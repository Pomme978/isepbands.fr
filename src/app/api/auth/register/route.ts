import { NextRequest, NextResponse } from 'next/server';
import { uploadToStorage } from '@/lib/storageService';
import { prisma } from '@/prisma';
import { setSession } from '@/lib/auth';

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
    const motivation = formData.get('motivation') as string | null;
    const experience = formData.get('experience') as string | null;
    const instruments = formData.get('instruments') as string | null;
    const preferredGenres = formData.get('preferredGenres') as string | null;
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
        lastName: lastName.toUpperCase(),
        promotion: cycle,
        birthDate: new Date(birthDate),
        phone: phone || null,
        biography: '',
        password: hashedPassword,
        email,
        emailVerified: true, // TODO: temporaire, bypass vérification email
        photoUrl: photoUrl || null,
        isLookingForGroup: false,
        preferredGenres: preferredGenres ? JSON.stringify(JSON.parse(preferredGenres)) : null,
      },
    });

    await prisma.registrationRequest.create({
      data: {
        userId: user.id,
        status: 'PENDING',
        motivation: motivation || null,
        experience: experience || null,
      },
    });

    if (instruments) {
      try {
        const parsedInstruments = JSON.parse(instruments) as Array<{
          instrumentId: number;
          skillLevel: string;
          yearsPlaying?: number;
          isPrimary: boolean;
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
              yearsPlaying: inst.yearsPlaying || null,
              isPrimary: inst.isPrimary || false,
            },
          });
        }
      } catch (error) {
        console.error('Error parsing instruments:', error);
        return NextResponse.json({ error: 'Format des instruments invalide.' }, { status: 400 });
      }
    }

    // Set session to automatically log in the user
    const res = NextResponse.json({ success: true, user: { id: user.id, email: user.email } }, { status: 201 });
    await setSession(res, { id: user.id, email: user.email });
    return res;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: "Erreur lors de l'inscription. Veuillez réessayer." },
      { status: 500 },
    );
  }
}
