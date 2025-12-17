'use client';

import { useComparison } from '@/contexts/ComparisonContext';
import Link from 'next/link';
import Image from 'next/image';

export function ComparisonBar() {
  const { comparisonProperties, removeFromComparison, clearComparison } = useComparison();

  if (comparisonProperties.length === 0) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-600 shadow-2xl z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Selected Properties */}
          <div className="flex items-center gap-3 flex-1 overflow-x-auto">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="font-semibold text-gray-900">Compare Properties:</span>
              <span className="text-sm text-gray-600">({comparisonProperties.length}/3)</span>
            </div>

            <div className="flex gap-3">
              {comparisonProperties.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 pr-3 border border-gray-200 flex-shrink-0"
                >
                  <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={property.images[0] || '/images/placeholder-house.jpg'}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate max-w-[150px]">
                      {property.title}
                    </div>
                    <div className="text-xs text-blue-600 font-semibold">
                      {formatPrice(property.price)}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromComparison(property.id)}
                    className="text-gray-400 hover:text-red-600 transition flex-shrink-0"
                    title="Remove from comparison"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={clearComparison}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
            >
              Clear All
            </button>
            <Link
              href="/compare"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm shadow-lg"
            >
              Compare Now →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
