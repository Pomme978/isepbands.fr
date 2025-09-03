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
    setExperienceError(validateExperience(data.experience || ''));
    return !validateMotivation(data.motivation) && !validateExperience(data.experience || '');
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
        <h3 className="text-lg font-medium text-gray-900 mb-4">Motivation</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pourquoi souhaitez-vous rejoindre ISEP Bands ? *
            </label>
            <textarea
              id="motivation"
              placeholder="Parlez-nous de votre motivation à rejoindre notre association musicale. Qu'est-ce qui vous attire dans l'expérience musicale collective ? Quels sont vos objectifs ?"
              value={data.motivation}
              onChange={(e) => {
                onChange({ motivation: e.target.value });
                setMotivationError(validateMotivation(e.target.value));
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
              rows={5}
              required
            />
            {motivationError && <div className="text-red-500 text-xs mt-1">{motivationError}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parlez-nous de votre expérience musicale *
            </label>
            <textarea
              id="experience"
              placeholder="Décrivez votre parcours musical : instruments pratiqués, années d'expérience, formations suivies, groupes ou orchestres rejoints, style musical préféré, etc."
              value={data.experience || ''}
              onChange={(e) => {
                onChange({ experience: e.target.value });
                setExperienceError(validateExperience(e.target.value));
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
              rows={5}
              required
            />
            {experienceError && <div className="text-red-500 text-xs mt-1">{experienceError}</div>}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Votre motivation</h4>
        <p className="text-sm text-blue-700">
          Cette information est essentielle pour évaluer votre candidature et déterminer si vous
          pourrez rejoindre l&lsquo;association. Soyez authentique !
        </p>
      </div>

      <div className="flex md:flex-row flex-col gap-4 justify-center md:justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="px-6 md:py-2 py-6 md:w-auto w-full"
        >
          Retour
        </Button>
        <Button type="submit" className="px-6 md:py-2 py-6 md:w-auto w-full">
          Suivant
        </Button>
      </div>
    </form>
  );
}
