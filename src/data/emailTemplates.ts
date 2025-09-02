export const baseEmailTemplates = [
  {
    name: 'Bienvenue - Base',
    description: 'Template par défaut pour les emails de bienvenue',
    subject: 'Bienvenue sur ISEP Bands ! 🎸',
    templateType: 'SYSTEM' as const,
    isDefault: true,
    htmlContent: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: #1e293b; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">ISEP Bands</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 32px 24px;">
          <h1 style="color: #1e293b; font-size: 28px; font-weight: 700; line-height: 36px; margin: 0 0 24px;">
            Bienvenue sur ISEP Bands ! 🎸
          </h1>
          
          <p style="color: #475569; font-size: 16px; line-height: 26px; margin: 0 0 16px;">
            Bonjour {{ name }},
          </p>
          
          <p style="color: #475569; font-size: 16px; line-height: 26px; margin: 0 0 16px;">
            Votre compte ISEP Bands a été créé avec succès. Vous faites maintenant partie de notre communauté musicale !
          </p>

          <!-- Temporary password section (conditionally shown) -->
          <div style="background: #f1f5f9; border-radius: 6px; padding: 16px; margin: 16px 0;">
            <p style="color: #475569; font-size: 16px; line-height: 26px; margin: 0 0 8px;">Vos identifiants de connexion :</p>
            <p style="font-family: monospace; font-size: 14px; color: #1e293b; margin: 0 0 8px;">
              Email : <strong>{{ email }}</strong>
            </p>
            <p style="font-family: monospace; font-size: 14px; color: #1e293b; margin: 0 0 8px;">
              Mot de passe temporaire : <strong>{{ temporaryPassword }}</strong>
            </p>
            <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 6px; padding: 12px 16px; margin: 16px 0;">
              <p style="color: #92400e; font-size: 14px; line-height: 20px; margin: 0;">
                ⚠️ Vous devrez changer ce mot de passe lors de votre première connexion.
              </p>
            </div>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://isepbands.fr/login" style="background: #3b82f6; border-radius: 6px; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; display: inline-block; padding: 12px 32px;">
              Se connecter
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 24px; text-align: center;">
          <p style="color: #64748b; font-size: 14px; line-height: 24px; margin: 0 0 8px;">
            © ${new Date().getFullYear()} ISEP Bands - Association musicale de l'ISEP
          </p>
          <p style="color: #64748b; font-size: 14px; line-height: 24px; margin: 0 0 8px;">
            <a href="https://isepbands.fr" style="color: #3b82f6; text-decoration: none;">Site web</a>
            •
            <a href="https://isepbands.fr/contact" style="color: #3b82f6; text-decoration: none;">Contact</a>
            •
            <a href="https://instagram.com/isepbands" style="color: #3b82f6; text-decoration: none;">Instagram</a>
          </p>
          <p style="color: #94a3b8; font-size: 12px; line-height: 20px; margin: 8px 0 0;">
            Cet email a été envoyé automatiquement, merci de ne pas y répondre.
          </p>
        </div>
      </div>
    `,
    variables: {
      name: { type: 'string', description: 'Nom de l\'utilisateur', required: true },
      email: { type: 'string', description: 'Email de l\'utilisateur', required: true },
      temporaryPassword: { type: 'string', description: 'Mot de passe temporaire (optionnel)', required: false }
    }
  },
  {
    name: 'Réinitialisation mot de passe',
    description: 'Template pour les emails de réinitialisation de mot de passe',
    subject: 'Réinitialisation de votre mot de passe ISEP Bands',
    templateType: 'SYSTEM' as const,
    isDefault: true,
    htmlContent: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: #1e293b; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">ISEP Bands</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 32px 24px;">
          <h1 style="color: #1e293b; font-size: 28px; font-weight: 700; line-height: 36px; margin: 0 0 24px;">
            Réinitialisation de mot de passe 🔐
          </h1>
          
          <p style="color: #475569; font-size: 16px; line-height: 26px; margin: 0 0 16px;">
            Bonjour {{ name }},
          </p>
          
          <p style="color: #475569; font-size: 16px; line-height: 26px; margin: 0 0 16px;">
            Vous avez demandé la réinitialisation de votre mot de passe pour votre compte ISEP Bands.
          </p>

          <p style="color: #475569; font-size: 16px; line-height: 26px; margin: 0 0 16px;">
            Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :
          </p>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 32px 0;">
            <a href="{{ resetUrl }}" style="background: #3b82f6; border-radius: 6px; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; display: inline-block; padding: 12px 32px;">
              Réinitialiser mon mot de passe
            </a>
          </div>

          <!-- Warning -->
          <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 6px; padding: 12px 16px; margin: 16px 0;">
            <p style="color: #92400e; font-size: 14px; line-height: 20px; margin: 0;">
              ⏰ Ce lien expirera dans 1 heure pour des raisons de sécurité.
            </p>
          </div>

          <p style="color: #64748b; font-size: 14px; line-height: 26px; margin: 16px 0;">
            Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.
            Votre mot de passe restera inchangé.
          </p>

          <div style="border-top: 1px solid #e2e8f0; margin: 24px 0;"></div>

          <p style="color: #94a3b8; font-size: 12px; line-height: 20px; margin: 0;">
            Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
            <br />
            <span style="word-break: break-all;">{{ resetUrl }}</span>
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 24px; text-align: center;">
          <p style="color: #64748b; font-size: 14px; line-height: 24px; margin: 0 0 8px;">
            © ${new Date().getFullYear()} ISEP Bands - Association musicale de l'ISEP
          </p>
          <p style="color: #64748b; font-size: 14px; line-height: 24px; margin: 0 0 8px;">
            <a href="https://isepbands.fr" style="color: #3b82f6; text-decoration: none;">Site web</a>
            •
            <a href="https://isepbands.fr/contact" style="color: #3b82f6; text-decoration: none;">Contact</a>
            •
            <a href="https://instagram.com/isepbands" style="color: #3b82f6; text-decoration: none;">Instagram</a>
          </p>
          <p style="color: #94a3b8; font-size: 12px; line-height: 20px; margin: 8px 0 0;">
            Cet email a été envoyé automatiquement, merci de ne pas y répondre.
          </p>
        </div>
      </div>
    `,
    variables: {
      name: { type: 'string', description: 'Nom de l\'utilisateur', required: true },
      resetUrl: { type: 'url', description: 'URL de réinitialisation du mot de passe', required: true }
    }
  },
  {
    name: 'Compte approuvé',
    description: 'Template pour notifier l\'approbation d\'un compte',
    subject: 'Votre compte ISEP Bands a été approuvé ! 🎉',
    templateType: 'SYSTEM' as const,
    isDefault: true,
    htmlContent: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: #1e293b; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">ISEP Bands</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 32px 24px;">
          <h1 style="color: #1e293b; font-size: 28px; font-weight: 700; line-height: 36px; margin: 0 0 24px;">
            Félicitations ! 🎉
          </h1>
          
          <p style="color: #475569; font-size: 16px; line-height: 26px; margin: 0 0 16px;">
            Bonjour {{ name }},
          </p>
          
          <p style="color: #475569; font-size: 16px; line-height: 26px; margin: 0 0 16px;">
            Excellente nouvelle ! Votre compte ISEP Bands a été approuvé par notre équipe d'administration.
          </p>

          <!-- Success box -->
          <div style="background: #d1fae5; border: 1px solid #34d399; border-radius: 6px; padding: 12px 16px; margin: 16px 0;">
            <p style="color: #065f46; font-size: 14px; line-height: 20px; margin: 0;">
              ✅ Votre compte est maintenant actif et vous avez accès à toutes les fonctionnalités du site !
            </p>
          </div>

          <p style="color: #475569; font-size: 16px; line-height: 26px; margin: 16px 0 8px;">
            Vous pouvez désormais :
          </p>

          <ul style="color: #475569; font-size: 16px; line-height: 26px; padding-left: 20px; margin: 0 0 24px;">
            <li>Consulter votre profil et le personnaliser</li>
            <li>Accéder aux événements et actualités</li>
            <li>Participer à la vie de l'association</li>
            <li>Échanger avec les autres membres</li>
          </ul>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://isepbands.fr/login" style="background: #10b981; border-radius: 6px; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; display: inline-block; padding: 12px 32px;">
              Se connecter maintenant
            </a>
          </div>

          <p style="color: #475569; font-size: 16px; line-height: 26px; margin: 16px 0;">
            Bienvenue dans la famille ISEP Bands ! 🎸🎤🥁
          </p>

          <div style="border-top: 1px solid #e2e8f0; margin: 24px 0;"></div>

          <p style="color: #64748b; font-size: 14px; line-height: 26px; margin: 0;">
            Si vous avez des questions, n'hésitez pas à nous contacter via le site ou sur nos réseaux sociaux.
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 24px; text-align: center;">
          <p style="color: #64748b; font-size: 14px; line-height: 24px; margin: 0 0 8px;">
            © ${new Date().getFullYear()} ISEP Bands - Association musicale de l'ISEP
          </p>
          <p style="color: #64748b; font-size: 14px; line-height: 24px; margin: 0 0 8px;">
            <a href="https://isepbands.fr" style="color: #3b82f6; text-decoration: none;">Site web</a>
            •
            <a href="https://isepbands.fr/contact" style="color: #3b82f6; text-decoration: none;">Contact</a>
            •
            <a href="https://instagram.com/isepbands" style="color: #3b82f6; text-decoration: none;">Instagram</a>
          </p>
          <p style="color: #94a3b8; font-size: 12px; line-height: 20px; margin: 8px 0 0;">
            Cet email a été envoyé automatiquement, merci de ne pas y répondre.
          </p>
        </div>
      </div>
    `,
    variables: {
      name: { type: 'string', description: 'Nom de l\'utilisateur', required: true }
    }
  },
  {
    name: 'Compte rejeté',
    description: 'Template pour notifier le rejet d\'une demande d\'inscription',
    subject: 'Concernant votre demande d\'inscription ISEP Bands',
    templateType: 'SYSTEM' as const,
    isDefault: true,
    htmlContent: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: #1e293b; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">ISEP Bands</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 32px 24px;">
          <h1 style="color: #1e293b; font-size: 28px; font-weight: 700; line-height: 36px; margin: 0 0 24px;">
            Concernant votre demande d'inscription
          </h1>
          
          <p style="color: #475569; font-size: 16px; line-height: 26px; margin: 0 0 16px;">
            Bonjour {{ name }},
          </p>
          
          <p style="color: #475569; font-size: 16px; line-height: 26px; margin: 0 0 16px;">
            Nous avons bien reçu et examiné votre demande d'inscription sur la plateforme ISEP Bands.
          </p>

          <p style="color: #475569; font-size: 16px; line-height: 26px; margin: 0 0 16px;">
            Après étude de votre dossier, nous sommes au regret de vous informer que nous ne pouvons pas 
            approuver votre compte pour le moment.
          </p>

          <!-- Reason box (if provided) -->
          <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 16px 0;">
            <p style="color: #475569; font-size: 16px; line-height: 26px; margin: 0;">
              <strong>Raison :</strong> {{ reason }}
            </p>
          </div>

          <p style="color: #475569; font-size: 16px; line-height: 26px; margin: 16px 0;">
            Si vous pensez qu'il s'agit d'une erreur ou si vous souhaitez obtenir plus d'informations, 
            n'hésitez pas à nous contacter directement.
          </p>

          <div style="border-top: 1px solid #e2e8f0; margin: 24px 0;"></div>

          <p style="color: #64748b; font-size: 14px; line-height: 26px; margin: 0;">
            Nous restons à votre disposition pour toute question.
            <br />
            L'équipe ISEP Bands
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 24px; text-align: center;">
          <p style="color: #64748b; font-size: 14px; line-height: 24px; margin: 0 0 8px;">
            © ${new Date().getFullYear()} ISEP Bands - Association musicale de l'ISEP
          </p>
          <p style="color: #64748b; font-size: 14px; line-height: 24px; margin: 0 0 8px;">
            <a href="https://isepbands.fr" style="color: #3b82f6; text-decoration: none;">Site web</a>
            •
            <a href="https://isepbands.fr/contact" style="color: #3b82f6; text-decoration: none;">Contact</a>
            •
            <a href="https://instagram.com/isepbands" style="color: #3b82f6; text-decoration: none;">Instagram</a>
          </p>
          <p style="color: #94a3b8; font-size: 12px; line-height: 20px; margin: 8px 0 0;">
            Cet email a été envoyé automatiquement, merci de ne pas y répondre.
          </p>
        </div>
      </div>
    `,
    variables: {
      name: { type: 'string', description: 'Nom de l\'utilisateur', required: true },
      reason: { type: 'string', description: 'Raison du rejet (optionnel)', required: false }
    }
  },
  {
    name: 'Newsletter - Template de base',
    description: 'Template de base pour les newsletters',
    subject: '🎵 Newsletter ISEP Bands - {{ title }}',
    templateType: 'NEWSLETTER' as const,
    isDefault: true,
    htmlContent: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: #1e293b; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">ISEP Bands</h1>
          <p style="color: #94a3b8; margin: 8px 0 0; font-size: 14px;">Newsletter {{ date }}</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 32px 24px;">
          <h1 style="color: #1e293b; font-size: 28px; font-weight: 700; line-height: 36px; margin: 0 0 24px;">
            {{ title }}
          </h1>
          
          <div style="color: #475569; font-size: 16px; line-height: 26px;">
            {{ content }}
          </div>

          <!-- Call to action -->
          <div style="text-align: center; margin: 32px 0;">
            <a href="{{ ctaUrl }}" style="background: #3b82f6; border-radius: 6px; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; display: inline-block; padding: 12px 32px;">
              {{ ctaText }}
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 24px; text-align: center;">
          <p style="color: #64748b; font-size: 14px; line-height: 24px; margin: 0 0 8px;">
            © ${new Date().getFullYear()} ISEP Bands - Association musicale de l'ISEP
          </p>
          <p style="color: #64748b; font-size: 14px; line-height: 24px; margin: 0 0 8px;">
            <a href="https://isepbands.fr" style="color: #3b82f6; text-decoration: none;">Site web</a>
            •
            <a href="https://isepbands.fr/contact" style="color: #3b82f6; text-decoration: none;">Contact</a>
            •
            <a href="https://instagram.com/isepbands" style="color: #3b82f6; text-decoration: none;">Instagram</a>
          </p>
          <p style="color: #64748b; font-size: 12px; line-height: 20px; margin: 8px 0;">
            Vous recevez cet email car vous êtes abonné à notre newsletter.
            <br />
            <a href="{{ unsubscribeUrl }}" style="color: #3b82f6; text-decoration: none;">Se désabonner</a>
          </p>
        </div>
      </div>
    `,
    variables: {
      title: { type: 'string', description: 'Titre de la newsletter', required: true },
      content: { type: 'html', description: 'Contenu principal de la newsletter', required: true },
      date: { type: 'string', description: 'Date de la newsletter', required: false },
      ctaText: { type: 'string', description: 'Texte du bouton d\'action', required: false },
      ctaUrl: { type: 'url', description: 'URL du bouton d\'action', required: false },
      unsubscribeUrl: { type: 'url', description: 'URL de désabonnement', required: true }
    }
  }
];