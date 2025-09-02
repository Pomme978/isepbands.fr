'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Monitor, Smartphone, Tablet } from 'lucide-react';

interface EmailTemplate {
  id?: number;
  name: string;
  subject: string;
  htmlContent: string;
  templateType: string;
}

interface TemplatePreviewModalProps {
  template: EmailTemplate;
  isOpen: boolean;
  onClose: () => void;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export const TemplatePreviewModal = ({ template, isOpen, onClose }: TemplatePreviewModalProps) => {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');

  if (!isOpen || !template) return null;

  // Variables d'exemple pour la prévisualisation
  const sampleVariables = {
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    resetUrl: 'https://isepbands.fr/reset-password?token=example',
    temporaryPassword: 'temp123456',
    reason: 'Profil incomplet',
    title: 'Newsletter ISEP Bands',
    content: '<p class="text-gray-600">Contenu de la newsletter avec toutes les actualités musicales...</p>',
    unsubscribeUrl: 'https://isepbands.fr/unsubscribe',
    date: new Date().toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    ctaText: 'Voir plus',
    ctaUrl: 'https://isepbands.fr'
  };

  const renderPreview = () => {
    let htmlContent = template.htmlContent;
    
    // Remplacer les variables par les valeurs d'exemple
    Object.entries(sampleVariables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      htmlContent = htmlContent.replace(regex, value);
    });

    return htmlContent;
  };

  const getViewportStyles = () => {
    switch (viewport) {
      case 'mobile':
        return { width: '375px', height: '600px' };
      case 'tablet':
        return { width: '768px', height: '600px' };
      default:
        return { width: '100%', height: '600px' };
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Aperçu du template</h2>
            <p className="text-gray-600 mt-1">{template.name}</p>
            <p className="text-sm text-gray-500">Sujet: {template.subject}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Vue :</span>
              <Button
                variant={viewport === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewport('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={viewport === 'tablet' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewport('tablet')}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={viewport === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewport('mobile')}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 p-6 flex items-start justify-center overflow-auto bg-gray-100">
          <div
            className="bg-white shadow-lg border transition-all duration-300"
            style={getViewportStyles()}
          >
            <iframe
              className="w-full h-full border-0"
              srcDoc={`
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                      body { margin: 0; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
                    </style>
                  </head>
                  <body>
                    ${renderPreview()}
                  </body>
                </html>
              `}
              title="Email Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewModal;