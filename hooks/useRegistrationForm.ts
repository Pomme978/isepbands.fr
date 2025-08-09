// hooks/useRegistrationForm.ts (VALIDATION EMAIL AJOUTÉE)
'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/auth-client'
import { RegistrationData, RegistrationStep, UseRegistrationFormReturn } from '../app/[locale]/register/types'

const initialFormData: RegistrationData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  cycle: '',
  birthDate: '',
  phone: '',
  motivation: '',
  experience: '',
  instruments: [],
  profilePhoto: null
}

export function useRegistrationForm(): UseRegistrationFormReturn {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1)
  const [formData, setFormData] = useState<RegistrationData>(initialFormData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateFormData = useCallback(<K extends keyof RegistrationData>(
    field: K, 
    value: RegistrationData[K]
  ) => {
    setFormData((prev: RegistrationData) => ({ ...prev, [field]: value }))
  }, [])

  // Validation email ISEP
  const isValidEmail = useCallback((email: string): boolean => {
    return email.endsWith('@eleve.isep.fr') && email.length > '@eleve.isep.fr'.length
  }, [])

  // Validation mot de passe renforcée
  const validatePassword = useCallback((password: string): boolean => {
    if (password.length < 8) return false
    if (!/[A-Z]/.test(password)) return false
    if (!/[a-z]/.test(password)) return false
    if (!/[0-9]/.test(password)) return false
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false
    return true
  }, [])

  const validateCurrentStep = useCallback((): boolean => {
    switch (currentStep) {
      case 1:
        return !!(
          formData.firstName.trim() && 
          formData.lastName.trim() && 
          isValidEmail(formData.email) && 
          formData.password && 
          formData.confirmPassword && 
          formData.cycle &&
          formData.password === formData.confirmPassword &&
          validatePassword(formData.password)
        )
      case 2:
        return !!(formData.birthDate && formData.phone.trim())
      case 3:
        return !!(formData.motivation.trim() && formData.experience.trim())
      case 4:
        return formData.instruments.length > 0
      case 5:
        return true
      case 6:
        return true
      default:
        return false
    }
  }, [currentStep, formData, validatePassword, isValidEmail])

  const getStepErrorMessage = useCallback((step: RegistrationStep): string => {
    switch (step) {
      case 1:
        if (!isValidEmail(formData.email)) {
          return 'Veuillez utiliser votre email ISEP (@eleve.isep.fr)'
        }
        if (formData.password !== formData.confirmPassword) {
          return 'Les mots de passe ne correspondent pas'
        }
        if (!validatePassword(formData.password)) {
          return 'Le mot de passe ne respecte pas les critères de sécurité'
        }
        return 'Veuillez remplir tous les champs requis'
      case 2:
        return 'Veuillez renseigner votre date de naissance et téléphone'
      case 3:
        return 'Veuillez décrire votre motivation et expérience'
      case 4:
        return 'Veuillez sélectionner au moins un instrument'
      default:
        return 'Veuillez remplir tous les champs requis'
    }
  }, [formData, validatePassword, isValidEmail])

  const nextStep = useCallback(() => {
    if (validateCurrentStep()) {
      setError(null)
      if (currentStep < 6) {
        setCurrentStep((prev: RegistrationStep) => (prev + 1) as RegistrationStep)
      }
    } else {
      setError(getStepErrorMessage(currentStep))
    }
  }, [currentStep, validateCurrentStep, getStepErrorMessage])

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev: RegistrationStep) => (prev - 1) as RegistrationStep)
      setError(null)
    }
  }, [currentStep])

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!validateCurrentStep()) {
      setError('Veuillez vérifier toutes les informations')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await signUp.email({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password
      })

      router.push('/')
    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err.message || 'Une erreur est survenue lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }, [formData, validateCurrentStep, router])

  return {
    currentStep,
    formData,
    loading,
    error,
    nextStep,
    prevStep,
    updateFormData,
    handleSubmit,
    validateCurrentStep,
  }
}