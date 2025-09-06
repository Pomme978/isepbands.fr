'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import AdminDetailLayout from '@/components/admin/common/AdminDetailLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  Send,
  Users,
  FileText,
  Plus,
  Edit3,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  UserCheck,
  Archive,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import Loading from '@/components/ui/Loading';
import { toast } from 'sonner';
import DeleteConfirmModal from '@/components/admin/common/DeleteConfirmModal';
import EmailTemplateEditor from '@/components/admin/newsletter/EmailTemplateEditor';
import EmailTestModal from '@/components/admin/newsletter/EmailTestModal';
import TemplatePreviewModal from '@/components/admin/newsletter/TemplatePreviewModal';

interface Subscriber {
  id: number;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  source?: string;
  hasAccount?: boolean;
  isArchived?: boolean;
}

interface EmailTemplate {
  id: number;
  name: string;
  description?: string;
  subject: string;
  templateType: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    firstName: string;
  };
}

interface Newsletter {
  id: number;
  title: string;
  description?: string;
  subject: string;
  status: string;
  scheduledAt?: string;
  sentAt?: string;
  recipientCount: number;
  openCount: number;
  clickCount: number;
  createdAt: string;
}

interface NewsletterStats {
  totalSubscribers: number;
  activeSubscribers: number;
  totalNewsletters: number;
  totalTemplates: number;
  totalEmailsSent: number;
  averageOpenRate: number;
}

