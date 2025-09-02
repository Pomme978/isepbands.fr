import { Resend } from 'resend';
import { render } from '@react-email/components';
import WelcomeEmail from '@/emails/WelcomeEmail';
import PasswordResetEmail from '@/emails/PasswordResetEmail';
import ApprovalEmail from '@/emails/ApprovalEmail';
import RejectionEmail from '@/emails/RejectionEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  react?: React.ReactElement;
}

export class EmailService {
  private static from = process.env.EMAIL_FROM || 'ISEP Bands <no-reply@isepbands.fr>';

  static async send({ to, subject, html, text, react }: EmailOptions) {
    try {
      const { data, error } = await resend.emails.send({
        from: this.from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
        react,
      });

      if (error) {
        console.error('Email send error:', error);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      console.log(`Email sent successfully to ${to}`, data);
      return data;
    } catch (error) {
      console.error('Email service error:', error);
      throw error;
    }
  }

  static async sendWelcomeEmail(email: string, name: string, temporaryPassword?: string) {
    const emailHtml = render(WelcomeEmail({ name, email, temporaryPassword }));
    
    return this.send({
      to: email,
      subject: 'Bienvenue sur ISEP Bands !',
      html: emailHtml,
    });
  }

  static async sendPasswordResetEmail(email: string, name: string, resetToken: string) {
    const resetUrl = `https://isepbands.fr/reset-password?token=${resetToken}`;
    const emailHtml = render(PasswordResetEmail({ name, resetUrl }));
    
    return this.send({
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      html: emailHtml,
    });
  }

  static async sendApprovalEmail(email: string, name: string) {
    const emailHtml = render(ApprovalEmail({ name }));
    
    return this.send({
      to: email,
      subject: 'Votre compte ISEP Bands a été approuvé !',
      html: emailHtml,
    });
  }

  static async sendRejectionEmail(email: string, name: string, reason?: string) {
    const emailHtml = render(RejectionEmail({ name, reason }));
    
    return this.send({
      to: email,
      subject: 'Votre demande d\'inscription ISEP Bands',
      html: emailHtml,
    });
  }

  static async sendTestEmail(to: string) {
    return this.send({
      to,
      subject: 'Test Email - ISEP Bands',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Test Email</h2>
          <p>Si vous recevez cet email, la configuration Resend fonctionne correctement ! ✅</p>
          <p>Envoyé depuis : ${this.from}</p>
          <p>Date : ${new Date().toLocaleString('fr-FR')}</p>
        </div>
      `,
    });
  }
}