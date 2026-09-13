import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { detectDeviceType, hashIp } from '@/lib/device-detection';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Invalid product slug' },
        { status: 400 }
      );
    }
    
    // Find product and affiliate link
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { affiliateLink: true },
    });
    
    if (!product || !product.active || !product.affiliateLink?.active) {
      return NextResponse.json(
        { error: 'Product not found or inactive' },
        { status: 404 }
      );
    }
    
    // Check if product is featured
    const featuredDeal = await prisma.featuredDeal.findFirst({
      where: {
        productId: product.id,
        active: true,
        startDate: { lte: new Date() },
        OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
      },
    });
    
    // Extract analytics data
    const userAgent = request.headers.get('user-agent') || undefined;
    const referer = request.headers.get('referer') || undefined;
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIp = forwardedFor?.split(',')[0] || request.ip || undefined;
    
    // Record click
    await prisma.click.create({
      data: {
        productId: product.id,
        affiliateLinkId: product.affiliateLink.id,
        userAgent,
        referer,
        ipHash: clientIp ? hashIp(clientIp) : null,
        deviceType: userAgent ? detectDeviceType(userAgent) : 'UNKNOWN',
        source: referer ? new URL(referer).hostname || 'direct' : 'direct',
        featured: !!featuredDeal,
      },
    });
    
    // Redirect to affiliate URL
    return NextResponse.redirect(product.affiliateLink.url, { status: 302 });
  } catch (error) {
    console.error('Affiliate redirect error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
