import { RegistrationData } from '@/types/registration';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface Step1BasicInfoProps {
  data: RegistrationData;
  onChange: (fields: Partial<RegistrationData>) => void;
  onNext: () => void;
}

export default function Step1BasicInfo({ data, onChange, onNext }: Step1BasicInfoProps) {
  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
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
            onChange={(e) => onChange({ firstName: e.target.value })}
            required
          />
        </div>
        <div className="flex-1 space-y-1">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            type="text"
            autoComplete="family-name"
            value={data.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            required
          />
        </div>
        <div className="flex-1 space-y-1">
          <Label htmlFor="username">Pseudo</Label>
          <Input
            id="username"
            type="text"
            autoComplete="username"
            value={data.username}
            onChange={(e) => onChange({ username: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          value={data.password}
          onChange={(e) => onChange({ password: e.target.value })}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={data.confirmPassword}
          onChange={(e) => onChange({ confirmPassword: e.target.value })}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="cycle">Cycle</Label>
        <Input
          id="cycle"
          type="text"
          value={data.cycle}
          onChange={(e) => onChange({ cycle: e.target.value })}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Suivant
      </Button>
    </form>
  );
}
