'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-tevin-bg">
      <div className="text-center max-w-md mx-4">
        <h2 className="text-2xl font-bold text-tevin-text mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-tevin-text/70 mb-6">
          We encountered an error. Try refreshing the page or come back later.
        </p>
        <button
          onClick={reset}
          className="bubble-btn"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
