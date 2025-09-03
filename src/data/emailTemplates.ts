export const baseEmailTemplates = [
  {
    name: 'Bienvenue',
    description: "Template d'accueil pour nouveaux membres",
    subject: 'Bienvenue sur ISEP Bands 🎸',
    templateType: 'SYSTEM' as const,
    isDefault: true,
    htmlContent: `
      <div class="max-w-2xl mx-auto bg-white font-sans">
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-8 text-center">
          <h1 class="text-3xl font-bold mb-2">ISEP BANDS</h1>
          <p class="text-purple-100">Association musicale de l'ISEP</p>
        </div>
        
        <!-- Content -->
        <div class="p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Bienvenue {{ name }} ! 🎵</h2>
          
          <p class="text-gray-600 mb-6">
            Ton compte a été créé avec succès. Tu peux maintenant accéder à la plateforme et rejoindre la communauté musicale de l'ISEP.
          </p>
          
          <div class="bg-gray-50 border-l-4 border-purple-500 p-4 mb-6">
            <h3 class="font-semibold text-gray-800 mb-2">Tes identifiants :</h3>
            <p class="text-sm text-gray-600 mb-1">Email : {{ email }}</p>
            <p class="text-sm text-gray-600">Mot de passe temporaire : {{ temporaryPassword }}</p>
            <p class="text-xs text-amber-600 mt-2">⚠️ Change ton mot de passe lors de ta première connexion</p>
          </div>
          
          <div class="text-center mb-6">
            <a href="https://isepbands.fr/login" class="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg">
              Se connecter
            </a>
          </div>
          
          <div class="border-t pt-6">
            <h3 class="font-semibold text-gray-800 mb-3">Ce qui t'attend :</h3>
            <ul class="text-gray-600 space-y-2">
              <li>🎸 Rejoindre des groupes musicaux</li>
              <li>🎤 Participer aux concerts</li>
              <li>📅 Accès aux salles de répétition</li>
              <li>👥 Rencontrer d'autres musiciens</li>
            </ul>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="bg-gray-50 p-6 text-center text-sm text-gray-500">
          <p>&copy; 2024 ISEP Bands</p>
          <div class="mt-2">
            <a href="https://isepbands.fr" class="text-purple-600">Site web</a> • 
            <a href="mailto:contact@isepbands.fr" class="text-purple-600">Contact</a>
          </div>
        </div>
      </div>
    `,
    variables: {
      name: { type: 'string', description: "Nom de l'utilisateur", required: true },
      email: { type: 'string', description: "Email de l'utilisateur", required: true },
      temporaryPassword: {
        type: 'string',
        description: 'Mot de passe temporaire',
        required: false,
      },
    },
  },
  {
    name: 'Réinitialisation mot de passe',
    description: 'Template pour réinitialiser le mot de passe',
    subject: 'Réinitialisation de ton mot de passe',
    templateType: 'SYSTEM' as const,
    isDefault: true,
    htmlContent: `
      <div class="max-w-2xl mx-auto bg-white font-sans">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 text-center">
          <h1 class="text-3xl font-bold mb-2">ISEP BANDS</h1>
          <p class="text-blue-100">Réinitialisation de mot de passe</p>
        </div>
        
        <!-- Content -->
        <div class="p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Réinitialise ton mot de passe</h2>
          
          <p class="text-gray-600 mb-6">
            Bonjour {{ name }}, tu as demandé la réinitialisation de ton mot de passe.
          </p>
          
          <div class="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
            <p class="text-blue-800 text-sm">
              🔒 Ce lien est valide pendant 1 heure pour des raisons de sécurité.
            </p>
          </div>
          
          <div class="text-center mb-6">
            <a href="{{ resetUrl }}" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg">
              Réinitialiser mon mot de passe
            </a>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-gray-600 text-sm">
              Si tu n'as pas fait cette demande, tu peux ignorer cet email. Ton mot de passe actuel reste inchangé.
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="bg-gray-50 p-6 text-center text-sm text-gray-500">
          <p>&copy; 2024 ISEP Bands</p>
          <div class="mt-2">
            <a href="https://isepbands.fr" class="text-blue-600">Site web</a> • 
            <a href="mailto:contact@isepbands.fr" class="text-blue-600">Contact</a>
          </div>
        </div>
      </div>
    `,
    variables: {
      name: { type: 'string', description: "Nom de l'utilisateur", required: true },
      resetUrl: { type: 'url', description: 'URL de réinitialisation', required: true },
    },
  },
  {
    name: 'Compte approuvé',
    description: "Template de confirmation d'approbation",
    subject: 'Ton compte ISEP Bands est approuvé ! 🎉',
    templateType: 'SYSTEM' as const,
    isDefault: true,
    htmlContent: `
      <div class="max-w-2xl mx-auto bg-white font-sans">
        <!-- Header -->
        <div class="bg-gradient-to-r from-green-500 to-green-700 text-white p-8 text-center">
          <h1 class="text-3xl font-bold mb-2">ISEP BANDS</h1>
          <p class="text-green-100">Compte approuvé ✅</p>
        </div>
        
        <!-- Content -->
        <div class="p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Félicitations {{ name }} ! 🎉</h2>
          
          <div class="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
            <p class="text-green-800 font-semibold">
              ✅ Ton compte a été approuvé par notre équipe !
            </p>
          </div>
          
          <p class="text-gray-600 mb-6">
            Tu peux maintenant accéder à toutes les fonctionnalités de la plateforme ISEP Bands.
          </p>
          
          <div class="text-center mb-6">
            <a href="https://isepbands.fr/login" class="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg">
              Accéder à ma plateforme
            </a>
          </div>
          
          <div class="bg-gray-50 p-6 rounded-lg">
            <h3 class="font-semibold text-gray-800 mb-3">Prêt à commencer :</h3>
            <ul class="text-gray-600 space-y-2">
              <li>🎸 Explore les groupes disponibles</li>
              <li>🎤 Inscris-toi aux événements</li>
              <li>👥 Connecte-toi avec d'autres musiciens</li>
              <li>📅 Réserve les salles de répétition</li>
            </ul>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="bg-gray-50 p-6 text-center text-sm text-gray-500">
          <p>&copy; 2024 ISEP Bands</p>
          <div class="mt-2">
            <a href="https://isepbands.fr" class="text-green-600">Site web</a> • 
            <a href="mailto:contact@isepbands.fr" class="text-green-600">Contact</a>
          </div>
        </div>
      </div>
    `,
    variables: {
      name: { type: 'string', description: "Nom de l'utilisateur", required: true },
    },
  },
  {
    name: 'Compte rejeté',
    description: 'Template de notification de rejet',
    subject: "Concernant ta demande d'inscription ISEP Bands",
    templateType: 'SYSTEM' as const,
    isDefault: true,
    htmlContent: `
      <div class="max-w-2xl mx-auto bg-white font-sans">
        <!-- Header -->
        <div class="bg-gradient-to-r from-gray-500 to-gray-700 text-white p-8 text-center">
          <h1 class="text-3xl font-bold mb-2">ISEP BANDS</h1>
          <p class="text-gray-100">Réponse à ta candidature</p>
        </div>
        
        <!-- Content -->
        <div class="p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Bonjour {{ name }}</h2>
          
          <p class="text-gray-600 mb-6">
            Merci d'avoir pris le temps de postuler pour rejoindre ISEP Bands.
          </p>
          
          <div class="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
            <p class="text-red-800 font-semibold mb-2">
              Malheureusement, nous ne pouvons pas approuver ton compte pour le moment.
            </p>
            {{#if reason}}
            <p class="text-red-700 text-sm">Raison : {{ reason }}</p>
            {{/if}}
          </div>
          
          <div class="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
            <h3 class="font-semibold text-blue-800 mb-2">Questions ?</h3>
            <p class="text-blue-700 text-sm">
              N'hésite pas à nous contacter si tu souhaites plus d'informations.
            </p>
          </div>
          
          <div class="text-center mb-6">
            <a href="mailto:contact@isepbands.fr" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg">
              Nous contacter
            </a>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-gray-600 text-sm">
              Tu peux toujours suivre nos actualités sur nos réseaux sociaux et participer à nos événements ouverts.
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="bg-gray-50 p-6 text-center text-sm text-gray-500">
          <p>&copy; 2024 ISEP Bands</p>
          <div class="mt-2">
            <a href="https://isepbands.fr" class="text-gray-600">Site web</a> • 
            <a href="mailto:contact@isepbands.fr" class="text-gray-600">Contact</a>
          </div>
        </div>
      </div>
    `,
    variables: {
      name: { type: 'string', description: "Nom de l'utilisateur", required: true },
      reason: { type: 'string', description: 'Raison du rejet', required: false },
    },
  },
  {
    name: 'Newsletter standard',
    description: 'Template pour newsletters régulières',
    subject: '🎵 {{ title }} - ISEP Bands',
    templateType: 'NEWSLETTER' as const,
    isDefault: true,
    htmlContent: `
      <div class="max-w-2xl mx-auto bg-white font-sans">
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-8 text-center">
          <h1 class="text-3xl font-bold mb-2">ISEP BANDS</h1>
          <p class="text-purple-100">Newsletter {{ date }}</p>
        </div>
        
        <!-- Content -->
        <div class="p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ title }}</h2>
          
          <div class="prose prose-gray max-w-none">
            {{ content }}
          </div>
          
          {{#if ctaUrl}}
          <div class="text-center mt-8">
            <a href="{{ ctaUrl }}" class="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg">
              {{ ctaText }}
            </a>
          </div>
          {{/if}}
        </div>
        
        <!-- Footer -->
        <div class="bg-gray-50 p-6 text-center text-sm text-gray-500">
          <p>&copy; 2024 ISEP Bands</p>
          <div class="mt-2">
            <a href="https://isepbands.fr" class="text-purple-600">Site web</a> • 
            <a href="mailto:contact@isepbands.fr" class="text-purple-600">Contact</a>
          </div>
          <div class="mt-4">
            <a href="{{ unsubscribeUrl }}" class="text-xs text-gray-400 underline">
              Se désabonner
            </a>
          </div>
        </div>
      </div>
    `,
    variables: {
      title: { type: 'string', description: 'Titre de la newsletter', required: true },
      content: { type: 'html', description: 'Contenu principal', required: true },
      date: { type: 'string', description: 'Date de la newsletter', required: false },
      ctaText: { type: 'string', description: 'Texte du bouton', required: false },
      ctaUrl: { type: 'url', description: 'URL du bouton', required: false },
      unsubscribeUrl: { type: 'url', description: 'URL de désabonnement', required: true },
    },
  },
  {
    name: 'Nouvel événement',
    description: 'Template pour annoncer un nouvel événement',
    subject: '🎤 Nouvel événement : {{ eventTitle }}',
    templateType: 'NEWSLETTER' as const,
    isDefault: false,
    htmlContent: `
      <div class="max-w-2xl mx-auto bg-white font-sans">
        <!-- Header -->
        <div class="bg-gradient-to-r from-red-500 to-pink-600 text-white p-8 text-center">
          <h1 class="text-3xl font-bold mb-2">ISEP BANDS</h1>
          <p class="text-red-100">Nouvel événement 🎤</p>
        </div>
        
        <!-- Content -->
        <div class="p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ eventTitle }}</h2>
          
          <div class="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 p-6 rounded-lg mb-6">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-semibold text-red-800">📅 Date :</span>
                <p class="text-red-700">{{ eventDate }}</p>
              </div>
              <div>
                <span class="font-semibold text-red-800">⏰ Heure :</span>
                <p class="text-red-700">{{ eventTime }}</p>
              </div>
              <div class="col-span-2">
                <span class="font-semibold text-red-800">📍 Lieu :</span>
                <p class="text-red-700">{{ eventLocation }}</p>
              </div>
            </div>
          </div>
          
          <div class="prose prose-gray max-w-none mb-6">
            {{ eventDescription }}
          </div>
          
          <div class="text-center">
            <a href="{{ registrationUrl }}" class="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg">
              S'inscrire à l'événement
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="bg-gray-50 p-6 text-center text-sm text-gray-500">
          <p>&copy; 2024 ISEP Bands</p>
          <div class="mt-2">
            <a href="https://isepbands.fr" class="text-red-600">Site web</a> • 
            <a href="mailto:contact@isepbands.fr" class="text-red-600">Contact</a>
          </div>
          <div class="mt-4">
            <a href="{{ unsubscribeUrl }}" class="text-xs text-gray-400 underline">
              Se désabonner
            </a>
          </div>
        </div>
      </div>
    `,
    variables: {
      eventTitle: { type: 'string', description: "Titre de l'événement", required: true },
      eventDate: { type: 'string', description: "Date de l'événement", required: true },
      eventTime: { type: 'string', description: "Heure de l'événement", required: true },
      eventLocation: { type: 'string', description: "Lieu de l'événement", required: true },
      eventDescription: { type: 'html', description: "Description de l'événement", required: true },
      registrationUrl: { type: 'url', description: "URL d'inscription", required: true },
      unsubscribeUrl: { type: 'url', description: 'URL de désabonnement', required: true },
    },
  },
  {
    name: 'Rappel événement',
    description: 'Template de rappel avant un événement',
    subject: '⏰ Rappel : {{ eventTitle }} demain',
    templateType: 'NEWSLETTER' as const,
    isDefault: false,
    htmlContent: `
      <div class="max-w-2xl mx-auto bg-white font-sans">
        <!-- Header -->
        <div class="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-8 text-center">
          <h1 class="text-3xl font-bold mb-2">ISEP BANDS</h1>
          <p class="text-amber-100">Rappel événement ⏰</p>
        </div>
        
        <!-- Content -->
        <div class="p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">N'oublie pas : {{ eventTitle }}</h2>
          
          <div class="bg-amber-50 border border-amber-200 p-6 rounded-lg mb-6">
            <p class="text-amber-800 font-semibold mb-3">
              ⚡ C'est demain !
            </p>
            <div class="text-sm text-amber-700">
              <p><strong>📅 Date :</strong> {{ eventDate }}</p>
              <p><strong>⏰ Heure :</strong> {{ eventTime }}</p>
              <p><strong>📍 Lieu :</strong> {{ eventLocation }}</p>
            </div>
          </div>
          
          {{#if instructions}}
          <div class="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
            <h3 class="font-semibold text-blue-800 mb-2">📝 Instructions :</h3>
            <div class="text-blue-700 text-sm">
              {{ instructions }}
            </div>
          </div>
          {{/if}}
          
          <div class="text-center">
            <a href="{{ eventUrl }}" class="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg">
              Voir les détails
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="bg-gray-50 p-6 text-center text-sm text-gray-500">
          <p>&copy; 2024 ISEP Bands</p>
          <div class="mt-2">
            <a href="https://isepbands.fr" class="text-amber-600">Site web</a> • 
            <a href="mailto:contact@isepbands.fr" class="text-amber-600">Contact</a>
          </div>
          <div class="mt-4">
            <a href="{{ unsubscribeUrl }}" class="text-xs text-gray-400 underline">
              Se désabonner
            </a>
          </div>
        </div>
      </div>
    `,
    variables: {
      eventTitle: { type: 'string', description: "Titre de l'événement", required: true },
      eventDate: { type: 'string', description: "Date de l'événement", required: true },
      eventTime: { type: 'string', description: "Heure de l'événement", required: true },
      eventLocation: { type: 'string', description: "Lieu de l'événement", required: true },
      instructions: { type: 'html', description: 'Instructions spéciales', required: false },
      eventUrl: { type: 'url', description: "URL de l'événement", required: true },
      unsubscribeUrl: { type: 'url', description: 'URL de désabonnement', required: true },
    },
  },
  {
    name: 'Nouveau groupe formé',
    description: "Template pour annoncer la formation d'un nouveau groupe",
    subject: '🎸 Nouveau groupe formé : {{ groupName }}',
    templateType: 'NEWSLETTER' as const,
    isDefault: false,
    htmlContent: `
      <div class="max-w-2xl mx-auto bg-white font-sans">
        <!-- Header -->
        <div class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 text-center">
          <h1 class="text-3xl font-bold mb-2">ISEP BANDS</h1>
          <p class="text-indigo-100">Nouveau groupe 🎸</p>
        </div>
        
        <!-- Content -->
        <div class="p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ groupName }}</h2>
          
          <div class="bg-indigo-50 border border-indigo-200 p-6 rounded-lg mb-6">
            <p class="text-indigo-800 font-semibold mb-2">
              🎉 Un nouveau groupe vient de se former !
            </p>
            <p class="text-indigo-700 text-sm">{{ groupDescription }}</p>
          </div>
          
          {{#if members}}
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 class="font-semibold text-gray-800 mb-3">👥 Membres :</h3>
            <div class="text-gray-600 text-sm">
              {{ members }}
            </div>
          </div>
          {{/if}}
          
          <div class="prose prose-gray max-w-none mb-6">
            {{ content }}
          </div>
          
          <div class="text-center">
            <a href="{{ groupUrl }}" class="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg">
              Découvrir le groupe
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="bg-gray-50 p-6 text-center text-sm text-gray-500">
          <p>&copy; 2024 ISEP Bands</p>
          <div class="mt-2">
            <a href="https://isepbands.fr" class="text-indigo-600">Site web</a> • 
            <a href="mailto:contact@isepbands.fr" class="text-indigo-600">Contact</a>
          </div>
          <div class="mt-4">
            <a href="{{ unsubscribeUrl }}" class="text-xs text-gray-400 underline">
              Se désabonner
            </a>
          </div>
        </div>
      </div>
    `,
    variables: {
      groupName: { type: 'string', description: 'Nom du groupe', required: true },
      groupDescription: {
        type: 'string',
        description: 'Description courte du groupe',
        required: true,
      },
      members: { type: 'string', description: 'Liste des membres', required: false },
      content: { type: 'html', description: 'Contenu détaillé', required: true },
      groupUrl: { type: 'url', description: 'URL du groupe', required: true },
      unsubscribeUrl: { type: 'url', description: 'URL de désabonnement', required: true },
    },
  },
  {
    name: 'Notification système',
    description: 'Template pour les notifications système importantes',
    subject: '🔔 {{ title }} - ISEP Bands',
    templateType: 'SYSTEM' as const,
    isDefault: false,
    htmlContent: `
      <div class="max-w-2xl mx-auto bg-white font-sans">
        <!-- Header -->
        <div class="bg-gradient-to-r from-slate-600 to-slate-800 text-white p-8 text-center">
          <h1 class="text-3xl font-bold mb-2">ISEP BANDS</h1>
          <p class="text-slate-100">Notification système</p>
        </div>
        
        <!-- Content -->
        <div class="p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ title }}</h2>
          
          <div class="bg-slate-50 border border-slate-200 p-6 rounded-lg mb-6">
            <div class="prose prose-slate max-w-none">
              {{ content }}
            </div>
          </div>
          
          {{#if actionUrl}}
          <div class="text-center">
            <a href="{{ actionUrl }}" class="inline-block bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg">
              {{ actionText }}
            </a>
          </div>
          {{/if}}
        </div>
        
        <!-- Footer -->
        <div class="bg-gray-50 p-6 text-center text-sm text-gray-500">
          <p>&copy; 2024 ISEP Bands</p>
          <div class="mt-2">
            <a href="https://isepbands.fr" class="text-slate-600">Site web</a> • 
            <a href="mailto:contact@isepbands.fr" class="text-slate-600">Contact</a>
          </div>
        </div>
      </div>
    `,
    variables: {
      title: { type: 'string', description: 'Titre de la notification', required: true },
      content: { type: 'html', description: 'Contenu de la notification', required: true },
      actionText: { type: 'string', description: "Texte du bouton d'action", required: false },
      actionUrl: { type: 'url', description: "URL du bouton d'action", required: false },
    },
  },
];
