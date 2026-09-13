import { Product } from '@prisma/client';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: (Product & { category: any })[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <section className="py-12 px-4 max-w-[480px] mx-auto">
        <div className="text-center">
          <p className="text-tevin-text/60 mb-4">No products yet</p>
          <p className="text-sm text-tevin-text/40">Check back soon for curated picks!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 max-w-[480px] mx-auto">
      <h2 className="text-2xl font-black text-tevin-text mb-6">Top Picks</h2>
      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
