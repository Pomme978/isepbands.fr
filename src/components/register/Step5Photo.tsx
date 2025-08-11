import { RegistrationData } from '@/types/registration';
import { useI18n } from '@/locales/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface Step5PhotoProps {
  data: RegistrationData;
  onChange: (fields: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step5Photo({ onChange, onNext, onBack }: Omit<Step5PhotoProps, 'data'>) {
  const t = useI18n();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange({ profilePhoto: e.target.files[0] });
    }
  };
  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <div className="space-y-1">
        <Label htmlFor="profilePhoto">{t('auth.register.profilePhoto')}</Label>
        <Input id="profilePhoto" type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <div className="flex justify-between gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          {t('common.goback')}
        </Button>
        <Button type="submit">{t('common.next')}</Button>
      </div>
    </form>
  );
}
