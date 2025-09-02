'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import Loading from '@/components/ui/Loading';

interface EmailTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type EmailType = 'test' | 'welcome' | 'password-reset' | 'approval' | 'rejection';

const emailTypes: Record<EmailType, { label: string; description: string; fields?: string[] }> = {
  test: {
    label: 'Email de test basique',
    description: 'Email simple pour tester la configuration',
  },
  welcome: {
    label: 'Email de bienvenue',
    description: 'Email envoyé lors de la création d\'un compte',
    fields: ['name', 'temporaryPassword'],
  },
  'password-reset': {
    label: 'Réinitialisation mot de passe',
    description: 'Email pour réinitialiser le mot de passe',
    fields: ['name'],
  },
  approval: {
    label: 'Compte approuvé',
    description: 'Email de validation d\'inscription',
    fields: ['name'],
  },
  rejection: {
    label: 'Compte rejeté',
    description: 'Email de rejet d\'inscription',
    fields: ['name', 'reason'],
  },
};

export const EmailTestModal = ({ isOpen, onClose }: EmailTestModalProps) => {
  const [formData, setFormData] = useState({
    to: '',
    type: 'test' as EmailType,
    name: 'Utilisateur Test',
    temporaryPassword: 'TestPass123!',
    reason: 'Profil incomplet',
  });
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendTest = async () => {
    if (!formData.to || !formData.to.includes('@')) {
      toast.error('Veuillez entrer un email valide');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        onClose();
      } else {
        toast.error(data.error || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Erreur lors de l\'envoi de l\'email de test');
    } finally {
      setIsSending(false);
    }
  };

  const selectedType = emailTypes[formData.type];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Test d'envoi d'email</h3>
                <p className="text-sm text-gray-600">Testez la configuration email</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Email destinataire */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email destinataire *
              </label>
              <Input
                type="email"
                value={formData.to}
                onChange={(e) => handleInputChange('to', e.target.value)}
                placeholder="test@example.com"
                className="w-full"
              />
            </div>

            {/* Type d'email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Type d'email
              </label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(emailTypes).map(([key, type]) => (
                    <SelectItem key={key} value={key}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Champs dynamiques selon le type */}
            {selectedType.fields && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Données de test</CardTitle>
                  <CardDescription>
                    Variables utilisées pour ce type d'email
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedType.fields.includes('name') && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Nom
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Nom de l'utilisateur"
                      />
                    </div>
                  )}
                  
                  {selectedType.fields.includes('temporaryPassword') && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Mot de passe temporaire
                      </label>
                      <Input
                        value={formData.temporaryPassword}
                        onChange={(e) => handleInputChange('temporaryPassword', e.target.value)}
                        placeholder="Mot de passe temporaire"
                      />
                    </div>
                  )}
                  
                  {selectedType.fields.includes('reason') && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Raison du rejet
                      </label>
                      <Input
                        value={formData.reason}
                        onChange={(e) => handleInputChange('reason', e.target.value)}
                        placeholder="Raison du rejet"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Boutons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose} disabled={isSending}>
                Annuler
              </Button>
              <Button onClick={handleSendTest} disabled={isSending} className="flex items-center gap-2">
                {isSending ? (
                  <Loading text="Envoi..." size="sm" variant="spinner" theme="white" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Envoyer le test
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTestModal;