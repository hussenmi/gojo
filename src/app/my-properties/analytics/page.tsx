'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Property } from '@/types/property';

interface PropertyWithAnalytics extends Property {
  total_views?: number;
  views_last_7_days?: number;
  views_last_30_days?: number;
  total_inquiries?: number;
  inquiries_last_7_days?: number;
  total_viewing_requests?: number;
  viewing_requests_last_7_days?: number;
  total_favorites?: number;
}

function AnalyticsContent() {
  const searchParams = useSearchParams();
  const propertyIdFromUrl = searchParams.get('property');
  const [properties, setProperties] = useState<PropertyWithAnalytics[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | 'all'>(propertyIdFromUrl || 'all');
  const [loading, setLoading] = useState(true);
  const [userTier, setUserTier] = useState<'free' | 'premium' | 'admin' | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all' | 'custom'>('30d');
  const [customDateRange, setCustomDateRange] = useState({ from: '', to: '' });
  const [viewsData, setViewsData] = useState<any[]>([]);

  useEffect(() => {
    fetchDataAndProperties();
  }, []);

  useEffect(() => {
    if (propertyIdFromUrl && propertyIdFromUrl !== 'all') {
      setSelectedPropertyId(propertyIdFromUrl);
    }
  }, [propertyIdFromUrl]);

  useEffect(() => {
    if (properties.length > 0) {
      fetchViewsData();
    }
  }, [properties, selectedPropertyId, timeRange, customDateRange]);

  const fetchDataAndProperties = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Get user's subscription tier
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserTier(profile.subscription_tier);
      }

      // Only allow premium/admin access
      if (profile?.subscription_tier !== 'premium' && profile?.subscription_tier !== 'admin') {
        setLoading(false);
        return;
      }

      // Get user's properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (propertiesError) throw propertiesError;

      // Fetch analytics for each property
      const propertiesWithAnalytics = await Promise.all(
        (propertiesData || []).map(async (property) => {
          const { data: analyticsData } = await supabase
            .from('property_analytics')
            .select('*')
            .eq('id', property.id)
            .single();

          return { ...property, ...analyticsData };
        })
      );

      setProperties(propertiesWithAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateConversionRate = (views: number, inquiries: number) => {
    if (views === 0) return 0;
    return ((inquiries / views) * 100);
  };

  // Calculate overall or filtered analytics
  const getAnalytics = () => {
    const filteredProperties = selectedPropertyId === 'all'
      ? properties
      : properties.filter(p => p.id === selectedPropertyId);

    const totalViews = filteredProperties.reduce((sum, p) => sum + (p.total_views || 0), 0);
    const totalInquiries = filteredProperties.reduce((sum, p) => sum + (p.total_inquiries || 0), 0);
    const totalViewings = filteredProperties.reduce((sum, p) => sum + (p.total_viewing_requests || 0), 0);
    const totalFavorites = filteredProperties.reduce((sum, p) => sum + (p.total_favorites || 0), 0);
    const conversionRate = calculateConversionRate(totalViews, totalInquiries);

    return {
      totalViews,
      totalInquiries,
      totalViewings,
      totalFavorites,
      conversionRate,
      propertyCount: filteredProperties.length,
    };
  };

  const fetchViewsData = async () => {
    try {
      // Calculate date range
      const endDate = new Date();
      let startDate = new Date();

      if (timeRange === 'custom') {
        if (!customDateRange.from || !customDateRange.to) return;
        startDate = new Date(customDateRange.from);
        endDate.setTime(new Date(customDateRange.to).getTime());
      } else if (timeRange === '7d') {
        startDate.setDate(endDate.getDate() - 7);
      } else if (timeRange === '30d') {
        startDate.setDate(endDate.getDate() - 30);
      } else if (timeRange === '90d') {
        startDate.setDate(endDate.getDate() - 90);
      } else {
        // 'all' - get data from last 90 days max for performance
        startDate.setDate(endDate.getDate() - 90);
      }

      // Get property IDs to filter
      const propertyIds = selectedPropertyId === 'all'
        ? properties.map(p => p.id)
        : [selectedPropertyId];

      // Fetch daily aggregated views
      const { data: viewsData, error } = await supabase
        .from('property_views')
        .select('property_id, viewed_at')
        .in('property_id', propertyIds)
        .gte('viewed_at', startDate.toISOString())
        .lte('viewed_at', endDate.toISOString());

      if (error) throw error;

      // Aggregate by date
      const dailyData: Record<string, { views: number; inquiries: number }> = {};

      // Process views
      viewsData?.forEach(view => {
        const date = new Date(view.viewed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!dailyData[date]) {
          dailyData[date] = { views: 0, inquiries: 0 };
        }
        dailyData[date].views++;
      });

      // Fetch inquiries in the same date range
      const { data: inquiriesData } = await supabase
        .from('property_inquiries')
        .select('property_id, created_at')
        .in('property_id', propertyIds)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      inquiriesData?.forEach(inquiry => {
        const date = new Date(inquiry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!dailyData[date]) {
          dailyData[date] = { views: 0, inquiries: 0 };
        }
        dailyData[date].inquiries++;
      });

      // Convert to array and sort by date
      const chartData = Object.entries(dailyData)
        .map(([date, data]) => ({
          date,
          views: data.views,
          inquiries: data.inquiries,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setViewsData(chartData);
    } catch (error) {
      console.error('Error fetching views data:', error);
      setViewsData([]);
    }
  };

  // Data for metrics comparison bar chart
  const getMetricsComparisonData = () => {
    const analytics = getAnalytics();
    return [
      { metric: 'Views', value: analytics.totalViews },
      { metric: 'Inquiries', value: analytics.totalInquiries },
      { metric: 'Viewings', value: analytics.totalViewings },
      { metric: 'Favorites', value: analytics.totalFavorites },
    ];
  };

  // Custom tooltip for line chart with better contrast
  const CustomLineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg border border-gray-700">
          <p className="font-bold text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for bar chart showing only value
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-700">
          <p className="font-bold text-lg">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const analytics = getAnalytics();

  if (loading) {
    return (
      <ProtectedRoute requireTier="premium">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (userTier === 'free') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
            <div className="text-6xl mb-4">📊</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Premium Feature</h1>
            <p className="text-gray-600 mb-6">
              Upgrade to Premium to access detailed analytics and insights for your properties.
            </p>
            <Link
              href="/my-properties"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Back to My Properties
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Link
                  href="/my-properties"
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to My Properties
                </Link>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                <p className="text-gray-600">
                  Comprehensive insights and performance metrics for your properties
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
              {/* Property Selector */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Property:</label>
                <select
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
                >
                  <option value="all">All Properties ({properties.length})</option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Range Selector */}
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Time Range:</label>
                <div className="flex flex-wrap gap-2">
                  {(['7d', '30d', '90d', 'all', 'custom'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        timeRange === range
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {range === '7d' ? '7 Days' :
                       range === '30d' ? '30 Days' :
                       range === '90d' ? '90 Days' :
                       range === 'all' ? 'All Time' : 'Custom'}
                    </button>
                  ))}
                </div>
                {timeRange === 'custom' && (
                  <div className="flex items-center gap-2 ml-2">
                    <input
                      type="date"
                      value={customDateRange.from}
                      onChange={(e) => setCustomDateRange({ ...customDateRange, from: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="From"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="date"
                      value={customDateRange.to}
                      onChange={(e) => setCustomDateRange({ ...customDateRange, to: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="To"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {properties.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Yet</h2>
              <p className="text-gray-600 mb-6">
                Add properties to start seeing analytics
              </p>
              <Link
                href="/my-properties/new"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Add Your First Property
              </Link>
            </div>
          ) : (
            <>
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">Total Views</span>
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-1">{analytics.totalViews.toLocaleString()}</div>
                  <div className="text-xs text-blue-700">
                    Across {analytics.propertyCount} {analytics.propertyCount === 1 ? 'property' : 'properties'}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-700">Total Inquiries</span>
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-1">{analytics.totalInquiries}</div>
                  <div className="text-xs text-green-700">
                    {(analytics.totalInquiries / Math.max(1, analytics.propertyCount)).toFixed(1)} per property
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-700">Viewing Requests</span>
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-1">{analytics.totalViewings}</div>
                  <div className="text-xs text-purple-700">
                    {analytics.totalViewings} scheduled viewings
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-yellow-700">Conversion Rate</span>
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className={`text-4xl font-bold mb-1 ${
                    analytics.conversionRate >= 5 ? 'text-green-600' :
                    analytics.conversionRate >= 2 ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    {analytics.conversionRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-yellow-700">Views to inquiries</div>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Views & Inquiries Over Time - Line Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {selectedPropertyId === 'all' ? 'All Properties' : 'Property'} Performance Over Time
                  </h3>
                  {viewsData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={viewsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={<CustomLineTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} name="Views" />
                        <Line type="monotone" dataKey="inquiries" stroke="#10B981" strokeWidth={2} name="Inquiries" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <svg className="w-16 h-16 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p>No data available for selected period</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Metrics Comparison - Bar Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Engagement Metrics Comparison</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getMetricsComparisonData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis />
                      <Tooltip content={<CustomBarTooltip />} />
                      <Bar dataKey="value" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Engagement Metrics */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Engagement Breakdown</h3>
                  <div className="space-y-4">
                    {(() => {
                      const maxValue = Math.max(
                        analytics.totalViews,
                        analytics.totalInquiries,
                        analytics.totalViewings,
                        analytics.totalFavorites,
                        1
                      );
                      return (
                        <>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Views</span>
                              <span className="text-sm font-bold text-gray-900">{analytics.totalViews}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{
                                width: `${(analytics.totalViews / maxValue) * 100}%`
                              }}></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Inquiries</span>
                              <span className="text-sm font-bold text-gray-900">{analytics.totalInquiries}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{
                                width: `${(analytics.totalInquiries / maxValue) * 100}%`
                              }}></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Viewings</span>
                              <span className="text-sm font-bold text-gray-900">{analytics.totalViewings}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-purple-600 h-2 rounded-full" style={{
                                width: `${(analytics.totalViewings / maxValue) * 100}%`
                              }}></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Favorites</span>
                              <span className="text-sm font-bold text-gray-900">{analytics.totalFavorites}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-red-600 h-2 rounded-full" style={{
                                width: `${(analytics.totalFavorites / maxValue) * 100}%`
                              }}></div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Insights and Recommendations */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Insights & Recommendations
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                  {analytics.conversionRate < 2 && (
                    <li className="flex items-start gap-2 bg-white p-3 rounded-lg">
                      <span className="text-orange-500 text-lg">⚠️</span>
                      <span>Low conversion rate detected. Consider improving property photos and descriptions.</span>
                    </li>
                  )}
                  {analytics.conversionRate >= 5 && (
                    <li className="flex items-start gap-2 bg-white p-3 rounded-lg">
                      <span className="text-green-500 text-lg">✅</span>
                      <span>Excellent conversion rate! Your listings are performing very well.</span>
                    </li>
                  )}
                  {analytics.totalViews / Math.max(1, analytics.propertyCount) < 50 && (
                    <li className="flex items-start gap-2 bg-white p-3 rounded-lg">
                      <span className="text-blue-500 text-lg">💡</span>
                      <span>Average views per property is low. Consider featuring properties or improving SEO.</span>
                    </li>
                  )}
                  {analytics.totalViewings > 0 && (
                    <li className="flex items-start gap-2 bg-white p-3 rounded-lg">
                      <span className="text-purple-500 text-lg">📅</span>
                      <span>You have {analytics.totalViewings} viewing requests. Respond promptly to convert them!</span>
                    </li>
                  )}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <AnalyticsContent />
    </Suspense>
  );
}
