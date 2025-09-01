'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Mail,
  Send,
  Users,
  FileText,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import Loading from '@/components/ui/Loading';

interface Subscriber {
  id: number;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  source?: string;
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

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
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

  const getTemplateTypeColor = (type: string) => {
    switch (type) {
      case 'NEWSLETTER':
        return 'bg-purple-100 text-purple-800';
      case 'SYSTEM':
        return 'bg-blue-100 text-blue-800';
      case 'TRANSACTIONAL':
        return 'bg-green-100 text-green-800';
      case 'CUSTOM':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Newsletter & Emails</h1>
            <p className="text-gray-600 mt-1">
              Gérez vos abonnés, templates d'emails et campagnes newsletter
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Nouveau Template
            </Button>
            <Button className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Nouvelle Newsletter
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Taux d'ouverture</p>
                    <p className="text-3xl font-bold">{stats.averageOpenRate.toFixed(1)}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="subscribers">Abonnés</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="newsletters">Newsletters</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Newsletters */}
              <Card>
                <CardHeader>
                  <CardTitle>Newsletters récentes</CardTitle>
                  <CardDescription>Dernières campagnes envoyées</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {newsletters.slice(0, 5).map((newsletter) => (
                      <div key={newsletter.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{newsletter.title}</h4>
                          <p className="text-sm text-gray-600">
                            {newsletter.recipientCount} destinataires
                          </p>
                        </div>
                        <Badge className={getStatusColor(newsletter.status)}>
                          {newsletter.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
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
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Voir les statistiques
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Subscribers Tab */}
          <TabsContent value="subscribers" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Abonnés Newsletter</CardTitle>
                  <CardDescription>
                    {subscribers.length} abonnés au total
                  </CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscribers.slice(0, 10).map((subscriber) => (
                    <div key={subscriber.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${subscriber.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <div>
                          <p className="font-medium">{subscriber.email}</p>
                          <p className="text-sm text-gray-600">
                            Inscrit le {new Date(subscriber.subscribedAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {subscriber.source && (
                          <Badge variant="secondary" className="text-xs">
                            {subscriber.source}
                          </Badge>
                        )}
                        <Badge className={subscriber.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {subscriber.isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Templates d'Emails</CardTitle>
                  <CardDescription>
                    {templates.length} templates disponibles
                  </CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau Template
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <Card key={template.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{template.name}</CardTitle>
                            <CardDescription>{template.description}</CardDescription>
                          </div>
                          <Badge className={getTemplateTypeColor(template.templateType)}>
                            {template.templateType}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {template.isDefault && (
                              <Badge variant="secondary" className="text-xs">
                                Par défaut
                              </Badge>
                            )}
                            <Badge className={template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {template.isActive ? 'Actif' : 'Inactif'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Newsletters Tab */}
          <TabsContent value="newsletters" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Campagnes Newsletter</CardTitle>
                  <CardDescription>
                    {newsletters.length} newsletters créées
                  </CardDescription>
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
                                {newsletter.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{newsletter.subject}</p>
                            <div className="flex items-center gap-6 text-sm text-gray-600">
                              <span>{newsletter.recipientCount} destinataires</span>
                              <span>{newsletter.openCount} ouvertures</span>
                              <span>{newsletter.clickCount} clics</span>
                              {newsletter.sentAt && (
                                <span>Envoyé le {new Date(newsletter.sentAt).toLocaleDateString('fr-FR')}</span>
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
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}