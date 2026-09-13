'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

interface AnalyticsSummary {
  performance: {
    totalClicks: number;
    todayClicks: number;
    weekClicks: number;
    monthClicks: number;
  };
  resources: {
    activeProducts: number;
    activeLinks: number;
  };
  topProducts: Array<{
    productId: string;
    productName: string;
    clicks: number;
  }>;
  topSources: Array<{
    source: string;
    clicks: number;
  }>;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/analytics/summary');

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to fetch analytics');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-tevin-bg flex items-center justify-center">
        <p className="text-tevin-text">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tevin-bg">
      {/* Header */}
      <header className="bg-white border-b border-tevin-product px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-black text-tevin-text">Dashboard</h1>
          <Button onClick={handleLogout} variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 max-w-6xl mx-auto">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {data && (
          <>
            {/* Performance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg border border-tevin-product p-6">
                <p className="text-sm text-tevin-text/60 mb-2">Total Clicks</p>
                <p className="text-3xl font-bold text-tevin-accent">
                  {data.performance.totalClicks}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-tevin-product p-6">
                <p className="text-sm text-tevin-text/60 mb-2">Today</p>
                <p className="text-3xl font-bold text-tevin-accent">
                  {data.performance.todayClicks}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-tevin-product p-6">
                <p className="text-sm text-tevin-text/60 mb-2">This Week</p>
                <p className="text-3xl font-bold text-tevin-accent">
                  {data.performance.weekClicks}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-tevin-product p-6">
                <p className="text-sm text-tevin-text/60 mb-2">This Month</p>
                <p className="text-3xl font-bold text-tevin-accent">
                  {data.performance.monthClicks}
                </p>
              </div>
            </div>

            {/* Resources */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white rounded-lg border border-tevin-product p-6">
                <p className="text-sm text-tevin-text/60 mb-2">Active Products</p>
                <p className="text-3xl font-bold text-tevin-accent">
                  {data.resources.activeProducts}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-tevin-product p-6">
                <p className="text-sm text-tevin-text/60 mb-2">Active Links</p>
                <p className="text-3xl font-bold text-tevin-accent">
                  {data.resources.activeLinks}
                </p>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-lg border border-tevin-product p-6 mb-8">
              <h2 className="text-lg font-bold text-tevin-text mb-4">Top Products</h2>
              {data.topProducts.length > 0 ? (
                <div className="space-y-2">
                  {data.topProducts.map((product) => (
                    <div
                      key={product.productId}
                      className="flex justify-between items-center py-2 border-b border-tevin-product last:border-0"
                    >
                      <span className="text-tevin-text">{product.productName}</span>
                      <span className="font-bold text-tevin-accent">
                        {product.clicks} clicks
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-tevin-text/60">No data yet</p>
              )}
            </div>

            {/* Top Sources */}
            <div className="bg-white rounded-lg border border-tevin-product p-6">
              <h2 className="text-lg font-bold text-tevin-text mb-4">Traffic Sources</h2>
              {data.topSources.length > 0 ? (
                <div className="space-y-2">
                  {data.topSources.map((source) => (
                    <div
                      key={source.source}
                      className="flex justify-between items-center py-2 border-b border-tevin-product last:border-0"
                    >
                      <span className="text-tevin-text capitalize">{source.source}</span>
                      <span className="font-bold text-tevin-accent">
                        {source.clicks} clicks
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-tevin-text/60">No data yet</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
