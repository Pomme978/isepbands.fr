'use client';

import { useEffect, useState } from 'react';
import { FileText, Building2 } from 'lucide-react';
import Loading from '@/components/ui/Loading';

interface LegalMentions {
  presidentName: string;
  contactEmail: string;
  technicalEmail: string;
  associationAddress?: string;
  hostingProvider?: string;
  hostingAddress?: string;
  hostingPhone?: string;
  hostingEmail?: string;
  domainProvider?: string;
  domainAddress?: string;
  domainPhone?: string;
  developmentTeam?: string;
  designTeam?: string;
}

interface LegalTabProps {
  onDataChange: (data: LegalMentions, isInitialLoad?: boolean) => void;
  onError: (message: string) => void;
}

export default function LegalTab({ onDataChange, onError }: LegalTabProps) {
  const [legalMentions, setLegalMentions] = useState<LegalMentions>({
    presidentName: '',
    contactEmail: 'contact@isepbands.fr',
    technicalEmail: 'tech@isepbands.fr',
    hostingProvider: '',
    hostingAddress: '',
    hostingPhone: '',
    hostingEmail: '',
    domainProvider: '',
    domainAddress: '',
    domainPhone: '',
    developmentTeam: '',
    designTeam: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLegalMentions();
  }, []);

  const loadLegalMentions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/legal-mentions');
      if (response.ok) {
        const data = await response.json();
        setLegalMentions(data);
        // Appeler onDataChange avec isInitialLoad=true pour initialiser les données parentes sans marquer comme modifié
        onDataChange(data, true);
      }
    } catch (error) {
      console.error('Failed to load legal mentions:', error);
      onError('Erreur lors du chargement des mentions légales');
    } finally {
      setLoading(false);
    }
  };

  const updateLegalMentions = (updates: Partial<LegalMentions>) => {
    // Ne pas permettre la modification du nom du président (il est automatique)
    const { presidentName, ...validUpdates } = updates;
    const newData = { ...legalMentions, ...validUpdates };
    setLegalMentions(newData);
    onDataChange(newData);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loading text="Chargement des mentions légales..." size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold">Mentions légales</h2>
      </div>

      <div className="space-y-6">
        {/* Association Information */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-primary" />
            Informations de l'association
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Nom du président
              </label>
              <input
                type="text"
                value={legalMentions.presidentName}
                readOnly
                placeholder="Récupéré automatiquement du user avec le rôle Président"
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email de contact *
              </label>
              <input
                type="email"
                value={legalMentions.contactEmail}
                onChange={(e) => updateLegalMentions({ contactEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Adresse de l'association *
              </label>
              <textarea
                value={legalMentions.associationAddress || 'Campus de l\'ISEP, 28 rue Notre-Dame des Champs, 75006 Paris, France'}
                onChange={(e) => updateLegalMentions({ associationAddress: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Adresse complète de l'association"
              />
            </div>
          </div>
        </div>

        {/* Hosting Information */}
        <div className="border-t pt-6">
          <h3 className="font-medium text-gray-900 mb-4">Informations d&apos;hébergement</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Nom de l&apos;hébergeur
              </label>
              <input
                type="text"
                value={legalMentions.hostingProvider || ''}
                onChange={(e) => updateLegalMentions({ hostingProvider: e.target.value })}
                placeholder="Ex: OVH, Scaleway..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email hébergeur
              </label>
              <input
                type="email"
                value={legalMentions.hostingEmail || ''}
                onChange={(e) => updateLegalMentions({ hostingEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Adresse hébergeur
              </label>
              <textarea
                value={legalMentions.hostingAddress || ''}
                onChange={(e) => updateLegalMentions({ hostingAddress: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Adresse complète de l'hébergeur"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Téléphone hébergeur
              </label>
              <input
                type="tel"
                value={legalMentions.hostingPhone || ''}
                onChange={(e) => updateLegalMentions({ hostingPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Domain Information */}
        <div className="border-t pt-6">
          <h3 className="font-medium text-gray-900 mb-4">Fournisseur de domaine</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Nom du registrar
              </label>
              <input
                type="text"
                value={legalMentions.domainProvider || ''}
                onChange={(e) => updateLegalMentions({ domainProvider: e.target.value })}
                placeholder="Ex: Gandi, OVH..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Téléphone registrar
              </label>
              <input
                type="tel"
                value={legalMentions.domainPhone || ''}
                onChange={(e) => updateLegalMentions({ domainPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Adresse registrar
              </label>
              <textarea
                value={legalMentions.domainAddress || ''}
                onChange={(e) => updateLegalMentions({ domainAddress: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Adresse complète du registrar"
              />
            </div>
          </div>
        </div>

        {/* Site Development */}
        <div className="border-t pt-6">
          <h3 className="font-medium text-gray-900 mb-4">Développement du site</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Réalisé par
              </label>
              <input
                type="text"
                value="SOLYZON.COM"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                À destination de
              </label>
              <input
                type="text"
                value="ISEP Bands"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Équipe développement & design
              </label>
              <input
                type="text"
                value="Armand OCTEAU, Sarah LÉVY"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Technical Contact */}
        <div className="border-t pt-6">
          <h3 className="font-medium text-gray-900 mb-4">Contacts techniques</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Pour les questions techniques et problèmes du site :</strong>
            </p>
            <div className="space-y-1 text-sm text-blue-700">
              <div>• armand@solyzon.com</div>
              <div>• sarah@solyzon.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
