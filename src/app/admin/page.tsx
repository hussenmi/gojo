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

      setStats({
        total: total || 0,
        active: active || 0,
        sold: sold || 0,
        rented: rented || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AdminNav />

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome to your admin panel</p>
          </div>

          {/* Stats Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Properties</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                  </div>
                  <div className="text-4xl">🏠</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Listings</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{stats.active}</p>
                  </div>
                  <div className="text-4xl">✅</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sold</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{stats.sold}</p>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Rented</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">{stats.rented}</p>
                  </div>
                  <div className="text-4xl">🔑</div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/properties/new"
                className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
              >
                <div className="text-3xl mr-4">➕</div>
                <div>
                  <div className="font-semibold text-gray-900 group-hover:text-blue-600">
                    Add New Property
                  </div>
                  <div className="text-sm text-gray-600">Create a new listing</div>
                </div>
              </Link>

              <Link
                href="/admin/properties"
                className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
              >
                <div className="text-3xl mr-4">📋</div>
                <div>
                  <div className="font-semibold text-gray-900 group-hover:text-blue-600">
                    Manage Properties
                  </div>
                  <div className="text-sm text-gray-600">Edit or delete listings</div>
                </div>
              </Link>

              <Link
                href="/"
                className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
              >
                <div className="text-3xl mr-4">👁️</div>
                <div>
                  <div className="font-semibold text-gray-900 group-hover:text-blue-600">
                    View Public Site
                  </div>
                  <div className="text-sm text-gray-600">See what users see</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
