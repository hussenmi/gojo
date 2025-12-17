import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/types/property';
import { FavoriteButton } from './FavoriteButton';
import { useComparison } from '@/contexts/ComparisonContext';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const inComparison = isInComparison(property.id);

  // Format price with Ethiopian Birr
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get property type badge color
  const getTypeBadgeColor = (type: string) => {
    const colors = {
      house: 'bg-blue-100 text-blue-800',
      apartment: 'bg-green-100 text-green-800',
      commercial: 'bg-purple-100 text-purple-800',
      land: 'bg-orange-100 text-orange-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Capitalize property type label
  const capitalizeType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inComparison) {
      removeFromComparison(property.id);
    } else {
      addToComparison(property);
    }
  };

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          <Image
            src={property.images[0] || '/images/placeholder-house.jpg'}
            alt={property.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {property.featured && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
              Featured
            </div>
          )}
          <div className={`absolute top-2 left-2 ${getTypeBadgeColor(property.property_type)} px-3 py-1 rounded-full text-xs font-semibold`}>
            {capitalizeType(property.property_type)}
          </div>
          <div className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg">
            <FavoriteButton propertyId={property.id} />
          </div>
          {/* Compare Checkbox */}
          <div className="absolute bottom-2 left-2">
            <button
              onClick={handleCompareToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg text-xs font-medium transition ${
                inComparison
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <input
                type="checkbox"
                checked={inComparison}
                onChange={() => {}}
                className="w-3.5 h-3.5 rounded"
              />
              <span>Compare</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-grow flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
            {property.title}
          </h3>

          {/* Location */}
          <p className="text-sm text-gray-600 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.city}
          </p>

          {/* Description */}
          <p className="text-sm text-gray-700 mb-4 line-clamp-2 flex-grow">
            {property.description}
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

          {/* Price and Listing Type */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {formatPrice(property.price)}
              </div>
              <div className="text-xs text-gray-500">
                For {capitalizeType(property.listing_type)}
              </div>
            </div>
            <div className="text-blue-600 font-semibold text-sm">
              View Details →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
