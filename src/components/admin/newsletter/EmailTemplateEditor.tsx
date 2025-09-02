'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, Save, RefreshCw, Monitor, Smartphone, Tablet, Code, X } from 'lucide-react';
import { toast } from 'sonner';
import Loading from '@/components/ui/Loading';

interface EmailTemplate {
  id?: number;
  name: string;
  description?: string;
  subject: string;
  htmlContent: string;
  cssContent?: string;
  variables?: any;
  templateType: 'NEWSLETTER' | 'SYSTEM' | 'TRANSACTIONAL' | 'CUSTOM';
  isActive: boolean;
  isDefault: boolean;
}

interface EmailTemplateEditorProps {
  template?: EmailTemplate;
  onSave: (template: EmailTemplate) => void;
  onClose: () => void;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export const EmailTemplateEditor = ({ template, onSave, onClose }: EmailTemplateEditorProps) => {
  const [formData, setFormData] = useState<EmailTemplate>({
    name: '',
    description: '',
    subject: '',
    htmlContent: '',
    cssContent: '',
    variables: {},
    templateType: 'CUSTOM',
    isActive: true,
    isDefault: false,
    ...template,
  });
  
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Variables d'exemple pour la prévisualisation
  const [sampleVariables] = useState({
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    resetUrl: 'https://isepbands.fr/reset-password?token=example',
    temporaryPassword: 'temp123456',
    reason: 'Profil incomplet',
    title: 'Titre de la newsletter',
    content: '<p>Contenu de la newsletter...</p>',
    unsubscribeUrl: 'https://isepbands.fr/unsubscribe',
  });

  const handleInputChange = (field: keyof EmailTemplate, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.subject.trim() || !formData.htmlContent.trim()) {
      toast.error('Veuillez remplir les champs obligatoires (nom, sujet, contenu HTML)');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      toast.success('Template sauvegardé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const renderPreview = () => {
    let htmlContent = formData.htmlContent;
    
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

  const templateTypeLabels = {
    NEWSLETTER: 'Newsletter',
    SYSTEM: 'Système',
    TRANSACTIONAL: 'Transactionnel',
    CUSTOM: 'Personnalisé',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {template ? 'Modifier le template' : 'Nouveau template'}
            </h2>
            <p className="text-gray-600 mt-1">
              Créez et modifiez vos templates d'emails avec prévisualisation en temps réel
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {isPreviewMode ? 'Mode Édition' : 'Prévisualisation'}
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
              {isSaving ? (
                <Loading text="Sauvegarde..." size="sm" variant="spinner" theme="white" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Form & Code */}
          <div className={`${isPreviewMode ? 'w-1/2' : 'w-full'} border-r flex flex-col`}>
            {/* Template Info */}
            <div className="p-4 border-b bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom du template *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Nom du template"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <Select
                    value={formData.templateType}
                    onValueChange={(value) => handleInputChange('templateType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(templateTypeLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Sujet *</label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="Sujet de l'email"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Input
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Description du template"
                  />
                </div>
              </div>
            </div>

            {/* HTML Editor */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="border-b bg-white">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    <span className="font-medium">Contenu HTML</span>
                    <Badge variant="default" className="text-xs">
                      Tailwind CSS supporté
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Variables: name, email, resetUrl, temporaryPassword, reason, unsubscribeUrl
                    </Badge>
                  </div>
                </div>
              </div>

              {/* HTML Content */}
              <div className="flex-1 overflow-hidden">
                <textarea
                  value={formData.htmlContent}
                  onChange={(e) => handleInputChange('htmlContent', e.target.value)}
                  placeholder={`Contenu HTML de votre email (Tailwind CSS supporté)...

Exemple avec Tailwind:
<div class="max-w-2xl mx-auto bg-white p-6">
  <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ name }}</h1>
  <p class="text-gray-600 leading-relaxed">Votre contenu ici...</p>
  <a href="{{ resetUrl }}" class="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
    Bouton d'action
  </a>
</div>

Variables disponibles: {{ name }}, {{ email }}, {{ resetUrl }}, {{ temporaryPassword }}, etc.`}
                  className="w-full h-full font-mono text-sm border-0 p-4 resize-none focus:ring-0 focus:outline-none overflow-auto"
                  style={{ 
                    lineHeight: '1.6',
                    tabSize: '2',
                    fontFamily: 'Monaco, Consolas, "Lucida Console", monospace'
                  }}
                  spellCheck={false}
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          {isPreviewMode && (
            <div className="w-1/2 flex flex-col bg-gray-100">
              {/* Viewport Controls */}
              <div className="p-4 bg-white border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Aperçu :</span>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Force refresh iframe
                    const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
                    if (iframe) {
                      iframe.src = iframe.src;
                    }
                  }}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>

              {/* Preview Content */}
              <div className="flex-1 p-4 flex items-start justify-center overflow-auto">
                <div
                  className="bg-white shadow-lg border transition-all duration-300"
                  style={getViewportStyles()}
                >
                  <iframe
                    id="preview-iframe"
                    className="w-full h-full border-0"
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <meta charset="utf-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1">
                          <script src="https://cdn.tailwindcss.com"></script>
                          <style>
                            body { margin: 0; padding: 16px; }
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
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateEditor;