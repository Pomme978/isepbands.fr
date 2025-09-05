import { NextRequest, NextResponse } from 'next/server';
import { uploadToStorage } from '@/lib/storageService';
import { prisma } from '@/lib/prisma';
import { setSession } from '@/lib/auth';
import crypto from 'crypto';

// Cache pour éviter les doubles inscriptions
const registrationCache = new Map<string, number>();

// Nettoyer le cache toutes les 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [email, timestamp] of registrationCache.entries()) {
      if (now - timestamp > 5 * 60 * 1000) {
        // 5 minutes
        registrationCache.delete(email);
      }
    }
  },
  5 * 60 * 1000,
);

export async function POST(req: NextRequest) {
  const registrationId = crypto.randomUUID().slice(0, 8);
  console.log(`🚀 [${registrationId}] Starting registration process`);

  let email = '';

  try {
    const formData = await req.formData();
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const cycle = formData.get('cycle') as string;
    const birthDate = formData.get('birthDate') as string;
    const phone = formData.get('phone') as string | null;
    const pronouns = formData.get('pronouns') as string | null;
    const motivation = formData.get('motivation') as string | null;
    const experience = formData.get('experience') as string | null;
    const instruments = formData.get('instruments') as string | null;
    const preferredGenres = formData.get('preferredGenres') as string | null;
    const profilePhoto = formData.get('profilePhoto') as File | null;

    // Debug: Log all received fields
    console.log(`📋 [${registrationId}] Register attempt with fields:`, {
      firstName: firstName ? '✓' : '✗',
      lastName: lastName ? '✓' : '✗',
      email: email ? '✓' : '✗',
      password: password ? '✓' : '✗',
      cycle: cycle ? '✓' : '✗',
      birthDate: birthDate ? '✓' : '✗',
      motivation: motivation ? '✓' : '✗',
      experience: experience ? '✓' : '✗',
      phone: phone ? '✓' : '-',
      pronouns: pronouns ? '✓' : '-',
      instruments: instruments ? '✓' : '-',
      preferredGenres: preferredGenres ? '✓' : '-',
      profilePhoto: profilePhoto ? '✓' : '-',
    });

    // Validation détaillée des champs requis
    const missingFields = [];
    if (!firstName) missingFields.push('firstName');
    if (!lastName) missingFields.push('lastName');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    if (!cycle) missingFields.push('cycle');
    if (!birthDate) missingFields.push('birthDate');
    if (!motivation) missingFields.push('motivation');
    if (!experience) missingFields.push('experience');

    if (missingFields.length > 0) {
      console.log(`❌ [${registrationId}] Missing required fields:`, missingFields);
      return NextResponse.json(
        {
          error: `Champs manquants: ${missingFields.join(', ')}`,
          missingFields,
        },
        { status: 400 },
      );
    }

    // Vérifier les doubles inscriptions rapides
    console.log(`🔍 [${registrationId}] Checking for duplicate registration:`, email);
    const now = Date.now();
    const lastRegistration = registrationCache.get(email);
    if (lastRegistration && now - lastRegistration < 30000) {
      // 30 secondes
      console.log(`❌ [${registrationId}] Duplicate registration attempt blocked for:`, email);
      return NextResponse.json(
        { error: 'Une inscription avec cet email est déjà en cours. Veuillez patienter.' },
        { status: 429 },
      );
    }

    // Marquer cette inscription comme en cours
    registrationCache.set(email, now);
    console.log(`🔒 [${registrationId}] Registration locked for:`, email);

    // Vérifier si l'email existe déjà en base
    console.log(`🔍 [${registrationId}] Checking if email exists in database:`, email);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      registrationCache.delete(email); // Libérer le cache en cas d'erreur
      console.log(`❌ [${registrationId}] User already exists with email:`, email);
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà.' },
        { status: 400 },
      );
    }
    console.log(`✅ [${registrationId}] Email is available`);

    let photoUrl: string | undefined = undefined;
    if (profilePhoto && profilePhoto.size > 0) {
      try {
        console.log('📸 Uploading profile photo:', profilePhoto.name, profilePhoto.size);
        const storage = await uploadToStorage(profilePhoto);
        photoUrl = storage.url;
        console.log('✅ Photo uploaded successfully:', photoUrl);
      } catch (uploadError) {
        console.error('❌ Error uploading photo:', uploadError);
        return NextResponse.json(
          { error: 'Erreur lors du téléchargement de la photo de profil.' },
          { status: 400 },
        );
      }
    } else {
      console.log('📷 No photo provided or photo size is 0');
    }

    // Hash password before storing
    console.log('🔐 Hashing password...');
    const { hashPassword } = await import('@/lib/auth');
    const hashedPassword = await hashPassword(password);
    console.log('✅ Password hashed successfully');

    // Generate email verification token
    const emailVerificationToken = crypto.randomUUID();
    const emailVerificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    console.log('👤 Creating user...');
    const user = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName.toUpperCase(),
        promotion: cycle,
        birthDate: new Date(birthDate),
        phone: phone || null,
        pronouns: pronouns || null,
        biography: '',
        password: hashedPassword,
        email,
        emailVerified: false, // Email not verified initially
        emailVerificationToken,
        emailVerificationTokenExpires,
        photoUrl: photoUrl || null,
        isLookingForGroup: false,
        preferredGenres: preferredGenres ? JSON.stringify(JSON.parse(preferredGenres)) : null,
      },
    });
    console.log('✅ User created successfully:', user.id);

    console.log('📝 Creating registration request...');
    await prisma.registrationRequest.create({
      data: {
        userId: user.id,
        status: 'PENDING',
        motivation: motivation || null,
        experience: experience || null,
      },
    });
    console.log('✅ Registration request created');

    if (instruments) {
      console.log('🎸 Processing instruments...');
      try {
        const parsedInstruments = JSON.parse(instruments) as Array<{
          instrumentId: number;
          skillLevel: string;
          yearsPlaying?: number;
          isPrimary: boolean;
        }>;

        console.log('🎼 Parsed instruments:', parsedInstruments);

        // Vérifier que la liste n'est pas vide après parsing
        if (parsedInstruments.length > 0) {
          for (const inst of parsedInstruments) {
            console.log(`🔍 Checking instrument ID ${inst.instrumentId}...`);
            // Vérifier que l'instrument existe
            const exists = await prisma.instrument.findUnique({ where: { id: inst.instrumentId } });
            if (!exists) {
              console.log(`❌ Instrument ID ${inst.instrumentId} does not exist`);
              return NextResponse.json(
                { error: `Instrument ID ${inst.instrumentId} n'existe pas.` },
                { status: 400 },
              );
            }
            console.log(`✅ Instrument ID ${inst.instrumentId} exists`);
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
            console.log(`✅ Created userInstrument for ${inst.instrumentId}`);
          }
          console.log('✅ All instruments processed successfully');
        } else {
          console.log('🎸 Empty instruments array - user chose not to add instruments');
        }
      } catch (error) {
        console.error('❌ Error parsing instruments:', error);
        return NextResponse.json({ error: 'Format des instruments invalide.' }, { status: 400 });
      }
    } else {
      console.log('🎸 No instruments to process - user chose not to add instruments');
    }

    // Envoyer l'email de compte en attente d'approbation
    try {
      console.log(`📧 [${registrationId}] Sending pending approval email to:`, user.email);
      const { EmailService } = await import('@/services/emailService');
      await EmailService.sendPendingApprovalEmail(user.email, user.firstName);
      console.log(`✅ [${registrationId}] Pending approval email sent successfully`);
    } catch (emailError) {
      console.error(`❌ [${registrationId}] Error sending pending approval email:`, emailError);
      // Ne pas bloquer l'inscription si l'email échoue
    }

    // Envoyer l'email de vérification d'email
    try {
      console.log(`📧 [${registrationId}] Sending email verification email to:`, user.email);
      const { EmailService } = await import('@/services/emailService');
      await EmailService.sendEmailVerificationEmail(
        user.email,
        user.firstName,
        emailVerificationToken,
      );
      console.log(`✅ [${registrationId}] Email verification email sent successfully`);
    } catch (emailError) {
      console.error(`❌ [${registrationId}] Error sending email verification email:`, emailError);
      // Ne pas bloquer l'inscription si l'email échoue
    }

    // Set session to automatically log in the user
    // Logger l'inscription
    try {
      const { createAdminActivityLog } = await import('@/services/activityLogService');
      await createAdminActivityLog({
        userId: user.id,
        type: 'user_registered',
        title: 'Inscription utilisateur',
        description: `**${user.firstName} ${user.lastName}** (${user.email}) s'est inscrit sur la plateforme`,
        metadata: {
          userEmail: user.email,
          promotion: cycle,
          hasPhoto: !!photoUrl,
          instrumentsCount: instruments ? (JSON.parse(instruments) || []).length : 0,
        },
        createdBy: null, // System generated
      });
    } catch (err) {
      console.log('Activity log error:', err);
    }
    const res = NextResponse.json(
      { success: true, user: { id: user.id, email: user.email } },
      { status: 201 },
    );
    await setSession(res, { id: user.id, email: user.email });

    // Libérer le cache à la fin du processus réussi
    registrationCache.delete(email);
    console.log(`🔓 [${registrationId}] Registration completed and cache cleared for:`, email);

    return res;
  } catch (error) {
    console.error(`🔴 [${registrationId}] REGISTRATION ERROR:`, error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');

    // Libérer le cache en cas d'erreur
    if (email) {
      registrationCache.delete(email);
      console.log(`🔓 [${registrationId}] Registration cache cleared after error for:`, email);
    }

    return NextResponse.json(
      {
        error: "Erreur lors de l'inscription. Veuillez réessayer.",
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
