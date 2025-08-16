// @components/settings/LevelBadge.tsx
'use client';

interface LevelBadgeProps {
  level: string;
  size?: 'sm' | 'md';
}

export default function LevelBadge({ level, size = 'md' }: LevelBadgeProps) {
  const getLevelColor = (level: string) => {
    const colors = {
      Débutant: 'bg-yellow-100 text-yellow-800',
      Intermédiaire: 'bg-blue-100 text-blue-800',
      Avancé: 'bg-purple-100 text-purple-800',
      Expert: 'bg-red-100 text-red-800',
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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
