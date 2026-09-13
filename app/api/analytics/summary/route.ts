import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/session';

export async function GET() {
  try {
    await requireAdmin();
    
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const [totalClicks, todayClicks, weekClicks, monthClicks, activeProducts, activeLinks, topProducts, topCategories, topSources] = await Promise.all([
      prisma.click.count(),
      prisma.click.count({ where: { timestamp: { gte: todayStart } } }),
      prisma.click.count({ where: { timestamp: { gte: weekStart } } }),
      prisma.click.count({ where: { timestamp: { gte: monthStart } } }),
      prisma.product.count({ where: { active: true } }),
      prisma.affiliateLink.count({ where: { active: true } }),
      prisma.click.groupBy({
        by: ['productId'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
      prisma.click.groupBy({
        by: ['source'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
      prisma.click.groupBy({
        by: ['source'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
    ]);
    
    // Fetch product names for top products
    const topProductsData = await Promise.all(
      topProducts.map(async (tp) => {
        const product = await prisma.product.findUnique({
          where: { id: tp.productId },
          select: { name: true },
        });
        return {
          productId: tp.productId,
          productName: product?.name || 'Unknown',
          clicks: tp._count.id,
        };
      })
    );
    
    return NextResponse.json({
      performance: {
        totalClicks,
        todayClicks,
        weekClicks,
        monthClicks,
      },
      resources: {
        activeProducts,
        activeLinks,
      },
      topProducts: topProductsData,
      topSources: topSources.map((s) => ({
        source: s.source || 'direct',
        clicks: s._count.id,
      })),
    });
  } catch (error) {
    if ((error as Error).message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
