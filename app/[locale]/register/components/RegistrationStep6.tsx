'use client'
import { RegistrationData } from '../types'

interface Props {
  formData: RegistrationData
  updateFormData: <K extends keyof RegistrationData>(field: K, value: RegistrationData[K]) => void
}

export function RegistrationStep6({ formData }: Omit<Props, 'updateFormData'>) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Confirmation</h2>
        <p className="text-muted-foreground">Votre compte sera créé et en attente de validation</p>
      </div>
      
      <div className="text-center text-muted-foreground">
        <p>Step 6 - Récapitulatif et soumission</p>
        <p>Vous recevrez une réponse par email dans les plus brefs délais</p>
      </div>
    </div>
  )
}