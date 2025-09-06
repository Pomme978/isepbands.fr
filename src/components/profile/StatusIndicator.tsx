// @components/settings/StatusIndicator.tsx
interface StatusIndicatorProps {
  isActive: boolean;
  type: 'group' | 'recruitment';
  className?: string;
}

export default function StatusIndicator({ isActive, type, className = '' }: StatusIndicatorProps) {
  const getStatusConfig = () => {
    if (type === 'group') {
      return {
        active: { label: 'Actif', color: 'bg-green-100 text-green-800' },
        inactive: { label: 'Inactif', color: 'bg-red-100 text-red-800' },
      };
    }

    return {
      active: { label: 'Recrute', color: 'bg-green-100 text-green-800' },
      inactive: { label: 'Fermé', color: 'bg-gray-100 text-gray-800' },
    };
  };

  const config = getStatusConfig();
  const status = isActive ? config.active : config.inactive;

  return (
    <span className={`px-2 py-1 text-xs rounded-full font-medium ${status.color} ${className}`}>
      {status.label}
    </span>
  );
}
