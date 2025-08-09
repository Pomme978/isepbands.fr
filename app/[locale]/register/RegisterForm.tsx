// app/[locale]/register/RegisterForm.tsx (VERSION CLEAN)
'use client' 

import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button" 
import { Progress } from "@/components/ui/Progress" 
import BackButton from "@/components/ui/BackButton"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRegistrationForm } from "@/hooks/useRegistrationForm" 
import { useInstruments } from "@/hooks/useInstruments" 
import { useI18n } from '@/locales/client'

import { RegistrationStep1 } from "./components/RegistrationStep1"
import { RegistrationStep2 } from "./components/RegistrationStep2"
import { RegistrationStep3 } from "./components/RegistrationStep3"
import { RegistrationStep4 } from "./components/RegistrationStep4"
import { RegistrationStep5 } from "./components/RegistrationStep5"
import { RegistrationStep6 } from "./components/RegistrationStep6"

interface RegisterFormProps {
  locale: string;
}

export default function RegisterForm({ locale }: RegisterFormProps) {
  const {
    currentStep,
    formData,
    loading,
    error,
    nextStep,
    prevStep,
    updateFormData,
    handleSubmit,
    validateCurrentStep
  } = useRegistrationForm()

  const { instruments, loading: instrumentsLoading } = useInstruments()
  const t = useI18n()

  const totalSteps = 6
  const progress = (currentStep / totalSteps) * 100
  const isLastStep = currentStep === totalSteps
  const isFirstStep = currentStep === 1
  const isFormValid = validateCurrentStep()

  const renderCurrentStep = () => {
    const commonProps = { formData, updateFormData }

    switch (currentStep) {
      case 1:
        return <RegistrationStep1 {...commonProps} />
      case 2:
        return <RegistrationStep2 {...commonProps} />
      case 3:
        return <RegistrationStep3 {...commonProps} />
      case 4:
        return <RegistrationStep4 {...commonProps} instruments={instruments} />
      case 5:
        return <RegistrationStep5 {...commonProps} />
      case 6:
        return <RegistrationStep6 formData={formData} />
      default:
        return <RegistrationStep1 {...commonProps} />
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 relative">
      <div className="absolute top-6 left-6">
        <BackButton variant="ghost"/>
      </div>
      
      <Card className="w-full max-w-2xl p-8">
        {/* Header with progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">{t('auth.register.title')}</h1>
            <span className="text-sm text-muted-foreground">
              {t('common.step')} {currentStep} {t('common.of')} {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Current step content */}
        <div className="min-h-[400px] mb-8">
          {instrumentsLoading && currentStep === 4 ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>{t('common.loadingInstruments')}</p>
              </div>
            </div>
          ) : (
            renderCurrentStep()
          )}
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between items-center">
          {/* Bouton Précédent - masqué sur step 1 */}
          {isFirstStep ? (
            <div></div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              {t('common.previous')}
            </Button>
          )}

          {/* Bouton Suivant/Finaliser - toujours affiché mais conditionnel */}
          {isLastStep ? (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !isFormValid}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {t('common.creating')}
                </>
              ) : (
                t('auth.register.submit')
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={nextStep}
              disabled={loading || !isFormValid}
              className="flex items-center gap-2"
            >
              {t('common.next')}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Link to login */}
        <div className="text-center">
          <a
            href={`/${locale}/login`}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            {t('auth.login.alreadyAccount')} {t('auth.login.button')}
          </a>
        </div>
      </Card>
    </div>
  )
}

