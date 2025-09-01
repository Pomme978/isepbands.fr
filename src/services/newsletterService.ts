import { prisma } from '@/lib/prisma';

/**
 * Automatically subscribe a user to the newsletter when they are created or approved
 */
export async function autoSubscribeUser(email: string, source: 'admin_created' | 'approved' = 'approved'): Promise<void> {
  try {
    const emailLower = email.toLowerCase().trim();

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: emailLower },
    });

    if (existing) {
      // If exists but inactive, reactivate
      if (!existing.isActive) {
        await prisma.newsletterSubscriber.update({
          where: { email: emailLower },
          data: {
            isActive: true,
            unsubscribedAt: null,
            source,
          },
        });
      }
      // If already active, nothing to do
      return;
    }

    // Create new subscription
    await prisma.newsletterSubscriber.create({
      data: {
        email: emailLower,
        source,
        isActive: true,
      },
    });

    console.log(`Auto-subscribed ${emailLower} to newsletter (source: ${source})`);
  } catch (error) {
    console.error('Error auto-subscribing user to newsletter:', error);
    // Don't throw - this is a non-critical operation
  }
}

/**
 * Automatically unsubscribe a user when they are deleted/archived
 */
export async function autoUnsubscribeUser(email: string): Promise<void> {
  try {
    const emailLower = email.toLowerCase().trim();

    // Find and deactivate subscription
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: emailLower },
    });

    if (subscriber && subscriber.isActive) {
      await prisma.newsletterSubscriber.update({
        where: { email: emailLower },
        data: {
          isActive: false,
          unsubscribedAt: new Date(),
        },
      });

      console.log(`Auto-unsubscribed ${emailLower} from newsletter (user deleted)`);
    }
  } catch (error) {
    console.error('Error auto-unsubscribing user from newsletter:', error);
    // Don't throw - this is a non-critical operation
  }
}

/**
 * Check if an email is subscribed to the newsletter
 */
export async function isSubscribedToNewsletter(email: string): Promise<boolean> {
  try {
    const emailLower = email.toLowerCase().trim();
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: emailLower },
    });

    return subscriber ? subscriber.isActive : false;
  } catch (error) {
    console.error('Error checking newsletter subscription:', error);
    return false;
  }
}