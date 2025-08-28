import { RegistrationData } from '@/types/registration';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useI18n } from '@/locales/client';
import { formatPhoneInput, isValidPhone } from '@/utils/phoneUtils';

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
    if (!value.trim()) return t('validator.required');

    // Remove all formatting to check the digits
    const digitsOnly = value.replace(/\D/g, '');

    // French phone validation (more flexible)
    if (digitsOnly.length >= 9 && digitsOnly.length <= 15) {
      // Check if it's a French mobile starting with 6 or 7 (after removing 0 or 33)
      const numberPart = digitsOnly.startsWith('33')
        ? digitsOnly.slice(2)
        : digitsOnly.startsWith('0')
          ? digitsOnly.slice(1)
          : digitsOnly;

      if (numberPart.length === 9 && /^[67]/.test(numberPart)) {
        return ''; // Valid French mobile
      }

      // Or any international number with reasonable length
      if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
        return ''; // Valid international number
      }
    }

    return 'Numéro de téléphone invalide';
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneInput(value);
    onChange({ phone: formatted });
    setPhoneError(validatePhone(formatted));
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
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations complémentaires</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de naissance *
            </label>
            <input
              id="birthDate"
              type="date"
              value={data.birthDate}
              onChange={(e) => {
                onChange({ birthDate: e.target.value });
                setBirthDateError(validateBirthDate(e.target.value));
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              required
            />
            {birthDateError && <div className="text-red-500 text-xs mt-1">{birthDateError}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de téléphone *
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              value={data.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              maxLength={20}
              required
            />
            {phoneError && <div className="text-red-500 text-xs mt-1">{phoneError}</div>}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Communication et communauté</h4>
        <p className="text-sm text-blue-700">
          Votre numéro de téléphone est requis pour vous ajouter aux groupes WhatsApp de
          l&lsquo;association et de vos futurs groupes musicaux. C&lsquo;est ainsi que nous restons
          connectés !
        </p>
      </div>

      <div className="flex justify-between gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="px-6 py-2">
          Retour
        </Button>
        <Button type="submit" className="px-6 py-2">
          Suivant
        </Button>
      </div>
    </form>
  );
}
