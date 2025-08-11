import { RegistrationData } from '@/types/registration';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface Step3MotivationProps {
  data: RegistrationData;
  onChange: (fields: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3Motivation({ data, onChange, onNext, onBack }: Step3MotivationProps) {
  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <div className="space-y-1">
        <Label htmlFor="motivation">Motivation</Label>
        <Textarea
          id="motivation"
          value={data.motivation}
          onChange={(e) => onChange({ motivation: e.target.value })}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="experience">Expérience</Label>
        <Textarea
          id="experience"
          value={data.experience}
          onChange={(e) => onChange({ experience: e.target.value })}
          required
        />
      </div>
      <div className="flex justify-between gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button type="submit">Suivant</Button>
      </div>
    </form>
  );
}
