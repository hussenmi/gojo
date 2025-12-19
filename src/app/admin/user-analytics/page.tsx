'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { AdminNav } from '@/components/admin/AdminNav';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import {
  BarChart,
  Bar,
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

interface UserStats {
  id: string;
  email: string;
  subscription_tier: string;
  subscription_status: string;
  created_at: string;
  total_properties: number;
  active_properties: number;
  featured_properties: number;
}

const COLORS = {
  blue: '#3b82f6',
  green: '#10b981',
  purple: '#8b5cf6',
  orange: '#f59e0b',
  red: '#ef4444',
  teal: '#14b8a6',
};

const ITEMS_PER_PAGE = 15;

export default function UserAnalyticsPage() {
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserStats(data || []);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary stats
  const totalUsers = userStats.length;
  const usersWithListings = userStats.filter(u => u.total_properties > 0).length;
  const totalListings = userStats.reduce((sum, u) => sum + u.total_properties, 0);
  const avgListingsPerUser = totalUsers > 0 ? (totalListings / totalUsers).toFixed(1) : '0';

  // Tier distribution
  const tierData = userStats.reduce((acc, user) => {
    const tier = user.subscription_tier || 'free';
    if (!acc[tier]) acc[tier] = 0;
    acc[tier]++;
    return acc;
  }, {} as Record<string, number>);

  const tierPieData = Object.entries(tierData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  // Users by listing count
  const listingDistribution = [
    { range: '0 listings', count: userStats.filter(u => u.total_properties === 0).length },
    { range: '1 listing', count: userStats.filter(u => u.total_properties === 1).length },
    { range: '2-5 listings', count: userStats.filter(u => u.total_properties >= 2 && u.total_properties <= 5).length },
    { range: '6-10 listings', count: userStats.filter(u => u.total_properties >= 6 && u.total_properties <= 10).length },
    { range: '10+ listings', count: userStats.filter(u => u.total_properties > 10).length },
  ].filter(item => item.count > 0);

  // Pagination
  const sortedUsers = [...userStats].sort((a, b) => b.total_properties - a.total_properties);
  const totalPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = sortedUsers.slice(
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
              <h1 className="text-4xl font-bold text-white mb-2">User Analytics</h1>
              <p className="text-gray-400">
                Track user signups, subscriptions, and listing activity
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
                <div className="text-sm font-medium text-gray-400">Total Users</div>
                <div className="text-2xl">👥</div>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-1">
                {totalUsers.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                Registered accounts
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-400">Property Listers</div>
                <div className="text-2xl">🏠</div>
              </div>
              <div className="text-3xl font-bold text-green-400 mb-1">
                {usersWithListings.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                Users with listings ({totalUsers > 0 ? ((usersWithListings / totalUsers) * 100).toFixed(1) : 0}%)
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-400">Total Listings</div>
                <div className="text-2xl">📋</div>
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-1">
                {totalListings.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                All property listings
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-400">Avg per User</div>
                <div className="text-2xl">📊</div>
              </div>
              <div className="text-3xl font-bold text-orange-400 mb-1">
                {avgListingsPerUser}
              </div>
              <div className="text-xs text-gray-500">
                Listings per user
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Subscription Tier Distribution */}
            {tierPieData.length > 0 && (
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4">Subscription Tiers</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={tierPieData}
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
                      {tierPieData.map((entry, index) => (
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

            {/* Listing Distribution */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Users by Listing Count</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={listingDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="range" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#9ca3af' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="count" fill={COLORS.blue} name="Users" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Table */}
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">User Details</h2>
                <div className="text-sm text-gray-400">
                  Showing {paginatedUsers.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-
                  {Math.min(currentPage * ITEMS_PER_PAGE, sortedUsers.length)} of {sortedUsers.length} users
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Tier
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Total Listings
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Active
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Featured
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        <div className="text-4xl mb-2">👥</div>
                        <div>No users yet</div>
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-750">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">{user.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                            user.subscription_tier === 'admin' ? 'bg-red-400/20 text-red-400' :
                            user.subscription_tier === 'premium' ? 'bg-purple-400/20 text-purple-400' :
                            'bg-gray-600/20 text-gray-400'
                          }`}>
                            {user.subscription_tier}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-white font-semibold">{user.total_properties}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-green-400">{user.active_properties}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-yellow-400">{user.featured_properties}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
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
                <p className="font-medium mb-2">Understanding User Metrics</p>
                <ul className="space-y-1 text-blue-200">
                  <li>• <strong>Property Listers:</strong> Users who have created at least one property listing</li>
                  <li>• <strong>Subscription Tiers:</strong> Free (basic), Premium (enhanced features), Admin (full access)</li>
                  <li>• <strong>Active Listings:</strong> Properties currently available (not sold/rented)</li>
                  <li>• <strong>Featured:</strong> Properties highlighted on the homepage for premium users</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
