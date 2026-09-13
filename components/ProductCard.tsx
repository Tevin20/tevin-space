import { Product } from '@prisma/client';
import Link from 'next/link';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';

interface ProductCardProps {
  product: Product & { category: any };
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.previousPrice
    ? getDiscountPercentage(product.price, product.previousPrice)
    : 0;

  return (
    <div className="bg-white border border-tevin-product rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      {product.image && (
        <div className="relative aspect-square overflow-hidden bg-tevin-product">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {discount > 0 && (
            <div className="absolute top-3 right-3 bg-tevin-accent text-white px-2 py-1 rounded-lg text-xs font-bold">
              -{discount}%
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        {product.category && (
          <span className="inline-block text-xs font-semibold text-tevin-accent mb-2">
            {product.category.emoji || ''} {product.category.name}
          </span>
        )}

        {/* Name */}
        <h3 className="font-bold text-tevin-text mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-xs text-tevin-text/60 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Rating */}
        {product.rating !== null && product.rating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <span className="text-xs">⭐ {product.rating.toFixed(1)}</span>
            <span className="text-xs text-tevin-text/50">
              ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mb-4">
          <span className="text-lg font-bold text-tevin-accent">
            {formatPrice(product.price)}
          </span>
          {product.previousPrice && (
            <span className="ml-2 text-xs text-tevin-text/50 line-through">
              {formatPrice(product.previousPrice)}
            </span>
          )}
        </div>

        {/* CTA */}
        <Link href={`/go/${product.slug}`} className="block w-full">
          <button className="w-full bg-tevin-accent text-white font-semibold py-2 rounded-lg hover:bg-opacity-90 transition-all text-sm">
            Shop Now →
          </button>
        </Link>
      </div>
    </div>
  );
}
