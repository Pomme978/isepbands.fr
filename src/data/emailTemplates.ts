export const baseEmailTemplates = [
  {
    name: 'Creation compte en attente approbation',
    description: "Template d'accueil pour nouveaux comptes en attente d'approbation",
    subject: 'Bienvenue sur ISEP Bands - Compte en attente',
    templateType: 'SYSTEM' as const,
    isDefault: true,
    htmlContent: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenue sur ISEP Bands</title>
        <style>
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 40px 24px; text-align: center; }
          .logo { color: white; font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 2px; }
          .tagline { color: #e0e7ff; font-size: 14px; margin: 8px 0 0 0; }
          .content { padding: 40px 24px; }
          .title { font-size: 24px; font-weight: 600; color: #1e293b; margin: 0 0 20px 0; line-height: 1.3; }
          .text { color: #64748b; line-height: 1.6; margin: 16px 0; font-size: 16px; }
          .status-card { background: #fefce8; border-left: 4px solid #eab308; border-radius: 8px; padding: 20px; margin: 24px 0; }
          .status-title { color: #a16207; font-weight: 600; margin: 0 0 12px 0; font-size: 16px; }
          .status-list { color: #a16207; margin: 0; padding: 0; list-style: none; }
          .status-list li { margin: 8px 0; padding-left: 20px; position: relative; }
          .status-list li::before { content: '•'; position: absolute; left: 0; color: #eab308; font-weight: bold; }
          .features-card { background: #f8fafc; border-radius: 12px; padding: 24px; margin: 32px 0; }
          .features-title { color: #1e293b; font-weight: 600; margin: 0 0 16px 0; font-size: 18px; }
          .features-list { color: #64748b; margin: 0; padding: 0; list-style: none; }
          .features-list li { margin: 12px 0; padding-left: 24px; position: relative; }
          .features-list li::before { content: '♪'; position: absolute; left: 0; color: #8b5cf6; }
          .contact-card { background: #eff6ff; border: 1px solid #dbeafe; border-radius: 8px; padding: 16px; text-align: center; }
          .contact-text { color: #1e40af; font-size: 14px; margin: 0; }
          .footer { background: #f1f5f9; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
          .footer a { color: #8b5cf6; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">ISEP BANDS</h1>
            <p class="tagline">Association musicale de l'ISEP</p>
          </div>
          
          <div class="content">
            <h2 class="title">Bienvenue {{ name }} !</h2>
            
            <p class="text">
              Merci d'avoir rejoint ISEP Bands ! Ton compte a été créé avec succès et est actuellement en attente d'approbation par notre équipe.
            </p>
            
            <div class="status-card">
              <h3 class="status-title">Prochaines étapes</h3>
              <ul class="status-list">
                <li>Notre équipe examine ton inscription</li>
                <li>Tu recevras un email de confirmation sous peu</li>
                <li>Une fois approuvé, tu pourras accéder à toutes les fonctionnalités</li>
              </ul>
            </div>
            
            <div class="features-card">
              <h3 class="features-title">Ce qui t'attend</h3>
              <ul class="features-list">
                <li>Rejoindre des groupes musicaux</li>
                <li>Participer aux concerts</li>
                <li>Réserver les salles de répétition</li>
                <li>Rencontrer d'autres musiciens</li>
              </ul>
            </div>
            
            <div class="contact-card">
              <p class="contact-text">
                Des questions ? Contacte-nous à contact@isepbands.fr
              </p>
            </div>
          </div>
          
          <div class="footer">
            <p>&copy; 2024 ISEP Bands</p>
            <p>
              <a href="https://isepbands.fr">Site web</a> • 
              <a href="mailto:contact@isepbands.fr">Contact</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    variables: {
      name: { type: 'string', description: "Nom de l'utilisateur", required: true },
    },
  },
  {
    name: 'Compte approuve',
    description: "Template de confirmation d'approbation",
    subject: 'Ton compte ISEP Bands est approuvé',
    templateType: 'SYSTEM' as const,
    isDefault: true,
    htmlContent: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Compte approuvé - ISEP Bands</title>
        <style>
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 24px; text-align: center; }
          .logo { color: white; font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 2px; }
          .tagline { color: #a7f3d0; font-size: 14px; margin: 8px 0 0 0; }
          .content { padding: 40px 24px; }
          .title { font-size: 24px; font-weight: 600; color: #1e293b; margin: 0 0 20px 0; line-height: 1.3; }
          .text { color: #64748b; line-height: 1.6; margin: 16px 0; font-size: 16px; }
          .success-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; }
          .success-icon { font-size: 48px; margin-bottom: 16px; }
          .success-title { color: #166534; font-weight: 600; margin: 0 0 8px 0; font-size: 18px; }
          .success-text { color: #15803d; margin: 0; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; font-weight: 600; padding: 16px 32px; border-radius: 8px; margin: 24px 0; transition: transform 0.2s; }
          .cta-button:hover { transform: translateY(-2px); }
          .features-card { background: #f8fafc; border-radius: 12px; padding: 24px; margin: 32px 0; }
          .features-title { color: #1e293b; font-weight: 600; margin: 0 0 16px 0; font-size: 18px; }
          .features-list { color: #64748b; margin: 0; padding: 0; list-style: none; }
          .features-list li { margin: 12px 0; padding-left: 24px; position: relative; }
          .features-list li::before { content: '✓'; position: absolute; left: 0; color: #10b981; font-weight: bold; }
          .footer { background: #f1f5f9; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
          .footer a { color: #10b981; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">ISEP BANDS</h1>
            <p class="tagline">Compte approuvé</p>
          </div>
          
          <div class="content">
            <h2 class="title">Félicitations {{firstName}} !</h2>
            
            <div class="success-card">
              <div class="success-icon">🎉</div>
              <h3 class="success-title">Compte approuvé</h3>
              <p class="success-text">Ton compte a été approuvé par notre équipe</p>
            </div>
            
            <p class="text">
              Tu peux maintenant accéder à toutes les fonctionnalités de la plateforme ISEP Bands et rejoindre notre communauté musicale.
            </p>
            
            <div style="text-align: center;">
              <a href="{{loginUrl}}" class="cta-button">
                Accéder à ma plateforme
              </a>
            </div>
            
            <div class="features-card">
              <h3 class="features-title">Prêt à commencer</h3>
              <ul class="features-list">
                <li>Explore les groupes disponibles</li>
                <li>Inscris-toi aux événements</li>
                <li>Connecte-toi avec d'autres musiciens</li>
                <li>Réserve les salles de répétition</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <p>&copy; 2024 ISEP Bands</p>
            <p>
              <a href="{{platformUrl}}">Site web</a> • 
              <a href="mailto:contact@isepbands.fr">Contact</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    variables: {
      firstName: { type: 'string', description: "Prénom de l'utilisateur", required: true },
      lastName: { type: 'string', description: "Nom de l'utilisateur", required: true },
      loginUrl: { type: 'url', description: 'URL de connexion', required: true },
      platformUrl: { type: 'url', description: 'URL de la plateforme', required: true },
    },
  },
  {
    name: 'Reinitialisation mot de passe',
    description: 'Template pour réinitialiser le mot de passe',
    subject: 'Réinitialisation de ton mot de passe',
    templateType: 'SYSTEM' as const,
    isDefault: true,
    htmlContent: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Réinitialisation mot de passe - ISEP Bands</title>
        <style>
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 24px; text-align: center; }
          .logo { color: white; font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 2px; }
          .tagline { color: #bfdbfe; font-size: 14px; margin: 8px 0 0 0; }
          .content { padding: 40px 24px; }
          .title { font-size: 24px; font-weight: 600; color: #1e293b; margin: 0 0 20px 0; line-height: 1.3; }
          .text { color: #64748b; line-height: 1.6; margin: 16px 0; font-size: 16px; }
          .security-card { background: #eff6ff; border: 1px solid #dbeafe; border-radius: 8px; padding: 16px; margin: 24px 0; }
          .security-icon { color: #3b82f6; font-size: 20px; margin-bottom: 8px; }
          .security-text { color: #1e40af; font-size: 14px; margin: 0; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; text-decoration: none; font-weight: 600; padding: 16px 32px; border-radius: 8px; margin: 24px 0; transition: transform 0.2s; }
          .cta-button:hover { transform: translateY(-2px); }
          .warning-card { background: #fefce8; border-left: 4px solid #eab308; padding: 16px; margin: 24px 0; border-radius: 8px; }
          .warning-text { color: #a16207; font-size: 14px; margin: 0; }
          .footer { background: #f1f5f9; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
          .footer a { color: #3b82f6; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">ISEP BANDS</h1>
            <p class="tagline">Réinitialisation de mot de passe</p>
          </div>
          
          <div class="content">
            <h2 class="title">Réinitialise ton mot de passe</h2>
            
            <p class="text">
              Bonjour {{ name }}, tu as demandé la réinitialisation de ton mot de passe pour ton compte ISEP Bands.
            </p>
            
            <div class="security-card">
              <div class="security-icon">🔒</div>
              <p class="security-text">
                Ce lien est valide pendant 1 heure pour des raisons de sécurité.
              </p>
            </div>
            
            <div style="text-align: center;">
              <a href="{{ resetUrl }}" class="cta-button">
                Réinitialiser mon mot de passe
              </a>
            </div>
            
            <div class="warning-card">
              <p class="warning-text">
                Si tu n'as pas fait cette demande, tu peux ignorer cet email. Ton mot de passe actuel reste inchangé.
              </p>
            </div>
          </div>
          
          <div class="footer">
            <p>&copy; 2024 ISEP Bands</p>
            <p>
              <a href="https://isepbands.fr">Site web</a> • 
              <a href="mailto:contact@isepbands.fr">Contact</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    variables: {
      name: { type: 'string', description: "Nom de l'utilisateur", required: true },
      resetUrl: { type: 'url', description: 'URL de réinitialisation', required: true },
    },
  },
  {
    name: 'Newsletter standard',
    description: 'Template pour newsletters régulières',
    subject: '{{ title }} - ISEP Bands',
    templateType: 'NEWSLETTER' as const,
    isDefault: true,
    htmlContent: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{ title }} - ISEP Bands</title>
        <style>
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 40px 24px; text-align: center; }
          .logo { color: white; font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 2px; }
          .newsletter-date { color: #e0e7ff; font-size: 14px; margin: 8px 0 0 0; }
          .content { padding: 40px 24px; }
          .title { font-size: 28px; font-weight: 700; color: #1e293b; margin: 0 0 24px 0; line-height: 1.2; }
          .article-content { color: #374151; line-height: 1.7; font-size: 16px; }
          .article-content h3 { color: #1e293b; font-weight: 600; margin: 24px 0 12px 0; }
          .article-content p { margin: 16px 0; }
          .article-content ul { margin: 16px 0; padding-left: 20px; }
          .article-content li { margin: 8px 0; }
          .cta-section { text-align: center; margin: 32px 0; padding: 24px; background: #f8fafc; border-radius: 12px; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; text-decoration: none; font-weight: 600; padding: 16px 32px; border-radius: 8px; transition: transform 0.2s; }
          .cta-button:hover { transform: translateY(-2px); }
          .divider { height: 1px; background: #e2e8f0; margin: 32px 0; }
          .footer { background: #f1f5f9; padding: 32px 24px; text-align: center; }
          .footer-links { margin-bottom: 16px; }
          .footer-links a { color: #8b5cf6; text-decoration: none; margin: 0 8px; }
          .footer-links a:hover { text-decoration: underline; }
          .footer-text { color: #64748b; font-size: 14px; margin: 8px 0; }
          .unsubscribe { margin-top: 16px; }
          .unsubscribe a { color: #9ca3af; font-size: 12px; text-decoration: none; }
          .unsubscribe a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">ISEP BANDS</h1>
            {{#if date}}
            <p class="newsletter-date">Newsletter {{ date }}</p>
            {{/if}}
          </div>
          
          <div class="content">
            <h2 class="title">{{ title }}</h2>
            
            <div class="article-content">
              {{{ content }}}
            </div>
            
            {{#if ctaUrl}}
            <div class="cta-section">
              <a href="{{ ctaUrl }}" class="cta-button">
                {{ ctaText }}
              </a>
            </div>
            {{/if}}
            
            <div class="divider"></div>
            
            <div style="text-align: center; color: #64748b; font-style: italic;">
              Merci de faire partie de la communauté ISEP Bands !
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-links">
              <a href="https://isepbands.fr">Site web</a>
              <a href="mailto:contact@isepbands.fr">Contact</a>
            </div>
            <p class="footer-text">&copy; 2024 ISEP Bands - Association musicale de l'ISEP</p>
            <div class="unsubscribe">
              <a href="{{ unsubscribeUrl }}">Se désabonner</a>
            </div>
          </div>
        </div>
      </body>
      </html>
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
    name: 'Compte non valide',
    description: 'Template pour les comptes refusés',
    subject: "Mise à jour de votre demande d'inscription ISEP Bands",
    templateType: 'SYSTEM' as const,
    isDefault: true,
    htmlContent: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Demande d'inscription - ISEP Bands</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f7fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Header with gradient -->
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 48px 32px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">
              ISEP Bands
            </h1>
            <p style="color: #fef3c7; font-size: 16px; margin: 8px 0 0 0;">
              Mise à jour de votre demande
            </p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 32px;">
            <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
              Bonjour {{firstName}} {{lastName}},
            </p>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
              Merci pour votre intérêt envers ISEP Bands et pour le temps que vous avez consacré à votre demande d'inscription.
            </p>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
              Après examen de votre dossier, nous regrettons de vous informer que nous ne pouvons pas donner suite à votre candidature pour le moment.
            </p>
            
            <!-- Reason Box -->
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 24px 0; border-radius: 4px;">
              <p style="color: #92400e; font-weight: 600; margin: 0 0 12px; font-size: 16px;">
                Motif
              </p>
              <p style="color: #78350f; font-size: 15px; line-height: 1.6; margin: 0;">
                {{reason}}
              </p>
            </div>
            
            <div style="background-color: #f9fafb; padding: 24px; border-radius: 8px; margin: 32px 0;">
              <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px;">
                Et maintenant ?
              </h3>
              <ul style="color: #4b5563; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li style="margin: 8px 0;">Vous pouvez nous contacter pour plus d'informations</li>
                <li style="margin: 8px 0;">Une nouvelle candidature sera possible ultérieurement</li>
                <li style="margin: 8px 0;">Restez connecté avec notre communauté musicale</li>
              </ul>
            </div>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 24px 0;">
              Nous vous encourageons à continuer votre parcours musical et peut-être nous recontacter dans le futur.
            </p>
            
            <!-- Contact Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="mailto:{{supportEmail}}" style="display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Nous contacter
              </a>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 24px;">
              <p style="color: #9ca3af; font-size: 14px; line-height: 1.5; margin: 0; text-align: center;">
                Merci de votre compréhension et de votre intérêt pour ISEP Bands.
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #1f2937; padding: 24px; text-align: center;">
            <p style="color: #9ca3af; font-size: 13px; margin: 0 0 8px;">
              ISEP Bands - Association musicale
            </p>
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              Pour toute question : {{supportEmail}}
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    variables: {
      firstName: { type: 'string', description: "Prénom de l'utilisateur", required: true },
      lastName: { type: 'string', description: "Nom de l'utilisateur", required: true },
      reason: { type: 'string', description: 'Raison du refus', required: true },
      supportEmail: { type: 'string', description: 'Email de support', required: true },
    },
  },
  {
    name: 'Compte suspendu',
    description: 'Template pour les comptes suspendus',
    subject: 'Votre compte ISEP Bands a été suspendu',
    templateType: 'SYSTEM' as const,
    isDefault: true,
    htmlContent: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Compte Suspendu - ISEP Bands</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f7fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Header with gradient -->
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 48px 32px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">
              Compte Suspendu
            </h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 32px;">
            <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
              Bonjour {{firstName}} {{lastName}},
            </p>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
              Nous vous informons que votre compte ISEP Bands a été temporairement suspendu.
            </p>
            
            <!-- Reason Box -->
            <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 16px 20px; margin: 24px 0; border-radius: 4px;">
              <p style="color: #991b1b; font-weight: 600; margin: 0 0 8px; font-size: 14px;">
                RAISON DE LA SUSPENSION
              </p>
              <p style="color: #7f1d1d; font-size: 15px; line-height: 1.5; margin: 0;">
                {{reason}}
              </p>
            </div>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 24px 0;">
              <h3 style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0 0 12px;">
                Que faire maintenant ?
              </h3>
              <ul style="color: #4b5563; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Contactez l'équipe d'administration pour plus d'informations</li>
                <li>Expliquez votre situation et demandez une révision si nécessaire</li>
                <li>Attendez la confirmation de la levée de suspension</li>
              </ul>
            </div>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 24px 0;">
              Si vous pensez qu'il s'agit d'une erreur ou si vous souhaitez contester cette décision, 
              n'hésitez pas à nous contacter.
            </p>
            
            <!-- Contact Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="mailto:{{supportEmail}}" style="display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Contacter le support
              </a>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 24px;">
              <p style="color: #9ca3af; font-size: 14px; line-height: 1.5; margin: 0; text-align: center;">
                Cet email a été envoyé par l'équipe d'administration d'ISEP Bands.
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #1f2937; padding: 24px; text-align: center;">
            <p style="color: #9ca3af; font-size: 13px; margin: 0 0 8px;">
              ISEP Bands - Association musicale
            </p>
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              Pour toute question : {{supportEmail}}
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    variables: {
      firstName: { type: 'string', description: "Prénom de l'utilisateur", required: true },
      lastName: { type: 'string', description: "Nom de l'utilisateur", required: true },
      reason: { type: 'string', description: 'Raison de la suspension', required: true },
      supportEmail: { type: 'string', description: 'Email de support', required: true },
    },
  },
  {
    name: 'Compte suspendu restauré',
    description: 'Template pour les comptes suspendus qui ont été restaurés',
    subject: 'Votre compte ISEP Bands a été restauré',
    templateType: 'SYSTEM' as const,
    isDefault: true,
    htmlContent: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Compte Restauré - ISEP Bands</title>
        <style>
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 24px; text-align: center; }
          .logo { color: white; font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 2px; }
          .tagline { color: #a7f3d0; font-size: 14px; margin: 8px 0 0 0; }
          .content { padding: 40px 24px; }
          .title { font-size: 24px; font-weight: 600; color: #1e293b; margin: 0 0 20px 0; line-height: 1.3; }
          .text { color: #64748b; line-height: 1.6; margin: 16px 0; font-size: 16px; }
          .success-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; }
          .success-icon { font-size: 48px; margin-bottom: 16px; }
          .success-title { color: #166534; font-weight: 600; margin: 0 0 8px 0; font-size: 18px; }
          .success-text { color: #15803d; margin: 0; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; font-weight: 600; padding: 16px 32px; border-radius: 8px; margin: 24px 0; transition: transform 0.2s; }
          .cta-button:hover { transform: translateY(-2px); }
          .info-card { background: #f8fafc; border-radius: 12px; padding: 24px; margin: 32px 0; }
          .info-title { color: #1e293b; font-weight: 600; margin: 0 0 16px 0; font-size: 18px; }
          .info-list { color: #64748b; margin: 0; padding: 0; list-style: none; }
          .info-list li { margin: 12px 0; padding-left: 24px; position: relative; }
          .info-list li::before { content: '✓'; position: absolute; left: 0; color: #10b981; font-weight: bold; }
          .footer { background: #f1f5f9; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
          .footer a { color: #10b981; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">ISEP BANDS</h1>
            <p class="tagline">Compte restauré</p>
          </div>
          
          <div class="content">
            <h2 class="title">Bonne nouvelle {{firstName}} !</h2>
            
            <div class="success-card">
              <div class="success-icon">🎉</div>
              <h3 class="success-title">Votre compte a été restauré</h3>
              <p class="success-text">Vous pouvez de nouveau accéder à votre compte ISEP Bands</p>
            </div>
            
            <p class="text">
              Nous sommes heureux de vous informer que la suspension de votre compte a été levée. 
              Vous pouvez maintenant vous reconnecter et profiter pleinement de toutes les fonctionnalités de la plateforme.
            </p>
            
            <div style="text-align: center;">
              <a href="{{loginUrl}}" class="cta-button">
                Me reconnecter maintenant
              </a>
            </div>
            
            <div class="info-card">
              <h3 class="info-title">Ce que vous pouvez maintenant faire</h3>
              <ul class="info-list">
                <li>Vous connecter à votre compte</li>
                <li>Participer aux activités du club</li>
                <li>Rejoindre des groupes musicaux</li>
                <li>Réserver des salles de répétition</li>
                <li>Accéder à tous vos contenus précédents</li>
              </ul>
            </div>
            
            <p class="text">
              Nous vous remercions de votre patience et sommes ravis de vous retrouver dans notre communauté musicale.
            </p>
          </div>
          
          <div class="footer">
            <p>&copy; 2024 ISEP Bands</p>
            <p>
              <a href="{{platformUrl}}">Site web</a> • 
              <a href="mailto:contact@isepbands.fr">Contact</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    variables: {
      firstName: { type: 'string', description: "Prénom de l'utilisateur", required: true },
      lastName: { type: 'string', description: "Nom de l'utilisateur", required: true },
      loginUrl: { type: 'url', description: 'URL de connexion', required: true },
      platformUrl: { type: 'url', description: 'URL de la plateforme', required: true },
    },
  },
  {
    name: 'Membre refusé restauré',
    description: 'Template pour les membres refusés qui ont été acceptés',
    subject: 'Bonne nouvelle ! Votre candidature ISEP Bands a été acceptée',
    templateType: 'SYSTEM' as const,
    isDefault: true,
    htmlContent: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Candidature Acceptée - ISEP Bands</title>
        <style>
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 24px; text-align: center; }
          .logo { color: white; font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 2px; }
          .tagline { color: #a7f3d0; font-size: 14px; margin: 8px 0 0 0; }
          .content { padding: 40px 24px; }
          .title { font-size: 24px; font-weight: 600; color: #1e293b; margin: 0 0 20px 0; line-height: 1.3; }
          .text { color: #64748b; line-height: 1.6; margin: 16px 0; font-size: 16px; }
          .celebration-card { background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 1px solid #bbf7d0; border-radius: 16px; padding: 32px; margin: 24px 0; text-align: center; position: relative; overflow: hidden; }
          .celebration-card::before { content: '🎵'; position: absolute; top: 10px; left: 20px; font-size: 24px; opacity: 0.3; }
          .celebration-card::after { content: '🎶'; position: absolute; bottom: 10px; right: 20px; font-size: 24px; opacity: 0.3; }
          .celebration-icon { font-size: 56px; margin-bottom: 20px; }
          .celebration-title { color: #166534; font-weight: 700; margin: 0 0 12px 0; font-size: 20px; }
          .celebration-text { color: #15803d; margin: 0; font-size: 16px; font-style: italic; }
          .surprise-text { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center; }
          .surprise-text p { color: #92400e; font-weight: 600; margin: 0; font-size: 15px; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; font-weight: 700; padding: 18px 36px; border-radius: 12px; margin: 32px 0; transition: all 0.3s; font-size: 16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }
          .cta-button:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4); }
          .welcome-card { background: #f8fafc; border-radius: 12px; padding: 24px; margin: 32px 0; }
          .welcome-title { color: #1e293b; font-weight: 600; margin: 0 0 16px 0; font-size: 18px; }
          .welcome-list { color: #64748b; margin: 0; padding: 0; list-style: none; }
          .welcome-list li { margin: 12px 0; padding-left: 28px; position: relative; }
          .welcome-list li::before { content: '🎸'; position: absolute; left: 0; }
          .footer { background: #f1f5f9; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
          .footer a { color: #10b981; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">ISEP BANDS</h1>
            <p class="tagline">Candidature acceptée</p>
          </div>
          
          <div class="content">
            <h2 class="title">Excellente nouvelle {{firstName}} !</h2>
            
            <div class="celebration-card">
              <div class="celebration-icon">🎉</div>
              <h3 class="celebration-title">Nous avons changé d'avis !</h3>
              <p class="celebration-text">Votre candidature a finalement été acceptée</p>
            </div>
            
            <div class="surprise-text">
              <p>Après réexamen, nous sommes ravis de vous accueillir dans la famille ISEP Bands !</p>
            </div>
            
            <p class="text">
              Suite à une révision de votre dossier, nous sommes heureux de vous annoncer que votre candidature 
              a été acceptée. Nous nous excusons pour toute confusion et sommes impatients de vous voir rejoindre 
              notre communauté musicale.
            </p>
            
            <div style="text-align: center;">
              <a href="{{loginUrl}}" class="cta-button">
                🚀 Accéder à mon compte
              </a>
            </div>
            
            <div class="welcome-card">
              <h3 class="welcome-title">Votre aventure musicale commence maintenant</h3>
              <ul class="welcome-list">
                <li>Explorez les groupes disponibles et trouvez votre style</li>
                <li>Participez aux répétitions et concerts</li>
                <li>Rencontrez d'autres musiciens passionnés</li>
                <li>Réservez des créneaux dans nos studios</li>
                <li>Accédez à nos équipements et instruments</li>
              </ul>
            </div>
            
            <p class="text">
              Bienvenue officiellement dans l'aventure ISEP Bands ! Nous avons hâte de découvrir votre talent 
              et de créer de la musique ensemble.
            </p>
          </div>
          
          <div class="footer">
            <p>&copy; 2024 ISEP Bands</p>
            <p>
              <a href="{{platformUrl}}">Site web</a> • 
              <a href="mailto:contact@isepbands.fr">Contact</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    variables: {
      firstName: { type: 'string', description: "Prénom de l'utilisateur", required: true },
      lastName: { type: 'string', description: "Nom de l'utilisateur", required: true },
      loginUrl: { type: 'url', description: 'URL de connexion', required: true },
      platformUrl: { type: 'url', description: 'URL de la plateforme', required: true },
    },
  },
  {
    name: 'Verification email',
    description: "Template pour la vérification d'email",
    subject: 'Vérifiez votre adresse email - ISEP Bands',
    templateType: 'SYSTEM' as const,
    isDefault: true,
    htmlContent: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vérification Email - ISEP Bands</title>
        <style>
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 24px; text-align: center; }
          .logo { color: white; font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 2px; }
          .tagline { color: #bfdbfe; font-size: 14px; margin: 8px 0 0 0; }
          .content { padding: 40px 24px; }
          .title { font-size: 24px; font-weight: 600; color: #1e293b; margin: 0 0 20px 0; line-height: 1.3; }
          .text { color: #64748b; line-height: 1.6; margin: 16px 0; font-size: 16px; }
          .verification-card { background: #eff6ff; border: 1px solid #dbeafe; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; }
          .verification-icon { font-size: 48px; margin-bottom: 16px; }
          .verification-title { color: #1e40af; font-weight: 600; margin: 0 0 8px 0; font-size: 18px; }
          .verification-text { color: #3730a3; margin: 0; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; text-decoration: none; font-weight: 700; padding: 18px 36px; border-radius: 12px; margin: 32px 0; transition: all 0.3s; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }
          .cta-button:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4); }
          .security-note { background: #fefce8; border: 1px solid #facc15; border-radius: 8px; padding: 16px; margin: 24px 0; }
          .security-note p { color: #a16207; font-size: 14px; margin: 0; }
          .footer { background: #f1f5f9; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
          .footer a { color: #3b82f6; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">ISEP BANDS</h1>
            <p class="tagline">Vérification d'email</p>
          </div>
          
          <div class="content">
            <h2 class="title">Vérifiez votre adresse email</h2>
            
            <p class="text">
              Bonjour {{firstName}}, pour finaliser la création de votre compte ISEP Bands, 
              nous devons vérifier votre adresse email.
            </p>
            
            <div class="verification-card">
              <div class="verification-icon">📧</div>
              <h3 class="verification-title">Confirmation requise</h3>
              <p class="verification-text">Cliquez sur le bouton ci-dessous pour confirmer votre email</p>
            </div>
            
            <div style="text-align: center;">
              <a href="{{verificationUrl}}" class="cta-button">
                ✓ Vérifier mon email
              </a>
            </div>
            
            <div class="security-note">
              <p>
                <strong>Sécurité :</strong> Ce lien est valide pendant 24 heures. 
                Si vous n'avez pas créé de compte, ignorez cet email.
              </p>
            </div>
            
            <p class="text">
              Une fois votre email vérifié, vous pourrez accéder à toutes les fonctionnalités 
              de la plateforme ISEP Bands.
            </p>
          </div>
          
          <div class="footer">
            <p>&copy; 2024 ISEP Bands</p>
            <p>
              <a href="{{platformUrl}}">Site web</a> • 
              <a href="mailto:contact@isepbands.fr">Contact</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    variables: {
      firstName: { type: 'string', description: "Prénom de l'utilisateur", required: true },
      verificationUrl: { type: 'url', description: 'URL de vérification', required: true },
      platformUrl: { type: 'url', description: 'URL de la plateforme', required: true },
    },
  },
  {
    name: 'Email verifie',
    description: "Template de confirmation de vérification d'email",
    subject: 'Email vérifié avec succès ! - ISEP Bands',
    templateType: 'SYSTEM' as const,
    isDefault: true,
    htmlContent: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Vérifié - ISEP Bands</title>
        <style>
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 24px; text-align: center; }
          .logo { color: white; font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 2px; }
          .tagline { color: #a7f3d0; font-size: 14px; margin: 8px 0 0 0; }
          .content { padding: 40px 24px; }
          .title { font-size: 24px; font-weight: 600; color: #1e293b; margin: 0 0 20px 0; line-height: 1.3; }
          .text { color: #64748b; line-height: 1.6; margin: 16px 0; font-size: 16px; }
          .success-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; }
          .success-icon { font-size: 56px; margin-bottom: 20px; }
          .success-title { color: #166534; font-weight: 700; margin: 0 0 12px 0; font-size: 20px; }
          .success-text { color: #15803d; margin: 0; font-size: 16px; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; font-weight: 700; padding: 18px 36px; border-radius: 12px; margin: 32px 0; transition: all 0.3s; font-size: 16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }
          .cta-button:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4); }
          .next-steps { background: #f8fafc; border-radius: 12px; padding: 24px; margin: 32px 0; }
          .next-steps-title { color: #1e293b; font-weight: 600; margin: 0 0 16px 0; font-size: 18px; }
          .next-steps-list { color: #64748b; margin: 0; padding: 0; list-style: none; }
          .next-steps-list li { margin: 12px 0; padding-left: 28px; position: relative; }
          .next-steps-list li::before { content: '→'; position: absolute; left: 0; color: #10b981; font-weight: bold; }
          .footer { background: #f1f5f9; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
          .footer a { color: #10b981; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">ISEP BANDS</h1>
            <p class="tagline">Email vérifié</p>
          </div>
          
          <div class="content">
            <h2 class="title">Parfait {{firstName}} !</h2>
            
            <div class="success-card">
              <div class="success-icon">✅</div>
              <h3 class="success-title">Email vérifié avec succès</h3>
              <p class="success-text">Votre adresse email {{email}} a été confirmée</p>
            </div>
            
            <p class="text">
              Félicitations ! Votre adresse email a été vérifiée avec succès. 
              Votre compte est maintenant pleinement activé.
            </p>
            
            <div style="text-align: center;">
              <a href="{{loginUrl}}" class="cta-button">
                🎵 Accéder à mon compte
              </a>
            </div>
            
            <div class="next-steps">
              <h3 class="next-steps-title">Prochaines étapes</h3>
              <ul class="next-steps-list">
                <li>Complétez votre profil musical</li>
                <li>Explorez les groupes disponibles</li>
                <li>Inscrivez-vous aux événements</li>
                <li>Connectez-vous avec d'autres musiciens</li>
                <li>Réservez des créneaux de répétition</li>
              </ul>
            </div>
            
            <p class="text">
              Bienvenue dans la communauté ISEP Bands ! Nous sommes impatients de découvrir 
              votre talent musical et de faire de la musique ensemble.
            </p>
          </div>
          
          <div class="footer">
            <p>&copy; 2024 ISEP Bands</p>
            <p>
              <a href="{{platformUrl}}">Site web</a> • 
              <a href="mailto:contact@isepbands.fr">Contact</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    variables: {
      firstName: { type: 'string', description: "Prénom de l'utilisateur", required: true },
      email: { type: 'string', description: "Email de l'utilisateur", required: true },
      loginUrl: { type: 'url', description: 'URL de connexion', required: true },
      platformUrl: { type: 'url', description: 'URL de la plateforme', required: true },
    },
  },
  {
    name: 'Campagne futurs membres',
    description: 'Template pour inviter les futurs membres à finaliser leur inscription',
    subject: 'Finalisez votre inscription à ISEP Bands 🎵',
    templateType: 'NEWSLETTER' as const,
    isDefault: false,
    htmlContent: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Finalisez votre inscription - ISEP Bands</title>
        <style>
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 40px 24px; text-align: center; }
          .logo { color: white; font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 2px; }
          .tagline { color: #e0e7ff; font-size: 14px; margin: 8px 0 0 0; }
          .content { padding: 40px 24px; }
          .title { font-size: 26px; font-weight: 700; color: #1e293b; margin: 0 0 24px 0; line-height: 1.2; }
          .text { color: #64748b; line-height: 1.6; margin: 16px 0; font-size: 16px; }
          .highlight-card { background: #f8fafc; border-left: 4px solid #8b5cf6; border-radius: 8px; padding: 24px; margin: 24px 0; }
          .highlight-title { color: #8b5cf6; font-weight: 600; margin: 0 0 12px 0; font-size: 18px; }
          .features-list { color: #64748b; margin: 0; padding: 0; list-style: none; }
          .features-list li { margin: 12px 0; padding-left: 28px; position: relative; }
          .features-list li::before { content: '🎵'; position: absolute; left: 0; }
          .cta-section { text-align: center; margin: 40px 0; padding: 32px; background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%); border-radius: 16px; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; text-decoration: none; font-weight: 700; padding: 18px 36px; border-radius: 12px; transition: all 0.3s; font-size: 18px; box-shadow: 0 6px 16px rgba(139, 92, 246, 0.3); }
          .cta-button:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(139, 92, 246, 0.4); }
          .urgency-card { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center; }
          .urgency-text { color: #92400e; font-weight: 600; margin: 0; font-size: 14px; }
          .footer { background: #f1f5f9; padding: 32px 24px; text-align: center; }
          .footer-text { color: #64748b; font-size: 14px; margin: 8px 0; }
          .footer a { color: #8b5cf6; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">ISEP BANDS</h1>
            <p class="tagline">Association musicale de l'ISEP</p>
          </div>
          
          <div class="content">
            <h2 class="title">Salut {{ email }} !</h2>
            
            <p class="text">
              Tu as manifesté ton intérêt pour rejoindre ISEP Bands, l'association musicale de l'ISEP ! 
              Nous sommes ravis de ton enthousiasme pour la musique.
            </p>
            
            <div class="highlight-card">
              <h3 class="highlight-title">🚀 Finalise ton inscription maintenant</h3>
              <p style="color: #64748b; margin: 0; line-height: 1.6;">
                Pour faire partie officiellement de notre communauté musicale, il ne te reste qu'une étape : 
                compléter ton inscription sur notre plateforme.
              </p>
            </div>
            
            <div class="cta-section">
              <p style="color: #6366f1; font-weight: 600; margin: 0 0 20px 0; font-size: 16px;">
                Prêt(e) à rejoindre l'aventure ?
              </p>
              <a href="{{ registerUrl }}" class="cta-button">
                ✨ Terminer mon inscription
              </a>
            </div>
            
            <div class="highlight-card">
              <h3 class="highlight-title">Ce qui t'attend chez ISEP Bands</h3>
              <ul class="features-list">
                <li>Rejoindre des groupes musicaux avec d'autres étudiants</li>
                <li>Participer à des concerts et événements</li>
                <li>Accéder aux salles de répétition équipées</li>
                <li>Emprunter instruments et matériel audio</li>
                <li>Rencontrer des musiciens de tous niveaux</li>
                <li>Développer tes compétences musicales</li>
              </ul>
            </div>
            
            <div class="urgency-card">
              <p class="urgency-text">
                ⏰ Ne laisse pas passer cette opportunité ! Inscris-toi dès maintenant.
              </p>
            </div>
            
            <p class="text">
              Si tu as des questions ou besoin d'aide, n'hésite pas à nous contacter à 
              <a href="mailto:contact@isepbands.fr" style="color: #8b5cf6;">contact@isepbands.fr</a>
            </p>
            
            <p class="text">
              On a hâte de faire de la musique avec toi ! 🎶
            </p>
            
            <p style="color: #64748b; font-style: italic; margin-top: 32px;">
              L'équipe ISEP Bands
            </p>
          </div>
          
          <div class="footer">
            <p class="footer-text">&copy; 2024 ISEP Bands - Association musicale de l'ISEP</p>
            <p>
              <a href="https://isepbands.fr">Site web</a> • 
              <a href="mailto:contact@isepbands.fr">Contact</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    variables: {
      email: { type: 'string', description: 'Email du destinataire', required: true },
      registerUrl: { type: 'url', description: "URL de la page d'inscription", required: true },
    },
  },
  {
    name: 'Bienvenue newsletter',
    description: "Template d'accueil pour nouveaux abonnés newsletter",
    subject: 'Bienvenue dans la communauté ISEP Bands ! 🎵',
    templateType: 'NEWSLETTER' as const,
    isDefault: false,
    htmlContent: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenue - ISEP Bands Newsletter</title>
        <style>
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 24px; text-align: center; }
          .logo { color: white; font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 2px; }
          .tagline { color: #a7f3d0; font-size: 14px; margin: 8px 0 0 0; }
          .content { padding: 40px 24px; }
          .title { font-size: 26px; font-weight: 700; color: #1e293b; margin: 0 0 24px 0; line-height: 1.2; text-align: center; }
          .text { color: #64748b; line-height: 1.6; margin: 16px 0; font-size: 16px; }
          .welcome-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; }
          .welcome-icon { font-size: 48px; margin-bottom: 16px; }
          .welcome-title { color: #166534; font-weight: 600; margin: 0 0 12px 0; font-size: 20px; }
          .welcome-text { color: #15803d; margin: 0; }
          .info-section { background: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0; }
          .info-title { color: #1e293b; font-weight: 600; margin: 0 0 16px 0; font-size: 18px; }
          .info-list { color: #64748b; margin: 0; padding: 0; list-style: none; }
          .info-list li { margin: 12px 0; padding-left: 28px; position: relative; }
          .info-list li::before { content: '📧'; position: absolute; left: 0; }
          .social-section { text-align: center; margin: 32px 0; padding: 24px; background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%); border-radius: 12px; }
          .social-title { color: #6366f1; font-weight: 600; margin: 0 0 16px 0; font-size: 18px; }
          .social-links { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }
          .social-link { display: inline-block; padding: 10px 20px; background: #8b5cf6; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: transform 0.2s; }
          .social-link:hover { transform: translateY(-2px); }
          .footer { background: #f1f5f9; padding: 32px 24px; text-align: center; }
          .footer-text { color: #64748b; font-size: 14px; margin: 8px 0; }
          .footer a { color: #10b981; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
          .unsubscribe { margin-top: 16px; }
          .unsubscribe a { color: #9ca3af; font-size: 12px; text-decoration: none; }
          .unsubscribe a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">ISEP BANDS</h1>
            <p class="tagline">Newsletter</p>
          </div>
          
          <div class="content">
            <h2 class="title">Bienvenue dans notre communauté ! 🎉</h2>
            
            <div class="welcome-card">
              <div class="welcome-icon">🎵</div>
              <h3 class="welcome-title">Merci de ton abonnement !</h3>
              <p class="welcome-text">Tu fais maintenant partie de la communauté ISEP Bands</p>
            </div>
            
            <p class="text">
              Salut et bienvenue dans la newsletter d'ISEP Bands ! Nous sommes ravis que tu aies rejoint 
              notre communauté musicale. Tu vas recevoir toutes les actualités, événements et moments 
              forts de notre association.
            </p>
            
            <div class="info-section">
              <h3 class="info-title">Ce que tu vas recevoir</h3>
              <ul class="info-list">
                <li>Annonces des concerts et événements à venir</li>
                <li>Actualités des groupes et membres</li>
                <li>Conseils et astuces musicales</li>
                <li>Opportunités de collaboration musicale</li>
                <li>Coulisses et photos des répétitions</li>
                <li>Invitations exclusives aux événements privés</li>
              </ul>
            </div>
            
            <p class="text">
              Notre newsletter sort généralement <strong>2 fois par mois</strong>, et nous promettons 
              de ne pas spammer ta boîte mail ! Que du contenu de qualité sur l'univers musical de l'ISEP.
            </p>
            
            <div class="social-section">
              <h3 class="social-title">Suis-nous aussi sur nos réseaux</h3>
              <div class="social-links">
                <a href="https://instagram.com/isepbands" class="social-link">Instagram</a>
                <a href="https://facebook.com/isepbands" class="social-link">Facebook</a>
                <a href="https://isepbands.fr" class="social-link">Site Web</a>
              </div>
            </div>
            
            <p class="text">
              Si tu es étudiant(e) à l'ISEP et que tu souhaites rejoindre activement l'association, 
              n'hésite pas à <a href="https://isepbands.fr/register" style="color: #10b981;">créer ton compte membre</a> 
              pour accéder à toutes nos fonctionnalités !
            </p>
            
            <p style="color: #64748b; font-style: italic; text-align: center; margin-top: 32px;">
              Merci de faire partie de l'aventure ISEP Bands ! 🎶<br>
              L'équipe ISEP Bands
            </p>
          </div>
          
          <div class="footer">
            <p class="footer-text">&copy; 2024 ISEP Bands - Association musicale de l'ISEP</p>
            <p>
              <a href="https://isepbands.fr">Site web</a> • 
              <a href="mailto:contact@isepbands.fr">Contact</a>
            </p>
            <div class="unsubscribe">
              <a href="{{ unsubscribeUrl }}">Se désabonner de cette newsletter</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    variables: {
      unsubscribeUrl: { type: 'url', description: 'URL de désabonnement', required: true },
    },
  },
  {
    name: 'Confirmation desabonnement',
    description: 'Template de confirmation de désabonnement newsletter',
    subject: 'Désabonnement confirmé - ISEP Bands',
    templateType: 'NEWSLETTER' as const,
    isDefault: false,
    htmlContent: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Désabonnement confirmé - ISEP Bands</title>
        <style>
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); padding: 40px 24px; text-align: center; }
          .logo { color: white; font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 2px; }
          .tagline { color: #d1d5db; font-size: 14px; margin: 8px 0 0 0; }
          .content { padding: 40px 24px; }
          .title { font-size: 24px; font-weight: 600; color: #1e293b; margin: 0 0 24px 0; line-height: 1.2; text-align: center; }
          .text { color: #64748b; line-height: 1.6; margin: 16px 0; font-size: 16px; }
          .confirm-card { background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; }
          .confirm-icon { font-size: 48px; margin-bottom: 16px; }
          .confirm-title { color: #374151; font-weight: 600; margin: 0 0 12px 0; font-size: 18px; }
          .confirm-text { color: #6b7280; margin: 0; }
          .feedback-section { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0; }
          .feedback-title { color: #92400e; font-weight: 600; margin: 0 0 12px 0; font-size: 16px; }
          .feedback-text { color: #a16207; margin: 0; font-size: 14px; line-height: 1.5; }
          .resubscribe-section { text-align: center; margin: 32px 0; padding: 24px; background: #eff6ff; border-radius: 12px; }
          .resubscribe-title { color: #1e40af; font-weight: 600; margin: 0 0 12px 0; font-size: 16px; }
          .resubscribe-text { color: #3730a3; margin: 0 0 16px 0; font-size: 14px; }
          .resubscribe-button { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: transform 0.2s; }
          .resubscribe-button:hover { transform: translateY(-2px); }
          .footer { background: #f9fafb; padding: 32px 24px; text-align: center; }
          .footer-text { color: #6b7280; font-size: 14px; margin: 8px 0; }
          .footer a { color: #6b7280; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">ISEP BANDS</h1>
            <p class="tagline">Désabonnement</p>
          </div>
          
          <div class="content">
            <h2 class="title">Désabonnement confirmé</h2>
            
            <div class="confirm-card">
              <div class="confirm-icon">✅</div>
              <h3 class="confirm-title">C'est fait !</h3>
              <p class="confirm-text">Tu as été désabonné(e) de notre newsletter avec succès</p>
            </div>
            
            <p class="text">
              Ton email <strong>{{ email }}</strong> ne recevra plus nos newsletters à partir de maintenant.
              Nous respectons ta décision et te remercions pour l'intérêt que tu as porté à ISEP Bands.
            </p>
            
            <div class="feedback-section">
              <h3 class="feedback-title">💭 Ton avis nous intéresse</h3>
              <p class="feedback-text">
                Si tu as un moment, nous serions ravis de connaître les raisons de ton désabonnement 
                pour améliorer notre contenu. N'hésite pas à nous écrire à 
                <a href="mailto:contact@isepbands.fr" style="color: #92400e;">contact@isepbands.fr</a>
              </p>
            </div>
            
            <p class="text">
              <strong>Important :</strong> Si tu as un compte membre sur notre plateforme, celui-ci reste actif. 
              Seule la newsletter a été désactivée. Tu peux toujours accéder à ton espace membre et 
              participer aux activités de l'association.
            </p>
            
            <div class="resubscribe-section">
              <h3 class="resubscribe-title">Tu changes d'avis ?</h3>
              <p class="resubscribe-text">
                Tu peux te réabonner à tout moment en visitant notre site
              </p>
              <a href="https://isepbands.fr" class="resubscribe-button">Retourner sur le site</a>
            </div>
            
            <p class="text">
              Nous espérons te revoir bientôt dans notre communauté musicale ! En attendant, 
              tu peux toujours suivre nos actualités sur nos réseaux sociaux.
            </p>
            
            <p style="color: #64748b; font-style: italic; text-align: center; margin-top: 32px;">
              Merci d'avoir fait partie de l'aventure ISEP Bands ! 🎶<br>
              L'équipe ISEP Bands
            </p>
          </div>
          
          <div class="footer">
            <p class="footer-text">&copy; 2024 ISEP Bands - Association musicale de l'ISEP</p>
            <p>
              <a href="https://isepbands.fr">Site web</a> • 
              <a href="mailto:contact@isepbands.fr">Contact</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    variables: {
      email: { type: 'string', description: 'Email désabonné', required: true },
    },
  },
];
