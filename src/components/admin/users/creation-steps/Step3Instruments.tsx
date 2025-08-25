'use client';

import { useState } from 'react';
import { Plus, Minus, X } from 'lucide-react';
import { UserFormData } from '../CreateUserModal';

interface Step3InstrumentsProps {
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
}

const AVAILABLE_INSTRUMENTS = [
  'Guitar', 'Bass', 'Drums', 'Piano/Keyboard', 'Vocals', 'Violin', 'Trumpet',
  'Saxophone', 'Flute', 'Clarinet', 'Cello', 'Percussion', 'Harmonica', 'Other'
];

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const MUSIC_GENRES = [
  'Rock', 'Pop', 'Jazz', 'Classical', 'Blues', 'Folk', 'Electronic',
  'Hip-Hop', 'R&B', 'Country', 'Metal', 'Punk', 'Reggae', 'World'
];

export default function Step3Instruments({ formData, setFormData }: Step3InstrumentsProps) {
  const [newInstrument, setNewInstrument] = useState('Guitar');
  const [newLevel, setNewLevel] = useState('Beginner');

  const addInstrument = () => {
    const newInstrumentEntry = { instrument: newInstrument, level: newLevel };
    const updatedInstruments = [...(formData.instruments || []), newInstrumentEntry];
    setFormData({ ...formData, instruments: updatedInstruments });
  };

  const removeInstrument = (index: number) => {
    const updatedInstruments = formData.instruments.filter((_, i) => i !== index);
    setFormData({ ...formData, instruments: updatedInstruments });
  };

  const updateField = (field: keyof UserFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleGenre = (genre: string) => {
    const currentGenres = formData.preferredGenres || [];
    const newGenres = currentGenres.includes(genre)
      ? currentGenres.filter(g => g !== genre)
      : [...currentGenres, genre];
    
    setFormData({ ...formData, preferredGenres: newGenres });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Instruments Played</h3>
        
        {/* Add Instrument */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1">
            <select
              value={newInstrument}
              onChange={(e) => setNewInstrument(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              {AVAILABLE_INSTRUMENTS.map(instrument => (
                <option key={instrument} value={instrument}>{instrument}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
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
          <button
            onClick={addInstrument}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </button>
        </div>

        {/* Current Instruments */}
        {formData.instruments.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Current Instruments:</p>
            {formData.instruments.map((inst, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-sm">
                  <strong>{inst.instrument}</strong> ({inst.level})
                </span>
                <button
                  onClick={() => removeInstrument(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
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
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    formData.preferredGenres.includes(genre)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
            {formData.preferredGenres.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Selected: {formData.preferredGenres.join(', ')}
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