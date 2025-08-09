// app/[locale]/register/components/RegistrationStep1.tsx (CORRIGÉ)
'use client'

import { RegistrationData } from '../types'
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { useI18n } from '@/locales/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { cn } from "@/lib/utils"

interface Props {
  formData: RegistrationData
  updateFormData: <K extends keyof RegistrationData>(field: K, value: RegistrationData[K]) => void
}

export function RegistrationStep1({ formData, updateFormData }: Props) {
  const t = useI18n()

  // Fonction pour vérifier si un champ est valide
  const isFieldValid = (field: keyof RegistrationData) => {
    switch (field) {
      case 'firstName':
        return formData.firstName.trim().length > 0
      case 'lastName':
        return formData.lastName.trim().length > 0
      case 'email':
        return formData.email.endsWith('@eleve.isep.fr') && formData.email.length > '@eleve.isep.fr'.length
      case 'cycle':
        return formData.cycle.length > 0
      case 'password':
        const passwordRequirements = [
          formData.password.length >= 8,
          /[A-Z]/.test(formData.password),
          /[a-z]/.test(formData.password),
          /[0-9]/.test(formData.password),
          /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)
        ]
        return passwordRequirements.every(req => req)
      case 'confirmPassword':
        return formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword
      default:
        return false
    }
  }

  // Validation email ISEP
  const isValidEmail = formData.email.endsWith('@eleve.isep.fr') && formData.email.length > '@eleve.isep.fr'.length
  const showEmailValidation = formData.email.length > 0

  // Validation mot de passe en temps réel
  const passwordRequirements = [
    { 
      text: "8 caractères min", 
      valid: formData.password.length >= 8 
    },
    { 
      text: "1 majuscule", 
      valid: /[A-Z]/.test(formData.password) 
    },
    { 
      text: "1 minuscule", 
      valid: /[a-z]/.test(formData.password) 
    },
    { 
      text: "1 chiffre", 
      valid: /[0-9]/.test(formData.password) 
    },
    { 
      text: "1 caractère spécial", 
      valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) 
    }
  ]

  const showPasswordRequirements = formData.password.length > 0

  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold">FORMULAIRE D'INSCRIPTION</h2>
        <p className="text-muted-foreground text-sm">Créez votre compte ISEP Bands</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <Label htmlFor="firstName">
            {t('auth.register.firstName')}
          </Label>
          <Input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => updateFormData('firstName', e.target.value)}
            placeholder="Jean"
            required
          />
        </div>

        <div>
          <Label htmlFor="lastName">
            {t('auth.register.lastName')}
          </Label>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => updateFormData('lastName', e.target.value)}
            placeholder="Dupont"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">
          {t('auth.register.email')}
        </Label>
        
        {/* Validation email ISEP */}
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showEmailValidation ? 'max-h-10 opacity-100 mb-2' : 'max-h-0 opacity-0 mb-0'
          }`}
        >
          <div className="py-1">
            <div className="flex items-center gap-2 text-xs">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                isValidEmail ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <FontAwesomeIcon 
                  icon={isValidEmail ? faCheck : faTimes} 
                  className={isValidEmail ? "text-green-600" : "text-red-500"} 
                />
              </div>
              <span className={isValidEmail ? "text-green-600" : "text-red-500"}>
                {isValidEmail ? "Email ISEP valide" : "Doit finir par @eleve.isep.fr"}
              </span>
            </div>
          </div>
        </div>

        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          placeholder="prenom.nom@eleve.isep.fr"
          required
        />
      </div>

      <div>
        <Label htmlFor="cycle">
          {t('auth.register.cycle')}
        </Label>
        <div className="relative">
          <select
            id="cycle"
            value={formData.cycle}
            onChange={(e) => updateFormData('cycle', e.target.value)}
            className={cn(
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              isFieldValid('cycle') ? "pr-10" : ""
            )}
            required
          >
            <option value="">Sélectionnez votre cycle</option>
            
            {/* Cycle Préparatoire */}
            <optgroup label="Cycle Préparatoire">
              <option value="P1">P1 - Première année prépa</option>
              <option value="P2">P2 - Deuxième année prépa</option>
            </optgroup>
            
            {/* Cycle Ingénieur Intégré */}
            <optgroup label="Cycle Ingénieur Intégré">
              <option value="I1">I1 - Première année</option>
              <option value="I2">I2 - Deuxième année</option>
            </optgroup>
            
            {/* Cycle Bachelor */}
            <optgroup label="Cycle Bachelor">
              <option value="B1">B1 - Troisième année</option>
              <option value="B2">B2 - Quatrième année</option>
              <option value="B3">B3 - Cinquième année</option>
            </optgroup>
            
            {/* Cycle Ingénieur */}
            <optgroup label="Cycle Ingénieur">
              <option value="A1">A1 - Sixième année</option>
              <option value="A2">A2 - Septième année</option>
              <option value="A3">A3 - Huitième année</option>
            </optgroup>
          </select>
          {isFieldValid('cycle') && (
            <div className="absolute right-0 top-0 h-full w-8 bg-gray-800 rounded-r-md flex items-center justify-center">
              <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
            </div>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="password">
          {t('auth.register.password')}
        </Label>
        
        {/* Validation mot de passe */}
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showPasswordRequirements ? 'max-h-24 opacity-100 mb-2' : 'max-h-0 opacity-0 mb-0'
          }`}
        >
          <div className="py-1">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    req.valid ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <FontAwesomeIcon 
                      icon={req.valid ? faCheck : faTimes} 
                      className={req.valid ? "text-green-600" : "text-red-500"} 
                    />
                  </div>
                  <span className={`whitespace-nowrap ${req.valid ? "text-green-600" : "text-red-500"}`}>
                    {req.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => updateFormData('password', e.target.value)}
          placeholder="Créez un mot de passe sécurisé"
          required
        />
      </div>

      <div>
        <Label htmlFor="confirmPassword">
          {t('auth.register.confirmPassword')}
        </Label>
        
        {/* Validation correspondance mots de passe */}
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            formData.confirmPassword.length > 0 ? 'max-h-10 opacity-100 mb-2' : 'max-h-0 opacity-0 mb-0'
          }`}
        >
          <div className="py-1">
            <div className="flex items-center gap-2 text-xs">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                formData.password === formData.confirmPassword ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <FontAwesomeIcon 
                  icon={formData.password === formData.confirmPassword ? faCheck : faTimes} 
                  className={formData.password === formData.confirmPassword ? "text-green-600" : "text-red-500"} 
                />
              </div>
              <span className={formData.password === formData.confirmPassword ? "text-green-600" : "text-red-500"}>
                {formData.password === formData.confirmPassword ? "Mots de passe identiques" : "Mots de passe différents"}
              </span>
            </div>
          </div>
        </div>

        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => updateFormData('confirmPassword', e.target.value)}
          placeholder="Confirmez votre mot de passe"
          required
        />
      </div>
    </div>
  )
}