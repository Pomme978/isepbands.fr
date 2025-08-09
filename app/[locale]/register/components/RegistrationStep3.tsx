
// app/[locale]/register/components/RegistrationStep3.tsx
'use client'

import { RegistrationData } from '../types'
import { Label } from "@/components/ui/Label"
import { useI18n } from '@/locales/client'

interface Props {
  formData: RegistrationData
  updateFormData: <K extends keyof RegistrationData>(field: K, value: RegistrationData[K]) => void
}

export function RegistrationStep3({ formData, updateFormData }: Props) {
  const t = useI18n()

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">{t('auth.register.step3.title')}</h2>
        <p className="text-muted-foreground">Parlez-nous de vous</p>
      </div>
      
      <div>
        <Label htmlFor="motivation">{t('auth.register.motivation')}</Label>
        <textarea
          id="motivation"
          value={formData.motivation}
          onChange={(e) => updateFormData('motivation', e.target.value)}
          placeholder={t('auth.register.motivationPlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          required
        />
      </div>

      <div>
        <Label htmlFor="experience">{t('auth.register.experience')}</Label>
        <textarea
          id="experience"
          value={formData.experience}
          onChange={(e) => updateFormData('experience', e.target.value)}
          placeholder={t('auth.register.experiencePlaceholder')}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          required
        />
      </div>
    </div>
  )
}