import { Suspense } from 'react';
import { prisma } from '@/lib/db';
import Profile from '@/components/Profile';
import FeaturedDeal from '@/components/FeaturedDeal';
import ProductGrid from '@/components/ProductGrid';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import SocialLinks from '@/components/SocialLinks';

async function getSettings() {
  try {
    return await prisma.siteSettings.findFirst();
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return null;
  }
}

async function getFeaturedProduct() {
  try {
    const featured = await prisma.featuredDeal.findFirst({
      where: {
        active: true,
        startDate: { lte: new Date() },
        OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
      },
      include: { product: true },
    });
    return featured?.product || null;
  } catch (error) {
    console.error('Failed to fetch featured product:', error);
    return null;
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

async function getProducts() {
  try {
    return await prisma.product.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

async function getSocialLinks() {
  try {
    return await prisma.socialLink.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error('Failed to fetch social links:', error);
    return [];
  }
}

export default async function Home() {
  const [settings, featuredProduct, categories, products, socialLinks] =
    await Promise.all([
      getSettings(),
      getFeaturedProduct(),
      getCategories(),
      getProducts(),
      getSocialLinks(),
    ]);

  return (
    <div className="min-h-screen bg-tevin-bg">
      {/* Profile Section */}
      <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
        <Profile settings={settings} />
      </Suspense>

      {/* Featured Deal Section */}
      {featuredProduct && (
        <Suspense fallback={<div className="h-64 skeleton rounded-lg" />}>
          <FeaturedDeal product={featuredProduct} />
        </Suspense>
      )}

      {/* Search Bar */}
      <Suspense fallback={<div className="h-12 skeleton rounded-full" />}>
        <SearchBar />
      </Suspense>

      {/* Category Filter */}
      {categories.length > 0 && (
        <Suspense fallback={<div className="h-16 skeleton rounded-lg" />}>
          <CategoryFilter categories={categories} />
        </Suspense>
      )}

      {/* Products Grid */}
      <Suspense fallback={<div className="h-96 skeleton rounded-lg" />}>
        <ProductGrid products={products} />
      </Suspense>

      {/* Social Links */}
      {socialLinks.length > 0 && (
        <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
          <SocialLinks links={socialLinks} />
        </Suspense>
      )}
    </div>
  );
}
