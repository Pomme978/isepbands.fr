'use client';

import { useMemo, useState, useEffect } from 'react';
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

// Types
type LevelKey = 'beginner' | 'intermediate' | 'advanced';
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

export function MusicSettings() {
  // ===== Catalog / labels =====
  const levelLabels: Record<LevelKey, string> = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé',
  };

  const catalog: Instrument[] = [
    { id: 'guitar', name: 'Guitare', level: 'beginner', yearsPlaying: 0 },
    { id: 'bass', name: 'Basse', level: 'beginner', yearsPlaying: 0 },
    { id: 'drums', name: 'Batterie', level: 'beginner', yearsPlaying: 0 },
    { id: 'keys', name: 'Clavier/Piano', level: 'beginner', yearsPlaying: 0 },
    { id: 'vocal', name: 'Chant', level: 'beginner', yearsPlaying: 0 },
    { id: 'violin', name: 'Violon', level: 'beginner', yearsPlaying: 0 },
    { id: 'sax', name: 'Saxophone', level: 'beginner', yearsPlaying: 0 },
    { id: 'trumpet', name: 'Trompette', level: 'beginner', yearsPlaying: 0 },
    { id: 'other', name: 'Autre', level: 'beginner', yearsPlaying: 0 },
  ];

  const fixedStyles = [
    'Rock',
    'Pop',
    'Jazz',
    'Blues',
    'Métal',
    'Punk',
    'Reggae',
    'Funk',
    'Country',
    'Électro',
    'Classique',
  ];

  // ===== User state =====
  const [userMusic, setUserMusic] = useState<UserMusicProfile>({
    instruments: [],
    primaryInstrumentId: '',
    seekingBand: false,
    styles: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Load user music data from API
  useEffect(() => {
    const loadUserMusicData = async () => {
      try {
        const response = await fetch('/api/profile/music');
        if (response.ok) {
          const data = await response.json();
          setUserMusic({
            instruments: data.instruments || [],
            primaryInstrumentId: data.primaryInstrumentId || '',
            seekingBand: data.seekingBand || false,
            styles: data.styles || [],
          });
        }
      } catch (error) {
        console.error('Error loading user music data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserMusicData();
  }, []);

  // ===== Derived =====
  const availableToAdd = useMemo(() => {
    const owned = new Set(userMusic.instruments.map((i) => i.id));
    return catalog.filter((i) => !owned.has(i.id));
  }, [userMusic.instruments]);

  // Combobox state
  const [openAdd, setOpenAdd] = useState(false);
  const [instrumentToAdd, setInstrumentToAdd] = useState<string>('');

  // ===== Handlers =====
  const setPrimary = (id: string, checked: boolean) => {
    if (checked) {
      setUserMusic((prev) => ({ ...prev, primaryInstrumentId: id }));
    }
  };

  const addInstrument = () => {
    if (!instrumentToAdd) return;
    const found = catalog.find((i) => i.id === instrumentToAdd);
    if (!found) return;
    setUserMusic((prev) => {
      const next = { ...prev, instruments: [...prev.instruments, { ...found }] };
      if (!prev.primaryInstrumentId) next.primaryInstrumentId = found.id;
      return next;
    });
    setInstrumentToAdd('');
    setOpenAdd(false);
  };

  const removeInstrument = (id: string) => {
    setUserMusic((prev) => {
      const nextInstruments = prev.instruments.filter((i) => i.id !== id);
      let nextPrimary = prev.primaryInstrumentId;
      if (prev.primaryInstrumentId === id) {
        nextPrimary = nextInstruments[0]?.id ?? '';
      }
      return { ...prev, instruments: nextInstruments, primaryInstrumentId: nextPrimary };
    });
  };

  const updateLevel = (id: string, level: LevelKey) => {
    setUserMusic((prev) => ({
      ...prev,
      instruments: prev.instruments.map((i) => (i.id === id ? { ...i, level } : i)),
    }));
  };

  const updateYears = (id: string, years: number) => {
    setUserMusic((prev) => ({
      ...prev,
      instruments: prev.instruments.map((i) => (i.id === id ? { ...i, yearsPlaying: years } : i)),
    }));
  };

  const toggleStyle = (style: string, checked: boolean) => {
    setUserMusic((prev) => {
      const set = new Set(prev.styles);
      if (checked) set.add(style);
      else set.delete(style);
      return { ...prev, styles: Array.from(set) };
    });
  };

  const saveInstruments = async () => {
    try {
      const response = await fetch('/api/profile/music', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruments: userMusic.instruments,
          primaryInstrumentId: userMusic.primaryInstrumentId,
        }),
      });

      if (response.ok) {
        alert('Instruments sauvegardés avec succès');
      } else {
        throw new Error('Failed to save instruments');
      }
    } catch (error) {
      console.error('Error saving instruments:', error);
      alert('Erreur lors de la sauvegarde des instruments');
    }
  };

  const savePreferences = async () => {
    try {
      const response = await fetch('/api/profile/music', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seekingBand: userMusic.seekingBand,
          styles: userMusic.styles,
        }),
      });

      if (response.ok) {
        alert('Préférences sauvegardées avec succès');
      } else {
        throw new Error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Erreur lors de la sauvegarde des préférences');
    }
  };

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
              <div>Ajoutez vos instruments pour commencer.</div>
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

          <div className="flex justify-end">
            <Button onClick={saveInstruments}>Enregistrer mes instruments</Button>
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
              onCheckedChange={(v) =>
                setUserMusic((prev) => ({ ...prev, seekingBand: Boolean(v) }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Styles musicaux</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {fixedStyles.map((style) => {
                const checked = userMusic.styles.includes(style);
                return (
                  <div key={style} className="flex items-center space-x-2">
                    <Checkbox
                      id={style}
                      checked={checked}
                      onCheckedChange={(v) => toggleStyle(style, Boolean(v))}
                    />
                    <Label htmlFor={style} className="text-sm">
                      {style}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={savePreferences}>Enregistrer mes préférences</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
