'use client'
import { Instrument, RegistrationData } from '../types'

interface Props {
  formData: RegistrationData
  updateFormData: <K extends keyof RegistrationData>(field: K, value: RegistrationData[K]) => void
}

interface Step4Props extends Props {
  instruments: Instrument[]
}

export function RegistrationStep4({ formData, updateFormData, instruments }: Step4Props) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">De quels instruments joues-tu ?</h2>
        <p className="text-muted-foreground">Sélectionne tes instruments et ton niveau</p>
      </div>
      
      <div className="text-center text-muted-foreground">
        <p>Step 4 - Instruments dynamiques</p>
        <p>Available instruments: {instruments.length}</p>
      </div>
    </div>
  )
}