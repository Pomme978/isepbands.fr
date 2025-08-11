import { RegistrationData } from '@/types/registration';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useI18n } from '@/locales/client';

interface Step3MotivationProps {
  data: RegistrationData;
  onChange: (fields: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3Motivation({ data, onChange, onNext, onBack }: Step3MotivationProps) {
  const t = useI18n();
  const [motivationError, setMotivationError] = useState('');
  const [experienceError, setExperienceError] = useState('');

  const validateMotivation = (value: string) => {
    if (!value.trim()) return t('validator.required');
    return '';
  };
  const validateExperience = (value: string) => {
    if (!value.trim()) return t('validator.required');
    return '';
  };
  const validateAll = () => {
    setMotivationError(validateMotivation(data.motivation));
    setExperienceError(validateExperience(data.experience));
    return !validateMotivation(data.motivation) && !validateExperience(data.experience);
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
        <Label htmlFor="motivation">Motivation</Label>
        <Textarea
          id="motivation"
          value={data.motivation}
          onChange={(e) => {
            onChange({ motivation: e.target.value });
            setMotivationError(validateMotivation(e.target.value));
          }}
        />
        {motivationError && <div className="text-red-500 text-xs mt-1">{motivationError}</div>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="experience">Expérience</Label>
        <Textarea
          id="experience"
          value={data.experience}
          onChange={(e) => {
            onChange({ experience: e.target.value });
            setExperienceError(validateExperience(e.target.value));
          }}
        />
        {experienceError && <div className="text-red-500 text-xs mt-1">{experienceError}</div>}
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
