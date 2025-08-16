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
import { useState } from 'react';

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
  const [instrumentsError, setInstrumentsError] = useState('');

  const translateSkillLevel = (key: string) =>
    t(`user.skillLevels.${key}` as Parameters<typeof t>[0]);

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
    if (availableInstruments.length === 0) {
      setInstrumentsError("Aucun instrument disponible. Veuillez contacter l'administrateur.");
      return;
    }

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

  const validateInstruments = () => {
    if (!data.instruments || data.instruments.length === 0) return t('validator.selectInstrument');
    return '';
  };

  const validateAll = () => {
    setInstrumentsError(validateInstruments());
    return !validateInstruments();
  };

  // Si aucun instrument n'est disponible, afficher un message d'erreur
  if (availableInstruments.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            Aucun instrument n&#39;est disponible pour le moment.
          </p>
          <p className="text-sm text-muted-foreground">
            Veuillez contacter l&#39;administrateur pour résoudre ce problème.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            {t('common.goback')}
          </Button>
          <Button type="button" onClick={onNext} disabled={data.instruments.length === 0}>
            {t('common.next')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (validateAll()) onNext();
      }}
    >
      {/* Header Labels */}
      <div className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-0">
        <Label className="text-sm font-medium">{t('auth.register.instrument')}</Label>
        <Label className="text-sm font-medium">{t('auth.register.level')}</Label>
        <div className="w-24"></div> {/* Spacer for remove button */}
      </div>

      {/* Instruments List */}
      <div className="space-y-3">
        {data.instruments.map((inst, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
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

            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeInstrument(i)}
              className="w-24"
            >
              {t('auth.register.removeInstrument')}
            </Button>
          </div>
        ))}
      </div>

      {/* Add Instrument Button */}
      <Button
        type="button"
        className="w-full"
        variant="secondary"
        onClick={addInstrument}
        disabled={availableInstruments.length === 0}
      >
        {t('auth.register.addInstrument')}
      </Button>

      {/* Error Message */}
      {instrumentsError && <div className="text-red-500 text-xs mt-1">{instrumentsError}</div>}

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          {t('common.goback')}
        </Button>
        <Button type="submit">{t('common.next')}</Button>
      </div>
    </form>
  );
}
