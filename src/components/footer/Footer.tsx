// Footer.tsx
'use client';

import { FooterColumn } from './FooterColumn';
import { Newsletter } from './Newsletter';
import SocialsLink from '@/components/common/SocialsLink';
import { useI18n } from '@/locales/client';
import Image from 'next/image';
import isepbands_logo from '@/assets/images/logo_bands.png';

export default function Footer() {
  const t = useI18n();
  const currentYear = new Date().getFullYear();

  const footerColumns = [
    {
      title: t('footer.columns.pages.title'),
      links: [
        { label: t('footer.columns.pages.links.home'), href: '/' },
        { label: t('footer.columns.pages.links.club'), href: '/club' },
        { label: t('footer.columns.pages.links.bands'), href: '/bands' },
        { label: t('footer.columns.pages.links.events'), href: '/events' },
        { label: t('footer.columns.pages.links.team'), href: '/team' },
      ],
    },
    {
      title: t('footer.columns.association.title'),
      links: [
        { label: t('footer.columns.association.links.rules'), href: '/rules' },
        { label: t('footer.columns.association.links.membership'), href: '/club#rejoindre-asso' },
        { label: t('footer.columns.association.links.contact'), href: '/team' },
      ],
    },
    {
      title: t('footer.columns.legal.title'),
      links: [
        { label: t('footer.columns.legal.links.terms'), href: '/terms-of-service' },
        { label: t('footer.columns.legal.links.privacy'), href: '/privacy-policy' },
        { label: t('footer.columns.legal.links.legal'), href: '/legal-notice' },
      ],
    },
  ];

  const handleNewsletterSubmit = (email: string) => {
    console.log('Newsletter subscription:', email);
  };

  return (
    <footer className="bg-white relative mt-6 rounded-t-lg md:rounded-lg w-full max-w-7xl mx-auto">
      <div className="px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          <div className="col-span-1 mb-4 flex justify-center md:justify-start">
            <Image
              src={isepbands_logo}
              alt="ISEPBANDS Logo"
              width={120}
              height={120}
              className="object-contain w-28 h-28 md:w-24 md:h-24 hover:scale-105 transition-transform duration-300 cursor-pointer"
            />
          </div>

          <div className="col-span-3 flex-1 max-w-4xl grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerColumns.map((column) => (
              <FooterColumn key={column.title} title={column.title} links={column.links} />
            ))}
          </div>
        </div>

        <Newsletter
          title={t('footer.newsletter.title')}
          description={t('footer.newsletter.description')}
          placeholder={t('footer.newsletter.placeholder')}
          buttonText={t('footer.newsletter.buttonText')}
          onSubmit={handleNewsletterSubmit}
        />

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © {currentYear} ISEPBANDS, {t('footer.all_rights_reserved')}
            </p>
            <SocialsLink />
          </div>
        </div>
      </div>
    </footer>
  );
}
