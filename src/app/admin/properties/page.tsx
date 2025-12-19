'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminNav } from '@/components/admin/AdminNav';
import { supabase } from '@/lib/supabase';
import { Property } from '@/types/property';
import Link from 'next/link';
import Image from 'next/image';

export default function ManagePropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>('all');
  const [listingTypeFilter, setListingTypeFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    try {
      // Fetch properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (propertiesError) throw propertiesError;

      // Fetch user profiles to get owner emails
      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles')
        .select('id, email');

      if (usersError) throw usersError;

      // Merge owner email into properties
      const propertiesWithOwners = (propertiesData || []).map(property => ({
        ...property,
        user_profiles: usersData?.find(u => u.id === property.owner_id) || null,
      }));

      setProperties(propertiesWithOwners as any[]);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProperty(id: string) {
    if (!confirm('Are you sure you want to delete this property?')) return;

    setDeleting(id);
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProperties(properties.filter(p => p.id !== id));
      alert('Property deleted successfully');
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property');
    } finally {
      setDeleting(null);
    }
  }

  async function bulkDeleteProperties() {
    if (selectedIds.size === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedIds.size} properties?`)) return;

    setBulkDeleting(true);
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .in('id', Array.from(selectedIds));

      if (error) throw error;

      setProperties(properties.filter(p => !selectedIds.has(p.id)));
      setSelectedIds(new Set());
      alert(`Successfully deleted ${selectedIds.size} properties`);
    } catch (error) {
      console.error('Error deleting properties:', error);
      alert('Failed to delete properties');
    } finally {
      setBulkDeleting(false);
    }
  }

  function toggleSelection(id: string) {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  }

  function toggleSelectAll() {
    // Toggle selection for currently filtered properties
    const filteredIds = filteredAndSortedProperties.map(p => p.id);
    const allFilteredSelected = filteredIds.every(id => selectedIds.has(id));

    if (allFilteredSelected) {
      // Deselect all filtered properties
      const newSelected = new Set(selectedIds);
      filteredIds.forEach(id => newSelected.delete(id));
      setSelectedIds(newSelected);
    } else {
      // Select all filtered properties
      const newSelected = new Set(selectedIds);
      filteredIds.forEach(id => newSelected.add(id));
      setSelectedIds(newSelected);
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Extract unique cities from properties
  const uniqueCities = Array.from(new Set(properties.map(p => p.city).filter(Boolean))).sort();

  // Filter and sort properties
  const filteredAndSortedProperties = properties
    .filter((property) => {
      // Search filter
      const matchesSearch = searchTerm === '' ||
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || property.status === statusFilter;

      // Property type filter
      const matchesPropertyType = propertyTypeFilter === 'all' || property.property_type === propertyTypeFilter;

      // Listing type filter
      const matchesListingType = listingTypeFilter === 'all' || property.listing_type === listingTypeFilter;

      // City filter
      const matchesCity = cityFilter === 'all' || property.city === cityFilter;

      return matchesSearch && matchesStatus && matchesPropertyType && matchesListingType && matchesCity;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-950">
        <AdminNav />

        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Manage Properties</h1>
              <p className="text-gray-400 mt-1">
                {filteredAndSortedProperties.length} {filteredAndSortedProperties.length === 1 ? 'property' : 'properties'}
                {searchTerm || statusFilter !== 'all' || propertyTypeFilter !== 'all' || listingTypeFilter !== 'all' || cityFilter !== 'all'
                  ? ` (filtered from ${properties.length} total)`
                  : ''}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-medium"
              >
                ← Back
              </Link>
              <Link
                href="/admin/properties/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                + Add New Property
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Search Properties
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by title, address, city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                </select>
              </div>

              {/* Property Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Property Type
                </label>
                <select
                  value={propertyTypeFilter}
                  onChange={(e) => setPropertyTypeFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                </select>
              </div>

              {/* Listing Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Listing Type
                </label>
                <select
                  value={listingTypeFilter}
                  onChange={(e) => setListingTypeFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Listings</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  City
                </label>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Cities</option>
                  {uniqueCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort and Clear Filters */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-300">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="title-asc">Title: A to Z</option>
                  <option value="title-desc">Title: Z to A</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              {(searchTerm || statusFilter !== 'all' || propertyTypeFilter !== 'all' || listingTypeFilter !== 'all' || cityFilter !== 'all' || sortBy !== 'newest') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setPropertyTypeFilter('all');
                    setListingTypeFilter('all');
                    setCityFilter('all');
                    setSortBy('newest');
                  }}
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedIds.size > 0 && (
            <div className="mb-4 bg-blue-900/30 border border-blue-700 rounded-lg p-4 flex items-center justify-between">
              <div className="text-sm text-blue-300">
                <strong>{selectedIds.size}</strong> {selectedIds.size === 1 ? 'property' : 'properties'} selected
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Clear selection
                </button>
                <button
                  onClick={bulkDeleteProperties}
                  disabled={bulkDeleting}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium disabled:opacity-50"
                >
                  {bulkDeleting ? 'Deleting...' : 'Delete Selected'}
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : filteredAndSortedProperties.length === 0 ? (
            <div className="bg-gray-800 rounded-lg shadow p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">No properties found</h3>
              <p className="text-gray-400 mb-6">
                {properties.length === 0
                  ? 'Get started by adding your first property'
                  : 'Try adjusting your search or filters'}
              </p>
              {properties.length === 0 ? (
                <Link
                  href="/admin/properties/new"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Add Property
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setPropertyTypeFilter('all');
                    setListingTypeFilter('all');
                    setCityFilter('all');
                    setSortBy('newest');
                  }}
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-950">
                    <tr>
                      <th className="px-6 py-3">
                        <input
                          type="checkbox"
                          checked={filteredAndSortedProperties.length > 0 && filteredAndSortedProperties.every(p => selectedIds.has(p.id))}
                          onChange={toggleSelectAll}
                          className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 h-4 w-4"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Owner
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-200">
                    {filteredAndSortedProperties.map((property) => (
                      <tr key={property.id} className="hover:bg-gray-950">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(property.id)}
                            onChange={() => toggleSelection(property.id)}
                            className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 relative">
                              {property.images && property.images[0] ? (
                                <Image
                                  src={property.images[0]}
                                  alt={property.title}
                                  fill
                                  className="rounded object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-gray-200 rounded flex items-center justify-center text-gray-400">
                                  🏠
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {property.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {property.bedrooms && `${property.bedrooms} bed`}
                                {property.bathrooms && ` · ${property.bathrooms} bath`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                            {property.property_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {formatPrice(property.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {property.city}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                            property.status === 'active' ? 'bg-green-100 text-green-800' :
                            property.status === 'sold' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {property.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {(property as any).user_profiles?.email || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/admin/properties/${property.id}/edit`}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteProperty(property.id)}
                            disabled={deleting === property.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            {deleting === property.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
