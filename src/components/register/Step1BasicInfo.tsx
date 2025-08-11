import { RegistrationData } from '@/types/registration';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useI18n } from '@/locales/client';

interface Step1BasicInfoProps {
  data: RegistrationData;
  onChange: (fields: Partial<RegistrationData>) => void;
  onNext: () => void;
}

export default function Step1BasicInfo({ data, onChange, onNext }: Step1BasicInfoProps) {
  const t = useI18n();
  // States d'erreur par champ
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [cycleError, setCycleError] = useState('');

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
    setEmailError(validateEmail(data.email));
    setPasswordError(validatePassword(data.password));
    setConfirmPasswordError(validateConfirmPassword(data.confirmPassword, data.password));
    setCycleError(validateCycle(data.cycle));
    if (
      validateFirstName(data.firstName) ||
      validateLastName(data.lastName) ||
      validateEmail(data.email) ||
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
      <div className="flex gap-4">
        <div className="flex-1 space-y-1">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            type="text"
            autoComplete="given-name"
            value={data.firstName}
            onChange={(e) => {
              onChange({ firstName: e.target.value });
              setFirstNameError(validateFirstName(e.target.value));
            }}
            required
          />
          {firstNameError && <div className="text-red-500 text-xs mt-1">{firstNameError}</div>}
        </div>
        <div className="flex-1 space-y-1">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            type="text"
            autoComplete="family-name"
            value={data.lastName}
            onChange={(e) => {
              onChange({ lastName: e.target.value });
              setLastNameError(validateLastName(e.target.value));
            }}
            required
          />
          {lastNameError && <div className="text-red-500 text-xs mt-1">{lastNameError}</div>}
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={data.email}
          onChange={(e) => {
            onChange({ email: e.target.value });
            setEmailError(validateEmail(e.target.value));
          }}
          required
        />
        {emailError && <div className="text-red-500 text-xs mt-1">{emailError}</div>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          value={data.password}
          onChange={(e) => {
            onChange({ password: e.target.value });
            setPasswordError(validatePassword(e.target.value));
            setConfirmPasswordError(validateConfirmPassword(data.confirmPassword, e.target.value));
          }}
          required
        />
        {passwordError && <div className="text-red-500 text-xs mt-1">{passwordError}</div>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={data.confirmPassword}
          onChange={(e) => {
            onChange({ confirmPassword: e.target.value });
            setConfirmPasswordError(validateConfirmPassword(e.target.value, data.password));
          }}
          required
        />
        {confirmPasswordError && (
          <div className="text-red-500 text-xs mt-1">{confirmPasswordError}</div>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="cycle">Cycle</Label>
        <Input
          id="cycle"
          type="text"
          value={data.cycle}
          onChange={(e) => {
            onChange({ cycle: e.target.value });
            setCycleError(validateCycle(e.target.value));
          }}
          required
        />
        {cycleError && <div className="text-red-500 text-xs mt-1">{cycleError}</div>}
      </div>
      <Button type="submit" className="w-full">
        Suivant
      </Button>
    </form>
  );
}
