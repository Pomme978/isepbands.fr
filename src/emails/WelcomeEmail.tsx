import { Button, Heading, Section, Text } from '@react-email/components';
import * as React from 'react';
import BaseEmailTemplate, { styles } from './BaseEmailTemplate';

interface WelcomeEmailProps {
  name: string;
  email: string;
  temporaryPassword?: string;
}

export const WelcomeEmail = ({
  name = 'Membre',
  email,
  temporaryPassword,
}: WelcomeEmailProps) => {
  const previewText = `Bienvenue sur ISEP Bands, ${name}!`;

  return (
    <BaseEmailTemplate previewText={previewText}>
      <Heading style={styles.h1}>Bienvenue sur ISEP Bands ! 🎸</Heading>
      
      <Text style={styles.text}>Bonjour {name},</Text>
      
      <Text style={styles.text}>
        Votre compte ISEP Bands a été créé avec succès. Vous faites maintenant partie de notre communauté musicale !
      </Text>

      {temporaryPassword && (
        <Section style={styles.codeBox}>
          <Text style={styles.text}>Vos identifiants de connexion :</Text>
          <Text style={styles.code}>
            Email : <strong>{email}</strong>
          </Text>
          <Text style={styles.code}>
            Mot de passe temporaire : <strong>{temporaryPassword}</strong>
          </Text>
          <Section style={styles.alert}>
            <Text style={styles.alertText}>
              ⚠️ Vous devrez changer ce mot de passe lors de votre première connexion.
            </Text>
          </Section>
        </Section>
      )}

      <Section style={{ textAlign: 'center', margin: '24px 0' }}>
        <Button style={styles.button} href="https://isepbands.fr/login">
          Se connecter
        </Button>
      </Section>
    </BaseEmailTemplate>
  );
};

export default WelcomeEmail;