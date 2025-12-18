'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { TableRowSkeleton } from '@/components/ui/Skeletons';

interface PropertyAnalytics {
  id: string;
  title: string;
  featured: boolean;
  status: string;
  total_views: number;
  views_last_7_days: number;
  views_last_30_days: number;
  total_inquiries: number;
  inquiries_last_7_days: number;
  total_viewing_requests: number;
  viewing_requests_last_7_days: number;
  total_favorites: number;
  last_activity_at: string;
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<PropertyAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('views');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('property_analytics')
        .select('*');

      if (error) throw error;
      setAnalytics(data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedAnalytics = [...analytics].sort((a, b) => {
    switch (sortBy) {
      case 'views':
        return b.total_views - a.total_views;
      case 'inquiries':
        return b.total_inquiries - a.total_inquiries;
      case 'viewings':
        return b.total_viewing_requests - a.total_viewing_requests;
      case 'favorites':
        return b.total_favorites - a.total_favorites;
      case 'recent':
        return new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime();
      default:
        return 0;
    }
  });

  const totalStats = analytics.reduce(
    (acc, curr) => ({
      views: acc.views + curr.total_views,
      inquiries: acc.inquiries + curr.total_inquiries,
      viewings: acc.viewings + curr.total_viewing_requests,
      favorites: acc.favorites + curr.total_favorites,
    }),
    { views: 0, inquiries: 0, viewings: 0, favorites: 0 }
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-96"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-4">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Property Analytics</h1>
              <p className="text-gray-600">
                Track views, inquiries, and engagement for all properties
              </p>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
            >
              Back to Dashboard
            </Link>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600 mb-1">Total Views</div>
              <div className="text-2xl font-bold text-blue-600">{totalStats.views.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600 mb-1">Total Inquiries</div>
              <div className="text-2xl font-bold text-green-600">{totalStats.inquiries.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600 mb-1">Viewing Requests</div>
              <div className="text-2xl font-bold text-purple-600">{totalStats.viewings.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600 mb-1">Total Favorites</div>
              <div className="text-2xl font-bold text-red-600">{totalStats.favorites.toLocaleString()}</div>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex gap-2">
            <span className="text-sm text-gray-600 flex items-center">Sort by:</span>
            <button
              onClick={() => setSortBy('views')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                sortBy === 'views' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Views
            </button>
            <button
              onClick={() => setSortBy('inquiries')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                sortBy === 'inquiries' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Inquiries
            </button>
            <button
              onClick={() => setSortBy('viewings')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                sortBy === 'viewings' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Viewings
            </button>
            <button
              onClick={() => setSortBy('favorites')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                sortBy === 'favorites' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Favorites
            </button>
            <button
              onClick={() => setSortBy('recent')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                sortBy === 'recent' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Recent Activity
            </button>
          </div>
        </div>

        {/* Analytics Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inquiries
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Viewings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Favorites
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversion
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAnalytics.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No analytics data available yet
                    </td>
                  </tr>
                ) : (
                  sortedAnalytics.map((property) => {
                    const conversionRate = property.total_views > 0
                      ? ((property.total_inquiries / property.total_views) * 100).toFixed(1)
                      : '0';

                    return (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/properties/${property.id}`}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {property.title}
                            </Link>
                            {property.featured && (
                              <span className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                                Featured
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="font-semibold text-gray-900">{property.total_views.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">
                            {property.views_last_7_days} last 7 days
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="font-semibold text-gray-900">{property.total_inquiries}</div>
                          <div className="text-xs text-gray-500">
                            {property.inquiries_last_7_days} last 7 days
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="font-semibold text-gray-900">{property.total_viewing_requests}</div>
                          <div className="text-xs text-gray-500">
                            {property.viewing_requests_last_7_days} last 7 days
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {property.total_favorites}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${
                              parseFloat(conversionRate) >= 5 ? 'text-green-600' :
                              parseFloat(conversionRate) >= 2 ? 'text-yellow-600' :
                              'text-gray-600'
                            }`}>
                              {conversionRate}%
                            </span>
                            {parseFloat(conversionRate) >= 5 && (
                              <span className="text-xs text-green-600">🔥</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">About Analytics</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li><strong>Views:</strong> Number of times property detail page was viewed</li>
                <li><strong>Inquiries:</strong> Contact form submissions from potential buyers</li>
                <li><strong>Viewings:</strong> Scheduled viewing requests</li>
                <li><strong>Favorites:</strong> Users who saved this property</li>
                <li><strong>Conversion:</strong> Percentage of views that resulted in inquiries (higher is better)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
