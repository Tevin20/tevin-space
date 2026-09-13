import { Product } from '@prisma/client';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import Link from 'next/link';

interface FeaturedDealProps {
  product: Product;
}

export default function FeaturedDeal({ product }: FeaturedDealProps) {
  const discount = product.previousPrice
    ? getDiscountPercentage(product.price, product.previousPrice)
    : 0;

  return (
    <section className="py-8 px-4 max-w-[480px] mx-auto">
      <div className="bg-tevin-product rounded-2xl overflow-hidden shadow-lg">
        {/* Product Image */}
        {product.image && (
          <div className="relative aspect-square overflow-hidden bg-white">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discount > 0 && (
              <div className="absolute top-4 right-4 bg-tevin-accent text-white rounded-full w-14 h-14 flex items-center justify-center font-bold">
                -{discount}%
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <p className="text-xs text-tevin-text/60 uppercase tracking-wider mb-2">
            🔥 Deal of the Day
          </p>

          <h2 className="text-2xl font-black text-tevin-text mb-2">
            {product.name}
          </h2>

          {product.description && (
            <p className="text-sm text-tevin-text/70 mb-4">{product.description}</p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-tevin-accent">
              {formatPrice(product.price)}
            </span>
            {product.previousPrice && (
              <span className="text-sm text-tevin-text/50 line-through">
                {formatPrice(product.previousPrice)}
              </span>
            )}
          </div>

          {/* Rating */}
          {product.rating !== null && product.rating > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-tevin-text/70">
                ⭐ {product.rating.toFixed(1)}
              </span>
              <span className="text-xs text-tevin-text/60">
                ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          {/* CTA */}
          <Link href={`/go/${product.slug}`} className="block w-full">
            <button className="bubble-btn w-full">
              Shop Deal →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
