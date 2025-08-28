'use client';

import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Check, ChevronsUpDown, Plus, X } from 'lucide-react';
import { MUSIC_GENRES } from '@/data/musicGenres';

// Types
type LevelKey = 'beginner' | 'intermediate' | 'advanced' | 'expert';
interface Instrument {
  id: string;
  name: string;
  level: LevelKey;
  yearsPlaying?: number;
}
interface UserMusicProfile {
  instruments: Instrument[];
  primaryInstrumentId: string; // persisted on user
  seekingBand: boolean;
  styles: string[];
}

interface MusicSettingsProps {
  formData?: Record<string, unknown>;
  onFormDataChange?: (data: Record<string, unknown>) => void;
}

export function MusicSettings({ onFormDataChange }: MusicSettingsProps) {
  const params = useParams();
  const locale = params.lang as string;

  // ===== Catalog / labels =====
  const levelLabels: Record<LevelKey, string> = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé',
    expert: 'Expert',
  };

  // Fetch available instruments from API instead of hardcoded catalog
  const [availableInstruments, setAvailableInstruments] = useState<{ id: string; name: string }[]>(
    [],
  );

  // Fetch instruments catalog from API
  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const response = await fetch('/api/instruments');
        if (response.ok) {
          const data = await response.json();
          const instrumentsWithIds = (data.instruments || []).map(
            (inst: { id: number; nameFr: string }) => ({
              id: inst.id.toString(),
              name: inst.nameFr,
            }),
          );
          setAvailableInstruments(instrumentsWithIds);
        }
      } catch (error) {
        console.error('Error fetching instruments:', error);
      }
    };
    fetchInstruments();
  }, []);

  // Use MUSIC_GENRES from data file instead of hardcoded list

  // ===== User state =====
  const [userMusic, setUserMusic] = useState<UserMusicProfile>({
    instruments: [],
    primaryInstrumentId: '',
    seekingBand: false,
    styles: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Report changes to parent for save functionality
  const handleMusicDataChange = (newData: Partial<UserMusicProfile>) => {
    const updatedData = { ...userMusic, ...newData };
    setUserMusic(updatedData);
    onFormDataChange?.(updatedData);
  };

  // Load user music data from API
  useEffect(() => {
    const loadUserMusicData = async () => {
      try {
        const response = await fetch('/api/profile/music');
        console.log('API Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('API Response data:', data);

          const musicData = {
            instruments: data.instruments || [],
            primaryInstrumentId: data.primaryInstrumentId || '',
            seekingBand: data.seekingBand || false,
            styles: data.styles || [],
          };
          setUserMusic(musicData);
          // Don't call onFormDataChange here to avoid triggering "unsaved changes" on load

          console.log('User music set to:', {
            instruments: data.instruments || [],
            primaryInstrumentId: data.primaryInstrumentId || '',
            seekingBand: data.seekingBand || false,
            styles: data.styles || [],
          });
        } else {
          const errorText = await response.text();
          console.error('API Error:', response.status, errorText);

          // Redirect to login if unauthorized
          if (response.status === 401) {
            window.location.href = `/${locale}/login`;
            return;
          }
        }
      } catch (error) {
        console.error('Error loading user music data:', error);

        // Redirect to login on network errors that might indicate session issues
        window.location.href = `/${locale}/login`;
      } finally {
        setIsLoading(false);
      }
    };

    loadUserMusicData();
  }, [locale]);

  // ===== Derived =====
  const availableToAdd = useMemo(() => {
    const owned = new Set(userMusic.instruments.map((i) => i.id));
    return availableInstruments.filter((i) => !owned.has(i.id));
  }, [userMusic.instruments, availableInstruments]);

  // Combobox state
  const [openAdd, setOpenAdd] = useState(false);
  const [instrumentToAdd, setInstrumentToAdd] = useState<string>('');

  // ===== Handlers =====
  const setPrimary = (id: string, checked: boolean) => {
    if (checked) {
      // Set this instrument as primary
      handleMusicDataChange({ primaryInstrumentId: id });
    } else {
      // Remove primary status (no primary instrument)
      handleMusicDataChange({ primaryInstrumentId: '' });
    }
  };

  const addInstrument = () => {
    if (!instrumentToAdd) return;
    const found = availableInstruments.find((i) => i.id === instrumentToAdd);
    if (!found) return;

    const newInstrument: Instrument = {
      id: found.id,
      name: found.name,
      level: 'beginner',
      yearsPlaying: 0,
    };

    const currentInstruments = [...userMusic.instruments, newInstrument];
    const updates: Partial<UserMusicProfile> = {
      instruments: currentInstruments,
    };
    if (!userMusic.primaryInstrumentId) {
      updates.primaryInstrumentId = found.id;
    }
    handleMusicDataChange(updates);
    setInstrumentToAdd('');
    setOpenAdd(false);
  };

  const removeInstrument = (id: string) => {
    const nextInstruments = userMusic.instruments.filter((i) => i.id !== id);
    let nextPrimary = userMusic.primaryInstrumentId;
    if (userMusic.primaryInstrumentId === id) {
      nextPrimary = nextInstruments[0]?.id ?? '';
    }
    handleMusicDataChange({ instruments: nextInstruments, primaryInstrumentId: nextPrimary });
  };

  const updateLevel = (id: string, level: LevelKey) => {
    const updatedInstruments = userMusic.instruments.map((i) =>
      i.id === id ? { ...i, level } : i,
    );
    handleMusicDataChange({ instruments: updatedInstruments });
  };

  const updateYears = (id: string, years: number) => {
    const updatedInstruments = userMusic.instruments.map((i) =>
      i.id === id ? { ...i, yearsPlaying: years } : i,
    );
    handleMusicDataChange({ instruments: updatedInstruments });
  };

  const toggleStyle = (genreId: string, checked: boolean) => {
    const set = new Set(userMusic.styles);
    if (checked) set.add(genreId);
    else set.delete(genreId);
    handleMusicDataChange({ styles: Array.from(set) });
  };

  // Save functions removed - handled by parent layout's save functionality

  // ===== Render (single column) =====
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Musique</h1>
          <p className="mt-1">Configurez vos instruments et vos préférences musicales.</p>
        </div>
        <div className="flex justify-center items-center p-8">
          <div className="animate-pulse text-gray-500">Chargement des données musicales...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Musique</h1>
        <p className="mt-1">Configurez vos instruments et vos préférences musicales.</p>
      </div>

      {/* Instruments */}
      <Card>
        <CardHeader>
          <CardTitle>Mes instruments</CardTitle>
          <CardDescription>
            Gérez vos instruments, votre niveau, et définissez l’instrument principal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current primary */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Instrument principal :</span>
            <Badge>
              {userMusic.instruments.find((i) => i.id === userMusic.primaryInstrumentId)?.name ||
                '—'}
            </Badge>
          </div>

          {/* Add instrument — Combobox */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Label className="sr-only">Ajouter un instrument</Label>
              <Popover open={openAdd} onOpenChange={setOpenAdd}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openAdd}
                    className="w-full justify-between"
                  >
                    {instrumentToAdd
                      ? availableToAdd.find((i) => i.id === instrumentToAdd)?.name
                      : 'Ajouter un instrument'}
                    <ChevronsUpDown className="h-4 w-4 opacity-70" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  align="start"
                  className="w-[var(--radix-popover-trigger-width)] p-0"
                >
                  <Command>
                    <CommandInput placeholder="Rechercher…" />
                    <CommandEmpty>Aucun instrument</CommandEmpty>
                    <CommandGroup>
                      {availableToAdd.map((inst) => (
                        <CommandItem
                          key={inst.id}
                          value={inst.name}
                          onSelect={() => {
                            setInstrumentToAdd(inst.id);
                            setOpenAdd(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              instrumentToAdd === inst.id ? '' : 'opacity-0'
                            }`}
                          />
                          {inst.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <Button onClick={addInstrument} disabled={!instrumentToAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </div>

          {/* List */}
          <div className="space-y-3">
            {userMusic.instruments.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                <p className="text-lg font-medium">Aucun instrument ajouté</p>
                <p className="text-sm">
                  Ajoutez vos instruments pour commencer à personnaliser votre profil musical.
                </p>
              </div>
            ) : (
              userMusic.instruments.map((instrument) => {
                const isPrimary = instrument.id === userMusic.primaryInstrumentId;
                return (
                  <div
                    key={instrument.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{instrument.name}</span>
                      <Badge>{levelLabels[instrument.level]}</Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 md:min-w-[480px]">
                      {/* Level — shadcn Select */}
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Niveau</Label>
                        <Select
                          value={instrument.level}
                          onValueChange={(v) => updateLevel(instrument.id, v as LevelKey)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">{levelLabels.beginner}</SelectItem>
                            <SelectItem value="intermediate">{levelLabels.intermediate}</SelectItem>
                            <SelectItem value="advanced">{levelLabels.advanced}</SelectItem>
                            <SelectItem value="expert">{levelLabels.expert}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Years of practice */}
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Années</Label>
                        <Select
                          value={String(instrument.yearsPlaying || 0)}
                          onValueChange={(v) => updateYears(instrument.id, parseInt(v))}
                        >
                          <SelectTrigger className="w-[80px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30].map((year) => (
                              <SelectItem key={year} value={String(year)}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Primary — checkbox (unique) */}
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`primary-${instrument.id}`}
                          checked={isPrimary}
                          onCheckedChange={(v) => setPrimary(instrument.id, Boolean(v))}
                        />
                        <Label htmlFor={`primary-${instrument.id}`} className="text-sm">
                          Principal
                        </Label>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInstrument(instrument.id)}
                        aria-label={`Retirer ${instrument.name}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preferences (no time slots; fixed styles) */}
      <Card>
        <CardHeader>
          <CardTitle>Préférences</CardTitle>
          <CardDescription>Recherche de groupe et styles favoris.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label htmlFor="seeking-band">Recherche un groupe</Label>
              <p>Votre profil pourra apparaître dans les recommandations.</p>
            </div>
            <Switch
              id="seeking-band"
              checked={userMusic.seekingBand}
              onCheckedChange={(v) => handleMusicDataChange({ seekingBand: Boolean(v) })}
            />
          </div>

          <div className="space-y-2">
            <Label>Styles musicaux</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {MUSIC_GENRES.map((genre) => {
                const checked = userMusic.styles.includes(genre.id);
                return (
                  <div key={genre.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={genre.id}
                      checked={checked}
                      onCheckedChange={(v) => toggleStyle(genre.id, Boolean(v))}
                    />
                    <Label
                      htmlFor={genre.id}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {genre.nameFr}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
