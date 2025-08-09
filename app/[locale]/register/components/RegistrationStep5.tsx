'use client'
import { RegistrationData } from '../types'

interface Props {
  formData: RegistrationData
  updateFormData: <K extends keyof RegistrationData>(field: K, value: RegistrationData[K]) => void
}

export function RegistrationStep5({ formData, updateFormData }: Props) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Et enfin, une petite photo ?</h2>
        <p className="text-muted-foreground">Choisis ta photo de profil</p>
      </div>
      
      <div className="text-center text-muted-foreground">
        <p>Step 5 - Upload photo</p>
      </div>
    </div>
  )
}