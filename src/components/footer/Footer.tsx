// Footer.tsx
'use client';

import { FooterColumn } from './FooterColumn';
import { Newsletter } from './Newsletter';
import { SocialIcons } from './SocialIcons';
import { useI18n } from '@/locales/client';
import { siFacebook, siInstagram, siX, siGithub, siYoutube } from 'simple-icons';

const footerColumns = [
  {
    title: 'Ressources',
    links: [
      { label: 'Accueil', href: '/' },
      { label: "L'association", href: '/club' },
      { label: 'Bands', href: '/bands' },
      { label: 'Les Evenements', href: '/events' },
      { label: 'Le Bureau', href: '/team' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Jobs', href: '/jobs' },
      { label: 'Press', href: '/press' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of service', href: '/terms' },
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'License', href: '/license' },
    ],
  },
];

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d={siFacebook.path} />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d={siInstagram.path} />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d={siYoutube.path} />
      </svg>
    ),
  },
];

export default function Footer() {
  const t = useI18n();
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (email: string) => {
    console.log('Newsletter subscription:', email);
  };

  return (
    <footer className="bg-white md:bottom-4 relative mt-6 rounded-t-lg md:rounded-lg w-full max-w-7xl mx-auto">
      <div className="px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          <div className="col-span-1 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 bg-white rounded-sm transform rotate-12"></div>
            </div>
          </div>

          <div className="col-span-3 flex-1 max-w-4xl grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerColumns.map((column) => (
              <FooterColumn key={column.title} title={column.title} links={column.links} />
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 py-8">
          <Newsletter
            title="Subscribe to our newsletter"
            description="The latest news, articles, and resources, sent to your inbox weekly."
            placeholder="Enter your email"
            buttonText="Subscribe"
            onSubmit={handleNewsletterSubmit}
          />
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © {currentYear} ISEPBANDS, {t('footer.all_rights_reserved')}
            </p>
            <SocialIcons links={socialLinks} />
          </div>
        </div>
      </div>
    </footer>
  );
}
