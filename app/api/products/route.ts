import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/session';
import { ProductSchema } from '@/lib/validation';
import { slugify } from '@/lib/utils';
import { ZodError } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const active = searchParams.get('active');
    const skip = parseInt(searchParams.get('skip') || '0');
    const take = Math.min(parseInt(searchParams.get('take') || '50'), 100);
    
    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (active) where.active = active === 'true';
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, affiliateLink: true },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);
    
    return NextResponse.json({
      products,
      total,
      skip,
      take,
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    
    const body = await request.json();
    const validatedData = ProductSchema.parse(body);
    
    // Generate slug if not provided
    const slug = validatedData.slug || slugify(validatedData.name);
    
    // Check if slug already exists
    const existing = await prisma.product.findUnique({
      where: { slug },
    });
    
    if (existing) {
      return NextResponse.json(
        { error: 'Product slug already exists' },
        { status: 400 }
      );
    }
    
    const product = await prisma.product.create({
      data: {
        ...validatedData,
        slug,
      },
    });
    
    // Log audit
    await prisma.adminAuditLog.create({
      data: {
        userId: admin.id,
        action: 'CREATE_PRODUCT',
        entity: 'Product',
        entityId: product.id,
      },
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    if ((error as Error).message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
