import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface BaseEmailTemplateProps {
  previewText: string;
  children: React.ReactNode;
}

export const BaseEmailTemplate = ({
  previewText,
  children,
}: BaseEmailTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header avec logo */}
          <Section style={header}>
            <Img
              src="https://isepbands.fr/logo.png"
              width="150"
              height="50"
              alt="ISEP Bands"
              style={logo}
            />
          </Section>

          {/* Contenu principal */}
          <Section style={content}>
            {children}
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} ISEP Bands - Association musicale de l'ISEP
            </Text>
            <Text style={footerLinks}>
              <Link href="https://isepbands.fr" style={link}>
                Site web
              </Link>
              {' • '}
              <Link href="https://isepbands.fr/contact" style={link}>
                Contact
              </Link>
              {' • '}
              <Link href="https://instagram.com/isepbands" style={link}>
                Instagram
              </Link>
            </Text>
            <Text style={unsubscribe}>
              Cet email a été envoyé automatiquement, merci de ne pas y répondre.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles réutilisables
export const styles = {
  main: {
    backgroundColor: '#f6f9fc',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  },
  container: {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    borderRadius: '8px',
    overflow: 'hidden',
    marginTop: '20px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  header: {
    backgroundColor: '#1e293b',
    padding: '24px',
    textAlign: 'center' as const,
  },
  logo: {
    margin: '0 auto',
  },
  content: {
    padding: '32px 24px',
  },
  footer: {
    backgroundColor: '#f8fafc',
    padding: '24px',
    textAlign: 'center' as const,
  },
  footerText: {
    color: '#64748b',
    fontSize: '14px',
    lineHeight: '24px',
    margin: '0 0 8px',
  },
  footerLinks: {
    color: '#64748b',
    fontSize: '14px',
    lineHeight: '24px',
    margin: '0 0 8px',
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
  },
  unsubscribe: {
    color: '#94a3b8',
    fontSize: '12px',
    lineHeight: '20px',
    margin: '8px 0 0',
  },
  h1: {
    color: '#1e293b',
    fontSize: '28px',
    fontWeight: '700',
    lineHeight: '36px',
    margin: '0 0 24px',
  },
  h2: {
    color: '#1e293b',
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '28px',
    margin: '0 0 16px',
  },
  text: {
    color: '#475569',
    fontSize: '16px',
    lineHeight: '26px',
    margin: '0 0 16px',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 32px',
    margin: '16px 0',
  },
  buttonSecondary: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    color: '#475569',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 32px',
    margin: '16px 0',
  },
  codeBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: '6px',
    padding: '16px',
    margin: '16px 0',
  },
  code: {
    fontFamily: 'monospace',
    fontSize: '14px',
    color: '#1e293b',
    margin: '0',
  },
  alert: {
    backgroundColor: '#fef3c7',
    border: '1px solid #fbbf24',
    borderRadius: '6px',
    padding: '12px 16px',
    margin: '16px 0',
  },
  alertText: {
    color: '#92400e',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0',
  },
  success: {
    backgroundColor: '#d1fae5',
    border: '1px solid #34d399',
    borderRadius: '6px',
    padding: '12px 16px',
    margin: '16px 0',
  },
  successText: {
    color: '#065f46',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0',
  },
  divider: {
    borderTop: '1px solid #e2e8f0',
    margin: '24px 0',
  },
};

const {
  main,
  container,
  header,
  logo,
  content,
  footer,
  footerText,
  footerLinks,
  link,
  unsubscribe,
} = styles;

export default BaseEmailTemplate;