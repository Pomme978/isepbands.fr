import { RegistrationData } from '@/types/registration';
import { useI18n } from '@/locales/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface Step6ConfirmationProps {
  data: RegistrationData;
  onBack: () => void;
  onSubmit: () => void;
  availableInstruments: { id: number; name: string }[];
}
export default function Step6Confirmation({
  data,
  onBack,
  onSubmit,
  availableInstruments,
}: Step6ConfirmationProps) {
  const t = useI18n();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>{t('auth.register.firstName')}</Label>
          <div>{data.firstName}</div>
        </div>
        <div>
          <Label>{t('auth.register.lastName')}</Label>
          <div>{data.lastName}</div>
        </div>
        <div>
          <Label>{t('auth.register.email')}</Label>
          <div>{data.email}</div>
        </div>
        <div>
          <Label>{t('auth.register.cycle')}</Label>
          <div>{data.cycle}</div>
        </div>
        <div>
          <Label>{t('auth.register.birthDate')}</Label>
          <div>{data.birthDate}</div>
        </div>
        <div>
          <Label>{t('auth.register.phone')}</Label>
          <div>{data.phone}</div>
        </div>
        <div className="md:col-span-2">
          <Label>{t('auth.register.motivation')}</Label>
          <div className="whitespace-pre-line">{data.motivation}</div>
        </div>
        <div className="md:col-span-2">
          <Label>{t('auth.register.experience')}</Label>
          <div className="whitespace-pre-line">{data.experience}</div>
        </div>
        <div className="md:col-span-2">
          <Label>{t('auth.register.instruments')}</Label>
          <ul className="list-disc list-inside">
            {data.instruments.map((inst, i) => {
              const instr = availableInstruments.find((x) => x.id === inst.instrumentId);
              return (
                <li key={i}>
                  {instr?.name || t('auth.register.instrument')} ({inst.skillLevel})
                </li>
              );
            })}
          </ul>
        </div>
        <div className="md:col-span-2">
          <Label>{t('auth.register.profilePhoto')}</Label>
          <div>{data.profilePhoto ? data.profilePhoto.name : t('common.none')}</div>
        </div>
      </div>
      <div className="flex justify-between gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          {t('common.goback')}
        </Button>
        <Button type="button" onClick={onSubmit}>
          {t('auth.register.confirm')}
        </Button>
      </div>
    </div>
  );
}
