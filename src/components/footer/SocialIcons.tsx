interface SocialIconsProps {
  links: Array<{
    name: string;
    href: string;
    icon: React.ReactNode;
    // Optional per-link customization
    color?: string;
    hoverColor?: string;
    size?: string;
  }>;
  // Global defaults
  defaultColor?: string;
  defaultHoverColor?: string;
  defaultSize?: string;
  gap?: string;
  className?: string;
}

export function SocialIcons({
  links,
  defaultColor = 'text-gray-600',
  defaultHoverColor = 'text-gray-900',
  defaultSize = 'w-5 h-5',
  gap = 'gap-4',
  className = '',
}: SocialIconsProps) {
  return (
    <div className={`flex ${gap} ${className}`}>
      {links.map((social) => (
        <a
          key={social.name}
          href={social.href}
          className={`
            ${social.color || defaultColor} 
            hover:${social.hoverColor || defaultHoverColor} 
            transition-colors p-1
          `}
          aria-label={social.name}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={social.size || defaultSize}>{social.icon}</div>
        </a>
      ))}
    </div>
  );
}
