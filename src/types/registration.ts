export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface RegistrationInstrument {
  instrumentId: number;
  skillLevel: SkillLevel;
}

export interface RegistrationData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  cycle: string;
  birthDate: string;
  phone: string;
  motivation: string;
  experience: string;
  instruments: RegistrationInstrument[];
  profilePhoto: File | null;
}

export type RegistrationStep = 1 | 2 | 3 | 4 | 5 | 6;
