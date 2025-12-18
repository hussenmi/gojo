'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const PropertyMap = dynamic(
  () => import('@/components/features/PropertyMap').then(mod => ({ default: mod.PropertyMap })),
  { ssr: false }
);
import { Property } from '@/types/property';

interface PropertyWithAnalytics extends Property {
  total_views?: number;
  views_last_7_days?: number;
  total_inquiries?: number;
  inquiries_last_7_days?: number;
  total_viewing_requests?: number;
  viewing_requests_last_7_days?: number;
  total_favorites?: number;
}

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<PropertyWithAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userTier, setUserTier] = useState<'free' | 'premium' | 'admin' | null>(null);
  const [sortBy, setSortBy] = useState<string>('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const propertiesPerPage = 9; // Changed to 9 for 3x3 grid

  useEffect(() => {
    fetchUserAndProperties();
  }, []);

  const fetchUserAndProperties = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUser(user);

      // Get user's subscription tier
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserTier(profile.subscription_tier);
      }

      // Get user's properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (propertiesError) throw propertiesError;

      // For each property, fetch analytics if it's featured
      const propertiesWithAnalytics = await Promise.all(
        (propertiesData || []).map(async (property) => {
          if (property.featured) {
            // Fetch analytics for featured properties
            const { data: analyticsData } = await supabase
              .from('property_analytics')
              .select('*')
              .eq('id', property.id)
              .single();

            return { ...property, ...analyticsData };
          }
          return property;
        })
      );

      setProperties(propertiesWithAnalytics);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateConversionRate = (views: number, inquiries: number) => {
    if (views === 0) return '0';
    return ((inquiries / views) * 100).toFixed(1);
  };

  // Sorting logic
  const sortedProperties = [...properties].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'price-high':
        return b.price - a.price;
      case 'price-low':
        return a.price - b.price;
      case 'views':
        return (b.total_views || 0) - (a.total_views || 0);
      case 'inquiries':
        return (b.total_inquiries || 0) - (a.total_inquiries || 0);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProperties.length / propertiesPerPage);
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = sortedProperties.slice(indexOfFirstProperty, indexOfLastProperty);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                <h1 className="text-4xl font-bold text-gray-900 mb-2">My Properties</h1>
                <p className="text-gray-600">
                  Manage your listings and view performance analytics
                </p>
              </div>
              <div className="flex gap-3">
                {(userTier === 'premium' || userTier === 'admin') && (
                  <Link
                    href="/my-properties/analytics"
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Analytics
                  </Link>
                )}
                <Link
                  href="/my-properties/new"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  + Add New Property
                </Link>
              </div>
            </div>

            {/* Stats, Sorting and View Toggle */}
            {properties.length > 0 && (
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Left side: Stats and Sorting */}
                <div className="flex items-center gap-4">
                  {/* Stats */}
                  <div className="text-sm text-gray-600">
                    {properties.length} {properties.length === 1 ? 'property' : 'properties'}
                  </div>

                  {/* Sorting */}
                  <div className="flex gap-2">
                    <span className="text-sm text-gray-600 flex items-center">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="views">Most Views</option>
                      <option value="inquiries">Most Inquiries</option>
                    </select>
                  </div>
                </div>

                {/* Right side: View Toggle */}
                <div className="flex gap-2 bg-white rounded-lg shadow-sm p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-2 rounded-md transition flex items-center gap-2 ${
                      viewMode === 'grid'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`px-4 py-2 rounded-md transition flex items-center gap-2 ${
                      viewMode === 'map'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Map
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Properties List */}
          {properties.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-6xl mb-4">🏠</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Properties Yet</h2>
              <p className="text-gray-600 mb-6">
                Start by adding your first property listing
              </p>
              <Link
                href="/my-properties/new"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Add Your First Property
              </Link>
            </div>
          ) : viewMode === 'grid' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProperties.map((property) => (
                <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Property Image */}
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={property.images[0] || '/images/placeholder-house.jpg'}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    {property.featured && (
                      <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Featured
                      </span>
                    )}
                    <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded ${
                      property.status === 'active' ? 'bg-green-500 text-white' :
                      property.status === 'sold' ? 'bg-orange-500 text-white' :
                      property.status === 'rented' ? 'bg-purple-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </span>
                  </div>

                  <Link href={`/properties/${property.id}`} className="p-4 block">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 line-clamp-1 mb-2">
                      {property.title}
                    </h3>

                    {/* Location */}
                    <p className="text-sm text-gray-600 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {property.address}, {property.city}
                    </p>

                    {/* Details */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      {property.bedrooms && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          {property.bedrooms} bed
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                          </svg>
                          {property.bathrooms} bath
                        </div>
                      )}
                      {property.area_sqm && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                          {property.area_sqm} m²
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="text-xl font-bold text-blue-600">
                      {formatPrice(property.price)}
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`px-4 py-2 border-2 rounded-lg font-medium transition shadow-sm ${
                          currentPage === pageNumber
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                    return <span key={pageNumber} className="px-2 py-2 text-gray-500 font-medium">...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition shadow-sm"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
          ) : (
            <PropertyMap properties={sortedProperties} />
          )}

          {/* Info Box */}
          {properties.length > 0 && (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">About Featured Listings</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Priority Placement:</strong> Featured properties always appear first in search results</li>
                    <li><strong>Homepage Visibility:</strong> Showcased in the featured properties carousel</li>
                    <li><strong>Analytics Dashboard:</strong> Track views, inquiries, viewings, and conversion rates</li>
                    <li><strong>Better ROI:</strong> Data shows featured listings get 3-5x more inquiries</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}