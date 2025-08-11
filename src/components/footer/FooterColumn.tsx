// FooterColumn.tsx
import LangLink from '../common/LangLink';

interface FooterColumnProps {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}

export function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-gray-900 font-medium text-base">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <LangLink
              href={link.href}
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              {link.label}
            </LangLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
