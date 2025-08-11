import { RegistrationData } from '@/types/registration';
import { useI18n } from '@/locales/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface Step5PhotoProps {
  data: RegistrationData;
  onChange: (fields: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step5Photo({ onChange, onNext, onBack }: Step5PhotoProps) {
  const t = useI18n();
  const [photoError, setPhotoError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange({ profilePhoto: e.target.files[0] });
    }
  };

  const validatePhoto = (file: File | null) => {
    if (!file) return t('validator.required');
    if (file.size > 5 * 1024 * 1024) return t('validator.fileTooLarge');
    return '';
  };
  const validateAll = (file: File | null) => {
    setPhotoError(validatePhoto(file));
    return !validatePhoto(file);
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (validateAll((e.target as HTMLFormElement).profilePhoto?.files?.[0] || null)) onNext();
      }}
    >
      <div className="space-y-1">
        <Label htmlFor="profilePhoto">{t('auth.register.profilePhoto')}</Label>
        <Input id="profilePhoto" type="file" accept="image/*" onChange={handleFileChange} />
        {photoError && <div className="text-red-500 text-xs mt-1">{photoError}</div>}
      </div>
      <div className="flex justify-between gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          {t('common.goback')}
        </Button>
        <Button type="submit">{t('common.next')}</Button>
      </div>
    </form>
  );
}