const TABS = [
  { id: 'overview', label: "Vue d'ensemble", mobileLabel: 'Overview', icon: Users },
  { id: 'subscribers', label: 'Abonnés', icon: Users },
  { id: 'templates', label: 'Templates', icon: FileText },
  { id: 'newsletters', label: 'Newsletters', icon: Mail },
];

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddSubscriberModal, setShowAddSubscriberModal] = useState(false);
  const [newSubscriberEmail, setNewSubscriberEmail] = useState('');
  const [isAddingSubscriber, setIsAddingSubscriber] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<Subscriber | null>(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [subscriberToArchive, setSubscriberToArchive] = useState<Subscriber | null>(null);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [showDeleteTemplateModal, setShowDeleteTemplateModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<EmailTemplate | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, subscribersRes, templatesRes, newslettersRes] = await Promise.all([
        fetch('/api/admin/newsletter/stats'),
        fetch('/api/admin/newsletter/subscribers'),
        fetch('/api/admin/newsletter/templates'),
        fetch('/api/admin/newsletter/newsletters'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      if (subscribersRes.ok) {
        const subscribersData = await subscribersRes.json();
        setSubscribers(subscribersData.subscribers || []);
      }

      if (templatesRes.ok) {
        const templatesData = await templatesRes.json();
        setTemplates(templatesData.templates || []);
      }

      if (newslettersRes.ok) {
        const newslettersData = await newslettersRes.json();
        setNewsletters(newslettersData.newsletters || []);
      }
    } catch (error) {
      console.error('Error fetching newsletter data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Primary actions
  const primaryActions = [
    {
      label: 'Nouvelle Newsletter',
      mobileLabel: 'Newsletter',
      icon: Send,
      onClick: () => {},
      variant: 'primary' as const,
    },
  ];

  // Secondary actions
  const secondaryActions = [
    {
      label: 'Nouveau Template',
      mobileLabel: 'Template',
      icon: FileText,
      onClick: () => {
        setSelectedTemplate(null);
        setShowTemplateEditor(true);
      },
      variant: 'secondary' as const,
    },
  ];

  const handleDeleteSubscriber = (subscriber: Subscriber) => {
    setSubscriberToDelete(subscriber);
    setShowDeleteModal(true);
  };

  const confirmDeleteSubscriber = async () => {
    if (!subscriberToDelete) return;

    try {
      const response = await fetch(
        `/api/admin/newsletter/subscribers?id=${subscriberToDelete.id}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success('Abonné supprimé avec succès');
        fetchData();
      } else {
        toast.error(data.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast.error("Erreur lors de la suppression de l'abonné");
    }
  };

  const handleToggleSubscriberStatus = async (subscriber: Subscriber) => {
    try {
      const response = await fetch(`/api/admin/newsletter/subscribers/${subscriber.id}/toggle`, {
        method: 'PUT',
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Abonné ${subscriber.isActive ? 'désactivé' : 'activé'} avec succès`);
        fetchData();
      } else {
        toast.error(data.error || 'Erreur lors de la modification du statut');
      }
    } catch (error) {
      console.error('Error toggling subscriber status:', error);
      toast.error('Erreur lors de la modification du statut');
    }
  };

  const handleArchiveSubscriber = (subscriber: Subscriber) => {
    setSubscriberToArchive(subscriber);
    setShowArchiveModal(true);
  };

  const confirmArchiveSubscriber = async () => {
    if (!subscriberToArchive) return;

    try {
      const response = await fetch(
        `/api/admin/newsletter/subscribers/${subscriberToArchive.id}/archive`,
        {
          method: 'PUT',
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success('Abonné archivé avec succès');
        fetchData();
      } else {
        toast.error(data.error || "Erreur lors de l'archivage");
      }
    } catch (error) {
      console.error('Error archiving subscriber:', error);
      toast.error("Erreur lors de l'archivage de l'abonné");
    }
  };

  const handleAddSubscriber = async () => {
    if (!newSubscriberEmail || !newSubscriberEmail.includes('@')) {
      toast.error('Veuillez entrer un email valide');
      return;
    }

    setIsAddingSubscriber(true);
    try {
      const response = await fetch('/api/admin/newsletter/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newSubscriberEmail,
          source: 'admin',
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Abonné ajouté avec succès');
        setShowAddSubscriberModal(false);
        setNewSubscriberEmail('');
        fetchData();
      } else {
        toast.error(data.error || "Erreur lors de l'ajout");
      }
    } catch (error) {
      console.error('Error adding subscriber:', error);
      toast.error("Erreur lors de l'ajout de l'abonné");
    } finally {
      setIsAddingSubscriber(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SENT':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'SENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'SENT':
        return 'Envoyée';
      case 'DRAFT':
        return 'Brouillon';
      case 'SCHEDULED':
        return 'Programmée';
      case 'SENDING':
        return "En cours d'envoi";
      case 'FAILED':
        return 'Échoué';
      default:
        return status;
    }
  };

  const getTemplateTypeColor = (type: string) => {
    switch (type) {
      case 'NEWSLETTER':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'SYSTEM':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'TRANSACTIONAL':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CUSTOM':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTemplateTypeIcon = (type: string) => {
    switch (type) {
      case 'NEWSLETTER':
        return <Mail className="w-4 h-4" />;
      case 'SYSTEM':
        return <AlertCircle className="w-4 h-4" />;
      case 'TRANSACTIONAL':
        return <CheckCircle className="w-4 h-4" />;
      case 'CUSTOM':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTemplateTypeLabel = (type: string) => {
    switch (type) {
      case 'NEWSLETTER':
        return 'Newsletter';
      case 'SYSTEM':
        return 'Système';
      case 'TRANSACTIONAL':
        return 'Transactionnel';
      case 'CUSTOM':
        return 'Personnalisé';
      default:
        return type;
    }
  };

  const handleSaveTemplate = async (templateData: EmailTemplate) => {
    try {
      const url = templateData.id
        ? `/api/admin/newsletter/templates/${templateData.id}`
        : '/api/admin/newsletter/templates';

      const method = templateData.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(templateData.id ? 'Template mis à jour' : 'Template créé avec succès');
        setShowTemplateEditor(false);
        setSelectedTemplate(null);
        fetchData();
      } else {
        throw new Error(data.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      throw error;
    }
  };

  const handlePreviewTemplate = (template: EmailTemplate) => {
    setPreviewTemplate(template);
    setShowPreviewModal(true);
  };

  const handleDeleteTemplate = (template: EmailTemplate) => {
    if (template.templateType === 'SYSTEM' && template.isDefault) {
      toast.error('Les templates système par défaut ne peuvent pas être supprimés');
      return;
    }
    setTemplateToDelete(template);
    setShowDeleteTemplateModal(true);
  };

  const confirmDeleteTemplate = async () => {
    if (!templateToDelete) return;

    try {
      const response = await fetch(`/api/admin/newsletter/templates/${templateToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Template supprimé avec succès');
        setShowDeleteTemplateModal(false);
        setTemplateToDelete(null);
        fetchData();
      } else {
        toast.error(data.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Erreur lors de la suppression du template');
    }
  };

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Newsletters récentes</CardTitle>
          <CardDescription>Dernières campagnes envoyées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {newsletters.slice(0, 5).map((newsletter) => (
              <div
                key={newsletter.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{newsletter.title}</h4>
                  <p className="text-sm text-gray-600">
                    {newsletter.recipientCount} destinataires
                  </p>
                </div>
                <Badge className={getStatusColor(newsletter.status)}>
                  {getStatusLabel(newsletter.status)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>Gérez vos emails et templates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Créer un nouveau template
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <Send className="w-4 h-4 mr-2" />
            Envoyer une newsletter
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <Users className="w-4 h-4 mr-2" />
            Gérer les abonnés
          </Button>
          <Button
            className="w-full justify-start"
            variant="outline"
            onClick={() => setShowTestModal(true)}
          >
            <Send className="w-4 h-4 mr-2" />
            Tester les emails
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderSubscribersTab = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Abonnés Newsletter</CardTitle>
          <CardDescription>{subscribers.length} abonnés au total</CardDescription>
        </div>
        <Button size="sm" onClick={() => setShowAddSubscriberModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subscribers.slice(0, 10).map((subscriber) => (
            <div
              key={subscriber.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${subscriber.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                />
                <div>
                  <p className="font-medium">{subscriber.email}</p>
                  <p className="text-sm text-gray-600">
                    Inscrit le{' '}
                    {new Date(subscriber.subscribedAt).toLocaleDateString('fr-FR')} à{' '}
                    {new Date(subscriber.subscribedAt).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    subscriber.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }
                >
                  {subscriber.isActive ? 'Actif' : 'Inactif'}
                </Badge>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2"
                    onClick={() => handleToggleSubscriberStatus(subscriber)}
                    title={subscriber.isActive ? "Désactiver l'abonné" : "Activer l'abonné"}
                  >
                    {subscriber.isActive ? (
                      <ToggleRight className="w-3 h-3 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-3 h-3 text-gray-400" />
                    )}
                  </Button>

                  {subscriber.hasAccount ? (
                    <div className="h-6 px-2 flex items-center">
                      <UserCheck
                        className="w-3 h-3 text-blue-500"
                        title="A un compte utilisateur"
                      />
                    </div>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2"
                        onClick={() => handleArchiveSubscriber(subscriber)}
                        title="Archiver l'abonné"
                      >
                        <Archive className="w-3 h-3 text-orange-500" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2"
                        onClick={() => handleDeleteSubscriber(subscriber)}
                        title="Supprimer l'abonné"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderTemplatesTab = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Templates d&apos;Emails</CardTitle>
          <CardDescription>{templates.length} templates disponibles</CardDescription>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setSelectedTemplate(null);
            setShowTemplateEditor(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Template
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {['SYSTEM', 'NEWSLETTER', 'TRANSACTIONAL', 'CUSTOM'].map((type) => {
            const templatesByType = templates.filter((t) => t.templateType === type);
            if (templatesByType.length === 0) return null;

            return (
              <div key={type} className="space-y-3">
                <div className="flex items-center gap-3 pb-2 border-b">
                  <div className={`p-2 rounded-lg ${getTemplateTypeColor(type)}`}>
                    {getTemplateTypeIcon(type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{getTemplateTypeLabel(type)}</h3>
                    <p className="text-sm text-gray-600">
                      {type === 'SYSTEM' &&
                        'Templates pour les emails système (bienvenue, mot de passe, etc.)'}
                      {type === 'NEWSLETTER' && 'Templates pour les campagnes newsletter'}
                      {type === 'TRANSACTIONAL' &&
                        'Templates pour les emails transactionnels'}
                      {type === 'CUSTOM' && 'Templates personnalisés'}
                    </p>
                  </div>
                  <Badge variant="default" className="ml-auto">
                    {templatesByType.length} template{templatesByType.length > 1 ? 's' : ''}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templatesByType.map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base flex items-center gap-2">
                              {template.name}
                              {template.isDefault && (
                                <Badge variant="default" className="text-xs px-1.5 py-0.5">
                                  Défaut
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {template.description || 'Aucune description'}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="p-2 bg-gray-50 rounded text-sm">
                            <span className="text-gray-600">Sujet:</span> {template.subject}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge
                                className={
                                  template.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }
                              >
                                {template.isActive ? 'Actif' : 'Inactif'}
                              </Badge>
                              {template.createdBy && (
                                <span className="text-xs text-gray-500">
                                  par {template.createdBy.firstName}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                title="Aperçu"
                                onClick={() => handlePreviewTemplate(template)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                title="Modifier"
                                onClick={() => {
                                  setSelectedTemplate(template);
                                  setShowTemplateEditor(true);
                                }}
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              {template.templateType !== 'SYSTEM' && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  title="Supprimer"
                                  onClick={() => handleDeleteTemplate(template)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}

          {templates.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun template d&apos;email trouvé</p>
              <Button
                className="mt-4"
                onClick={() => {
                  setSelectedTemplate(null);
                  setShowTemplateEditor(true);
                }}
              >
                Créer votre premier template
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderNewslettersTab = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Campagnes Newsletter</CardTitle>
          <CardDescription>{newsletters.length} newsletters créées</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Newsletter
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newsletters.map((newsletter) => (
            <Card key={newsletter.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{newsletter.title}</h4>
                      <Badge className={getStatusColor(newsletter.status)}>
                        {getStatusLabel(newsletter.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{newsletter.subject}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span>{newsletter.recipientCount} destinataires</span>
                      <span>{newsletter.openCount} ouvertures</span>
                      <span>{newsletter.clickCount} clics</span>
                      {newsletter.sentAt && (
                        <span>
                          Envoyé le{' '}
                          {new Date(newsletter.sentAt).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    {newsletter.status === 'DRAFT' && (
                      <Button size="sm">
                        <Send className="w-4 h-4 mr-2" />
                        Envoyer
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'subscribers':
        return renderSubscribersTab();
      case 'templates':
        return renderTemplatesTab();
      case 'newsletters':
        return renderNewslettersTab();
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <Loading text="Chargement des données newsletter..." size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Statistics Cards - Keep at top */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Abonnés actifs</p>
                  <p className="text-3xl font-bold">{stats.activeSubscribers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Templates</p>
                  <p className="text-3xl font-bold">{stats.totalTemplates}</p>
                </div>
                <FileText className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Newsletters envoyées</p>
                  <p className="text-3xl font-bold">{stats.totalNewsletters}</p>
                </div>
                <Mail className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <AdminDetailLayout
        backHref="/admin"
        backLabel="Back to Dashboard"
        backMobileLabel="Dashboard"
        itemInfo={{
          title: "Newsletter & Emails",
          subtitle: "Gérez vos abonnés, templates d'emails et campagnes newsletter",
        }}
        primaryActions={primaryActions}
        secondaryActions={secondaryActions}
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {renderTabContent()}
      </AdminDetailLayout>

      {/* Modal d'ajout d'abonné */}
      {showAddSubscriberModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Ajouter un abonné</h3>
              <Input
                type="email"
                value={newSubscriberEmail}
                onChange={(e) => setNewSubscriberEmail(e.target.value)}
                placeholder="Email de l'abonné"
                onKeyPress={(e) => e.key === 'Enter' && handleAddSubscriber()}
              />
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddSubscriberModal(false);
                    setNewSubscriberEmail('');
                  }}
                  disabled={isAddingSubscriber}
                >
                  Annuler
                </Button>
                <Button onClick={handleAddSubscriber} disabled={isAddingSubscriber}>
                  {isAddingSubscriber ? (
                    <Loading text="Ajout..." size="sm" variant="spinner" theme="white" />
                  ) : (
                    'Ajouter'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSubscriberToDelete(null);
        }}
        onConfirm={confirmDeleteSubscriber}
        title="Supprimer l'abonné"
        description="Cette action est irréversible. L'abonné sera définitivement supprimé de la liste de diffusion."
        itemName={subscriberToDelete?.email || ''}
        confirmButtonText="Supprimer l'abonné"
      />

      {/* Éditeur de templates */}
      {showTemplateEditor && (
        <EmailTemplateEditor
          template={selectedTemplate}
          onSave={handleSaveTemplate}
          onClose={() => {
            setShowTemplateEditor(false);
            setSelectedTemplate(null);
          }}
        />
      )}

      {/* Modal de test d'emails */}
      <EmailTestModal isOpen={showTestModal} onClose={() => setShowTestModal(false)} />

      {/* Modal de prévisualisation */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setPreviewTemplate(null);
        }}
      />

      {/* Modal de confirmation de suppression de template */}
      <DeleteConfirmModal
        isOpen={showDeleteTemplateModal}
        onClose={() => {
          setShowDeleteTemplateModal(false);
          setTemplateToDelete(null);
        }}
        onConfirm={confirmDeleteTemplate}
        title="Supprimer le template"
        description="Cette action est irréversible. Le template sera définitivement supprimé."
        itemName={templateToDelete?.name || ''}
        confirmButtonText="Supprimer le template"
      />

      {/* Modal de confirmation d'archivage */}
      <DeleteConfirmModal
        isOpen={showArchiveModal}
        onClose={() => {
          setShowArchiveModal(false);
          setSubscriberToArchive(null);
        }}
        onConfirm={confirmArchiveSubscriber}
        title="Archiver l'abonné"
        description="L'abonné sera désactivé et ne recevra plus les newsletters. Cette action peut être annulée en réactivant l'abonné."
        itemName={subscriberToArchive?.email || ''}
        confirmButtonText="Archiver l'abonné"
      />
    </AdminLayout>
  );
}