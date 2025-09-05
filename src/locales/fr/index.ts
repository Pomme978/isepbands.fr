const fr = {
  api: {
    errors: {
      unauthorized: 'Non autorisé',
      forbidden: 'Interdit',
      notFound: 'Introuvable',
      fileNotFound: 'Fichier introuvable sur le disque',
      missingId: 'Paramètre id manquant',
      unableToWrite: "Impossible d'écrire le fichier",
      emailInUse: 'Cet email est déjà utilisé.',
      registrationError: 'Erreur lors de la demande.',
      unknown: 'Erreur inconnue',
    },
  },
  title: 'ISEPBANDS',
  navigation: {
    title: 'ISEPBANDS 2025',
    year: 'Année 2025-2026',
    home: 'Accueil',
    links: {
      home: 'Accueil',
      club: "L'Association",
      bands: 'Bands',
      events: 'Les Événements',
      team: 'Le Bureau',
    },
    mobile: {
      profile: 'Mon profil',
      groupSpace: 'Mon espace groupe',
      adminDashboard: 'Tableau de bord admin',
      settings: 'Paramètres',
      signOut: 'Se déconnecter',
      signIn: 'Se connecter',
    },
  },
  auth: {
    signIn: "S'inscrire",
    logIn: 'Se connecter',
    logOut: 'Se déconnecter',
    login: {
      title: 'Bienvenue de nouveau !',
      subtitle: 'Veuillez vous connecter à votre compte.',
      remember: 'Se souvenir de moi',
      email: 'Email',
      button: 'Se Connecter',
      password: 'Mot de passe',
      noAccount: "Tu n'es pas inscris ?",
      alreadyAccount: 'Déjà inscrit ?',
      register: "Rejoint l'club",
      forgot: 'Mot de passe oublié ?',
      errors: {
        emailVerification: "Le mail n'a pas été vérifié.",
        inactive: "Votre compte n'est pas encore activé. Veuillez attendre la validation.",
        invalidCredentials: 'Identifiants invalides.',
        missingCredentials: 'Veuillez remplir tous les champs.',
      },
    },
    register: {
      title: 'ISEPBANDS - INSCRIPTION',
      title_top: 'Inscription',
      steps: {
        basicInfo: "FORMULAIRE D'INSCRIPTION",
        additionalInfo: 'INFORMATIONS COMPLÉMENTAIRES',
        motivation: 'DÉMARQUEZ-VOUS !',
        instruments: 'QUEL(S) INSTRUMENT(S) JOUEZ-VOUS ?',
        photo: 'ET POUR FINIR, UNE PETITE PHOTO ?',
        confirmation: 'RÉCAPITULATIF',
      },
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      cycle: 'Cycle ISEP',
      birthDate: 'Date de naissance',
      phone: 'Téléphone',
      motivation: 'Motivation',
      experience: 'Expérience musicale',
      instruments: 'Instruments',
      profilePhoto: 'Photo de profil',
      submit: "Finaliser l'inscription",
      motivationPlaceholder: 'Pourquoi veux-tu rejoindre ISEPBANDS ?',
      experiencePlaceholder: 'Décris ton expérience musicale...',
      instrument: 'Instrument',
      level: 'Niveau',
      removeInstrument: 'Supprimer',
      addInstrument: 'Ajouter un instrument',
      confirm: "Confirmer l'inscription",
    },
  },
  user: {
    profileLabel: 'Profil',
    skillLevels: {
      beginner: 'Débutant',
      intermediate: 'Intermédiaire',
      advanced: 'Avancé',
      expert: 'Expert',
    },
    profile: {
      notfound: {
        title: 'Profil introuvable',
        description: "L'utilisateur demandé n'existe pas ou n'est pas disponible.",
        action: "Retour à l'accueil",
      },
      role: {
        default: 'Membre',
      },
      promotion_year: 'Année de promo',
      pronouns: 'Pronoms',
      member_since: 'Membre depuis',
      pronouns: {
        hehim: 'il/lui',
        sheher: 'elle/elle',
        theythem: 'iel/ellui',
        other: 'autre',
      },
      instruments: {
        title: 'Instruments',
        empty_title: 'Aucun instrument ajouté',
        empty_description: 'Ajoutez vos instruments pour que les groupes puissent vous trouver !',
        years_experience: "ans d'expérience",
        primary_label: 'Instrument principal',
      },
      groups: {
        title: 'Groupes',
        inactive_label: 'Groupes Inactifs',
        empty_title: "N'a rejoint aucun groupe pour le moment",
        empty_description: 'Les groupes apparaîtront ici une fois rejoint !',
      },
    },
  },
  footer: {
    all_rights_reserved: 'Tout droits réservés.',
    columns: {
      pages: {
        title: 'Pages',
        links: {
          home: 'Accueil',
          club: "L'association",
          bands: 'Bands',
          events: 'Les Événements',
          team: 'Le Bureau',
        },
      },
      association: {
        title: 'Association',
        links: {
          rules: "Règlement de l'asso",
          membership: 'Adhésion',
          contact: 'Contact',
        },
      },
      legal: {
        title: 'Légal',
        links: {
          terms: "Conditions d'utilisation",
          privacy: 'Politique de confidentialité',
          legal: 'Mentions légales',
        },
      },
    },
    newsletter: {
      title: 'Inscrivez-vous à notre newsletter',
      description:
        'Les dernières actualités, articles et ressources, envoyés dans votre boîte mail chaque semaine.',
      placeholder: 'Entrez votre email',
      buttonText: "S'inscrire",
      alreadySubscribed: '✓ Vous êtes déjà inscrit à notre newsletter',
      pendingMessage:
        'Vous serez automatiquement inscrit à notre newsletter après validation de votre compte',
      errors: {
        emailRequired: 'Veuillez entrer votre email',
        subscriptionError: "Une erreur est survenue lors de l'inscription",
        generalError: 'Une erreur est survenue',
      },
      success: 'Inscription réussie !',
    },
  },
  common: {
    goback: 'Retour',
    next: 'Suivant',
    none: 'Aucune',
    loading: 'Chargement…',
    step: 'Étape',
    of: 'sur',
  },
  page: {
    home: {
      title: 'Accueil ISEPBANDS',
      hero: {
        motto: "POUR CEUX QUI JOUENT SANS JAMAIS S'ARRÊTER",
        joinUs: 'Nous rejoindre',
        scrollHint: 'Scroll pour voir plus',
      },
      about: {
        title: 'QUI SOMMES-NOUS?',
        description1:
          "Chez ISEPBands, la musique ne s'arrête jamais. Notre association réunit les étudiants passionnés, débutants comme confirmés, autour de jams, de concerts et de projets de groupe. Ici, chacun trouve sa place : que tu veuilles simplement jouer pour le plaisir, progresser avec d'autres musiciens, ou monter sur scène, on t'accompagne.",
        description2:
          "Notre mission : créer un espace convivial où la créativité et l\\'\u00e9nergie de la musique live se partagent sans limite.",
        learnMore: 'En savoir plus',
      },
      cta: {
        title: "ALORS SI TU ES PRÊT, QU'ATTENDS-TU ?",
        button: 'Nous rejoindre',
      },
      events: {
        upcoming: {
          title: 'ÉVÉNEMENTS À VENIR',
          comingSoon: 'Fonctionnalité à venir',
        },
        famous: {
          title: 'NOS ÉVÉNEMENTS PHARES',
          jams: {
            title: 'JAMS',
            description: 'Sessions de jam créatives et conviviales',
          },
          shows: {
            title: 'SHOWS',
            description: 'Concerts et performances sur scène',
          },
          recordings: {
            title: 'ENREGISTREMENTS STUDIO',
            description: "Sessions d'enregistrement professionnel",
          },
        },
      },
    },
  },
  welcome: 'Bienvenue, {name}!',
  register: {
    title: 'Inscription',
    loading: 'Inscription en cours…',
    success: 'Votre demande d’inscription a bien été envoyée',
    error: {
      upload: 'Erreur lors de l’upload de la photo de profil',
      submit: 'Erreur lors de la demande d’inscription',
      network: 'Erreur réseau lors de la demande d’inscription',
    },
  },
  instruments: {
    guitar: 'Guitare',
    bass: 'Basse',
    drums: 'Batterie',
    vocals: 'Chant',
    keyboard: 'Clavier',
  },
  validator: {
    required: 'Ce champ est requis.',
    invalidEmail: 'Adresse email invalide.',
    minLength: 'Ce champ est trop court.',
    maxLength: 'Ce champ est trop long.',
    passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères.',
    passwordMismatch: 'Les mots de passe ne correspondent pas.',
    invalidDate: 'Date invalide.',
    invalidPhone: 'Numéro de téléphone invalide.',
    selectInstrument: 'Sélectionne au moins un instrument.',
    invalidFile: 'Fichier non valide.',
    fileTooLarge: 'Le fichier est trop volumineux.',
    invalidField: 'Valeur invalide.',
    passwordComplexity:
      'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.',
  },
};

export default fr;
