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
import { MUSIC_GENRES } from '@/data/musicGenres';
import { usePathname } from 'next/navigation';

interface Step4InstrumentsProps {
  data: RegistrationData;
  onChange: (fields: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
  availableInstruments: { id: number; name: string; nameFr: string; nameEn: string }[];
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
  const pathname = usePathname();
  const locale = pathname.startsWith('/fr') ? 'fr' : 'en';
  const [instrumentsError, setInstrumentsError] = useState('');

  const translateSkillLevel = (key: string) =>
    t(`user.skillLevels.${key}` as Parameters<typeof t>[0]);

  const handleInstrumentChange = (
    index: number,
    field: 'instrumentId' | 'skillLevel' | 'yearsPlaying' | 'isPrimary',
    value: number | SkillLevel | boolean,
  ) => {
    const updated = [...data.instruments];

    // Si on marque un instrument comme primaire, retirer le statut primaire des autres
    if (field === 'isPrimary' && value === true) {
      updated.forEach((inst, i) => {
        if (i !== index) inst.isPrimary = false;
      });
    }

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
        {
          instrumentId: availableInstruments[0]?.id || 0,
          skillLevel: 'BEGINNER',
          yearsPlaying: undefined,
          isPrimary: false,
        },
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

  const toggleGenre = (genreId: string) => {
    const currentGenres = data.preferredGenres || [];
    const newGenres = currentGenres.includes(genreId)
      ? currentGenres.filter((g) => g !== genreId)
      : [...currentGenres, genreId];

    onChange({ preferredGenres: newGenres });
  };

  // Si aucun instrument n'est disponible, afficher un message d'erreur
  if (!Array.isArray(availableInstruments) || availableInstruments.length === 0) {
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
          <Button type="button" variant="outline" onClick={onBack} className="px-6 py-2">
            Retour
          </Button>
          <Button
            type="button"
            onClick={onNext}
            disabled={data.instruments.length === 0}
            className="px-6 py-2"
          >
            Suivant
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
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Instruments et niveau</h3>

        {/* Instruments List */}
        <div className="space-y-4">
          {data.instruments.map((inst, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instrument</label>
                  <select
                    value={inst.instrumentId}
                    onChange={(e) =>
                      handleInstrumentChange(i, 'instrumentId', Number(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option value="">Sélectionnez un instrument</option>
                    {Array.isArray(availableInstruments) &&
                      availableInstruments.map((instr) => (
                        <option key={instr.id} value={instr.id}>
                          {locale === 'fr' ? instr.nameFr : instr.nameEn}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                  <select
                    value={inst.skillLevel}
                    onChange={(e) =>
                      handleInstrumentChange(i, 'skillLevel', e.target.value as SkillLevel)
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option value="">Niveau</option>
                    {skillLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {translateSkillLevel(level.labelKey)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Années d&lsquo;expérience (optionnel)
                  </label>
                  <input
                    type="number"
                    value={inst.yearsPlaying || ''}
                    onChange={(e) =>
                      handleInstrumentChange(
                        i,
                        'yearsPlaying',
                        e.target.value === '' ? undefined : Number(e.target.value),
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="0"
                    min="0"
                    max="50"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={inst.isPrimary}
                      onChange={(e) => handleInstrumentChange(i, 'isPrimary', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary/20"
                    />
                    <span className="text-sm font-medium text-gray-700">Instrument principal</span>
                    <span
                      className={`text-yellow-500 ${inst.isPrimary ? 'opacity-100' : 'opacity-30'}`}
                    >
                      ⭐
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => removeInstrument(i)}
                    className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {data.instruments.length > 0 && !data.instruments.some((inst) => inst.isPrimary) && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700">
              Conseil : Marquez votre instrument de prédilection comme &quot;principal&quot; en
              cochant la case
            </p>
          </div>
        )}
      </div>

      {/* Add Instrument Button */}
      <button
        type="button"
        onClick={addInstrument}
        disabled={!Array.isArray(availableInstruments) || availableInstruments.length === 0}
        className="w-full px-4 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        + Ajouter un instrument
      </button>

      {/* Error Message */}
      {instrumentsError && <div className="text-red-500 text-xs mt-1">{instrumentsError}</div>}

      {/* Musical Genres Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Genres musicaux préférés</h3>
        <div className="flex flex-wrap gap-2">
          {MUSIC_GENRES.map((genre) => (
            <button
              key={genre.id}
              type="button"
              onClick={() => toggleGenre(genre.id)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                (data.preferredGenres || []).includes(genre.id)
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {locale === 'fr' ? genre.nameFr : genre.nameEn}
            </button>
          ))}
        </div>
        {(data.preferredGenres || []).length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Sélectionnés:{' '}
            {(data.preferredGenres || [])
              .map((genreId) => {
                const genre = MUSIC_GENRES.find((g) => g.id === genreId);
                return genre ? (locale === 'fr' ? genre.nameFr : genre.nameEn) : genreId;
              })
              .join(', ')}
          </p>
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Vos goûts musicaux</h4>
        <p className="text-sm text-blue-700">
          Ajoutez tous les instruments que vous savez jouer avec votre niveau actuel et vos genres
          préférés. Cela nous aide à vous proposer des groupes adaptés !
        </p>
      </div>

      {/* Navigation Buttons */}
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
