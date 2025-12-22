'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminNav } from '@/components/admin/AdminNav';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    sold: 0,
    rented: 0,
    inquiries: 0,
    viewings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const { count: total } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });

      const { count: active } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const { count: sold } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'sold');

      const { count: rented } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rented');

      const { count: inquiries } = await supabase
        .from('contact_inquiries')
        .select('*', { count: 'exact', head: true });

      const { count: viewings } = await supabase
        .from('viewing_schedules')
        .select('*', { count: 'exact', head: true });

      setStats({
        total: total || 0,
        active: active || 0,
        sold: sold || 0,
        rented: rented || 0,
        inquiries: inquiries || 0,
        viewings: viewings || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <AdminNav />

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome to your admin panel</p>
          </div>

          {/* Stats Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Properties</p>
                    <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
                  </div>
                  <div className="text-4xl">🏠</div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Active Listings</p>
                    <p className="text-3xl font-bold text-green-400 mt-2">{stats.active}</p>
                  </div>
                  <div className="text-4xl">✅</div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Contact Inquiries</p>
                    <p className="text-3xl font-bold text-blue-400 mt-2">{stats.inquiries}</p>
                  </div>
                  <div className="text-4xl">📧</div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Viewing Schedules</p>
                    <p className="text-3xl font-bold text-purple-400 mt-2">{stats.viewings}</p>
                  </div>
                  <div className="text-4xl">📅</div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Sold</p>
                    <p className="text-3xl font-bold text-orange-400 mt-2">{stats.sold}</p>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Rented</p>
                    <p className="text-3xl font-bold text-teal-400 mt-2">{stats.rented}</p>
                  </div>
                  <div className="text-4xl">🔑</div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/admin/properties"
                className="flex items-center p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-500 hover:bg-gray-700 transition group"
              >
                <div className="text-3xl mr-4">📋</div>
                <div>
                  <div className="font-semibold text-white group-hover:text-blue-400">
                    Property Management
                  </div>
                  <div className="text-sm text-gray-400">Manage all listings</div>
                </div>
              </Link>

              <Link
                href="/admin/analytics"
                className="flex items-center p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-500 hover:bg-gray-700 transition group"
              >
                <div className="text-3xl mr-4">📊</div>
                <div>
                  <div className="font-semibold text-white group-hover:text-blue-400">
                    Property Analytics
                  </div>
                  <div className="text-sm text-gray-400">Views, inquiries & more</div>
                </div>
              </Link>

              <Link
                href="/admin/users"
                className="flex items-center p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-500 hover:bg-gray-700 transition group"
              >
                <div className="text-3xl mr-4">👥</div>
                <div>
                  <div className="font-semibold text-white group-hover:text-blue-400">
                    User Management
                  </div>
                  <div className="text-sm text-gray-400">Manage users & subscriptions</div>
                </div>
              </Link>

              <Link
                href="/admin/user-analytics"
                className="flex items-center p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-500 hover:bg-gray-700 transition group"
              >
                <div className="text-3xl mr-4">📈</div>
                <div>
                  <div className="font-semibold text-white group-hover:text-blue-400">
                    User Analytics
                  </div>
                  <div className="text-sm text-gray-400">User stats & activity</div>
                </div>
              </Link>

              <Link
                href="/admin/inquiries"
                className="flex items-center p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-500 hover:bg-gray-700 transition group"
              >
                <div className="text-3xl mr-4">📧</div>
                <div>
                  <div className="font-semibold text-white group-hover:text-blue-400">
                    Contact Inquiries
                  </div>
                  <div className="text-sm text-gray-400">View contact requests</div>
                </div>
              </Link>

              <Link
                href="/admin/viewings"
                className="flex items-center p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-500 hover:bg-gray-700 transition group"
              >
                <div className="text-3xl mr-4">📅</div>
                <div>
                  <div className="font-semibold text-white group-hover:text-blue-400">
                    Viewing Schedules
                  </div>
                  <div className="text-sm text-gray-400">Manage appointments</div>
                </div>
              </Link>

              <Link
                href="/"
                className="flex items-center p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-500 hover:bg-gray-700 transition group"
              >
                <div className="text-3xl mr-4">👁️</div>
                <div>
                  <div className="font-semibold text-white group-hover:text-blue-400">
                    View Public Site
                  </div>
                  <div className="text-sm text-gray-400">See what users see</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
