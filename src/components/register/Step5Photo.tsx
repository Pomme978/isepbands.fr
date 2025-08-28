import { RegistrationData } from '@/types/registration';
import { useI18n } from '@/locales/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { validateImageFile } from '@/utils/imageUpload';
import { Upload, X } from 'lucide-react';

interface Step5PhotoProps {
  data: RegistrationData;
  onChange: (fields: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step5Photo({ data, onChange, onNext, onBack }: Step5PhotoProps) {
  const t = useI18n();
  const [photoError, setPhotoError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file before storing
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setPhotoError(validation.error || 'Invalid file');
      return;
    }

    setPhotoError('');

    // Store file for upload when registration is submitted (not auto-upload)
    onChange({ profilePhoto: file });

    // Create preview using URL.createObjectURL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const removeImage = () => {
    // Clean up preview URL if it exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    onChange({ profilePhoto: undefined });
    setPhotoError('');
  };

  const validateAll = () => {
    if (!data.profilePhoto) {
      setPhotoError(t('validator.required'));
      return false;
    }
    return true;
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (validateAll()) onNext();
      }}
    >
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Photo de profil</h3>

        {/* Photo Upload Section */}
        <div className="flex items-start space-x-6">
          <div className="relative">
            {previewUrl || data.profilePhoto ? (
              <div className="relative">
                <img
                  src={
                    previewUrl || (data.profilePhoto ? URL.createObjectURL(data.profilePhoto) : '')
                  }
                  alt="Aperçu du profil"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-dashed border-gray-300 flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <input
              id="profilePhoto"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="profilePhoto"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 mr-2" />
              {previewUrl || data.profilePhoto ? 'Changer la photo' : 'Choisir une photo'}
            </label>
            <div className="mt-2 text-sm text-gray-600">
              <p className="mb-1">• Format recommandé : image carrée</p>
              <p className="mb-1">• Taille minimale : 200x200 pixels</p>
              <p className="mb-1">• Taille maximale : 5 MB</p>
              <p>• Formats acceptés : JPG, PNG, WebP</p>
            </div>
            {data.profilePhoto && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm text-blue-700">
                  Photo sélectionnée. Elle sera téléchargée lors de l&apos;inscription.
                </p>
              </div>
            )}
          </div>
        </div>

        {photoError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{photoError}</p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Votre identité visuelle</h4>
        <p className="text-sm text-blue-700">
          Ajoutez une belle photo de profil pour que les autres membres puissent vous reconnaître !
          Une photo souriante et professionnelle est idéale.
        </p>
      </div>

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
