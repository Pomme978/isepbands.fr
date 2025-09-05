import { RegistrationData } from '@/types/registration';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState, useRef } from 'react';
import { useI18n } from '@/locales/client';
import { Eye, EyeOff } from 'lucide-react';

interface Step1BasicInfoProps {
  data: RegistrationData;
  onChange: (fields: Partial<RegistrationData>) => void;
  onNext: () => void;
  fieldErrors?: { [key: string]: string };
  onClearError?: (errors: { [key: string]: string }) => void;
}

export default function Step1BasicInfo({
  data,
  onChange,
  onNext,
  fieldErrors = {},
  onClearError,
}: Step1BasicInfoProps) {
  const t = useI18n();
  // States d'erreur par champ
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [cycleError, setCycleError] = useState('');

  // States pour la visibilité des mots de passe
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Ref pour le timeout de la vérification email
  const emailCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Validation manuelle
  const validateFirstName = (value: string) => {
    if (!value.trim()) return t('validator.required');
    return '';
  };
  const validateLastName = (value: string) => {
    if (!value.trim()) return t('validator.required');
    return '';
  };
  const validateEmail = (value: string) => {
    if (!value.trim()) return t('validator.required');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) return t('validator.invalidEmail');
    return '';
  };

  // Validation email côté serveur
  const checkEmailExists = async (email: string) => {
    if (!email || validateEmail(email)) return; // Skip si pas d'email ou email invalide

    try {
      const res = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.exists) {
        setEmailError('Un utilisateur avec cet email existe déjà.');
      } else {
        // Si l'email n'existe pas, effacer l'erreur précédente si c'était une erreur serveur
        if (emailError && emailError.includes('existe déjà')) {
          setEmailError('');
        }
      }
    } catch (error) {
      console.error('Error checking email:', error);
    }
  };
  const validatePassword = (value: string) => {
    if (!value) return t('validator.required');
    if (
      !/^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/.test(
        value,
      )
    ) {
      return t('validator.passwordComplexity');
    }
    return '';
  };
  const validateConfirmPassword = (value: string, password: string) => {
    if (!value) return t('validator.required');
    if (value !== password) return t('validator.passwordMismatch');
    return '';
  };
  const validateCycle = (value: string) => {
    if (!value.trim()) return t('validator.required');
    return '';
  };

  // Validation globale au submit
  const validateAll = () => {
    let valid = true;
    setFirstNameError(validateFirstName(data.firstName));
    setLastNameError(validateLastName(data.lastName));

    // Pour l'email, ne pas écraser l'erreur existante si elle vient du serveur
    const clientEmailError = validateEmail(data.email);
    if (!emailError || emailError.includes('requis') || emailError.includes('Invalid')) {
      setEmailError(clientEmailError);
    }

    setPasswordError(validatePassword(data.password));
    setConfirmPasswordError(validateConfirmPassword(data.confirmPassword, data.password));
    setCycleError(validateCycle(data.cycle));
    if (
      validateFirstName(data.firstName) ||
      validateLastName(data.lastName) ||
      validateEmail(data.email) ||
      emailError || // Inclure l'erreur email existant
      fieldErrors.email || // Inclure les erreurs serveur
      validatePassword(data.password) ||
      validateConfirmPassword(data.confirmPassword, data.password) ||
      validateCycle(data.cycle)
    ) {
      valid = false;
    }
    return valid;
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (validateAll()) onNext();
      }}
    >
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Entrez votre prénom"
              value={data.firstName}
              onChange={(e) => {
                onChange({ firstName: e.target.value });
                setFirstNameError(validateFirstName(e.target.value));
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              required
            />
            {firstNameError && <div className="text-red-500 text-xs mt-1">{firstNameError}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Entrez votre nom"
              value={data.lastName}
              onChange={(e) => {
                const upperCaseValue = e.target.value.toUpperCase();
                onChange({ lastName: upperCaseValue });
                setLastNameError(validateLastName(upperCaseValue));
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              required
            />
            {lastNameError && <div className="text-red-500 text-xs mt-1">{lastNameError}</div>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="prenom.nom@eleve.isep.fr"
              value={data.email}
              onChange={(e) => {
                onChange({ email: e.target.value });
                setEmailError(validateEmail(e.target.value));
                // Effacer l'erreur serveur quand l'utilisateur modifie l'email
                if (fieldErrors.email && onClearError) {
                  onClearError({ ...fieldErrors, email: '' });
                }
              }}
              onBlur={(e) => {
                const clientError = validateEmail(e.target.value);
                if (!clientError) {
                  // Debounce la vérification pour éviter trop d'appels API
                  if (emailCheckTimeoutRef.current) {
                    clearTimeout(emailCheckTimeoutRef.current);
                  }
                  emailCheckTimeoutRef.current = setTimeout(() => {
                    checkEmailExists(e.target.value);
                  }, 500);
                }
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              required
            />
            {(emailError || fieldErrors.email) && (
              <div className="text-red-500 text-xs mt-1">{emailError || fieldErrors.email}</div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sécurité</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Créez un mot de passe sécurisé"
                value={data.password}
                onChange={(e) => {
                  onChange({ password: e.target.value });
                  setPasswordError(validatePassword(e.target.value));
                  setConfirmPasswordError(
                    validateConfirmPassword(data.confirmPassword, e.target.value),
                  );
                }}
                className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordError && <div className="text-red-500 text-xs mt-1">{passwordError}</div>}
            {data.password && (
              <div className="mt-2 text-xs text-gray-600">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span
                    className={`flex items-center ${data.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}
                  >
                    <span className="mr-1">{data.password.length >= 8 ? '✓' : '○'}</span>
                    8+ caractères
                  </span>
                  <span
                    className={`flex items-center ${/[a-z]/.test(data.password) ? 'text-green-600' : 'text-gray-500'}`}
                  >
                    <span className="mr-1">{/[a-z]/.test(data.password) ? '✓' : '○'}</span>
                    Minuscule
                  </span>
                  <span
                    className={`flex items-center ${/[A-Z]/.test(data.password) ? 'text-green-600' : 'text-gray-500'}`}
                  >
                    <span className="mr-1">{/[A-Z]/.test(data.password) ? '✓' : '○'}</span>
                    Majuscule
                  </span>
                  <span
                    className={`flex items-center ${/\d/.test(data.password) ? 'text-green-600' : 'text-gray-500'}`}
                  >
                    <span className="mr-1">{/\d/.test(data.password) ? '✓' : '○'}</span>
                    Chiffre
                  </span>
                  <span
                    className={`flex items-center ${/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(data.password) ? 'text-green-600' : 'text-gray-500'}`}
                  >
                    <span className="mr-1">
                      {/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(data.password) ? '✓' : '○'}
                    </span>
                    Spécial
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le mot de passe *
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Confirmez votre mot de passe"
                value={data.confirmPassword}
                onChange={(e) => {
                  onChange({ confirmPassword: e.target.value });
                  setConfirmPasswordError(validateConfirmPassword(e.target.value, data.password));
                }}
                className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={
                  showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
                }
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPasswordError && (
              <div className="text-red-500 text-xs mt-1">{confirmPasswordError}</div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations ISEP</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Promotion *</label>
            <select
              id="cycle"
              value={data.cycle}
              onChange={(e) => {
                onChange({ cycle: e.target.value });
                setCycleError(validateCycle(e.target.value));
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              required
            >
              <option value="">Sélectionnez votre promotion</option>
              <option value="P1">P1 - Prépa intégrée 1ère année</option>
              <option value="P2">P2 - Prépa intégrée 2ème année</option>
              <option value="I1">I1 - Cycle intégré 1ère année</option>
              <option value="I2">I2 - Cycle intégré 2ème année</option>
              <option value="A1">A1 - Cycle ingénieur 1ère année</option>
              <option value="A2">A2 - Cycle ingénieur 2ème année</option>
              <option value="A3">A3 - Cycle ingénieur 3ème année</option>
              <option value="B1">B1 - Bachelor 1ère année</option>
              <option value="B2">B2 - Bachelor 2ème année</option>
              <option value="B3">B3 - Bachelor 3ème année</option>
              <option value="Graduate">Graduate - Diplômé</option>
              <option value="Former">Former - Ancien étudiant (non diplômé)</option>
            </select>
            {cycleError && <div className="text-red-500 text-xs mt-1">{cycleError}</div>}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Champs requis</h4>
        <p className="text-sm text-blue-700">
          Les champs marqués d&lsquo;un * sont obligatoires. Assurez-vous de remplir au moins le
          prénom, le nom, l&lsquo;email, le mot de passe et la promotion avant de passer à
          l&apos;étape suivante.
        </p>
      </div>

      <div className="flex justify-center md:justify-end pt-4">
        <Button type="submit" className="px-6 md:py-2 py-6 md:w-auto w-full">
          Suivant
        </Button>
      </div>
    </form>
  );
}
