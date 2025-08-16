'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export function NotificationsSettings() {
  const eventNotifications = [
    {
      id: 'new-events',
      title: 'Nouveaux événements',
      description: 'Concerts, jams et autres événements ISEP Bands',
      enabled: true,
    },
    {
      id: 'event-reminders',
      title: "Rappels d'événements",
      description: 'Notifications 24h et 1h avant les événements',
      enabled: true,
    },
    {
      id: 'event-changes',
      title: "Modifications d'événements",
      description: "Changements d'horaire, lieu ou annulations",
      enabled: true,
    },
  ];

  const bandNotifications = [
    {
      id: 'band-invitations',
      title: 'Invitations de groupes',
      description: 'Nouvelles invitations à rejoindre un groupe',
      enabled: true,
    },
    {
      id: 'band-updates',
      title: 'Actualités des groupes',
      description: 'Nouvelles de vos groupes actuels',
      enabled: true,
    },
    {
      id: 'band-requests',
      title: 'Demandes de recrutement',
      description: 'Notifications quand un groupe vous contacte',
      enabled: false,
    },
  ];

  const generalNotifications = [
    {
      id: 'newsletter',
      title: 'Newsletter ISEP Bands',
      description: "Newsletter mensuelle de l'association",
      enabled: true,
    },
    {
      id: 'admin-announcements',
      title: 'Annonces importantes',
      description: 'Communications officielles du bureau',
      enabled: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos préférences de notifications par email
        </p>
      </div>

      {/* Événements */}
      <Card>
        <CardHeader>
          <CardTitle>Événements</CardTitle>
          <CardDescription>Notifications liées aux concerts, jams et événements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {eventNotifications.map((notification, index) => (
            <div key={notification.id}>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor={notification.id} className="text-base font-medium">
                    {notification.title}
                  </Label>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                </div>
                <Switch id={notification.id} defaultChecked={notification.enabled} />
              </div>
              {index < eventNotifications.length - 1 && <Separator className="mt-6" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Groupes */}
      <Card>
        <CardHeader>
          <CardTitle>Groupes de musique</CardTitle>
          <CardDescription>Notifications relatives à vos groupes et au recrutement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {bandNotifications.map((notification, index) => (
            <div key={notification.id}>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor={notification.id} className="text-base font-medium">
                    {notification.title}
                  </Label>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                </div>
                <Switch id={notification.id} defaultChecked={notification.enabled} />
              </div>
              {index < bandNotifications.length - 1 && <Separator className="mt-6" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Communications générales */}
      <Card>
        <CardHeader>
          <CardTitle>Communications générales</CardTitle>
          <CardDescription>Newsletter et annonces officielles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {generalNotifications.map((notification, index) => (
            <div key={notification.id}>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor={notification.id} className="text-base font-medium">
                    {notification.title}
                  </Label>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                </div>
                <Switch id={notification.id} defaultChecked={notification.enabled} />
              </div>
              {index < generalNotifications.length - 1 && <Separator className="mt-6" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Fréquence des rappels */}
      <Card>
        <CardHeader>
          <CardTitle>Fréquence des rappels</CardTitle>
          <CardDescription>Configurez quand recevoir les rappels d&#39;événements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reminder-24h">Rappel 24h avant</Label>
              <Switch id="reminder-24h" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminder-1h">Rappel 1h avant</Label>
              <Switch id="reminder-1h" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Enregistrer les préférences</Button>
      </div>
    </div>
  );
}
