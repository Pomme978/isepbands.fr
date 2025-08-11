import { RegistrationData, SkillLevel } from '@/types/registration';
import { useI18n } from '@/locales/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

interface Step4InstrumentsProps {
  data: RegistrationData;
  onChange: (fields: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
  availableInstruments: { id: number; name: string }[];
}

const skillLevels = [
  { value: 'BEGINNER', labelKey: 'beginner' },
  { value: 'INTERMEDIATE', labelKey: 'intermediate' },
  { value: 'ADVANCED', labelKey: 'advanced' },
  { value: 'EXPERT', labelKey: 'expert' },
];

export default function Step4Instruments({
  data,
  onChange,
  onNext,
  onBack,
  availableInstruments,
}: Step4InstrumentsProps) {
  const t = useI18n();
  const translateSkillLevel = (key: string) =>
    t(`auth.register.skillLevels.${key}` as Parameters<typeof t>[0]);
  const handleInstrumentChange = (
    index: number,
    field: 'instrumentId' | 'skillLevel',
    value: number | SkillLevel,
  ) => {
    const updated = [...data.instruments];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ instruments: updated });
  };
  const addInstrument = () => {
    onChange({
      instruments: [
        ...data.instruments,
        { instrumentId: availableInstruments[0]?.id || 0, skillLevel: 'BEGINNER' },
      ],
    });
  };
  const removeInstrument = (index: number) => {
    const updated = [...data.instruments];
    updated.splice(index, 1);
    onChange({ instruments: updated });
  };
  return (
    <div className="space-y-6">
      {data.instruments.map((inst, i) => (
        <div key={i} className="flex gap-2 items-end">
          <div className="flex-1 space-y-1">
            <Label>{t('auth.register.instrument')}</Label>
            <Select
              value={inst.instrumentId.toString()}
              onValueChange={(val) => handleInstrumentChange(i, 'instrumentId', Number(val))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('auth.register.instrument')} />
              </SelectTrigger>
              <SelectContent>
                {availableInstruments.map((instr) => (
                  <SelectItem key={instr.id} value={instr.id.toString()}>
                    {instr.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-1">
            <Label>{t('auth.register.level')}</Label>
            <Select
              value={inst.skillLevel}
              onValueChange={(val) => handleInstrumentChange(i, 'skillLevel', val as SkillLevel)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('auth.register.level')} />
              </SelectTrigger>
              <SelectContent>
                {skillLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {translateSkillLevel(level.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="button" variant="destructive" onClick={() => removeInstrument(i)}>
            {t('auth.register.removeInstrument')}
          </Button>
        </div>
      ))}
      <Button type="button" className="w-full" variant="secondary" onClick={addInstrument}>
        {t('auth.register.addInstrument')}
      </Button>
      <div className="flex justify-between gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          {t('common.goback')}
        </Button>
        <Button type="button" onClick={onNext}>
          {t('common.next')}
        </Button>
      </div>
    </div>
  );
}
