// locales/en.ts
export default {
  title: "ISEPBANDS",
  
  navigation: {
    title: "ISEPBANDS 2025",
    home: "Home",
  },
  
  auth: {
    signIn: "Sign In",
    logIn: "Login",
    logOut: "Login",
    login: {
      title: "LOGIN FORM",
      subtitle: "LOGIN FORM",
      remember: "Remember me",
      email: "Email",
      button: "Log In",
      password: "Password",
      noAccount: "Not registered yet?",
      alreadyAccount: "Already registered?",
      register: "Join the association",
      forgot: "Forgot password",
      errors: {
        emailVerification: "Email has not been verified.",
      }
    },
    register: {
      title: "ISEPBANDS - REGISTRATION",
      title_top: "Registration",
      step1: { title: "REGISTRATION FORM" },
      step2: { title: "ADDITIONAL INFORMATION" },
      step3: { title: "STAND OUT!" },
      step4: { title: "WHICH INSTRUMENT(S) DO YOU PLAY?" },
      step5: { title: "AND FINALLY, A LITTLE PHOTO?" },
      step6: { title: "SUMMARY" },
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      cycle: "ISEP Cycle",
      birthDate: "Date of Birth",
      phone: "Phone Number",
      motivation: "Motivation",
      experience: "Musical experience",
      instruments: "Instruments",
      profilePhoto: "Profile picture",
      submit: "Complete Registration",
      motivationPlaceholder: "Why do you want to join ISEPBANDS?",
      experiencePlaceholder: "Describe your musical experience..."
    }
  },
  
  user: {
    profile: "Profile",
  },
  
  common: {
    goback: "Go Back",
    previous: "Previous",
    next: "Next",
    step: "Step",                    
    of: "of",                         
    creating: "Creating...",          
    loadingInstruments: "Loading instruments...",
    status: {
      loading: "Loading...",
      error: "Error",
      success: "Success"
    },
    validation: {
      required: "This field is required",
      emailInvalid: "Invalid email",
      passwordMismatch: "Passwords do not match",
      passwordTooShort: "Password must be at least 8 characters long"
    }
  },
  
  forms: {
    placeholders: {
      email: "anma63865@eleve.isep.fr",
    }
  },
  
  page: {
    home: {
      title: "Home",
    }
  },
  
  instruments: {
    guitar: "Guitar",
    bass: "Bass",
    drums: "Drums",
    piano: "Piano",
    keyboard: "Keyboard",
    violin: "Violin",
    saxophone: "Saxophone",
    trumpet: "Trumpet",
    vocals: "Vocals",
    other: "Other"
  },
  
  cycles: {
    I1: "I1 - First year",
    I2: "I2 - Second year",
    I3: "I3 - Third year",
    A1: "A1 - Fourth year",
    A2: "A2 - Fifth year",
    graduate: "Graduate",
    former: "Former member"
  },
  
  welcome: "Welcome, {name}!",
} as const;