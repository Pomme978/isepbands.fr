// @components/profile/GroupRoles.tsx
'use client';

interface GroupRoles {
  role: string;
  isPrimary: boolean;
}

interface GroupRolesProps {
  roles: GroupRoles[];
  className?: string;
}

export default function GroupRoles({ roles, className = '' }: GroupRolesProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      {roles.map((role, index) => (
        <span
          key={index}
          className={`inline-block text-xs px-2 py-1 rounded-full mr-1 ${
            role.isPrimary ? 'bg-purple-100 text-primary font-medium' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {role.role}
        </span>
      ))}
    </div>
  );
}
