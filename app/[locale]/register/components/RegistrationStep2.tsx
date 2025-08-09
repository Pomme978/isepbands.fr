
// app/[locale]/register/components/RegistrationStep2.tsx
'use client'

import { RegistrationData } from '../types'
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { useI18n } from '@/locales/client'

interface Props {
  formData: RegistrationData
  updateFormData: <K extends keyof RegistrationData>(field: K, value: RegistrationData[K]) => void
}

export function RegistrationStep2({ formData, updateFormData }: Props) {
  const t = useI18n()

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">{t('auth.register.step2.title')}</h2>
        <p className="text-muted-foreground">Quelques informations supplémentaires</p>
      </div>
      
      <div>
        <Label htmlFor="birthDate">{t('auth.register.birthDate')}</Label>
        <Input
          id="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={(e) => updateFormData('birthDate', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">{t('auth.register.phone')}</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => updateFormData('phone', e.target.value)}
          placeholder="06 12 34 56 78"
          required
        />
      </div>
    </div>
  )
}
