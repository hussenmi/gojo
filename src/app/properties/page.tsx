'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { PropertyCard } from '@/components/features/PropertyCard';
import { Property, PropertyType, ListingType } from '@/types/property';
import { supabase } from '@/lib/supabase';
import { demoProperties } from '@/lib/demo-data';
import { PropertyCardSkeleton } from '@/components/ui/Skeletons';

// Dynamically import PropertyMap with no SSR to avoid window undefined errors
const PropertyMap = dynamic(
  () => import('@/components/features/PropertyMap').then(mod => ({ default: mod.PropertyMap })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-lg shadow h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }
);

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<PropertyType | 'all'>('all');
  const [listingTypeFilter, setListingTypeFilter] = useState<ListingType | 'all'>('all');
  const [usingDemoData, setUsingDemoData] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [bedroomsFilter, setBedroomsFilter] = useState<string>('all');
  const [bathroomsFilter, setBathroomsFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 12;

  // Get unique cities from properties
  const uniqueCities = Array.from(new Set(properties.map(p => p.city))).sort();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        // Database not set up yet, use demo data
        console.info('Database not configured, using demo data');
        loadDemoData();
        return;
      }

      if (data && data.length > 0) {
        setProperties(data as Property[]);
        setUsingDemoData(false);
      } else {
        // Use demo data if no properties in database
        loadDemoData();
      }
    } catch (error) {
      // Fall back to demo data if any error occurs
      console.info('Using demo data');
      loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    // Add mock IDs and timestamps to demo data
    const demoWithIds = demoProperties.map((prop, index) => ({
      ...prop,
      id: `demo-${index + 1}`,
      created_at: new Date(Date.now() - index * 86400000).toISOString(),
      updated_at: new Date(Date.now() - index * 86400000).toISOString(),
    }));
    setProperties(demoWithIds as Property[]);
    setUsingDemoData(true);
  };

  // Filter and sort properties
  const filteredAndSortedProperties = properties
    .filter((property) => {
      const matchesSearch =
        searchTerm === '' ||
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPropertyType =
        propertyTypeFilter === 'all' || property.property_type === propertyTypeFilter;

      const matchesListingType =
        listingTypeFilter === 'all' || property.listing_type === listingTypeFilter;

      const minPrice = priceRange.min === '' ? 0 : Number(priceRange.min);
      const maxPrice = priceRange.max === '' ? Infinity : Number(priceRange.max);
      const matchesPrice = property.price >= minPrice && property.price <= maxPrice;

      const matchesBedrooms =
        bedroomsFilter === 'all' ||
        (bedroomsFilter === '5+' && (property.bedrooms || 0) >= 5) ||
        property.bedrooms === parseInt(bedroomsFilter);

      const matchesBathrooms =
        bathroomsFilter === 'all' ||
        (bathroomsFilter === '4+' && (property.bathrooms || 0) >= 4) ||
        property.bathrooms === parseInt(bathroomsFilter);

      const matchesCity =
        cityFilter === 'all' || property.city === cityFilter;

      const matchesFeatured =
        !showFeaturedOnly || property.featured === true;

      return matchesSearch && matchesPropertyType && matchesListingType &&
             matchesPrice && matchesBedrooms && matchesBathrooms &&
             matchesCity && matchesFeatured;
    })
    .sort((a, b) => {
      // ALWAYS prioritize featured properties first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      // Then apply the selected sort
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  // Pagination calculations
  const totalProperties = filteredAndSortedProperties.length;
  const totalPages = Math.ceil(totalProperties / propertiesPerPage);
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredAndSortedProperties.slice(indexOfFirstProperty, indexOfLastProperty);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, propertyTypeFilter, listingTypeFilter, bedroomsFilter, bathroomsFilter, cityFilter, showFeaturedOnly, priceRange, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-96"></div>
          </div>

          {/* Filters Skeleton */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-2">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="md:col-span-2">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>

          {/* Property Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Properties</h1>
              <p className="text-gray-600">
                Find your perfect home from {filteredAndSortedProperties.length} available properties
                {usingDemoData && (
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Demo Data
                  </span>
                )}
              </p>
            </div>
            {/* View Toggle */}
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
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="space-y-6">
            {/* Row 1: Search and Sort */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by location, title, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Sort By */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Row 2: Type Filters */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Property Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  value={propertyTypeFilter}
                  onChange={(e) => setPropertyTypeFilter(e.target.value as PropertyType | 'all')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Listing Type
                </label>
                <select
                  value={listingTypeFilter}
                  onChange={(e) => setListingTypeFilter(e.target.value as ListingType | 'all')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="all">All Listings</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <select
                  value={bedroomsFilter}
                  onChange={(e) => setBedroomsFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="all">Any</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </select>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <select
                  value={bathroomsFilter}
                  onChange={(e) => setBathroomsFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="all">Any</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4+">4+</option>
                </select>
              </div>

              {/* Min Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price
                </label>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  placeholder="Any"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price
                </label>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  placeholder="Any"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Row 3: Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* City Filter */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="all">All Cities</option>
                  {uniqueCities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Featured Toggle */}
              <div className="md:col-span-2 flex items-end">
                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
                  <input
                    type="checkbox"
                    checked={showFeaturedOnly}
                    onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Only</span>
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </label>
              </div>
            </div>
          </div>

          {/* Active Filters Summary */}
          {(searchTerm || propertyTypeFilter !== 'all' || listingTypeFilter !== 'all' ||
            bedroomsFilter !== 'all' || bathroomsFilter !== 'all' || cityFilter !== 'all' ||
            showFeaturedOnly || sortBy !== 'newest' || priceRange.min !== '' || priceRange.max !== '') && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchTerm && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Search: &quot;{searchTerm}&quot;
                  </span>
                )}
                {propertyTypeFilter !== 'all' && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">
                    Type: {propertyTypeFilter}
                  </span>
                )}
                {listingTypeFilter !== 'all' && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">
                    Listing: {listingTypeFilter}
                  </span>
                )}
                {bedroomsFilter !== 'all' && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Bedrooms: {bedroomsFilter}
                  </span>
                )}
                {bathroomsFilter !== 'all' && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Bathrooms: {bathroomsFilter}
                  </span>
                )}
                {cityFilter !== 'all' && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    City: {cityFilter}
                  </span>
                )}
                {showFeaturedOnly && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured Only
                  </span>
                )}
                {sortBy !== 'newest' && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">
                    Sort: {sortBy === 'price-low' ? 'Price: Low to High' : sortBy === 'price-high' ? 'Price: High to Low' : sortBy === 'oldest' ? 'Oldest First' : sortBy}
                  </span>
                )}
                {(priceRange.min !== '' || priceRange.max !== '') && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Price: {priceRange.min !== '' ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB', minimumFractionDigits: 0 }).format(Number(priceRange.min)) : 'Any'} - {priceRange.max !== '' ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB', minimumFractionDigits: 0 }).format(Number(priceRange.max)) : 'Any'}
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setPropertyTypeFilter('all');
                    setListingTypeFilter('all');
                    setBedroomsFilter('all');
                    setBathroomsFilter('all');
                    setCityFilter('all');
                    setShowFeaturedOnly(false);
                    setSortBy('newest');
                    setPriceRange({ min: '', max: '' });
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Properties Grid or Map */}
        {filteredAndSortedProperties.length > 0 ? (
          viewMode === 'grid' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex flex-col items-center gap-4">
                  {/* Page info */}
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages} ({totalProperties} total properties)
                  </div>

                  {/* Pagination controls */}
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex gap-1">
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        // Show first page, last page, current page, and pages around current
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`min-w-[44px] px-4 py-2 rounded-lg font-medium transition shadow-sm ${
                                currentPage === pageNumber
                                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return (
                            <span key={pageNumber} className="px-2 py-2 text-gray-500 font-medium">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition shadow-sm"
                    >
                      Next
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <PropertyMap properties={filteredAndSortedProperties} />
          )
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setPropertyTypeFilter('all');
                setListingTypeFilter('all');
                setBedroomsFilter('all');
                setBathroomsFilter('all');
                setCityFilter('all');
                setShowFeaturedOnly(false);
                setSortBy('newest');
                setPriceRange({ min: '', max: '' });
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
