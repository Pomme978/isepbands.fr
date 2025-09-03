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
            <h2 class="title">Félicitations {{ name }} !</h2>
            
            <div class="success-card">
              <div class="success-icon">🎉</div>
              <h3 class="success-title">Compte approuvé</h3>
              <p class="success-text">Ton compte a été approuvé par notre équipe</p>
            </div>
            
            <p class="text">
              Tu peux maintenant accéder à toutes les fonctionnalités de la plateforme ISEP Bands et rejoindre notre communauté musicale.
            </p>
            
            <div style="text-align: center;">
              <a href="https://isepbands.fr/login" class="cta-button">
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
    name: 'Compte non valide',
    description: 'Template de rappel pour valider son compte',
    subject: 'Valide ton compte ISEP Bands',
    templateType: 'SYSTEM' as const,
    isDefault: false,
    htmlContent: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Validation requise - ISEP Bands</title>
        <style>
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); padding: 40px 24px; text-align: center; }
          .logo { color: white; font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 2px; }
          .tagline { color: #fed7aa; font-size: 14px; margin: 8px 0 0 0; }
          .content { padding: 40px 24px; }
          .title { font-size: 24px; font-weight: 600; color: #1e293b; margin: 0 0 20px 0; line-height: 1.3; }
          .text { color: #64748b; line-height: 1.6; margin: 16px 0; font-size: 16px; }
          .alert-card { background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 24px; margin: 24px 0; }
          .alert-icon { color: #dc2626; font-size: 24px; margin-bottom: 12px; }
          .alert-title { color: #dc2626; font-weight: 600; margin: 0 0 8px 0; font-size: 16px; }
          .alert-text { color: #991b1b; font-size: 14px; margin: 0; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; text-decoration: none; font-weight: 600; padding: 16px 32px; border-radius: 8px; margin: 24px 0; transition: transform 0.2s; }
          .cta-button:hover { transform: translateY(-2px); }
          .help-card { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 16px; margin: 24px 0; }
          .help-text { color: #0369a1; font-size: 14px; margin: 0; }
          .footer { background: #f1f5f9; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
          .footer a { color: #f59e0b; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">ISEP BANDS</h1>
            <p class="tagline">Validation de compte</p>
          </div>
          
          <div class="content">
            <h2 class="title">Bonjour {{ name }},</h2>
            
            <p class="text">
              Ton compte ISEP Bands n'est pas encore validé. Pour accéder à toutes les fonctionnalités de la plateforme, tu dois valider ton compte.
            </p>
            
            <div class="alert-card">
              <div class="alert-icon">⚠️</div>
              <h3 class="alert-title">Action requise</h3>
              <p class="alert-text">
                Sans validation, tu ne pourras pas accéder à ton compte et aux services ISEP Bands.
              </p>
            </div>
            
            <div style="text-align: center;">
              <a href="{{ validationUrl }}" class="cta-button">
                Valider mon compte
              </a>
            </div>
            
            <div class="help-card">
              <p class="help-text">
                Des difficultés ? Contacte-nous à contact@isepbands.fr
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
      validationUrl: { type: 'url', description: 'URL de validation', required: true },
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
];
