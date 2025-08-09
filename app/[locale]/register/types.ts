// types.ts
export interface Instrument {
  id: string
  name: string
  category: string
}

export interface UserInstrument {
  instrumentId: string
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
}

export interface RegistrationData {
  // Step 1: Basic Info
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  cycle: string
  
  // Step 2: Additional Info
  birthDate: string
  phone: string
  
  // Step 3: Motivation
  motivation: string
  experience: string
  
  // Step 4: Instruments
  instruments: UserInstrument[]
  
  // Step 5: Photo
  profilePhoto: File | null
}

export type RegistrationStep = 1 | 2 | 3 | 4 | 5 | 6

export interface UseRegistrationFormReturn {
  currentStep: RegistrationStep
  formData: RegistrationData
  loading: boolean
  error: string | null
  nextStep: () => void
  prevStep: () => void
  updateFormData: <K extends keyof RegistrationData>(
    field: K, 
    value: RegistrationData[K]
  ) => void
  handleSubmit: () => Promise<void>
  validateCurrentStep: () => boolean
}