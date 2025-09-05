const en = {
  api: {
    errors: {
      unauthorized: 'Unauthorized',
      forbidden: 'Forbidden',
      notFound: 'Not found',
      fileNotFound: 'File not found on disk',
      missingId: 'Missing id param',
      unableToWrite: 'Unable to write file',
      emailInUse: 'This email is already in use.',
      registrationError: 'Error during registration request.',
      unknown: 'Unknown error',
    },
  },
  title: 'ISEPBANDS',
  navigation: {
    title: 'ISEPBANDS 2025',
    year: 'Year 2025-2026',
    home: 'Home',
    links: {
      home: 'Home',
      club: 'The Association',
      bands: 'Bands',
      events: 'Events',
      team: 'The Team',
    },
    mobile: {
      profile: 'My Profile',
      groupSpace: 'My Group Space',
      adminDashboard: 'Admin Dashboard',
      settings: 'Settings',
      signOut: 'Sign Out',
      signIn: 'Sign In',
    },
  },
  auth: {
    signIn: 'Sign In',
    logIn: 'Login',
    logOut: 'Login',
    login: {
      title: 'Welcome back!',
      subtitle: 'Please login to your account',
      remember: 'Remember me',
      email: 'Email',
      button: 'Log In',
      password: 'Password',
      noAccount: 'Not registered yet?',
      alreadyAccount: 'Already registered?',
      register: 'Join the association',
      forgot: 'Forgot password ?',
      errors: {
        emailVerification: 'Email has not been verified.',
        inactive: 'Your account is not yet active. Please wait for validation.',
        invalidCredentials: 'Invalid credentials.',
        missingCredentials: 'Please fill in all fields.',
      },
    },
    register: {
      title: 'ISEPBANDS - REGISTRATION',
      title_top: 'Registration',
      steps: {
        basicInfo: 'REGISTRATION FORM',
        additionalInfo: 'ADDITIONAL INFORMATION',
        motivation: 'STAND OUT!',
        instruments: 'WHICH INSTRUMENT(S) DO YOU PLAY?',
        photo: 'AND FINALLY, A LITTLE PHOTO?',
        confirmation: 'SUMMARY',
      },
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      cycle: 'ISEP Cycle',
      birthDate: 'Date of Birth',
      phone: 'Phone Number',
      motivation: 'Motivation',
      experience: 'Musical experience',
      instruments: 'Instruments',
      profilePhoto: 'Profile picture',
      submit: 'Complete Registration',
      motivationPlaceholder: 'Why do you want to join ISEPBANDS?',
      experiencePlaceholder: 'Describe your musical experience...',
      instrument: 'Instrument',
      level: 'Level',
      removeInstrument: 'Remove',
      addInstrument: 'Add an instrument',
      confirm: 'Confirm registration',
    },
  },
  user: {
    profile: {
      promotion_year: 'Promotion year',
      member_since: 'Member since',
      pronouns: {
        hehim: 'he/him',
        sheher: 'she/her',
        theythem: 'they/them',
        other: 'other',
      },
      instruments: {
        title: 'Instruments',
        empty_title: 'No instrument added',
        empty_description: 'Add your instruments so groups can find you!',
        years_experience: 'years experience',
        primary_label: 'Primary instrument',
      },
      groups: {
        title: 'Groups',
        inactive_label: 'Inactive Groups',
        empty_title: "Hasn't joined any group yet",
        empty_description: 'Groups will appear here once joined!',
      },
    },
    skillLevels: {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      expert: 'Expert',
    },
  },
  footer: {
    all_rights_reserved: 'All rights reserved.',
    columns: {
      pages: {
        title: 'Pages',
        links: {
          home: 'Home',
          club: 'The Association',
          bands: 'Bands',
          events: 'Events',
          team: 'The Team',
        },
      },
      association: {
        title: 'Association',
        links: {
          rules: 'Association Rules',
          membership: 'Membership',
          contact: 'Contact',
        },
      },
      legal: {
        title: 'Legal',
        links: {
          terms: 'Terms of Use',
          privacy: 'Privacy Policy',
          legal: 'Legal Notice',
        },
      },
    },
    newsletter: {
      title: 'Subscribe to our newsletter',
      description: 'The latest news, articles, and resources, sent to your inbox weekly.',
      placeholder: 'Enter your email',
      buttonText: 'Subscribe',
      alreadySubscribed: '✓ You are already subscribed to our newsletter',
      pendingMessage:
        'You will be automatically subscribed to our newsletter after account validation',
      errors: {
        emailRequired: 'Please enter your email',
        subscriptionError: 'An error occurred during subscription',
        generalError: 'An error occurred',
      },
      success: 'Successfully subscribed!',
    },
  },
  common: {
    goback: 'Go Back',
    next: 'Next',
    none: 'None',
    loading: 'Loading…',
    step: 'Step',
    of: 'of',
  },
  page: {
    home: {
      title: 'ISEPBANDS Home',
      hero: {
        motto: "FOR THOSE WHO CAN'T STOP PLAYING",
        joinUs: 'Join Us',
        scrollHint: 'Scroll to see more',
      },
      about: {
        title: 'WHO ARE WE?',
        description1:
          'At ISEPBands, music never stops. Our association brings together passionate students, beginners and experienced alike, around jams, concerts and group projects. Here, everyone finds their place: whether you simply want to play for fun, progress with other musicians, or get on stage, we support you.',
        description2:
          'Our mission: to create a friendly space where creativity and the energy of live music are shared without limits.',
        learnMore: 'Learn more',
      },
      cta: {
        title: "SO IF YOU'RE READY, WHAT ARE YOU WAITING FOR?",
        button: 'Join Us',
      },
      events: {
        upcoming: {
          title: 'UPCOMING EVENTS',
          comingSoon: 'Feature coming soon',
        },
        famous: {
          title: 'OUR FAMOUS EVENTS',
          jams: {
            title: 'JAMS',
            description: 'Creative and friendly jam sessions',
          },
          shows: {
            title: 'SHOWS',
            description: 'Concerts and stage performances',
          },
          recordings: {
            title: 'STUDIO RECORDINGS',
            description: 'Professional recording sessions',
          },
        },
      },
      loggedIn: {
        welcome: 'Welcome back, {name}',
        actions: {
          title: 'Quick Actions',
          profile: 'My Profile',
          groups: 'My Groups',
          admin: 'Admin',
          settings: 'Settings',
          logout: 'Logout',
          loggingOut: 'Logging out...',
        },
        feed: {
          title: 'Latest News',
          loading: 'Loading news...',
          offline: 'Offline mode',
          error: 'Unable to load latest news',
        },
        profile: {
          promotion: 'Promotion {year}',
          age: '{age} years old',
          fallbackName: 'User',
        },
        pending: {
          title: 'Registration under validation',
          description:
            'Welcome to the ISEP Bands community! Your registration request has been received and our team is currently reviewing your profile.',
          notification:
            'An email notification will be sent upon validation within 2-3 business days.',
        },
      },
    },
    badges: {
      lookingForGroup: 'Ready to join a group',
    },
    activities: {
      labels: {
        new_member: 'New member',
        post: 'Post',
        post_with_image: 'Post with image',
        new_group: 'New group',
        event: 'Event',
        announcement: 'Announcement',
        system_announcement: 'System announcement',
        default: 'Activity',
      },
      unknownUser: 'Unknown user',
      noActivity: 'No recent activity',
      showHistory: 'Show full history',
      moreActivities: '{count} more activities',
    },
  },
  welcome: 'Welcome, {name}!',
  register: {
    title: 'Registration',
    loading: 'Registration in progress…',
    success: 'Your registration request has been sent',
    error: {
      upload: 'Error uploading settings photo',
      submit: 'Error during registration request',
      network: 'Network error during registration request',
    },
  },
  instruments: {
    guitar: 'Guitar',
    bass: 'Bass',
    drums: 'Drums',
    vocals: 'Vocals',
    keyboard: 'Keyboard',
  },
  validator: {
    required: 'This field is required.',
    invalidEmail: 'Invalid email address.',
    minLength: 'This field is too short.',
    maxLength: 'This field is too long.',
    passwordTooShort: 'Password must be at least 8 characters.',
    passwordMismatch: 'Passwords do not match.',
    invalidDate: 'Invalid date.',
    invalidPhone: 'Invalid phone number.',
    selectInstrument: 'Select at least one instrument.',
    invalidFile: 'Invalid file.',
    fileTooLarge: 'File is too large.',
    invalidField: 'Invalid value.',
    passwordComplexity:
      'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a digit, and a special character.',
  },
};

export default en;
