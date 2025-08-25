'use client';

import { useState, useEffect } from 'react';
import { Plus, Minus, X, Star } from 'lucide-react';
import { UserFormData } from '../CreateUserModal';
import { MUSIC_GENRES } from '@/data/musicGenres';

interface Step3InstrumentsProps {
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
}

interface Instrument {
  id: number;
  name: string;
  nameFr: string;
  nameEn: string;
}

const AVAILABLE_INSTRUMENTS_FALLBACK = [
  'Guitar', 'Bass', 'Drums', 'Piano/Keyboard', 'Vocals', 'Violin', 'Trumpet',
  'Saxophone', 'Flute', 'Clarinet', 'Cello', 'Percussion', 'Harmonica', 'Other'
];

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];


export default function Step3Instruments({ formData, setFormData }: Step3InstrumentsProps) {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [isLoadingInstruments, setIsLoadingInstruments] = useState(true);
  const [newInstrument, setNewInstrument] = useState('');
  const [newLevel, setNewLevel] = useState('Beginner');
  const [newYearsPlaying, setNewYearsPlaying] = useState<number | ''>('');
  const [newIsPrimary, setNewIsPrimary] = useState(false);

  // Fetch instruments from API
  useEffect(() => {
    async function fetchInstruments() {
      try {
        const response = await fetch('/api/instruments');
        if (response.ok) {
          const data = await response.json();
          setInstruments(data.instruments || []);
          // Set default instrument
          if (data.instruments.length > 0) {
            setNewInstrument(data.instruments[0].name);
          }
        } else {
          console.error('Failed to fetch instruments');
        }
      } catch (error) {
        console.error('Error fetching instruments:', error);
      } finally {
        setIsLoadingInstruments(false);
      }
    }

    fetchInstruments();
  }, []);

  const addInstrument = () => {
    // Check if instrument already exists
    const existingInstrument = formData.instruments.find(inst => inst.instrument === newInstrument);
    if (existingInstrument) {
      alert(`${newInstrument} is already added to the list.`);
      return;
    }

    // If this is marked as primary, remove primary from other instruments
    let updatedInstruments = [...(formData.instruments || [])];
    if (newIsPrimary) {
      updatedInstruments = updatedInstruments.map(inst => ({ ...inst, isPrimary: false }));
    }

    // Find the instrument data to get the French name for display
    const instrumentData = instruments.find(inst => inst.name === newInstrument);
    const displayName = instrumentData ? instrumentData.nameFr : newInstrument;
    
    const newInstrumentEntry = { 
      instrument: newInstrument, // technical name for API
      displayName: displayName, // French name for display
      level: newLevel,
      yearsPlaying: newYearsPlaying === '' ? undefined : Number(newYearsPlaying),
      isPrimary: newIsPrimary 
    };
    updatedInstruments = [...updatedInstruments, newInstrumentEntry];
    setFormData({ ...formData, instruments: updatedInstruments });
    
    // Reset form
    setNewYearsPlaying('');
    setNewIsPrimary(false);
  };

  const removeInstrument = (index: number) => {
    const updatedInstruments = formData.instruments.filter((_, i) => i !== index);
    setFormData({ ...formData, instruments: updatedInstruments });
  };

  const togglePrimary = (index: number) => {
    const updatedInstruments = formData.instruments.map((inst, i) => ({
      ...inst,
      isPrimary: i === index ? !inst.isPrimary : false // Only one primary at a time
    }));
    setFormData({ ...formData, instruments: updatedInstruments });
  };

  // Get available instruments (exclude already added ones)
  const availableInstruments = instruments
    .filter(instrument => !formData.instruments.some(inst => inst.instrument === instrument.name))
    .map(instrument => ({ 
      value: instrument.name, 
      label: instrument.nameFr,
      nameEn: instrument.nameEn 
    }));

  // Update the selected instrument if the current one is no longer available
  if (availableInstruments.length > 0 && !availableInstruments.find(inst => inst.value === newInstrument)) {
    setNewInstrument(availableInstruments[0].value);
  }

  const updateField = (field: keyof UserFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleGenre = (genreId: string) => {
    const currentGenres = formData.preferredGenres || [];
    const newGenres = currentGenres.includes(genreId)
      ? currentGenres.filter(g => g !== genreId)
      : [...currentGenres, genreId];
    
    setFormData({ ...formData, preferredGenres: newGenres });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Instruments Played</h3>
        
        {/* Add Instrument */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Instrument</label>
              <select
                value={newInstrument}
                onChange={(e) => setNewInstrument(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                disabled={availableInstruments.length === 0 || isLoadingInstruments}
              >
                {isLoadingInstruments ? (
                  <option value="">Loading instruments...</option>
                ) : availableInstruments.length > 0 ? (
                  availableInstruments.map(instrument => (
                    <option key={instrument.value} value={instrument.value}>
                      {instrument.label}
                    </option>
                  ))
                ) : (
                  <option value="">No more instruments available</option>
                )}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Skill Level</label>
              <select
                value={newLevel}
                onChange={(e) => setNewLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              >
                {SKILL_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Years Playing (Optional)</label>
              <input
                type="number"
                value={newYearsPlaying}
                onChange={(e) => setNewYearsPlaying(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="0"
                min="0"
                max="50"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newIsPrimary}
                onChange={(e) => setNewIsPrimary(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary/20"
              />
              <span className="text-sm font-medium text-gray-700">Mark as primary instrument</span>
              <Star className={`w-4 h-4 ${newIsPrimary ? 'text-yellow-500' : 'text-gray-400'}`} />
            </label>
            
            <button
              onClick={addInstrument}
              disabled={availableInstruments.length === 0 || isLoadingInstruments || !newInstrument}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Instrument
            </button>
          </div>
          
          {!isLoadingInstruments && availableInstruments.length === 0 && (
            <p className="text-sm text-gray-500 italic">All available instruments have been added.</p>
          )}
          
          {isLoadingInstruments && (
            <p className="text-sm text-gray-500 italic">Loading available instruments...</p>
          )}
        </div>

        {/* Current Instruments */}
        {formData.instruments.length > 0 && (
          <div className="space-y-2 mt-6">
            <p className="text-sm font-medium text-gray-700">Current Instruments:</p>
            {formData.instruments.map((inst, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                inst.isPrimary 
                  ? 'bg-yellow-50 border-yellow-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <strong className="text-sm">{inst.displayName || inst.instrument}</strong>
                      <span className="text-xs text-gray-500">
                        ({inst.level}
                        {inst.yearsPlaying && inst.yearsPlaying > 0 ? `, ${inst.yearsPlaying} ans` : ''})
                      </span>
                      {inst.isPrimary && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-xs font-medium text-yellow-700">Primary</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => togglePrimary(index)}
                    className={`p-1 rounded transition-colors ${
                      inst.isPrimary
                        ? 'text-yellow-600 hover:text-yellow-700'
                        : 'text-gray-400 hover:text-yellow-500'
                    }`}
                    title={inst.isPrimary ? 'Remove primary status' : 'Make primary instrument'}
                  >
                    <Star className={`w-4 h-4 ${inst.isPrimary ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => removeInstrument(index)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1 rounded"
                    title="Remove instrument"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {formData.instruments.length > 0 && !formData.instruments.some(inst => inst.isPrimary) && (
              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                💡 Consider marking one instrument as your primary instrument by clicking the star icon.
              </p>
            )}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Musical Experience</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              value={formData.yearsExperience}
              onChange={(e) => updateField('yearsExperience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="0"
              min="0"
              max="50"
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Preferred Genres
            </label>
            <div className="flex flex-wrap gap-2">
              {MUSIC_GENRES.map(genre => (
                <button
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    formData.preferredGenres.includes(genre.id)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {genre.nameEn}
                </button>
              ))}
            </div>
            {formData.preferredGenres.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Selected: {formData.preferredGenres.map(genreId => {
                  const genre = MUSIC_GENRES.find(g => g.id === genreId);
                  return genre ? genre.nameEn : genreId;
                }).join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2">Optional Information</h4>
        <p className="text-sm text-green-700">
          This step is completely optional. Users can always add or update their musical 
          information later in their profile settings. This information helps with band matching 
          and group recommendations.
        </p>
      </div>
    </div>
  );
}