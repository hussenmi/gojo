'use client';

import React from 'react';
import { useComparison } from '@/contexts/ComparisonContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ComparePage() {
  const router = useRouter();
  const { comparisonProperties, removeFromComparison, clearComparison } = useComparison();
  const [selectedImages, setSelectedImages] = React.useState<{ [key: string]: number }>({});

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculatePricePerSqm = (price: number, area: number | null) => {
    if (!area || area === 0) return 'N/A';
    return formatPrice(Math.round(price / area)) + '/m²';
  };

  const capitalizeText = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const getSelectedImage = (propertyId: string) => {
    return selectedImages[propertyId] || 0;
  };

  const handlePreviousImage = (propertyId: string, totalImages: number) => {
    const current = getSelectedImage(propertyId);
    setSelectedImages(prev => ({
      ...prev,
      [propertyId]: current === 0 ? totalImages - 1 : current - 1
    }));
  };

  const handleNextImage = (propertyId: string, totalImages: number) => {
    const current = getSelectedImage(propertyId);
    setSelectedImages(prev => ({
      ...prev,
      [propertyId]: current === totalImages - 1 ? 0 : current + 1
    }));
  };

  if (comparisonProperties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Properties Selected</h2>
          <p className="text-gray-600 mb-6">
            Select properties from the listings to compare them side-by-side
          </p>
          <Link
            href="/properties"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.back()}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Compare Properties</h1>
              <p className="text-gray-600">
                Comparing {comparisonProperties.length} {comparisonProperties.length === 1 ? 'property' : 'properties'}
              </p>
            </div>
            <button
              onClick={clearComparison}
              className="px-4 py-2 text-red-600 hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-48">
                    Feature
                  </th>
                  {comparisonProperties.map((property) => (
                    <th key={property.id} className="px-6 py-4 text-left w-80">
                      <button
                        onClick={() => removeFromComparison(property.id)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition"
                        title="Remove from comparison"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Images Row */}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Image</td>
                  {comparisonProperties.map((property) => {
                    const currentImageIndex = getSelectedImage(property.id);
                    return (
                      <td key={property.id} className="px-6 py-4">
                        <div className="relative h-48 rounded-lg overflow-hidden group">
                          <Image
                            src={property.images[currentImageIndex] || '/images/placeholder-house.jpg'}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                          {property.images.length > 1 && (
                            <>
                              {/* Previous Button */}
                              <button
                                onClick={() => handlePreviousImage(property.id, property.images.length)}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition opacity-0 group-hover:opacity-100"
                              >
                                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>

                              {/* Next Button */}
                              <button
                                onClick={() => handleNextImage(property.id, property.images.length)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition opacity-0 group-hover:opacity-100"
                              >
                                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>

                              {/* Image Counter */}
                              <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium">
                                {currentImageIndex + 1} / {property.images.length}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Title Row */}
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Title</td>
                  {comparisonProperties.map((property) => (
                    <td key={property.id} className="px-6 py-4">
                      <Link
                        href={`/properties/${property.id}`}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        {property.title}
                      </Link>
                    </td>
                  ))}
                </tr>

                {/* Price Row */}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Price</td>
                  {comparisonProperties.map((property) => (
                    <td key={property.id} className="px-6 py-4">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatPrice(property.price)}
                      </div>
                      <div className="text-xs text-gray-600 capitalize">
                        For {capitalizeText(property.listing_type)}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Price per m² Row */}
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Price per m²</td>
                  {comparisonProperties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-gray-700 font-semibold">
                      {calculatePricePerSqm(property.price, property.area_sqm)}
                    </td>
                  ))}
                </tr>

                {/* Property Type Row */}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Property Type</td>
                  {comparisonProperties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-gray-700">
                      {capitalizeText(property.property_type)}
                    </td>
                  ))}
                </tr>

                {/* Bedrooms Row */}
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Bedrooms</td>
                  {comparisonProperties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-gray-700 font-semibold">
                      {property.bedrooms || 'N/A'}
                    </td>
                  ))}
                </tr>

                {/* Bathrooms Row */}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Bathrooms</td>
                  {comparisonProperties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-gray-700 font-semibold">
                      {property.bathrooms || 'N/A'}
                    </td>
                  ))}
                </tr>

                {/* Area Row */}
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Area</td>
                  {comparisonProperties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-gray-700 font-semibold">
                      {property.area_sqm ? `${property.area_sqm} m²` : 'N/A'}
                    </td>
                  ))}
                </tr>

                {/* Location Row */}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Location</td>
                  {comparisonProperties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-gray-700">
                      <div className="font-semibold">{property.address}</div>
                      <div className="text-sm text-gray-600">{property.city}, {property.region}</div>
                    </td>
                  ))}
                </tr>

                {/* Status Row */}
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Status</td>
                  {comparisonProperties.map((property) => (
                    <td key={property.id} className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        {capitalizeText(property.status)}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Description Row */}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Description</td>
                  {comparisonProperties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-gray-700 text-sm">
                      {property.description.length > 150
                        ? property.description.substring(0, 150) + '...'
                        : property.description}
                    </td>
                  ))}
                </tr>

                {/* View Details Row */}
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Actions</td>
                  {comparisonProperties.map((property) => (
                    <td key={property.id} className="px-6 py-4">
                      <Link
                        href={`/properties/${property.id}`}
                        className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
                      >
                        View Full Details →
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Add More Properties */}
        {comparisonProperties.length < 3 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              You can compare up to 3 properties. Add {3 - comparisonProperties.length} more to compare.
            </p>
            <Link
              href="/properties"
              className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-semibold"
            >
              Browse More Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
