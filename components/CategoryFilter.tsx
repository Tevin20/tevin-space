'use client';

import { Category } from '@prisma/client';
import { useState } from 'react';

interface CategoryFilterProps {
  categories: Category[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="py-4 px-4 max-w-[480px] mx-auto">
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="flex gap-3 pb-2">
          <button
            onClick={() => setSelected(null)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
              selected === null
                ? 'bg-tevin-accent text-white'
                : 'bg-tevin-product text-tevin-text hover:bg-tevin-accent/10'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelected(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
                selected === category.id
                  ? 'bg-tevin-accent text-white'
                  : 'bg-tevin-product text-tevin-text hover:bg-tevin-accent/10'
              }`}
            >
              {category.emoji} {category.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
