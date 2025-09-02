'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth, useSession } from '@/lib/auth-client';
import { registerSchema } from '@/validation/auth';
import { useI18n } from '@/locales/client';
import { RegistrationData, RegistrationStep } from '@/types/registration';
import { cleanPhoneNumber } from '@/utils/phoneUtils';
import Step1BasicInfo from '@/components/register/Step1BasicInfo';
import Step2AdditionalInfo from '@/components/register/Step2AdditionalInfo';
import Step3Motivation from '@/components/register/Step3Motivation';
import Step4Instruments from '@/components/register/Step4Instruments';
import Step5Photo from '@/components/register/Step5Photo';
import Step6Confirmation from '@/components/register/Step6Confirmation';
import { toast } from 'sonner';
import BackButton from '@/components/ui/back-button';
import RegisterFormCard from '@/components/register/RegisterFormCard';

import { useEffect } from 'react';
import Loading from '@/components/ui/Loading';

// Instruments dynamiques
async function fetchInstruments() {
  try {
    const res = await fetch('/api/instruments');
    if (!res.ok) return [];
    const data = await res.json();
    return data.instruments || [];
  } catch (error) {
    console.error('Error fetching instruments:', error);
    return [];
  }
}
const initialData: RegistrationData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  cycle: '',
  birthDate: '',
  phone: '',
  motivation: '',
  experience: '',
  instruments: [],
  preferredGenres: [],
  profilePhoto: null,
};

// Configuration des étapes
const stepTitles = [
  'auth.register.steps.basicInfo',
  'auth.register.steps.additionalInfo',
  'auth.register.steps.motivation',
  'auth.register.steps.instruments',
  'auth.register.steps.photo',
  'auth.register.steps.confirmation',
] as const;

export default function RegisterPage() {
  const t = useI18n();
  const [step, setStep] = useState<RegistrationStep>(1);
  const [data, setData] = useState<RegistrationData>(initialData);
  const [availableInstruments, setAvailableInstruments] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const params = useParams();
  const lang = typeof params.lang === 'string' ? params.lang : 'fr';

  // Use useSession for faster auth check, useAuth only for register function
  const { user, loading } = useSession();
  const { register: registerUser } = useAuth();

  useEffect(() => {
    fetchInstruments().then((instruments) => setAvailableInstruments(instruments));
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      router.push('/' + lang);
    }
  }, [user, loading, router, lang]);

  const handleChange = (fields: Partial<RegistrationData>) =>
    setData((prev) => ({ ...prev, ...fields }));

  const handleNext = () => setStep((s) => (s < 6 ? ((s + 1) as RegistrationStep) : s));
  const handleBack = () => setStep((s) => (s > 1 ? ((s - 1) as RegistrationStep) : s));

  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent multiple submissions

    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) {
      console.error('Register validation errors:', parsed.error);
      toast.error(t('register.error.submit'));
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'profilePhoto' && value) {
        formData.append('profilePhoto', value as File);
      } else if (key === 'phone' && value) {
        // Clean phone number before submission
        formData.append(key, cleanPhoneNumber(value as string));
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    });

    try {
      await registerUser(formData, () => {
        toast.success(t('register.success'));
        router.push('/');
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('register.error.submit');
      
      // Vérifier si c'est une erreur d'email déjà utilisé
      if (errorMessage.includes('email existe déjà') || errorMessage.includes('email already exists')) {
        setFieldErrors({ email: 'Un utilisateur avec cet email existe déjà.' });
        setStep(1); // Retourner au Step 1 pour afficher l'erreur
        toast.error('Email déjà utilisé. Veuillez en choisir un autre.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading screen while checking authentication status
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading text="Redirection..." size="lg" />
      </div>
    );
  }

  // Don't show register form if user is authenticated (during redirect)
  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading text="" size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center flex-col justify-center relative">
      <div className="absolute top-6 left-6 m:dtop-3 md:left-3 ">
        <BackButton variant="ghost" />
      </div>
      <RegisterFormCard>
        {/* Header */}
        <div className="flex md:mt-0 mt-10 md:flex-row flex-col items-center justify-center md:justify-between p-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl md:text-left text-center font-bold text-gray-900">{t('register.title')}</h1>
            <p className="text-sm md:text-left text-center text-gray-600 mt-1">{t(stepTitles[step - 1])}</p>
            <div className="flex mt-5 md:mt-2">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className={`h-1 md:w-16 w-10 mr-1 rounded ${i < step ? 'bg-primary' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          </div>
          <span className="text-sm md:mt-0 mt-5 text-gray-500">
            {t('common.step')} {step} {t('common.of')} 6
          </span>
        </div>

        {/* Contenu des étapes */}
        <div className="p-6 md:max-h-[70vh] md:overflow-y-auto">
          {step === 1 && <Step1BasicInfo data={data} onChange={handleChange} onNext={handleNext} fieldErrors={fieldErrors} onClearError={setFieldErrors} />}
          {step === 2 && (
            <Step2AdditionalInfo
              data={data}
              onChange={handleChange}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 3 && (
            <Step3Motivation
              data={data}
              onChange={handleChange}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 4 && (
            <Step4Instruments
              data={data}
              onChange={handleChange}
              onNext={handleNext}
              onBack={handleBack}
              availableInstruments={availableInstruments}
            />
          )}
          {step === 5 && (
            <Step5Photo
              data={data}
              onChange={handleChange}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 6 && (
            <Step6Confirmation
              data={data}
              onBack={handleBack}
              onSubmit={handleSubmit}
              availableInstruments={availableInstruments}
              isSubmitting={isSubmitting}
            />
          )}
        </div>

        {/* Error Message */}
        {registerError && (
          <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{registerError}</p>
              </div>
            </div>
          </div>
        )}

      </RegisterFormCard>
    </div>
  );
}
