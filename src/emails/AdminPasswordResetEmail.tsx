import { Button, Heading, Section, Text } from '@react-email/components';
import * as React from 'react';
import BaseEmailTemplate, { styles } from './BaseEmailTemplate';

interface AdminPasswordResetEmailProps {
  name: string;
  resetUrl: string;
  adminName?: string;
}

export const AdminPasswordResetEmail = ({
  name = 'Membre',
  resetUrl,
  adminName = 'un administrateur',
}: AdminPasswordResetEmailProps) => {
  const previewText = `Votre mot de passe a été réinitialisé par un administrateur`;

  return (
    <BaseEmailTemplate previewText={previewText}>
      <Heading style={styles.h1}>Réinitialisation de mot de passe 🔐</Heading>

      <Text style={styles.text}>Bonjour {name},</Text>

      <Text style={styles.text}>
        Votre mot de passe ISEP Bands a été réinitialisé par {adminName}.
      </Text>

      <Text style={styles.text}>
        Pour des raisons de sécurité, vous devez définir un nouveau mot de passe avant de pouvoir
        vous connecter.
      </Text>

      <Text style={styles.text}>
        Cliquez sur le bouton ci-dessous pour définir votre nouveau mot de passe :
      </Text>

      <Section style={{ textAlign: 'center', margin: '32px 0' }}>
        <Button
          style={{
            ...styles.button,
            backgroundColor: '#FF2E5A',
            color: '#ffffff',
          }}
          href={resetUrl}
        >
          Définir mon mot de passe
        </Button>
      </Section>

      <Text style={styles.text}>Ou copiez et collez ce lien dans votre navigateur :</Text>

      <Text style={{ ...styles.text, fontSize: '14px', color: '#666' }}>{resetUrl}</Text>

      <Section style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
        <Text style={{ ...styles.text, fontSize: '12px', color: '#999' }}>
          ⚠️ Ce lien expire dans 24 heures pour votre sécurité.
        </Text>
        <Text style={{ ...styles.text, fontSize: '12px', color: '#999' }}>
          Si vous n&apos;avez pas demandé cette réinitialisation, contactez immédiatement un
          administrateur.
        </Text>
      </Section>
    </BaseEmailTemplate>
  );
};

export default AdminPasswordResetEmail;
