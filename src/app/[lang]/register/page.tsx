'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-client';
import { registerSchema } from '@/validation/auth';
import { useI18n } from '@/locales/client';
import { RegistrationData, RegistrationStep } from '@/types/registration';
import Step1BasicInfo from '@/components/register/Step1BasicInfo';
import Step2AdditionalInfo from '@/components/register/Step2AdditionalInfo';
import Step3Motivation from '@/components/register/Step3Motivation';
import Step4Instruments from '@/components/register/Step4Instruments';
import Step5Photo from '@/components/register/Step5Photo';
import Step6Confirmation from '@/components/register/Step6Confirmation';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import BackButton from '@/components/ui/back-button';
import RegisterFormCard from '@/components/register/RegisterFormCard';

const instrumentKeys = [
  { id: 1, key: 'guitar' },
  { id: 2, key: 'bass' },
  { id: 3, key: 'drums' },
  { id: 4, key: 'vocals' },
  { id: 5, key: 'keyboard' },
];

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
  const router = useRouter();
  const { register: registerUser, loading, error } = useAuth();

  const handleChange = (fields: Partial<RegistrationData>) =>
    setData((prev) => ({ ...prev, ...fields }));

  const handleNext = () => setStep((s) => (s < 6 ? ((s + 1) as RegistrationStep) : s));
  const handleBack = () => setStep((s) => (s > 1 ? ((s - 1) as RegistrationStep) : s));

  const handleSubmit = async () => {
    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) {
      console.error('Register validation errors:', parsed.error);
      toast.error(t('register.error.submit'));
      return;
    }
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'profilePhoto' && value) {
        formData.append('profilePhoto', value as File);
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    });
    try {
      await registerUser(formData, () => {
        toast.success(t('register.success'));
        router.push('/login');
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('register.error.submit'));
    }
  };

  const availableInstruments = instrumentKeys.map(({ id, key }) => ({
    id,
    name: t(
      `instruments.${key}` as
        | 'instruments.guitar'
        | 'instruments.bass'
        | 'instruments.drums'
        | 'instruments.vocals'
        | 'instruments.keyboard',
    ),
  }));

  // Calcul du pourcentage de progression
  const progressPercentage = (step / stepTitles.length) * 100;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 relative">
      <div className="absolute top-6 left-6">
        <BackButton variant="ghost" />
      </div>
      <RegisterFormCard>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{t('register.title')}</h1>
            <h2 className="text-1xl">{t('register.title')}</h2>
            <span className="text-sm text-muted-foreground">
              {t('common.step')} {step} {t('common.of')} 6
            </span>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {t(stepTitles[step - 1])}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Contenu des étapes */}
        <div className="p-6">
          {step === 1 && <Step1BasicInfo data={data} onChange={handleChange} onNext={handleNext} />}
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
            />
          )}
          {loading && (
            <div className="mt-6 text-center text-muted-foreground">{t('register.loading')}</div>
          )}
          {error && <div className="mt-2 text-center text-red-500">{error}</div>}
        </div>
      </RegisterFormCard>
    </div>
  );
}
