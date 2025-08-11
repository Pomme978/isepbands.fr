import { RegistrationData } from '@/types/registration';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useI18n } from '@/locales/client';

interface Step2AdditionalInfoProps {
  data: RegistrationData;
  onChange: (fields: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2AdditionalInfo({
  data,
  onChange,
  onNext,
  onBack,
}: Step2AdditionalInfoProps) {
  const t = useI18n();
  const [birthDateError, setBirthDateError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validateBirthDate = (value: string) => {
    if (!value.trim()) return t('validator.required');
    // Optionnel: check format date
    return '';
  };
  const validatePhone = (value: string) => {
    if (!value) return '';
    if (value && !/^\+?\d{8,15}$/.test(value)) return t('validator.invalidPhone');
    return '';
  };
  const validateAll = () => {
    setBirthDateError(validateBirthDate(data.birthDate));
    setPhoneError(validatePhone(data.phone || ''));
    return !validateBirthDate(data.birthDate) && !validatePhone(data.phone || '');
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (validateAll()) onNext();
      }}
    >
      <div className="space-y-1">
        <Label htmlFor="birthDate">Date de naissance</Label>
        <Input
          id="birthDate"
          type="date"
          value={data.birthDate}
          onChange={(e) => {
            onChange({ birthDate: e.target.value });
            setBirthDateError(validateBirthDate(e.target.value));
          }}
          required
        />
        {birthDateError && <div className="text-red-500 text-xs mt-1">{birthDateError}</div>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          type="tel"
          value={data.phone}
          onChange={(e) => {
            onChange({ phone: e.target.value });
            setPhoneError(validatePhone(e.target.value));
          }}
        />
        {phoneError && <div className="text-red-500 text-xs mt-1">{phoneError}</div>}
      </div>
      <div className="flex justify-between gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button type="submit">Suivant</Button>
      </div>
    </form>
  );
}
