'use client';

import { Palette } from 'lucide-react';

interface AppearanceTabProps {
  primaryColor: string;
  onColorChange: (color: string) => void;
}

export default function AppearanceTab({ primaryColor, onColorChange }: AppearanceTabProps) {
  const predefinedColors = [
    { name: 'Violet (défaut)', value: 'oklch(0.559 0.238 307.331)' },
    { name: 'Bleu', value: 'oklch(0.559 0.238 230)' },
    { name: 'Vert', value: 'oklch(0.559 0.238 142)' },
    { name: 'Rouge', value: 'oklch(0.559 0.238 27)' },
    { name: 'Orange', value: 'oklch(0.559 0.238 50)' },
    { name: 'Rose', value: 'oklch(0.559 0.238 330)' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Palette className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold">Apparence du site</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">Couleur principale</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {predefinedColors.map((color) => (
              <button
                key={color.value}
                onClick={() => onColorChange(color.value)}
                className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                  primaryColor === color.value
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full mx-auto mb-2"
                  style={{
                    backgroundColor: `oklch(${color.value.split('(')[1].split(')')[0]})`,
                  }}
                />
                <span className="text-xs font-medium text-gray-900">{color.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Couleur personnalisée (OKLCH)
          </label>
          <input
            type="text"
            value={primaryColor}
            onChange={(e) => onColorChange(e.target.value)}
            placeholder="oklch(0.559 0.238 307.331)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <p className="text-xs text-gray-600 mt-1">
            Format: oklch(lightness chroma hue). Exemple: oklch(0.559 0.238 307.331)
          </p>
        </div>
      </div>
    </div>
  );
}
