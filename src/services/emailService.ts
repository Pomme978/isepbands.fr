import { Resend } from 'resend';
import { render } from '@react-email/components';
import WelcomeEmail from '@/emails/WelcomeEmail';
import PasswordResetEmail from '@/emails/PasswordResetEmail';
import AdminPasswordResetEmail from '@/emails/AdminPasswordResetEmail';
import SetPasswordEmail from '@/emails/SetPasswordEmail';
import ApprovalEmail from '@/emails/ApprovalEmail';
import RejectionEmail from '@/emails/RejectionEmail';
import { prisma } from '@/lib/prisma';

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
    const emailHtml = await render(WelcomeEmail({ name, email, temporaryPassword }));

    return this.send({
      to: email,
      subject: 'Bienvenue sur ISEP Bands !',
      html: emailHtml,
    });
  }

  static async sendPasswordResetEmail(email: string, name: string, resetToken: string) {
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://isepbands.com'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    const emailHtml = await render(PasswordResetEmail({ name, resetUrl }));

    return this.send({
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      html: emailHtml,
    });
  }

  static async sendApprovalEmail(email: string, name: string) {
    const emailHtml = await render(ApprovalEmail({ name }));

    return this.send({
      to: email,
      subject: 'Votre compte ISEP Bands a été approuvé !',
      html: emailHtml,
    });
  }

  static async sendRejectionEmail(email: string, name: string, reason?: string) {
    const emailHtml = await render(RejectionEmail({ name, reason }));

    return this.send({
      to: email,
      subject: "Votre demande d'inscription ISEP Bands",
      html: emailHtml,
    });
  }

  static async sendTemplateEmail(
    templateName: string,
    to: string,
    variables: Record<string, string | number | boolean>,
  ) {
    try {
      const template = await prisma.emailTemplate.findUnique({
        where: { name: templateName },
      });

      if (!template) {
        throw new Error(`Template "${templateName}" not found`);
      }

      let htmlContent = template.htmlContent;
      let subject = template.subject;

      // Remplacer les variables dans le contenu et le sujet
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
        htmlContent = htmlContent.replace(regex, value || '');
        subject = subject.replace(regex, value || '');
      });

      return this.send({
        to,
        subject,
        html: htmlContent,
      });
    } catch (error) {
      console.error('Error sending template email:', error);
      throw error;
    }
  }

  static async sendPendingApprovalEmail(email: string, name: string) {
    return this.sendTemplateEmail('Creation compte en attente approbation', email, { name });
  }

  static async sendAccountApprovedEmail(email: string, firstName: string, lastName: string) {
    return this.sendTemplateEmail('Compte approuve', email, {
      firstName,
      lastName,
      loginUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
      platformUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://isepbands.com',
    });
  }

  static async sendAccountRejectedEmail(
    email: string,
    firstName: string,
    lastName: string,
    reason: string,
  ) {
    return this.sendTemplateEmail('Compte non valide', email, {
      firstName,
      lastName,
      reason,
      supportEmail: 'support@isepbands.fr',
    });
  }

  static async sendAccountSuspendedEmail(
    email: string,
    firstName: string,
    lastName: string,
    reason: string,
  ) {
    return this.sendTemplateEmail('Compte suspendu', email, {
      firstName,
      lastName,
      reason,
      supportEmail: 'support@isepbands.fr',
    });
  }

  static async sendSuspendedAccountRestoredEmail(
    email: string,
    firstName: string,
    lastName: string,
  ) {
    return this.sendTemplateEmail('Compte suspendu restauré', email, {
      firstName,
      lastName,
      loginUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
      platformUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://isepbands.com',
    });
  }

  static async sendRefusedMemberRestoredEmail(email: string, firstName: string, lastName: string) {
    return this.sendTemplateEmail('Membre refusé restauré', email, {
      firstName,
      lastName,
      loginUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
      platformUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://isepbands.com',
    });
  }

  static async sendAdminPasswordResetEmail(
    email: string,
    name: string,
    resetToken: string,
    adminName?: string,
  ) {
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://isepbands.com'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    const emailHtml = await render(AdminPasswordResetEmail({ name, resetUrl, adminName }));

    return this.send({
      to: email,
      subject: 'Votre mot de passe a été réinitialisé par un administrateur',
      html: emailHtml,
    });
  }

  static async sendSetPasswordEmail(
    email: string,
    name: string,
    resetToken: string,
    adminName?: string,
  ) {
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://isepbands.com'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    const emailHtml = await render(SetPasswordEmail({ name, resetUrl, adminName }));

    return this.send({
      to: email,
      subject: 'Définissez votre mot de passe pour accéder à ISEP Bands',
      html: emailHtml,
    });
  }

  static async sendEmailVerificationEmail(
    email: string,
    firstName: string,
    verificationToken: string,
  ) {
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${verificationToken}`;
    return this.sendTemplateEmail('Verification email', email, {
      firstName,
      verificationUrl,
      platformUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://isepbands.com',
    });
  }

  static async sendEmailVerifiedEmail(email: string, firstName: string) {
    return this.sendTemplateEmail('Email verifie', email, {
      firstName,
      email,
      loginUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
      platformUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://isepbands.com',
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
