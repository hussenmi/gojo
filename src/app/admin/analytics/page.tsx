'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { AdminNav } from '@/components/admin/AdminNav';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PropertyAnalytics {
  id: string;
  title: string;
  featured: boolean;
  status: string;
  property_type: string;
  listing_type: string;
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

interface Property {
  id: string;
  property_type: string;
  listing_type: string;
}

const COLORS = {
  blue: '#3b82f6',
  green: '#10b981',
  purple: '#8b5cf6',
  orange: '#f59e0b',
  red: '#ef4444',
  teal: '#14b8a6',
  pink: '#ec4899',
  yellow: '#eab308',
};

const ITEMS_PER_PAGE = 10;

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<PropertyAnalytics[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<'7' | '30' | '90' | 'custom'>('7');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch analytics data
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('property_analytics')
        .select('*');

      if (analyticsError) throw analyticsError;

      // Fetch properties data to get types
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('id, property_type, listing_type');

      if (propertiesError) throw propertiesError;

      // Merge analytics with property types
      const mergedData = (analyticsData || []).map(analytic => {
        const property = propertiesData?.find(p => p.id === analytic.id);
        return {
          ...analytic,
          property_type: property?.property_type || 'unknown',
          listing_type: property?.listing_type || 'unknown',
        };
      });

      setAnalytics(mergedData);
      setProperties(propertiesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total stats
  const totalStats = analytics.reduce(
    (acc, curr) => ({
      views: acc.views + curr.total_views,
      inquiries: acc.inquiries + curr.total_inquiries,
      viewings: acc.viewings + curr.total_viewing_requests,
      favorites: acc.favorites + curr.total_favorites,
    }),
    { views: 0, inquiries: 0, viewings: 0, favorites: 0 }
  );

  // Overall conversion rate
  const overallConversion = totalStats.views > 0
    ? ((totalStats.inquiries / totalStats.views) * 100).toFixed(1)
    : '0';

  // Engagement trend over time (simulated)
  // In a real app, you'd fetch daily data from the database
  const getDaysInRange = () => {
    if (dateRange === 'custom' && customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }
    return parseInt(dateRange);
  };

  const days = getDaysInRange();
  const engagementTrend = Array.from({ length: Math.min(days, 90) }, (_, i) => {
    const daysAgo = days - 1 - i;
    const date = new Date();
    if (dateRange === 'custom' && customStartDate) {
      date.setTime(new Date(customStartDate).getTime() + i * 24 * 60 * 60 * 1000);
    } else {
      date.setDate(date.getDate() - daysAgo);
    }

    const totalViews = dateRange === '7'
      ? analytics.reduce((sum, p) => sum + p.views_last_7_days, 0)
      : dateRange === '30'
      ? analytics.reduce((sum, p) => sum + p.views_last_30_days, 0)
      : totalStats.views;

    const totalInquiries = dateRange === '7'
      ? analytics.reduce((sum, p) => sum + p.inquiries_last_7_days, 0)
      : totalStats.inquiries;

    const totalViewings = dateRange === '7'
      ? analytics.reduce((sum, p) => sum + p.viewing_requests_last_7_days, 0)
      : totalStats.viewings;

    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views: Math.floor(totalViews / days * (0.8 + Math.random() * 0.4)),
      inquiries: Math.floor(totalInquiries / days * (0.8 + Math.random() * 0.4)),
      viewings: Math.floor(totalViewings / days * (0.8 + Math.random() * 0.4)),
    };
  });

  // Property type distribution
  const propertyTypeData = properties.reduce((acc, curr) => {
    const type = curr.property_type;
    if (type && type !== 'unknown') {
      if (!acc[type]) acc[type] = 0;
      acc[type]++;
    }
    return acc;
  }, {} as Record<string, number>);

  const propertyTypePieData = Object.entries(propertyTypeData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  // Listing type distribution (For Sale vs For Rent)
  const listingTypeData = properties.reduce((acc, curr) => {
    const type = curr.listing_type;
    if (type && type !== 'unknown') {
      if (!acc[type]) acc[type] = 0;
      acc[type]++;
    }
    return acc;
  }, {} as Record<string, number>);

  const listingTypePieData = Object.entries(listingTypeData).map(([name, value]) => ({
    name: name === 'sale' ? 'For Sale' : name === 'rent' ? 'For Rent' : name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  // Performance comparison (last 7 days vs total)
  const performanceData = [
    {
      metric: 'Views',
      'Last 7 Days': analytics.reduce((sum, p) => sum + p.views_last_7_days, 0),
      'Total': totalStats.views,
    },
    {
      metric: 'Inquiries',
      'Last 7 Days': analytics.reduce((sum, p) => sum + p.inquiries_last_7_days, 0),
      'Total': totalStats.inquiries,
    },
    {
      metric: 'Viewings',
      'Last 7 Days': analytics.reduce((sum, p) => sum + p.viewing_requests_last_7_days, 0),
      'Total': totalStats.viewings,
    },
  ];

  // Pagination
  const sortedAnalytics = [...analytics].sort((a, b) => b.total_views - a.total_views);
  const totalPages = Math.ceil(sortedAnalytics.length / ITEMS_PER_PAGE);
  const paginatedAnalytics = sortedAnalytics.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-950">
          <AdminNav />
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-10 bg-gray-800 rounded w-64"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-800 rounded-lg h-24"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-800 rounded-lg h-80"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-950">
        <AdminNav />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Property Analytics</h1>
              <p className="text-gray-400">
                Track performance and engagement across all properties
              </p>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-medium"
            >
              ← Back
            </Link>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-400">Total Views</div>
                <div className="text-2xl">👁️</div>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-1">
                {totalStats.views.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                {analytics.reduce((sum, p) => sum + p.views_last_7_days, 0)} in last 7 days
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-400">Inquiries</div>
                <div className="text-2xl">📧</div>
              </div>
              <div className="text-3xl font-bold text-green-400 mb-1">
                {totalStats.inquiries.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                {analytics.reduce((sum, p) => sum + p.inquiries_last_7_days, 0)} in last 7 days
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-400">Viewing Requests</div>
                <div className="text-2xl">📅</div>
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-1">
                {totalStats.viewings.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                {analytics.reduce((sum, p) => sum + p.viewing_requests_last_7_days, 0)} in last 7 days
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-400">Conversion Rate</div>
                <div className="text-2xl">📊</div>
              </div>
              <div className="text-3xl font-bold text-orange-400 mb-1">
                {overallConversion}%
              </div>
              <div className="text-xs text-gray-500">
                Views to inquiries
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Engagement Trend Over Time */}
            <div className="lg:col-span-3 bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                <h2 className="text-xl font-bold text-white">Engagement Trend</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setDateRange('7')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                      dateRange === '7' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    7 Days
                  </button>
                  <button
                    onClick={() => setDateRange('30')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                      dateRange === '30' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    30 Days
                  </button>
                  <button
                    onClick={() => setDateRange('90')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                      dateRange === '90' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    90 Days
                  </button>
                  <button
                    onClick={() => setDateRange('custom')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                      dateRange === 'custom' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {dateRange === 'custom' && (
                <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-gray-900 rounded-lg">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-400">From:</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-400">To:</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagementTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" tick={{ fill: '#9ca3af' }} />
                  <YAxis tick={{ fill: '#9ca3af' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#9ca3af' }} />
                  <Line type="monotone" dataKey="views" stroke={COLORS.blue} strokeWidth={2} name="Views" />
                  <Line type="monotone" dataKey="inquiries" stroke={COLORS.green} strokeWidth={2} name="Inquiries" />
                  <Line type="monotone" dataKey="viewings" stroke={COLORS.purple} strokeWidth={2} name="Viewings" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Property Type Distribution */}
            {propertyTypePieData.length > 0 && (
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4">Property Types</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={propertyTypePieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, index }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = outerRadius + 25;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        const fill = Object.values(COLORS)[index % Object.values(COLORS).length];
                        return (
                          <text
                            x={x}
                            y={y}
                            fill={fill}
                            textAnchor={x > cx ? 'start' : 'end'}
                            dominantBaseline="central"
                            fontSize="13"
                            fontWeight="600"
                          >
                            {`${name}: ${(percent * 100).toFixed(0)}%`}
                          </text>
                        );
                      }}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {propertyTypePieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={Object.values(COLORS)[index % Object.values(COLORS).length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Listing Type Distribution */}
            {listingTypePieData.length > 0 && (
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4">Listing Types</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={listingTypePieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, index }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = outerRadius + 25;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        const fill = Object.values(COLORS)[index % Object.values(COLORS).length];
                        return (
                          <text
                            x={x}
                            y={y}
                            fill={fill}
                            textAnchor={x > cx ? 'start' : 'end'}
                            dominantBaseline="central"
                            fontSize="13"
                            fontWeight="600"
                          >
                            {`${name}: ${(percent * 100).toFixed(0)}%`}
                          </text>
                        );
                      }}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {listingTypePieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={[COLORS.green, COLORS.orange][index % 2]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Recent Activity vs Total */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Recent vs Total Activity</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="metric" tick={{ fill: '#9ca3af' }} />
                  <YAxis tick={{ fill: '#9ca3af' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#9ca3af' }} />
                  <Bar dataKey="Last 7 Days" fill={COLORS.green} />
                  <Bar dataKey="Total" fill={COLORS.blue} opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Table */}
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Property Performance Details</h2>
                <div className="text-sm text-gray-400">
                  Showing {paginatedAnalytics.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-
                  {Math.min(currentPage * ITEMS_PER_PAGE, sortedAnalytics.length)} of {sortedAnalytics.length} properties
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Inquiries
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Viewings
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Favorites
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Conv. Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {paginatedAnalytics.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        <div className="text-4xl mb-2">📊</div>
                        <div>No analytics data available yet</div>
                        <div className="text-sm mt-2">Data will appear once properties receive views</div>
                      </td>
                    </tr>
                  ) : (
                    paginatedAnalytics.map((property) => {
                      const conversionRate = property.total_views > 0
                        ? ((property.total_inquiries / property.total_views) * 100).toFixed(1)
                        : '0';

                      return (
                        <tr key={property.id} className="hover:bg-gray-750">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/properties/${property.id}`}
                                className="text-blue-400 hover:text-blue-300 font-medium"
                                target="_blank"
                              >
                                {property.title}
                              </Link>
                              {property.featured && (
                                <span className="inline-block px-2 py-0.5 bg-yellow-400/20 text-yellow-400 text-xs font-semibold rounded">
                                  ⭐ Featured
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                              property.status === 'active' ? 'bg-green-400/20 text-green-400' :
                              property.status === 'sold' ? 'bg-orange-400/20 text-orange-400' :
                              property.status === 'rented' ? 'bg-purple-400/20 text-purple-400' :
                              'bg-gray-600/20 text-gray-400'
                            }`}>
                              {property.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="font-semibold text-white">{property.total_views.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">
                              +{property.views_last_7_days} (7d)
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="font-semibold text-white">{property.total_inquiries}</div>
                            <div className="text-xs text-gray-500">
                              +{property.inquiries_last_7_days} (7d)
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="font-semibold text-white">{property.total_viewing_requests}</div>
                            <div className="text-xs text-gray-500">
                              +{property.viewing_requests_last_7_days} (7d)
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-semibold text-white">
                            {property.total_favorites}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className={`font-bold text-lg ${
                              parseFloat(conversionRate) >= 5 ? 'text-green-400' :
                              parseFloat(conversionRate) >= 2 ? 'text-yellow-400' :
                              'text-gray-400'
                            }`}>
                              {conversionRate}%
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg transition ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-900/30 border border-blue-700 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-2">Understanding Your Metrics</p>
                <ul className="space-y-1 text-blue-200">
                  <li>• <strong>Conversion Rate:</strong> Percentage of views that result in inquiries (5%+ is excellent)</li>
                  <li>• <strong>Views:</strong> Number of times property detail page was viewed</li>
                  <li>• <strong>Inquiries:</strong> Contact form submissions from potential buyers/renters</li>
                  <li>• <strong>Viewings:</strong> Scheduled in-person viewing requests</li>
                  <li>• <strong>Featured properties</strong> typically get 3-5x more engagement</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
