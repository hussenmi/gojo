'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminNav } from '@/components/admin/AdminNav';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface UserProfile {
  id: string;
  email: string;
  subscription_tier: 'free' | 'premium' | 'admin';
  subscription_status: string;
  subscription_started_at: string | null;
  subscription_expires_at: string | null;
  total_properties: number;
  featured_properties: number;
  active_properties: number;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTier, setFilterTier] = useState<string>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const upgradeToPremium = async (userId: string, userEmail: string) => {
    if (!confirm(`Upgrade ${userEmail} to Premium?`)) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          subscription_tier: 'premium',
          subscription_status: 'active',
          subscription_started_at: new Date().toISOString(),
          subscription_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      alert(`${userEmail} upgraded to Premium!`);
      fetchUsers();
    } catch (error: any) {
      console.error('Error upgrading user:', error);
      alert('Error: ' + (error.message || 'Failed to upgrade user'));
    }
  };

  const downgradeToFree = async (userId: string, userEmail: string) => {
    if (!confirm(`Downgrade ${userEmail} to Free tier?`)) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          subscription_tier: 'free',
          subscription_status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      alert(`${userEmail} downgraded to Free tier`);
      fetchUsers();
    } catch (error: any) {
      console.error('Error downgrading user:', error);
      alert('Error: ' + (error.message || 'Failed to downgrade user'));
    }
  };

  const filteredUsers = filterTier === 'all'
    ? users
    : users.filter(u => u.subscription_tier === filterTier);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-950">
          <AdminNav />
          <div className="container mx-auto px-4 py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
                <p className="text-gray-400">
                  Manage user subscriptions and view user statistics
                </p>
              </div>
              <Link
                href="/admin"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
              >
                Back to Dashboard
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg shadow p-4">
                <div className="text-sm text-gray-400 mb-1">Total Users</div>
                <div className="text-2xl font-bold text-white">{users.length}</div>
              </div>
              <div className="bg-green-50 rounded-lg shadow p-4">
                <div className="text-sm text-green-600 mb-1">Premium Users</div>
                <div className="text-2xl font-bold text-green-700">
                  {users.filter(u => u.subscription_tier === 'premium').length}
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg shadow p-4">
                <div className="text-sm text-blue-600 mb-1">Free Users</div>
                <div className="text-2xl font-bold text-blue-700">
                  {users.filter(u => u.subscription_tier === 'free').length}
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg shadow p-4">
                <div className="text-sm text-purple-600 mb-1">Total Properties</div>
                <div className="text-2xl font-bold text-purple-700">
                  {users.reduce((sum, u) => sum + u.total_properties, 0)}
                </div>
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <span className="text-sm text-gray-400 flex items-center">Filter:</span>
              <button
                onClick={() => setFilterTier('all')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  filterTier === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-100'
                }`}
              >
                All Users
              </button>
              <button
                onClick={() => setFilterTier('premium')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  filterTier === 'premium' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-100'
                }`}
              >
                Premium
              </button>
              <button
                onClick={() => setFilterTier('free')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  filterTier === 'free' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-100'
                }`}
              >
                Free
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-950 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Properties
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-950">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">{user.email}</div>
                          <div className="text-xs text-gray-500">ID: {user.id.substring(0, 8)}...</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            user.subscription_tier === 'premium' ? 'bg-green-100 text-green-800' :
                            user.subscription_tier === 'admin' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.subscription_tier === 'premium' && '⭐ '}
                            {user.subscription_tier.toUpperCase()}
                          </span>
                          {user.subscription_tier === 'premium' && user.subscription_expires_at && (
                            <div className="text-xs text-gray-500 mt-1">
                              Expires: {new Date(user.subscription_expires_at).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="font-semibold text-white">
                            {user.total_properties} total
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.featured_properties} featured • {user.active_properties} active
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {user.subscription_tier === 'free' ? (
                            <button
                              onClick={() => upgradeToPremium(user.id, user.email)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                            >
                              Upgrade to Premium
                            </button>
                          ) : user.subscription_tier === 'premium' ? (
                            <button
                              onClick={() => downgradeToFree(user.id, user.email)}
                              className="px-4 py-2 border-2 border-gray-600 text-gray-300 rounded-lg hover:bg-gray-950 transition font-semibold"
                            >
                              Downgrade to Free
                            </button>
                          ) : (
                            <span className="text-gray-500 text-xs">Admin User</span>
                          )}
                        </td>
                      </tr>
                    ))
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
                <p className="font-semibold mb-2">Subscription Tiers</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Free:</strong> Basic property listings, no featured properties, no analytics</li>
                  <li><strong>Premium:</strong> Featured properties, priority placement, analytics dashboard, homepage visibility</li>
                  <li><strong>Admin:</strong> Full system access for administrators</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
