'use client';

import { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // TODO: Implement search functionality
      console.log('Search for:', query);
    }
  };

  return (
    <section className="py-6 px-4 max-w-[480px] mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 Search Tevin's picks..."
            className="w-full px-4 py-3 rounded-full bg-tevin-product border border-tevin-product focus:border-tevin-accent focus:outline-none text-tevin-text placeholder-tevin-text/50"
          />
        </div>
      </form>
    </section>
  );
}
