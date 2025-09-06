// @components/settings/LevelBadge.tsx
interface LevelBadgeProps {
  level: string;
  size?: 'sm' | 'md';
}

export default function LevelBadge({ level, size = 'md' }: LevelBadgeProps) {
  const getLevelColor = (level: string) => {
    // Normalize the level to handle both french and english formats
    const normalizedLevel = level.toLowerCase();
    const colors = {
      // French
      débutant: 'bg-green-100 text-green-800',
      intermédiaire: 'bg-blue-100 text-blue-800',
      avancé: 'bg-orange-100 text-orange-800',
      expert: 'bg-red-100 text-red-800',
      // English
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-blue-100 text-blue-800',
      advanced: 'bg-orange-100 text-orange-800',
      expert: 'bg-red-100 text-red-800',
      // Uppercase English (legacy)
      BEGINNER: 'bg-green-100 text-green-800',
      INTERMEDIATE: 'bg-blue-100 text-blue-800',
      ADVANCED: 'bg-orange-100 text-orange-800',
      EXPERT: 'bg-red-100 text-red-800',
    };
    return colors[normalizedLevel as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-block rounded-full font-medium ${getLevelColor(level)} ${sizeClasses[size]}`}
    >
      {level}
    </span>
  );
}
