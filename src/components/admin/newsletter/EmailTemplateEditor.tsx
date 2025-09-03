'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, Save, RefreshCw, Monitor, Smartphone, Tablet, Code, X } from 'lucide-react';
import { toast } from 'sonner';
import Loading from '@/components/ui/Loading';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <Loading text="Chargement de l'éditeur..." size="sm" />
    </div>
  ),
});

interface EmailTemplate {
  id?: number;
  name: string;
  description?: string;
  subject: string;
  htmlContent: string;
  cssContent?: string;
  variables?: Record<string, { type: string; description: string; required: boolean }>;
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
  const [previewKey, setPreviewKey] = useState(0);

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

  const handleInputChange = (field: keyof EmailTemplate, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Forcer le refresh de la preview quand le contenu HTML change
    if (field === 'htmlContent') {
      setPreviewKey((prev) => prev + 1);
    }
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
    let htmlContent = formData.htmlContent || '';

    // Si pas de contenu, afficher un message par défaut
    if (!htmlContent.trim()) {
      return `
        <div style="padding: 40px; text-align: center; color: #666; font-family: Arial, sans-serif;">
          <h3>Aperçu du template</h3>
          <p>Commencez à écrire du HTML dans l'éditeur pour voir l'aperçu ici.</p>
        </div>
      `;
    }

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
        return { width: '1024px', height: '600px' };
    }
  };

  const templateTypeLabels = {
    NEWSLETTER: 'Newsletter',
    SYSTEM: 'Système',
    TRANSACTIONAL: 'Transactionnel',
    CUSTOM: 'Personnalisé',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[95vw] h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {template ? 'Modifier le template' : 'Nouveau template'}
            </h2>
            <p className="text-gray-600 mt-1">
              Créez et modifiez vos templates d&apos;emails avec prévisualisation en temps réel
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsPreviewMode(!isPreviewMode);
                if (!isPreviewMode) {
                  // Forcer le refresh quand on ouvre la preview
                  setPreviewKey((prev) => prev + 1);
                }
              }}
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
          <div
            className="flex-1 border-r flex flex-col"
            style={{
              width: isPreviewMode
                ? `calc(100% - ${viewport === 'mobile' ? '420px' : viewport === 'tablet' ? '820px' : '1080px'})`
                : '100%',
            }}
          >
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
                  {formData.templateType === 'SYSTEM' ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={templateTypeLabels[formData.templateType]}
                        disabled
                        className="bg-gray-100"
                      />
                      <Badge variant="outline" className="text-xs text-gray-500">
                        Non modifiable
                      </Badge>
                    </div>
                  ) : (
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
                  )}
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
              <div className="border-b bg-gray-900">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-white" />
                    <span className="font-medium text-white">Éditeur HTML</span>
                    <Badge variant="secondary" className="text-xs bg-blue-600 text-white">
                      Tailwind CSS supporté
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                      Variables: name, email, resetUrl, temporaryPassword, reason, unsubscribeUrl
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1 overflow-hidden bg-[#1e1e1e]">
                <MonacoEditor
                  height="100%"
                  language="html"
                  value={formData.htmlContent}
                  onChange={(value) => handleInputChange('htmlContent', value || '')}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    lineHeight: 20,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: 'on',
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    renderLineHighlight: 'line',
                    contextmenu: true,
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: false,
                    cursorStyle: 'line',
                    automaticLayout: true,
                    folding: true,
                    foldingStrategy: 'indentation',
                    showFoldingControls: 'always',
                    unfoldOnClickAfterEndOfLine: false,
                    bracketPairColorization: {
                      enabled: true,
                    },
                    guides: {
                      indentation: true,
                    },
                    padding: { top: 16, bottom: 16 },
                    smoothScrolling: true,
                    cursorBlinking: 'blink',
                    renderWhitespace: 'selection',
                    dragAndDrop: true,
                  }}
                  onMount={(editor, monaco) => {
                    // Configuration HTML avec suggestions pour les variables
                    monaco.languages.setLanguageConfiguration('html', {
                      wordPattern:
                        /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
                    });

                    // Ajouter les snippets pour les variables
                    monaco.languages.registerCompletionItemProvider('html', {
                      provideCompletionItems: () => {
                        const suggestions = [
                          {
                            label: '{{ name }}',
                            kind: monaco.languages.CompletionItemKind.Variable,
                            insertText: '{{ name }}',
                            documentation: "Nom de l'utilisateur",
                          },
                          {
                            label: '{{ email }}',
                            kind: monaco.languages.CompletionItemKind.Variable,
                            insertText: '{{ email }}',
                            documentation: "Email de l'utilisateur",
                          },
                          {
                            label: '{{ resetUrl }}',
                            kind: monaco.languages.CompletionItemKind.Variable,
                            insertText: '{{ resetUrl }}',
                            documentation: 'URL de réinitialisation',
                          },
                          {
                            label: '{{ temporaryPassword }}',
                            kind: monaco.languages.CompletionItemKind.Variable,
                            insertText: '{{ temporaryPassword }}',
                            documentation: 'Mot de passe temporaire',
                          },
                          {
                            label: '{{ reason }}',
                            kind: monaco.languages.CompletionItemKind.Variable,
                            insertText: '{{ reason }}',
                            documentation: 'Raison du rejet',
                          },
                          {
                            label: '{{ unsubscribeUrl }}',
                            kind: monaco.languages.CompletionItemKind.Variable,
                            insertText: '{{ unsubscribeUrl }}',
                            documentation: 'URL de désabonnement',
                          },
                        ];
                        return { suggestions };
                      },
                    });

                    // Focus sur l'éditeur
                    editor.focus();
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          {isPreviewMode && (
            <div
              className="flex flex-col bg-gray-100"
              style={{
                width: viewport === 'mobile' ? '420px' : viewport === 'tablet' ? '820px' : '1080px',
                flexShrink: 0,
              }}
            >
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
                    // Force refresh preview
                    setPreviewKey((prev) => prev + 1);
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
                    key={previewKey}
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
                            body { 
                              margin: 0; 
                              padding: 16px; 
                              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                              background: #f9fafb;
                            }
                            .email-container {
                              max-width: 650px;
                              margin: 0 auto;
                              background: white;
                              border-radius: 8px;
                              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                              overflow: hidden;
                            }
                          </style>
                        </head>
                        <body>
                          <div class="email-container">
                            ${renderPreview()}
                          </div>
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
