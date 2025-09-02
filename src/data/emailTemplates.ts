export const baseEmailTemplates = [
  {
    name: 'Bienvenue - Base',
    description: 'Template par défaut pour les emails de bienvenue avec design ISEP Bands',
    subject: 'Bienvenue sur ISEP Bands ! 🎸',
    templateType: 'SYSTEM' as const,
    isDefault: true,
    htmlContent: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; max-width: 650px; margin: 0 auto; background: linear-gradient(135deg, #19192B 0%, #2D0446 100%); border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);">
        
        <!-- Header with gradient and logo -->
        <div style="background: linear-gradient(135deg, #FF2E5A 0%, #FF6B9D 100%); padding: 40px 24px; text-align: center; position: relative;">
          <!-- Musical notes decoration -->
          <div style="position: absolute; top: 10px; left: 20px; font-size: 24px; opacity: 0.3;">🎵</div>
          <div style="position: absolute; top: 15px; right: 30px; font-size: 20px; opacity: 0.4;">🎶</div>
          <div style="position: absolute; bottom: 10px; left: 40px; font-size: 18px; opacity: 0.3;">🎸</div>
          
          <!-- Logo placeholder - will be replaced by actual logo -->
          <div style="background: rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 16px; display: inline-block; margin-bottom: 16px; backdrop-filter: blur(10px);">
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);">ISEP BANDS</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 4px 0 0; font-size: 14px; font-weight: 500;">Association Musicale de l'ISEP</p>
          </div>
        </div>
        
        <!-- Main content -->
        <div style="padding: 40px 32px; background: #ffffff;">
          <!-- Welcome title with gradient text -->
          <h1 style="background: linear-gradient(135deg, #FF2E5A 0%, #2D0446 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 32px; font-weight: 800; line-height: 1.2; margin: 0 0 24px; text-align: center;">
            Bienvenue dans la famille ! 🎸
          </h1>
          
          <p style="color: #64748b; font-size: 18px; line-height: 1.6; margin: 0 0 20px; text-align: center;">
            Salut <strong style="color: #2D0446;">{{ name }}</strong> ! 👋
          </p>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.7; margin: 0 0 24px;">
            🎉 Ton compte ISEP Bands a été créé avec succès ! Tu fais maintenant partie de notre incroyable communauté musicale où la passion de la musique rassemble tous les étudiants de l'ISEP.
          </p>

          <!-- Credentials section with modern design -->
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 2px solid #e2e8f0; border-radius: 16px; padding: 24px; margin: 24px 0; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -10px; right: -10px; width: 60px; height: 60px; background: linear-gradient(45deg, #FF2E5A, #FF6B9D); border-radius: 50%; opacity: 0.1;"></div>
            
            <h3 style="color: #1e293b; font-size: 18px; font-weight: 700; margin: 0 0 16px; display: flex; align-items: center;">
              🔐 Tes identifiants de connexion
            </h3>
            
            <div style="background: #ffffff; border-radius: 8px; padding: 16px; margin: 12px 0; border-left: 4px solid #FF2E5A;">
              <p style="color: #64748b; font-size: 14px; margin: 0 0 8px;">📧 Email :</p>
              <p style="font-family: 'SF Mono', Monaco, monospace; font-size: 16px; color: #1e293b; margin: 0; font-weight: 600;">{{ email }}</p>
            </div>
            
            <div style="background: #ffffff; border-radius: 8px; padding: 16px; margin: 12px 0; border-left: 4px solid #2D0446;">
              <p style="color: #64748b; font-size: 14px; margin: 0 0 8px;">🔑 Mot de passe temporaire :</p>
              <p style="font-family: 'SF Mono', Monaco, monospace; font-size: 16px; color: #1e293b; margin: 0; font-weight: 600;">{{ temporaryPassword }}</p>
            </div>
            
            <!-- Warning alert -->
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 16px 0;">
              <p style="color: #92400e; font-size: 14px; line-height: 1.5; margin: 0; display: flex; align-items: flex-start; gap: 8px;">
                <span style="font-size: 16px;">⚠️</span>
                <span><strong>Important :</strong> Tu devras changer ce mot de passe lors de ta première connexion pour sécuriser ton compte.</span>
              </p>
            </div>
          </div>

          <!-- Call to action with gradient button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://isepbands.fr/login" style="background: linear-gradient(135deg, #FF2E5A 0%, #FF6B9D 100%); border-radius: 12px; color: #ffffff; font-size: 18px; font-weight: 700; text-decoration: none; display: inline-block; padding: 16px 40px; box-shadow: 0 4px 16px rgba(255, 46, 90, 0.4); transition: transform 0.2s; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);">
              🚀 Se connecter maintenant
            </a>
          </div>

          <!-- Features highlight -->
          <div style="background: linear-gradient(135deg, #19192B 0%, #2D0446 100%); border-radius: 16px; padding: 24px; margin: 32px 0;">
            <h3 style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0 0 16px; text-align: center;">
              🎵 Ce qui t'attend sur ISEP Bands
            </h3>
            <div style="display: grid; gap: 12px;">
              <p style="color: rgba(255, 255, 255, 0.9); font-size: 15px; margin: 0; display: flex; align-items: center; gap: 12px;">
                <span style="background: #FF2E5A; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px;">🎸</span>
                Rejoindre des groupes musicaux et créer tes propres projets
              </p>
              <p style="color: rgba(255, 255, 255, 0.9); font-size: 15px; margin: 0; display: flex; align-items: center; gap: 12px;">
                <span style="background: #2D0446; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px;">🎤</span>
                Participer aux événements et concerts organisés
              </p>
              <p style="color: rgba(255, 255, 255, 0.9); font-size: 15px; margin: 0; display: flex; align-items: center; gap: 12px;">
                <span style="background: #FF2E5A; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px;">🥁</span>
                Échanger avec une communauté passionnée de musique
              </p>
              <p style="color: rgba(255, 255, 255, 0.9); font-size: 15px; margin: 0; display: flex; align-items: center; gap: 12px;">
                <span style="background: #2D0446; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px;">📅</span>
                Accéder aux salles de répétition et équipements
              </p>
            </div>
          </div>
        </div>

        <!-- Footer with gradient and social links -->
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 32px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <!-- Social icons -->
          <div style="margin-bottom: 20px;">
            <a href="https://instagram.com/isepbands" style="display: inline-block; margin: 0 8px; padding: 8px; background: linear-gradient(135deg, #FF2E5A, #FF6B9D); border-radius: 8px; text-decoration: none;">
              <span style="color: white; font-size: 16px;">📷</span>
            </a>
            <a href="https://isepbands.fr" style="display: inline-block; margin: 0 8px; padding: 8px; background: linear-gradient(135deg, #2D0446, #19192B); border-radius: 8px; text-decoration: none;">
              <span style="color: white; font-size: 16px;">🌐</span>
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 8px; font-weight: 600;">
            © 2024 ISEP Bands - Association musicale de l'ISEP
          </p>
          <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0;">
            <a href="https://isepbands.fr" style="color: #FF2E5A; text-decoration: none; font-weight: 500;">Site web</a>
            <span style="margin: 0 8px; opacity: 0.5;">•</span>
            <a href="https://isepbands.fr/contact" style="color: #FF2E5A; text-decoration: none; font-weight: 500;">Contact</a>
            <span style="margin: 0 8px; opacity: 0.5;">•</span>
            <a href="https://instagram.com/isepbands" style="color: #FF2E5A; text-decoration: none; font-weight: 500;">Instagram</a>
          </p>
          <p style="color: #94a3b8; font-size: 11px; line-height: 1.4; margin: 16px 0 0; opacity: 0.8;">
            Cet email a été envoyé automatiquement. Pour toute question, contacte-nous via le site web.
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
    description: 'Template pour les emails de réinitialisation de mot de passe avec design moderne',
    subject: '🔐 Réinitialisation de ton mot de passe ISEP Bands',
    templateType: 'SYSTEM' as const,
    isDefault: true,
    htmlContent: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; max-width: 650px; margin: 0 auto; background: linear-gradient(135deg, #19192B 0%, #2D0446 100%); border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #FF2E5A 0%, #FF6B9D 100%); padding: 40px 24px; text-align: center; position: relative;">
          <div style="position: absolute; top: 15px; left: 25px; font-size: 20px; opacity: 0.3;">🔐</div>
          <div style="position: absolute; top: 20px; right: 30px; font-size: 18px; opacity: 0.4;">🔑</div>
          
          <div style="background: rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 16px; display: inline-block; margin-bottom: 16px; backdrop-filter: blur(10px);">
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);">ISEP BANDS</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 4px 0 0; font-size: 14px; font-weight: 500;">Réinitialisation de mot de passe</p>
          </div>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 32px; background: #ffffff;">
          <h1 style="background: linear-gradient(135deg, #FF2E5A 0%, #2D0446 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 28px; font-weight: 800; line-height: 1.2; margin: 0 0 24px; text-align: center;">
            Réinitialisation de mot de passe 🔐
          </h1>
          
          <p style="color: #64748b; font-size: 18px; line-height: 1.6; margin: 0 0 20px; text-align: center;">
            Salut <strong style="color: #2D0446;">{{ name }}</strong> ! 👋
          </p>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.7; margin: 0 0 24px;">
            Tu as demandé la réinitialisation de ton mot de passe pour ton compte ISEP Bands. Pas de souci, ça arrive à tout le monde ! 😊
          </p>

          <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #0ea5e9; border-radius: 16px; padding: 24px; margin: 24px 0;">
            <p style="color: #0c4a6e; font-size: 16px; line-height: 1.6; margin: 0; display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 20px;">ℹ️</span>
              <span>Clique sur le bouton ci-dessous pour créer un nouveau mot de passe sécurisé.</span>
            </p>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="{{ resetUrl }}" style="background: linear-gradient(135deg, #FF2E5A 0%, #FF6B9D 100%); border-radius: 12px; color: #ffffff; font-size: 18px; font-weight: 700; text-decoration: none; display: inline-block; padding: 16px 40px; box-shadow: 0 4px 16px rgba(255, 46, 90, 0.4); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);">
              🔑 Réinitialiser mon mot de passe
            </a>
          </div>

          <!-- Security warning -->
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="color: #92400e; font-size: 14px; line-height: 1.6; margin: 0; display: flex; align-items: flex-start; gap: 12px;">
              <span style="font-size: 18px;">⏰</span>
              <span><strong>Attention :</strong> Ce lien expirera dans <strong>1 heure</strong> pour des raisons de sécurité. Si tu n'as pas fait cette demande, tu peux ignorer cet email en toute sécurité.</span>
            </p>
          </div>

          <!-- Alternative link section -->
          <div style="border-top: 2px dashed #e2e8f0; margin: 32px 0; padding-top: 20px;">
            <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0; text-align: center;">
              Le bouton ne fonctionne pas ? Copie et colle ce lien dans ton navigateur :
            </p>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin: 12px 0; word-break: break-all;">
              <code style="color: #1e293b; font-size: 12px; font-family: 'SF Mono', Monaco, monospace;">{{ resetUrl }}</code>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 32px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <div style="margin-bottom: 20px;">
            <a href="https://instagram.com/isepbands" style="display: inline-block; margin: 0 8px; padding: 8px; background: linear-gradient(135deg, #FF2E5A, #FF6B9D); border-radius: 8px; text-decoration: none;">
              <span style="color: white; font-size: 16px;">📷</span>
            </a>
            <a href="https://isepbands.fr" style="display: inline-block; margin: 0 8px; padding: 8px; background: linear-gradient(135deg, #2D0446, #19192B); border-radius: 8px; text-decoration: none;">
              <span style="color: white; font-size: 16px;">🌐</span>
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 8px; font-weight: 600;">
            © 2024 ISEP Bands - Association musicale de l'ISEP
          </p>
          <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0;">
            <a href="https://isepbands.fr" style="color: #FF2E5A; text-decoration: none; font-weight: 500;">Site web</a>
            <span style="margin: 0 8px; opacity: 0.5;">•</span>
            <a href="https://isepbands.fr/contact" style="color: #FF2E5A; text-decoration: none; font-weight: 500;">Contact</a>
            <span style="margin: 0 8px; opacity: 0.5;">•</span>
            <a href="https://instagram.com/isepbands" style="color: #FF2E5A; text-decoration: none; font-weight: 500;">Instagram</a>
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
    description: 'Template pour notifier l\'approbation d\'un compte avec célébration',
    subject: '🎉 Ton compte ISEP Bands a été approuvé !',
    templateType: 'SYSTEM' as const,
    isDefault: true,
    htmlContent: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; max-width: 650px; margin: 0 auto; background: linear-gradient(135deg, #19192B 0%, #2D0446 100%); border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);">
        
        <!-- Celebration header -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #34d399 100%); padding: 40px 24px; text-align: center; position: relative; overflow: hidden;">
          <!-- Confetti decoration -->
          <div style="position: absolute; top: 10px; left: 20px; font-size: 24px; animation: bounce 2s infinite;">🎊</div>
          <div style="position: absolute; top: 15px; right: 30px; font-size: 20px; animation: bounce 2s infinite 0.5s;">🎉</div>
          <div style="position: absolute; bottom: 15px; left: 40px; font-size: 18px; animation: bounce 2s infinite 1s;">🎈</div>
          <div style="position: absolute; bottom: 10px; right: 25px; font-size: 22px; animation: bounce 2s infinite 1.5s;">✨</div>
          
          <div style="background: rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 16px; display: inline-block; margin-bottom: 16px; backdrop-filter: blur(10px);">
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);">ISEP BANDS</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 4px 0 0; font-size: 14px; font-weight: 500;">Bienvenue officielle ! 🎸</p>
          </div>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 32px; background: #ffffff;">
          <h1 style="background: linear-gradient(135deg, #10b981 0%, #34d399 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 36px; font-weight: 800; line-height: 1.2; margin: 0 0 24px; text-align: center;">
            Félicitations ! 🎉
          </h1>
          
          <p style="color: #64748b; font-size: 18px; line-height: 1.6; margin: 0 0 20px; text-align: center;">
            Salut <strong style="color: #2D0446;">{{ name }}</strong> ! 👋
          </p>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.7; margin: 0 0 24px;">
            🎊 Excellente nouvelle ! Ton compte ISEP Bands a été <strong>approuvé</strong> par notre équipe d'administration. Tu es maintenant officiellement membre de notre famille musicale !
          </p>

          <!-- Success celebration box -->
          <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border: 3px solid #10b981; border-radius: 16px; padding: 24px; margin: 24px 0; text-align: center; position: relative;">
            <div style="font-size: 48px; margin-bottom: 12px;">🎸🎤🥁</div>
            <h3 style="color: #065f46; font-size: 20px; font-weight: 700; margin: 0 0 8px;">
              Ton compte est maintenant actif !
            </h3>
            <p style="color: #047857; font-size: 16px; margin: 0;">
              Tu as accès à toutes les fonctionnalités de la plateforme
            </p>
          </div>

          <!-- Features grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 32px 0;">
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 8px;">🎸</div>
              <h4 style="color: #92400e; font-size: 14px; font-weight: 700; margin: 0;">Rejoindre des groupes</h4>
            </div>
            <div style="background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%); border: 2px solid #ec4899; border-radius: 12px; padding: 20px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 8px;">🎤</div>
              <h4 style="color: #9d174d; font-size: 14px; font-weight: 700; margin: 0;">Participer aux events</h4>
            </div>
            <div style="background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%); border: 2px solid #0284c7; border-radius: 12px; padding: 20px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 8px;">🥁</div>
              <h4 style="color: #0c4a6e; font-size: 14px; font-weight: 700; margin: 0;">Accès aux studios</h4>
            </div>
            <div style="background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); border: 2px solid #9333ea; border-radius: 12px; padding: 20px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 8px;">👥</div>
              <h4 style="color: #581c87; font-size: 14px; font-weight: 700; margin: 0;">Communauté active</h4>
            </div>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://isepbands.fr/login" style="background: linear-gradient(135deg, #10b981 0%, #34d399 100%); border-radius: 12px; color: #ffffff; font-size: 18px; font-weight: 700; text-decoration: none; display: inline-block; padding: 16px 40px; box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);">
              🚀 Découvrir ma plateforme
            </a>
          </div>

          <!-- Welcome message -->
          <div style="background: linear-gradient(135deg, #19192B 0%, #2D0446 100%); border-radius: 16px; padding: 24px; margin: 32px 0; text-align: center;">
            <h3 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 12px;">
              Bienvenue dans la famille ISEP Bands ! 🎸🎶
            </h3>
            <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 0; line-height: 1.6;">
              Que tu sois guitariste, batteur, chanteur, ou simplement passionné de musique,<br>tu trouveras ta place parmi nous. Let's rock ! 🤘
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 32px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <div style="margin-bottom: 20px;">
            <a href="https://instagram.com/isepbands" style="display: inline-block; margin: 0 8px; padding: 8px; background: linear-gradient(135deg, #FF2E5A, #FF6B9D); border-radius: 8px; text-decoration: none;">
              <span style="color: white; font-size: 16px;">📷</span>
            </a>
            <a href="https://isepbands.fr" style="display: inline-block; margin: 0 8px; padding: 8px; background: linear-gradient(135deg, #2D0446, #19192B); border-radius: 8px; text-decoration: none;">
              <span style="color: white; font-size: 16px;">🌐</span>
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 8px; font-weight: 600;">
            © 2024 ISEP Bands - Association musicale de l'ISEP
          </p>
          <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0;">
            <a href="https://isepbands.fr" style="color: #10b981; text-decoration: none; font-weight: 500;">Site web</a>
            <span style="margin: 0 8px; opacity: 0.5;">•</span>
            <a href="https://isepbands.fr/contact" style="color: #10b981; text-decoration: none; font-weight: 500;">Contact</a>
            <span style="margin: 0 8px; opacity: 0.5;">•</span>
            <a href="https://instagram.com/isepbands" style="color: #10b981; text-decoration: none; font-weight: 500;">Instagram</a>
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
    description: 'Template pour notifier le rejet d\'une demande d\'inscription avec empathie',
    subject: 'Concernant ta demande d\'inscription ISEP Bands',
    templateType: 'SYSTEM' as const,
    isDefault: true,
    htmlContent: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; max-width: 650px; margin: 0 auto; background: linear-gradient(135deg, #19192B 0%, #2D0446 100%); border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);">
        
        <!-- Header with softer colors -->
        <div style="background: linear-gradient(135deg, #64748b 0%, #94a3b8 100%); padding: 40px 24px; text-align: center; position: relative;">
          <div style="position: absolute; top: 15px; left: 25px; font-size: 20px; opacity: 0.3;">📋</div>
          <div style="position: absolute; top: 20px; right: 30px; font-size: 18px; opacity: 0.4;">✉️</div>
          
          <div style="background: rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 16px; display: inline-block; margin-bottom: 16px; backdrop-filter: blur(10px);">
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);">ISEP BANDS</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 4px 0 0; font-size: 14px; font-weight: 500;">Réponse à ta candidature</p>
          </div>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 32px; background: #ffffff;">
          <h1 style="color: #475569; font-size: 28px; font-weight: 700; line-height: 1.2; margin: 0 0 24px; text-align: center;">
            Concernant ta demande d'inscription
          </h1>
          
          <p style="color: #64748b; font-size: 18px; line-height: 1.6; margin: 0 0 20px; text-align: center;">
            Bonjour <strong style="color: #2D0446;">{{ name }}</strong> 👋
          </p>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.7; margin: 0 0 24px;">
            Merci d'avoir pris le temps de postuler pour rejoindre ISEP Bands. Nous avons soigneusement examiné ta demande d'inscription.
          </p>

          <p style="color: #475569; font-size: 16px; line-height: 1.7; margin: 0 0 24px;">
            Après étude de ton dossier, nous sommes au regret de t'informer que nous ne pouvons pas approuver ton compte pour le moment.
          </p>

          <!-- Reason section with gentle styling -->
          <div style="background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%); border-left: 4px solid #ef4444; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #991b1b; font-size: 16px; font-weight: 600; margin: 0 0 8px; display: flex; align-items: center; gap: 8px;">
              <span>ℹ️</span> Raison de ce refus
            </h3>
            <p style="color: #7f1d1d; font-size: 15px; line-height: 1.6; margin: 0;">
              {{ reason }}
            </p>
          </div>

          <!-- Support section -->
          <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #0ea5e9; border-radius: 12px; padding: 24px; margin: 24px 0;">
            <h3 style="color: #0c4a6e; font-size: 18px; font-weight: 700; margin: 0 0 12px; display: flex; align-items: center; gap: 8px;">
              <span>💬</span> Besoin d'aide ?
            </h3>
            <p style="color: #0369a1; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
              Si tu penses qu'il s'agit d'une erreur ou si tu souhaites obtenir plus d'informations sur cette décision, n'hésite pas à nous contacter.
            </p>
            <div style="text-align: center;">
              <a href="https://isepbands.fr/contact" style="background: #0ea5e9; border-radius: 8px; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; display: inline-block; padding: 10px 20px;">
                📧 Nous contacter
              </a>
            </div>
          </div>

          <!-- Encouragement section -->
          <div style="background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
            <h3 style="color: #581c87; font-size: 18px; font-weight: 700; margin: 0 0 12px;">
              🎵 La musique nous rassemble
            </h3>
            <p style="color: #7c3aed; font-size: 15px; line-height: 1.6; margin: 0;">
              Même si nous ne pouvons pas t'accueillir maintenant, n'hésite pas à suivre nos actualités et événements ouverts à tous sur nos réseaux sociaux !
            </p>
          </div>

          <div style="border-top: 2px dashed #e2e8f0; margin: 32px 0; padding-top: 20px;">
            <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0; text-align: center;">
              Merci pour ton intérêt pour ISEP Bands.<br>
              L'équipe d'administration
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 32px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <div style="margin-bottom: 20px;">
            <a href="https://instagram.com/isepbands" style="display: inline-block; margin: 0 8px; padding: 8px; background: linear-gradient(135deg, #FF2E5A, #FF6B9D); border-radius: 8px; text-decoration: none;">
              <span style="color: white; font-size: 16px;">📷</span>
            </a>
            <a href="https://isepbands.fr" style="display: inline-block; margin: 0 8px; padding: 8px; background: linear-gradient(135deg, #2D0446, #19192B); border-radius: 8px; text-decoration: none;">
              <span style="color: white; font-size: 16px;">🌐</span>
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 8px; font-weight: 600;">
            © 2024 ISEP Bands - Association musicale de l'ISEP
          </p>
          <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0;">
            <a href="https://isepbands.fr" style="color: #64748b; text-decoration: none; font-weight: 500;">Site web</a>
            <span style="margin: 0 8px; opacity: 0.5;">•</span>
            <a href="https://isepbands.fr/contact" style="color: #64748b; text-decoration: none; font-weight: 500;">Contact</a>
            <span style="margin: 0 8px; opacity: 0.5;">•</span>
            <a href="https://instagram.com/isepbands" style="color: #64748b; text-decoration: none; font-weight: 500;">Instagram</a>
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
    name: 'Newsletter - Template moderne',
    description: 'Template moderne pour les newsletters avec design ISEP Bands',
    subject: '🎵 Newsletter ISEP Bands - {{ title }}',
    templateType: 'NEWSLETTER' as const,
    isDefault: true,
    htmlContent: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; max-width: 650px; margin: 0 auto; background: linear-gradient(135deg, #19192B 0%, #2D0446 100%); border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);">
        
        <!-- Newsletter header with dynamic elements -->
        <div style="background: linear-gradient(135deg, #FF2E5A 0%, #FF6B9D 100%); padding: 40px 24px; text-align: center; position: relative; overflow: hidden;">
          <!-- Animated musical elements -->
          <div style="position: absolute; top: 10px; left: 15px; font-size: 20px; opacity: 0.3; animation: float 3s ease-in-out infinite;">🎵</div>
          <div style="position: absolute; top: 15px; right: 20px; font-size: 18px; opacity: 0.4; animation: float 3s ease-in-out infinite 1s;">🎶</div>
          <div style="position: absolute; bottom: 15px; left: 25px; font-size: 16px; opacity: 0.3; animation: float 3s ease-in-out infinite 2s;">🎸</div>
          <div style="position: absolute; bottom: 10px; right: 30px; font-size: 22px; opacity: 0.4; animation: float 3s ease-in-out infinite 0.5s;">🎤</div>
          
          <!-- Logo section -->
          <div style="background: rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 20px; display: inline-block; margin-bottom: 16px; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1);">
            <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: 800; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);">ISEP BANDS</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0; font-size: 16px; font-weight: 600;">Newsletter {{ date }}</p>
          </div>
          
          <!-- Newsletter badge -->
          <div style="background: rgba(255, 255, 255, 0.9); color: #FF2E5A; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: 700; font-size: 14px; margin-top: 8px;">
            📮 NEWSLETTER OFFICIELLE
          </div>
        </div>
        
        <!-- Main content -->
        <div style="padding: 40px 32px; background: #ffffff;">
          <!-- Title with gradient effect -->
          <h1 style="background: linear-gradient(135deg, #FF2E5A 0%, #2D0446 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 32px; font-weight: 800; line-height: 1.2; margin: 0 0 32px; text-align: center; text-shadow: none;">
            {{ title }}
          </h1>
          
          <!-- Content with enhanced styling -->
          <div style="color: #475569; font-size: 16px; line-height: 1.8; margin-bottom: 32px;">
            <div style="border-left: 4px solid #FF2E5A; padding-left: 24px; margin: 24px 0;">
              {{ content }}
            </div>
          </div>

          <!-- Feature highlights section -->
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; padding: 24px; margin: 32px 0;">
            <h3 style="color: #1e293b; font-size: 20px; font-weight: 700; margin: 0 0 16px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 8px;">
              <span>⭐</span> À ne pas manquer
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 20px;">
              <div style="text-align: center; padding: 16px;">
                <div style="font-size: 32px; margin-bottom: 8px;">🎸</div>
                <p style="color: #64748b; font-size: 14px; margin: 0; font-weight: 500;">Nouveaux groupes</p>
              </div>
              <div style="text-align: center; padding: 16px;">
                <div style="font-size: 32px; margin-bottom: 8px;">🎤</div>
                <p style="color: #64748b; font-size: 14px; margin: 0; font-weight: 500;">Concerts à venir</p>
              </div>
              <div style="text-align: center; padding: 16px;">
                <div style="font-size: 32px; margin-bottom: 8px;">📅</div>
                <p style="color: #64748b; font-size: 14px; margin: 0; font-weight: 500;">Événements du mois</p>
              </div>
            </div>
          </div>

          <!-- Call to action with enhanced design -->
          <div style="text-align: center; margin: 40px 0;">
            <div style="background: linear-gradient(135deg, #19192B 0%, #2D0446 100%); border-radius: 16px; padding: 32px; margin: 24px 0;">
              <h3 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 16px;">
                🚀 Prêt à découvrir ?
              </h3>
              <p style="color: rgba(255, 255, 255, 0.8); font-size: 16px; margin: 0 0 24px;">
                Clique ci-dessous pour accéder à toutes les nouveautés !
              </p>
              <a href="{{ ctaUrl }}" style="background: linear-gradient(135deg, #FF2E5A 0%, #FF6B9D 100%); border-radius: 12px; color: #ffffff; font-size: 18px; font-weight: 700; text-decoration: none; display: inline-block; padding: 16px 40px; box-shadow: 0 4px 16px rgba(255, 46, 90, 0.4); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); transition: transform 0.2s;">
                {{ ctaText }} →
              </a>
            </div>
          </div>

          <!-- Community section -->
          <div style="border: 2px dashed #e2e8f0; border-radius: 12px; padding: 24px; margin: 32px 0; text-align: center;">
            <h3 style="color: #475569; font-size: 18px; font-weight: 600; margin: 0 0 12px;">
              💬 Rejoins la communauté
            </h3>
            <p style="color: #64748b; font-size: 14px; margin: 0 0 16px;">
              Suis-nous sur les réseaux pour ne rien rater !
            </p>
            <div style="display: flex; justify-content: center; gap: 12px;">
              <a href="https://instagram.com/isepbands" style="background: linear-gradient(135deg, #FF2E5A, #FF6B9D); padding: 8px 16px; border-radius: 20px; color: white; text-decoration: none; font-size: 14px; font-weight: 600;">
                📷 Instagram
              </a>
              <a href="https://isepbands.fr" style="background: linear-gradient(135deg, #2D0446, #19192B); padding: 8px 16px; border-radius: 20px; color: white; text-decoration: none; font-size: 14px; font-weight: 600;">
                🌐 Site Web
              </a>
            </div>
          </div>
        </div>

        <!-- Enhanced footer -->
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 32px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <!-- Social media section -->
          <div style="margin-bottom: 24px;">
            <p style="color: #64748b; font-size: 16px; font-weight: 600; margin: 0 0 12px;">Retrouve-nous sur :</p>
            <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 16px;">
              <a href="https://instagram.com/isepbands" style="display: inline-block; padding: 12px; background: linear-gradient(135deg, #FF2E5A, #FF6B9D); border-radius: 10px; text-decoration: none;">
                <span style="color: white; font-size: 18px;">📷</span>
              </a>
              <a href="https://isepbands.fr" style="display: inline-block; padding: 12px; background: linear-gradient(135deg, #2D0446, #19192B); border-radius: 10px; text-decoration: none;">
                <span style="color: white; font-size: 18px;">🌐</span>
              </a>
            </div>
          </div>
          
          <!-- Company info -->
          <div style="border-top: 1px solid #cbd5e1; padding-top: 20px;">
            <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 8px; font-weight: 600;">
              © 2024 ISEP Bands - Association musicale de l'ISEP
            </p>
            <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0 0 16px;">
              <a href="https://isepbands.fr" style="color: #FF2E5A; text-decoration: none; font-weight: 500;">Site web</a>
              <span style="margin: 0 8px; opacity: 0.5;">•</span>
              <a href="https://isepbands.fr/contact" style="color: #FF2E5A; text-decoration: none; font-weight: 500;">Contact</a>
              <span style="margin: 0 8px; opacity: 0.5;">•</span>
              <a href="https://isepbands.fr/privacy" style="color: #FF2E5A; text-decoration: none; font-weight: 500;">Confidentialité</a>
            </p>
            
            <!-- Unsubscribe section -->
            <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; margin: 16px 0;">
              <p style="color: #64748b; font-size: 12px; line-height: 1.4; margin: 0 0 8px;">
                Tu reçois cette newsletter car tu es abonné aux actualités ISEP Bands.
              </p>
              <p style="margin: 0;">
                <a href="{{ unsubscribeUrl }}" style="color: #64748b; text-decoration: underline; font-size: 12px;">
                  Se désabonner de cette newsletter
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Add floating animation keyframes -->
      <style>
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
      </style>
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