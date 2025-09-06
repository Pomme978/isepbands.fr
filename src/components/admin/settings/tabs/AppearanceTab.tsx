'use client';

import { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';

interface CSSColors {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primaryForeground: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
}

interface AppearanceTabProps {
  primaryColor: string;
  onColorChange: (color: string) => void;
}

export default function AppearanceTab({ primaryColor, onColorChange }: AppearanceTabProps) {
  const [colors, setColors] = useState<CSSColors | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const predefinedColors = [
    { name: 'Violet', value: 'oklch(0.559 0.238 307.331)' },
    { name: 'Bleu', value: 'oklch(0.559 0.238 230)' },
    { name: 'Vert', value: 'oklch(0.559 0.238 142)' },
    { name: 'Rouge', value: 'oklch(0.559 0.238 27)' },
    { name: 'Orange', value: 'oklch(0.559 0.238 50)' },
    { name: 'Rose', value: 'oklch(0.559 0.238 330)' },
  ];

  useEffect(() => {
    loadColors();
  }, []);

  const loadColors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/colors');
      if (response.ok) {
        const data = await response.json();
        setColors(data.colors);
      }
    } catch (error) {
      console.error('Failed to load colors:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateColor = (key: keyof CSSColors, value: string) => {
    if (!colors) return;
    setColors({ ...colors, [key]: value });
    setHasChanges(true);
  };

  const saveColors = async () => {
    if (!colors) return;
    try {
      setSaving(true);
      const response = await fetch('/api/admin/colors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(colors),
      });
      if (response.ok) {
        setHasChanges(false);
        // Apply colors immediately to CSS variables
        Object.entries(colors).forEach(([key, value]) => {
          const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
          document.documentElement.style.setProperty(cssVar, value);
        });
        // Reload page after brief delay to ensure all changes are applied
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.error('Failed to save colors:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <Palette className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Apparence du site</h2>
        </div>
        <div className="text-center py-8">Chargement des couleurs...</div>
      </div>
    );
  }

  if (!colors) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <Palette className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Apparence du site</h2>
        </div>
        <div className="text-center py-8 text-red-600">Erreur lors du chargement des couleurs</div>
      </div>
    );
  }

  const colorLabels: Record<keyof CSSColors, string> = {
    primary: 'Couleur principale',
    secondary: 'Couleur secondaire',
    background: 'Arrière-plan',
    foreground: 'Texte principal',
    card: 'Carte',
    cardForeground: 'Texte de carte',
    popover: 'Popover',
    popoverForeground: 'Texte de popover',
    primaryForeground: 'Texte principal inversé',
    secondaryForeground: 'Texte secondaire',
    muted: 'Couleur atténuée',
    mutedForeground: 'Texte atténué',
    accent: 'Accent',
    accentForeground: "Texte d'accent",
    destructive: 'Destructif (erreur)',
    border: 'Bordure',
    input: 'Champ de saisie',
    ring: 'Focus (ring)',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Palette className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Apparence du site</h2>
        </div>
        {hasChanges && (
          <button
            onClick={saveColors}
            disabled={saving}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder les couleurs'}
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Primary Color Quick Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Couleurs prédéfinies pour la couleur principale
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {predefinedColors.map((color) => (
              <button
                key={color.value}
                onClick={() => {
                  updateColor('primary', color.value);
                  onColorChange(color.value);
                }}
                className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                  colors.primary === color.value
                    ? 'border-gray-900 bg-gray-50 ring-2 ring-gray-900 ring-offset-2'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full mx-auto mb-2 shadow-sm"
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-xs font-medium text-gray-900">{color.name}</span>
                {colors.primary === color.value && (
                  <div className="text-xs text-gray-600 mt-1">Actuelle</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* All Color Variables */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-4">
            Toutes les variables de couleur
          </label>
          <div className="grid gap-4">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-900">
                    {colorLabels[key as keyof CSSColors]}
                  </label>
                  <div
                    className="w-8 h-8 rounded border-2 border-gray-200 shadow-sm"
                    style={{ backgroundColor: value }}
                  />
                </div>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => {
                    updateColor(key as keyof CSSColors, e.target.value);
                    if (key === 'primary') {
                      onColorChange(e.target.value);
                    }
                  }}
                  placeholder="oklch(0.559 0.238 307.331)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-mono"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-3">
            Format OKLCH: oklch(lightness chroma hue). Exemple: oklch(0.559 0.238 307.331)
          </p>
        </div>

        {hasChanges && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              Vous avez des modifications non sauvegardées. Cliquez sur &quot;Sauvegarder les
              couleurs&quot; pour appliquer les changements.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
