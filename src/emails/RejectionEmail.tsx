import { Heading, Section, Text } from '@react-email/components';
import * as React from 'react';
import BaseEmailTemplate, { styles } from './BaseEmailTemplate';

interface RejectionEmailProps {
  name: string;
  reason?: string;
}

export const RejectionEmail = ({
  name = 'Membre',
  reason,
}: RejectionEmailProps) => {
  const previewText = `Concernant votre demande d'inscription ISEP Bands`;

  return (
    <BaseEmailTemplate previewText={previewText}>
      <Heading style={styles.h1}>Concernant votre demande d'inscription</Heading>
      
      <Text style={styles.text}>Bonjour {name},</Text>
      
      <Text style={styles.text}>
        Nous avons bien reçu et examiné votre demande d'inscription sur la plateforme ISEP Bands.
      </Text>

      <Text style={styles.text}>
        Après étude de votre dossier, nous sommes au regret de vous informer que nous ne pouvons pas 
        approuver votre compte pour le moment.
      </Text>

      {reason && (
        <Section style={{ ...styles.codeBox, backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444' }}>
          <Text style={{ ...styles.text, margin: 0 }}>
            <strong>Raison :</strong> {reason}
          </Text>
        </Section>
      )}

      <Text style={styles.text}>
        Si vous pensez qu'il s'agit d'une erreur ou si vous souhaitez obtenir plus d'informations, 
        n'hésitez pas à nous contacter directement.
      </Text>

      <div style={styles.divider} />

      <Text style={{ ...styles.text, fontSize: '14px', color: '#64748b' }}>
        Nous restons à votre disposition pour toute question.
        <br />
        L'équipe ISEP Bands
      </Text>
    </BaseEmailTemplate>
  );
};

export default RejectionEmail;