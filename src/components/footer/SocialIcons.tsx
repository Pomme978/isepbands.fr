interface SocialIconsProps {
  links: Array<{
    name: string;
    href: string;
    icon: React.ReactNode;
  }>;
}

export function SocialIcons({ links }: SocialIconsProps) {
  return (
    <div className="flex gap-4">
      {links.map((social) => (
        <a
          key={social.name}
          href={social.href}
          className="text-gray-600 hover:text-gray-900 transition-colors p-1"
          aria-label={social.name}
          target="_blank"
          rel="noopener noreferrer"
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
}
