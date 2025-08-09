// locales/fr.ts
export default {
  title: "ISEPBANDS",
  
  navigation: {
    title: "ISEPBANDS 2025",
    home: "Accueil",
  },
  
  auth: {
    signIn: "S'inscrire",
    logIn: "Se connecter",
    logOut: "Se déconnecter",
    login: {
      title: "FORMULAIRE DE CONNEXION",
      subtitle: "FORMULAIRE DE CONNEXION",
      remember: "Se souvenir de moi",
      email: "Email",
      button: "Se Connecter",
      password: "Mot de passe",
      noAccount: "Tu n'es pas inscris ?",
      alreadyAccount: "Déjà inscrit ?",
      register: "Rejoint l'asso",
      forgot: "Mot de passe oublié",
      errors: {
        emailVerification: "Le mail n'a pas été vérifié.",
      }
    },
    register: {
      title: "ISEPBANDS - INSCRIPTION",
      title_top: "Inscription",
      step1: { title: "FORMULAIRE D'INSCRIPTION" },
      step2: { title: "INFORMATIONS SUPPLÉMENTAIRES" },
      step3: { title: "DÉMARQUE-TOI !" },
      step4: { title: "DE QUEL(S) INSTRUMENT(S) JOUES-TU ?" },
      step5: { title: "ET ENFIN, UNE PETITE PHOTO ?" },
      step6: { title: "RÉCAPITULATIF" },
      firstName: "Prénom",
      lastName: "Nom",
      email: "Email",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      cycle: "Cycle ISEP",
      birthDate: "Date de naissance",
      phone: "Téléphone",
      motivation: "Motivation",
      experience: "Expérience musicale",
      instruments: "Instruments",
      profilePhoto: "Photo de profil",
      submit: "Finaliser l'inscription",
      motivationPlaceholder: "Pourquoi veux-tu rejoindre ISEPBANDS ?",
      experiencePlaceholder: "Décris ton expérience musicale..."
    }
  },
  
  user: {
    profile: "Profil",
  },
  
  common: {
    goback: "Retour",
    previous: "Précédent", 
    next: "Suivant",
    step: "Étape",              
    of: "sur",                  
    creating: "Création...",    
    loadingInstruments: "Chargement des instruments...",
    status: {
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès"
    },
    validation: {
      required: "Ce champ est requis",
      emailInvalid: "Email invalide",
      passwordMismatch: "Les mots de passe ne correspondent pas",
      passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères"
    }
  },
  
  forms: {
    placeholders: {
      email: "anma63865@eleve.isep.fr",
    }
  },
  
  page: {
    home: {
      title: "Accueil",
    }
  },
  
  instruments: {
    guitar: "Guitare",
    bass: "Basse",
    drums: "Batterie",
    piano: "Piano",
    keyboard: "Clavier",
    violin: "Violon",
    saxophone: "Saxophone",
    trumpet: "Trompette",
    vocals: "Chant",
    other: "Autre"
  },
  
  cycles: {
    I1: "I1 - Première année",
    I2: "I2 - Deuxième année", 
    I3: "I3 - Troisième année",
    A1: "A1 - Quatrième année",
    A2: "A2 - Cinquième année",
    graduate: "Diplômé",
    former: "Ex-membre"
  },
  
  welcome: "Bienvenue, {name} !",

} as const;