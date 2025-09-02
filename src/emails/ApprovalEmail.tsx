import { Button, Heading, Section, Text } from '@react-email/components';
import * as React from 'react';
import BaseEmailTemplate, { styles } from './BaseEmailTemplate';

interface ApprovalEmailProps {
  name: string;
}

export const ApprovalEmail = ({
  name = 'Membre',
}: ApprovalEmailProps) => {
  const previewText = `Votre compte ISEP Bands a été approuvé !`;

  return (
    <BaseEmailTemplate previewText={previewText}>
      <Heading style={styles.h1}>Félicitations ! 🎉</Heading>
      
      <Text style={styles.text}>Bonjour {name},</Text>
      
      <Text style={styles.text}>
        Excellente nouvelle ! Votre compte ISEP Bands a été approuvé par notre équipe d'administration.
      </Text>

      <Section style={styles.success}>
        <Text style={styles.successText}>
          ✅ Votre compte est maintenant actif et vous avez accès à toutes les fonctionnalités du site !
        </Text>
      </Section>

      <Text style={styles.text}>
        Vous pouvez désormais :
      </Text>

      <ul style={{ ...styles.text, paddingLeft: '20px' }}>
        <li>Consulter votre profil et le personnaliser</li>
        <li>Accéder aux événements et actualités</li>
        <li>Participer à la vie de l'association</li>
        <li>Échanger avec les autres membres</li>
      </ul>

      <Section style={{ textAlign: 'center', margin: '32px 0' }}>
        <Button style={styles.button} href="https://isepbands.fr/login">
          Se connecter maintenant
        </Button>
      </Section>

      <Text style={styles.text}>
        Bienvenue dans la famille ISEP Bands ! 🎸🎤🥁
      </Text>

      <div style={styles.divider} />

      <Text style={{ ...styles.text, fontSize: '14px', color: '#64748b' }}>
        Si vous avez des questions, n'hésitez pas à nous contacter via le site ou sur nos réseaux sociaux.
      </Text>
    </BaseEmailTemplate>
  );
};

export default ApprovalEmail;