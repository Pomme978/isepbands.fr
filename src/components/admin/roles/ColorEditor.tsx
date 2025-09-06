'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Loading from '@/components/ui/Loading';
import { X, Palette, RotateCcw } from 'lucide-react';
import { getRoleColor } from '@/utils/roleColors';

interface ColorEditorProps {
  roleId: number;
  roleName: string;
  currentGradientStart?: string;
  currentGradientEnd?: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (gradientStart: string, gradientEnd: string) => Promise<void>;
}

// Predefined gradient presets - matching roleColors.ts exactly
const GRADIENT_PRESETS = [
  {
    name: 'Président Royal',
    start: '#dc2626', // red-600
    end: '#991b1b', // red-800
  },
  {
    name: 'Vice-président Sophistiqué',
    start: '#7c3aed', // purple-600
    end: '#8b5cf6', // violet-600 (correct hex)
  },
  {
    name: 'Secrétaire Général Premium',
    start: '#eab308', // yellow-500
    end: '#f97316', // orange-500
  },
  {
    name: 'Trésorier Émeraude',
    start: '#059669', // green-600
    end: '#047857', // emerald-600
  },
  {
    name: 'Responsable Océan',
    start: '#2563eb', // blue-600
    end: '#0891b2', // cyan-600
  },
  {
    name: 'Défaut (Membre)',
    start: '#4b5563', // gray-600
    end: '#475569', // slate-600
  },
];

// Helper function to extract hex colors from roleColors.ts gradients
const extractColorsFromRole = (roleName: string): { start: string; end: string } => {
  const roleColors = getRoleColor(roleName);
  const gradientBg = roleColors.bg || '';

  // Extract colors from Tailwind gradient classes
  // This is a simplified mapping - in a real app, we'd need a complete Tailwind to hex mapping
  const colorMap: Record<string, string> = {
    'red-600': '#dc2626',
    'red-800': '#991b1b',
    'purple-600': '#7c3aed',
    'violet-600': '#8b5cf6',
    'yellow-500': '#eab308',
    'orange-500': '#f97316',
    'green-600': '#059669',
    'emerald-600': '#047857',
    'blue-600': '#2563eb',
    'cyan-600': '#0891b2',
    'gray-600': '#4b5563',
    'slate-600': '#475569',
  };

  // Try to extract from gradient class (simplified parsing)
  if (gradientBg.includes('from-red-600') && gradientBg.includes('to-red-800')) {
    return { start: colorMap['red-600'], end: colorMap['red-800'] };
  }
  if (gradientBg.includes('from-purple-600') && gradientBg.includes('to-violet-600')) {
    return { start: colorMap['purple-600'], end: colorMap['violet-600'] };
  }
  if (gradientBg.includes('from-yellow-500') && gradientBg.includes('to-orange-500')) {
    return { start: colorMap['yellow-500'], end: colorMap['orange-500'] };
  }
  if (gradientBg.includes('from-green-600') && gradientBg.includes('to-emerald-600')) {
    return { start: colorMap['green-600'], end: colorMap['emerald-600'] };
  }
  if (gradientBg.includes('from-blue-600') && gradientBg.includes('to-cyan-600')) {
    return { start: colorMap['blue-600'], end: colorMap['cyan-600'] };
  }
  if (gradientBg.includes('from-gray-600') && gradientBg.includes('to-slate-600')) {
    return { start: colorMap['gray-600'], end: colorMap['slate-600'] };
  }

  // Default fallback
  return { start: colorMap['gray-600'], end: colorMap['slate-600'] };
};

export default function ColorEditor({
  roleId,
  roleName,
  currentGradientStart,
  currentGradientEnd,
  isOpen,
  onClose,
  onSave,
}: ColorEditorProps) {
  // Use database colors if available, otherwise fallback to role configuration
  const defaultColors = extractColorsFromRole(roleName);

  const [gradientStart, setGradientStart] = useState(
    currentGradientStart || defaultColors.start
  );
  const [gradientEnd, setGradientEnd] = useState(
    currentGradientEnd || defaultColors.end
  );
  const [isLoading, setIsLoading] = useState(false);

  // Update state when props change (when opening modal with different role)
  React.useEffect(() => {
    if (isOpen) {
      console.log('🎨 ColorEditor Debug:', {
        roleId,
        roleName,
        currentGradientStart,
        currentGradientEnd,
        defaultColors,
      });
      setGradientStart(currentGradientStart || defaultColors.start);
      setGradientEnd(currentGradientEnd || defaultColors.end);
    }
  }, [isOpen, currentGradientStart, currentGradientEnd, roleName, roleId, defaultColors.start, defaultColors.end]);

  if (!isOpen) return null;

  const handlePresetClick = (preset: { start: string; end: string }) => {
    setGradientStart(preset.start);
    setGradientEnd(preset.end);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(gradientStart, gradientEnd);
      onClose();
    } catch (error) {
      console.error('Error saving colors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    const resetStart = currentGradientStart || defaultColors.start;
    const resetEnd = currentGradientEnd || defaultColors.end;
    console.log('🔄 Reset colors:', { resetStart, resetEnd, currentGradientStart, currentGradientEnd });
    setGradientStart(resetStart);
    setGradientEnd(resetEnd);
  };

  const previewStyle = {
    background: `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`,
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden"
      style={{ zIndex: 9999 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Palette className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Modifier les couleurs</h3>
              <p className="text-sm text-gray-500">ID: {roleId}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Role Preview */}
        <div className="mb-6">
          <Label className="text-sm font-medium mb-2 block">Aperçu du rôle</Label>
          <div className="p-4 border rounded-lg bg-gray-50">
            <span
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold text-white shadow-sm"
              style={previewStyle}
            >
              {roleName}
            </span>
          </div>
        </div>

        {/* Color Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="start-color" className="text-sm font-medium mb-2 block">
              Couleur de début
            </Label>
            <div className="flex gap-2">
              <Input
                id="start-color"
                type="color"
                value={gradientStart}
                onChange={(e) => setGradientStart(e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={gradientStart}
                onChange={(e) => setGradientStart(e.target.value)}
                placeholder="#dc2626"
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="end-color" className="text-sm font-medium mb-2 block">
              Couleur de fin
            </Label>
            <div className="flex gap-2">
              <Input
                id="end-color"
                type="color"
                value={gradientEnd}
                onChange={(e) => setGradientEnd(e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={gradientEnd}
                onChange={(e) => setGradientEnd(e.target.value)}
                placeholder="#991b1b"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Gradient Presets */}
        <div className="mb-6">
          <Label className="text-sm font-medium mb-3 block">Gradients prédéfinis</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {GRADIENT_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handlePresetClick(preset)}
                className="p-3 border rounded-lg hover:border-primary transition-colors group"
                title={preset.name}
              >
                <div
                  className="w-full h-8 rounded mb-2"
                  style={{
                    background: `linear-gradient(to right, ${preset.start}, ${preset.end})`,
                  }}
                />
                <p className="text-xs text-gray-600 group-hover:text-primary font-medium">
                  {preset.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <Loading size="sm" theme="white" text="Sauvegarde..." centered={false} />
              ) : (
                <>
                  <Palette className="h-4 w-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
