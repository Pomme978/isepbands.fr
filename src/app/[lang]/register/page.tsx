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
  username: '',
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

  return (
    <div className="max-w-xl mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('register.title')}</h1>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className={`w-3 h-3 rounded-full ${step === n ? 'bg-primary' : 'bg-muted'}`}
            />
          ))}
        </div>
      </div>
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
        <Step5Photo data={data} onChange={handleChange} onNext={handleNext} onBack={handleBack} />
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
  );
}
