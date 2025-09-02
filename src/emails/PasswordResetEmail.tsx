import { Button, Heading, Section, Text } from '@react-email/components';
import * as React from 'react';
import BaseEmailTemplate, { styles } from './BaseEmailTemplate';

interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
}

export const PasswordResetEmail = ({
  name = 'Membre',
  resetUrl,
}: PasswordResetEmailProps) => {
  const previewText = `Réinitialisation de votre mot de passe ISEP Bands`;

  return (
    <BaseEmailTemplate previewText={previewText}>
      <Heading style={styles.h1}>Réinitialisation de mot de passe 🔐</Heading>
      
      <Text style={styles.text}>Bonjour {name},</Text>
      
      <Text style={styles.text}>
        Vous avez demandé la réinitialisation de votre mot de passe pour votre compte ISEP Bands.
      </Text>

      <Text style={styles.text}>
        Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :
      </Text>

      <Section style={{ textAlign: 'center', margin: '32px 0' }}>
        <Button style={styles.button} href={resetUrl}>
          Réinitialiser mon mot de passe
        </Button>
      </Section>

      <Section style={styles.alert}>
        <Text style={styles.alertText}>
          ⏰ Ce lien expirera dans 1 heure pour des raisons de sécurité.
        </Text>
      </Section>

      <Text style={{ ...styles.text, color: '#64748b', fontSize: '14px' }}>
        Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.
        Votre mot de passe restera inchangé.
      </Text>

      <div style={styles.divider} />

      <Text style={{ ...styles.text, color: '#94a3b8', fontSize: '12px' }}>
        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
        <br />
        <span style={{ wordBreak: 'break-all' }}>{resetUrl}</span>
      </Text>
    </BaseEmailTemplate>
  );
};

export default PasswordResetEmail;