import { Button, Heading, Section, Text } from '@react-email/components';
import * as React from 'react';
import BaseEmailTemplate, { styles } from './BaseEmailTemplate';

interface SetPasswordEmailProps {
  name: string;
  resetUrl: string;
  adminName?: string;
}

export const SetPasswordEmail = ({
  name = 'Nouveau membre',
  resetUrl,
  adminName = 'un administrateur',
}: SetPasswordEmailProps) => {
  const previewText = `Définissez votre mot de passe pour accéder à ISEP Bands`;

  return (
    <BaseEmailTemplate previewText={previewText}>
      <Heading style={styles.h1}>Bienvenue chez ISEP Bands ! 🎵</Heading>

      <Text style={styles.text}>Bonjour {name},</Text>

      <Text style={styles.text}>
        Votre compte ISEP Bands a été créé par {adminName}. Bienvenue dans notre communauté musicale
        !
      </Text>

      <Text style={styles.text}>
        Pour finaliser la configuration de votre compte, vous devez définir votre mot de passe
        personnel.
      </Text>

      <Text style={styles.text}>
        Cliquez sur le bouton ci-dessous pour créer votre mot de passe :
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
          Créer mon mot de passe
        </Button>
      </Section>

      <Text style={styles.text}>Ou copiez et collez ce lien dans votre navigateur :</Text>

      <Text style={{ ...styles.text, fontSize: '14px', color: '#666' }}>{resetUrl}</Text>

      <Section style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
        <Text style={{ ...styles.text, fontSize: '14px' }}>
          🎸 Une fois votre mot de passe défini, vous pourrez :
        </Text>
        <Text style={{ ...styles.text, fontSize: '14px', marginLeft: '20px' }}>
          • Accéder à votre profil personnel
        </Text>
        <Text style={{ ...styles.text, fontSize: '14px', marginLeft: '20px' }}>
          • Participer aux événements et jams
        </Text>
        <Text style={{ ...styles.text, fontSize: '14px', marginLeft: '20px' }}>
          • Rejoindre notre communauté de musiciens
        </Text>
      </Section>

      <Section style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
        <Text style={{ ...styles.text, fontSize: '12px', color: '#999' }}>
          ⚠️ Ce lien expire dans 24 heures pour votre sécurité.
        </Text>
        <Text style={{ ...styles.text, fontSize: '12px', color: '#999' }}>
          Si vous avez des questions, n&apos;hésitez pas à nous contacter.
        </Text>
      </Section>
    </BaseEmailTemplate>
  );
};

export default SetPasswordEmail;
