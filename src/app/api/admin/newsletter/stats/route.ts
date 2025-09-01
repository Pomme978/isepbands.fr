import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/middlewares/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.ok) return auth.res;

  try {
    // Get newsletter statistics
    const [
      totalSubscribers,
      activeSubscribers,
      totalNewsletters,
      totalTemplates,
      emailLogs,
      sentNewsletters,
    ] = await Promise.all([
      prisma.newsletterSubscriber.count(),
      prisma.newsletterSubscriber.count({ where: { isActive: true } }),
      prisma.newsletter.count(),
      prisma.emailTemplate.count(),
      prisma.emailLog.findMany({
        where: { emailType: 'NEWSLETTER', status: { in: ['SENT', 'DELIVERED', 'OPENED'] } },
        select: { status: true },
      }),
      prisma.newsletter.findMany({
        where: { status: 'SENT' },
        select: { recipientCount: true, openCount: true },
      }),
    ]);

    // Calculate email stats
    const totalEmailsSent = emailLogs.length;
    
    // Calculate average open rate
    let averageOpenRate = 0;
    if (sentNewsletters.length > 0) {
      const totalRecipients = sentNewsletters.reduce((sum, n) => sum + n.recipientCount, 0);
      const totalOpens = sentNewsletters.reduce((sum, n) => sum + n.openCount, 0);
      averageOpenRate = totalRecipients > 0 ? (totalOpens / totalRecipients) * 100 : 0;
    }

    const stats = {
      totalSubscribers,
      activeSubscribers,
      totalNewsletters,
      totalTemplates,
      totalEmailsSent,
      averageOpenRate,
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Error fetching newsletter stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}