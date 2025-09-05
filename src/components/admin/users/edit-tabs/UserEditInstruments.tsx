'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Edit2 } from 'lucide-react';
import { MUSIC_GENRES } from '@/data/musicGenres';
import { parsePreferredGenres } from '@/utils/genreUtils';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  instruments?: Array<{
    id: string;
    instrumentId?: string;
    instrument?: {
      id: number;
      name: string;
      nameFr: string;
      nameEn: string;
    };
    skillLevel: string;
    yearsPlaying: number;
    isPrimary: boolean;
  }>;
  isAvailableForBands?: boolean;
  preferredGenres?: string[];
}

interface UserEditInstrumentsProps {
  user: User;
  setUser: (user: User) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  isReadOnly?: boolean;
}

interface Instrument {
  id: string;
  name: string;
  level: string;
  yearsPlaying: number;
  primary: boolean;
}

// All instruments are now fetched from database via API

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

// MUSIC_GENRES imported from data file

export default function UserEditInstruments({
  user,
  setUser,
  setHasUnsavedChanges,
  isReadOnly = false,
}: UserEditInstrumentsProps) {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [availableInstruments, setAvailableInstruments] = useState<
    Array<{
      id: number;
      name: string;
      nameFr: string;
      nameEn: string;
    }>
  >([]);
  const [instrumentMapping, setInstrumentMapping] = useState<Record<string, number>>({});
  const [preferredGenres, setPreferredGenres] = useState<string[]>([]);
  const [isAddingInstrument, setIsAddingInstrument] = useState(false);
  const [editingInstrument, setEditingInstrument] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [newInstrument, setNewInstrument] = useState({
    name: '',
    level: 'Beginner',
    yearsPlaying: 0,
    primary: false,
  });
  // Band Matching Settings state (controlled by user object)
  const bandMatchingSettings = {
    isAvailableForBands: user.isAvailableForBands ?? true,
  };

  // Load available instruments from database
  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const response = await fetch('/api/instruments');
        const data = await response.json();
        if (data.instruments) {
          setAvailableInstruments(data.instruments);
          // Create mapping from French name to ID
          const mapping: Record<string, number> = {};
          data.instruments.forEach((inst: { id: number; nameFr: string }) => {
            mapping[inst.nameFr] = inst.id;
          });
          setInstrumentMapping(mapping);

          // Set default instrument name
          if (data.instruments.length > 0 && !newInstrument.name) {
            setNewInstrument((prev) => ({ ...prev, name: data.instruments[0].nameFr }));
          }
        }
      } catch (error) {
        console.error('Error fetching instruments:', error);
      }
    };
    fetchInstruments();
  }, [newInstrument.name]);

  // Load real user instruments when component mounts or user changes
  useEffect(() => {
    if (user?.instruments) {
      const userInstruments = user.instruments.map((inst) => ({
        id: inst.instrumentId?.toString() || inst.id?.toString(),
        name:
          inst.instrument?.nameFr || inst.instrument?.nameEn || inst.instrument?.name || 'Unknown',
        level: inst.skillLevel || 'Beginner',
        yearsPlaying: inst.yearsPlaying || 0,
        primary: inst.isPrimary || false,
      }));
      setInstruments(userInstruments);
    } else {
      setInstruments([]);
    }

    // Load preferred genres from user using utility function
    const genres = parsePreferredGenres(user?.preferredGenres);
    setPreferredGenres(genres);
  }, [user]);

  const addInstrument = () => {
    setErrorMessage(null); // Clear previous errors

    // Check if instrument already exists by name
    if (instruments.some((inst) => inst.name === newInstrument.name)) {
      setErrorMessage(
        `${newInstrument.name} est déjà dans la liste ! Chaque instrument ne peut être ajouté qu'une seule fois.`,
      );
      return;
    }

    // Also check if the instrumentId already exists (for database constraint)
    const newInstrumentId = instrumentMapping[newInstrument.name];
    if (!newInstrumentId) {
      setErrorMessage(
        `Impossible de trouver l'instrument ${newInstrument.name} dans la base de données !`,
      );
      return;
    }
    if (
      instruments.some((inst) => {
        const existingId = instrumentMapping[inst.name] || parseInt(inst.id);
        return existingId === newInstrumentId;
      })
    ) {
      setErrorMessage(`Cet instrument est déjà ajouté sous un autre nom !`);
      return;
    }

    const instrument: Instrument = {
      id: Date.now().toString(),
      ...newInstrument,
    };

    // If this instrument is being set as primary, unset all others first
    let updatedInstruments;
    if (newInstrument.primary) {
      // Unset primary on all existing instruments, then add new one as primary
      updatedInstruments = [
        ...instruments.map((inst) => ({ ...inst, primary: false })),
        instrument,
      ];
    } else {
      // Just add the new instrument
      updatedInstruments = [...instruments, instrument];
    }
    setInstruments(updatedInstruments);

    // Update the parent user object with the new instruments data
    const updatedUserInstruments = updatedInstruments.map((inst) => {
      const instrumentId = instrumentMapping[inst.name] || parseInt(inst.id);
      return {
        id: inst.id,
        instrumentId: instrumentId.toString(),
        skillLevel: inst.level.toUpperCase(),
        yearsPlaying: inst.yearsPlaying || 0,
        isPrimary: inst.primary,
        instrument: {
          id: instrumentId,
          name: inst.name.toLowerCase(),
          nameFr: inst.name,
          nameEn: inst.name,
        },
      };
    });
    setUser({ ...user, instruments: updatedUserInstruments });

    setNewInstrument({
      name: availableInstruments.length > 0 ? availableInstruments[0].nameFr : '',
      level: 'Beginner',
      yearsPlaying: 0,
      primary: false,
    });
    setIsAddingInstrument(false);
    setHasUnsavedChanges(true);
  };

  const removeInstrument = (id: string) => {
    const updatedInstruments = instruments.filter((inst) => inst.id !== id);
    setInstruments(updatedInstruments);

    // Update the parent user object with the new instruments data
    const updatedUserInstruments = updatedInstruments.map((inst) => {
      const instrumentId = instrumentMapping[inst.name] || parseInt(inst.id);
      return {
        id: inst.id,
        instrumentId: instrumentId.toString(),
        skillLevel: inst.level.toUpperCase(),
        yearsPlaying: inst.yearsPlaying || 0,
        isPrimary: inst.primary,
        instrument: {
          id: instrumentId,
          name: inst.name.toLowerCase(),
          nameFr: inst.name,
          nameEn: inst.name,
        },
      };
    });
    setUser({ ...user, instruments: updatedUserInstruments });
    setHasUnsavedChanges(true);
  };

  const updateInstrument = (id: string, updates: Partial<Instrument>) => {
    // If setting an instrument as primary, unset all others first
    let updatedInstruments;
    if (updates.primary === true) {
      updatedInstruments = instruments.map((inst) =>
        inst.id === id ? { ...inst, ...updates } : { ...inst, primary: false },
      );
    } else {
      updatedInstruments = instruments.map((inst) =>
        inst.id === id ? { ...inst, ...updates } : inst,
      );
    }
    setInstruments(updatedInstruments);

    // Update the parent user object with the new instruments data
    const updatedUserInstruments = updatedInstruments.map((inst) => {
      const instrumentId = instrumentMapping[inst.name] || parseInt(inst.id);
      return {
        id: inst.id,
        instrumentId: instrumentId.toString(),
        skillLevel: inst.level.toUpperCase(),
        yearsPlaying: inst.yearsPlaying,
        isPrimary: inst.primary,
        instrument: {
          id: instrumentId,
          name: inst.name.toLowerCase(),
          nameFr: inst.name,
          nameEn: inst.name,
        },
      };
    });
    setUser({ ...user, instruments: updatedUserInstruments });
    setHasUnsavedChanges(true);
  };

  const setPrimaryInstrument = (id: string) => {
    // Ensure only one instrument can be primary
    const updatedInstruments = instruments.map((inst) => ({
      ...inst,
      primary: inst.id === id, // This will set the selected one to true, all others to false
    }));
    setInstruments(updatedInstruments);

    // Update the parent user object with the new instruments data
    const updatedUserInstruments = updatedInstruments.map((inst) => {
      const instrumentId = instrumentMapping[inst.name] || parseInt(inst.id);
      return {
        id: inst.id,
        instrumentId: instrumentId.toString(),
        skillLevel: inst.level.toUpperCase(),
        yearsPlaying: inst.yearsPlaying || 0,
        isPrimary: inst.primary,
        instrument: {
          id: instrumentId,
          name: inst.name.toLowerCase(),
          nameFr: inst.name,
          nameEn: inst.name,
        },
      };
    });
    setUser({ ...user, instruments: updatedUserInstruments });
    setHasUnsavedChanges(true);
  };

  const toggleGenre = (genreId: string) => {
    const newGenres = preferredGenres.includes(genreId)
      ? preferredGenres.filter((g) => g !== genreId)
      : [...preferredGenres, genreId];
    setPreferredGenres(newGenres);

    // Update the parent user object with preferred genres (as JSON string)
    setUser({ ...user, preferredGenres: newGenres });
    setHasUnsavedChanges(true);
  };

  // Handlers for Band Matching Settings
  const handleBandMatchingChange = (field: keyof typeof bandMatchingSettings, value: boolean) => {
    setUser({ ...user, [field]: value });
    setHasUnsavedChanges(true);
  };

  const InstrumentCard = ({ instrument }: { instrument: Instrument }) => (
    <div
      className={`p-4 border-2 rounded-lg transition-all ${
        instrument.primary ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-900 flex items-center">
          {instrument.name}
          {instrument.primary && (
            <span className="ml-2 px-2 py-1 text-xs bg-primary text-white rounded-full">
              Primary
            </span>
          )}
        </h4>
        {!isReadOnly && (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setEditingInstrument(instrument.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => removeInstrument(instrument.id)}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {editingInstrument === instrument.id && !isReadOnly ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <select
              value={instrument.level}
              onChange={(e) => updateInstrument(instrument.id, { level: e.target.value })}
              className="px-2 py-1 text-sm border border-gray-200 rounded"
            >
              {SKILL_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={instrument.yearsPlaying || ''}
              onChange={(e) => {
                const value = e.target.value;
                const numValue = value === '' ? 0 : parseInt(value) || 0;
                updateInstrument(instrument.id, { yearsPlaying: numValue });
              }}
              disabled={isReadOnly}
              className="px-2 py-1 text-sm border border-gray-200 rounded disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="Years"
              min="0"
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="radio"
                checked={instrument.primary}
                onChange={() => setPrimaryInstrument(instrument.id)}
                className="text-primary"
              />
              <span>Set as primary instrument</span>
            </label>
            <button
              onClick={() => setEditingInstrument(null)}
              className="text-sm text-primary hover:text-primary/80"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-600">
          <p>
            {instrument.level}
            {instrument.yearsPlaying > 0 ? ` • ${instrument.yearsPlaying} years` : ''}
          </p>
          {!instrument.primary && !isReadOnly && (
            <button
              onClick={() => setPrimaryInstrument(instrument.id)}
              className="text-primary hover:text-primary/80 text-xs mt-1"
            >
              Set as primary
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Instruments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Instruments</h3>
          {!isReadOnly && (
            <button
              onClick={() => setIsAddingInstrument(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 border border-transparent rounded-lg shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4" />
              Ajouter un instrument
            </button>
          )}
        </div>

        {/* Add Instrument Form */}
        {isAddingInstrument && !isReadOnly && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Add New Instrument</h4>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select
                value={newInstrument.name}
                onChange={(e) => setNewInstrument({ ...newInstrument, name: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              >
                {availableInstruments.map((instrument) => (
                  <option key={instrument.id} value={instrument.nameFr}>
                    {instrument.nameFr}
                  </option>
                ))}
              </select>

              <select
                value={newInstrument.level}
                onChange={(e) => setNewInstrument({ ...newInstrument, level: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              >
                {SKILL_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={newInstrument.yearsPlaying || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const numValue = value === '' ? 0 : parseInt(value) || 0;
                  setNewInstrument({ ...newInstrument, yearsPlaying: numValue });
                }}
                placeholder="Years playing"
                min="0"
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPrimary"
                  checked={newInstrument.primary}
                  onChange={(e) =>
                    setNewInstrument({ ...newInstrument, primary: e.target.checked })
                  }
                  className="text-primary border-gray-300 rounded focus:ring-primary/20"
                />
                <label htmlFor="isPrimary" className="text-sm text-gray-700">
                  Primary
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={() => {
                  setIsAddingInstrument(false);
                  setErrorMessage(null);
                  setNewInstrument({
                    name: availableInstruments.length > 0 ? availableInstruments[0].nameFr : '',
                    level: 'Beginner',
                    yearsPlaying: 0,
                    primary: false,
                  });
                }}
                className="inline-flex items-center px-4 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addInstrument}
                className="inline-flex items-center px-4 py-2 text-sm bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
              >
                Add Instrument
              </button>
            </div>
          </div>
        )}

        {/* Instruments List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {instruments.map((instrument) => (
            <InstrumentCard key={instrument.id} instrument={instrument} />
          ))}
        </div>

        {instruments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No instruments added yet</p>
            <p className="text-sm">Add instruments to help with band matching</p>
          </div>
        )}
      </div>

      {/* Preferred Genres */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferred Genres</h3>
        <div className="flex flex-wrap gap-2">
          {MUSIC_GENRES.map((genre) => (
            <button
              key={genre.id}
              onClick={() => !isReadOnly && toggleGenre(genre.id)}
              disabled={isReadOnly}
              className={`px-3 py-2 text-sm rounded-full border transition-colors ${
                preferredGenres.includes(genre.id)
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              } ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {genre.nameFr}
            </button>
          ))}
        </div>

        {preferredGenres.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Selected genres:</strong>{' '}
              {preferredGenres
                .map((genreId) => {
                  const genre = MUSIC_GENRES.find((g) => g.id === genreId);
                  return genre ? genre.nameFr : genreId;
                })
                .join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Availability Settings */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Band Matching Settings</h3>
        <div className="space-y-4">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={bandMatchingSettings.isAvailableForBands}
              onChange={(e) =>
                !isReadOnly && handleBandMatchingChange('isAvailableForBands', e.target.checked)
              }
              disabled={isReadOnly}
              className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Available for new bands</span>
              <p className="text-xs text-gray-500">
                Allow band leaders to see this user when looking for members
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
