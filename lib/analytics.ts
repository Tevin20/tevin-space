import { prisma } from './db';

export async function recordClick(
  productId: string,
  affiliateLinkId: string,
  data: {
    userAgent?: string;
    referer?: string;
    ipHash?: string;
    deviceType?: string;
    source?: string;
    sessionId?: string;
    featured?: boolean;
  }
) {
  try {
    await prisma.click.create({
      data: {
        productId,
        affiliateLinkId,
        userAgent: data.userAgent,
        referer: data.referer,
        ipHash: data.ipHash,
        deviceType: data.deviceType || 'UNKNOWN',
        source: data.source || 'direct',
        sessionId: data.sessionId,
        featured: data.featured || false,
      },
    });

    // Update click count on affiliate link
    await prisma.affiliateLink.update({
      where: { id: affiliateLinkId },
      data: { clickCount: { increment: 1 } },
    });
  } catch (error) {
    console.error('Failed to record click:', error);
  }
}

export async function getAnalyticsSummary(days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [totalClicks, todayClicks, weekClicks, monthClicks] = await Promise.all([
    prisma.click.count(),
    prisma.click.count({
      where: {
        timestamp: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    prisma.click.count({
      where: {
        timestamp: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    prisma.click.count({
      where: {
        timestamp: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);

  return {
    totalClicks,
    todayClicks,
    weekClicks,
    monthClicks,
  };
}
