// Reusable skeleton loading components

export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-gray-200"></div>

      {/* Content skeleton */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>

        {/* Location */}
        <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>

        {/* Description */}
        <div className="space-y-2 mb-4 flex-grow">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* Details */}
        <div className="flex items-center gap-4 mb-4">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>

        {/* Price */}
        <div className="pt-4 border-t border-gray-100">
          <div className="h-8 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    </div>
  );
}

export function PropertyDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Main image */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="h-96 bg-gray-200"></div>
              {/* Thumbnails */}
              <div className="flex gap-2 p-4">
                <div className="h-20 w-20 bg-gray-200 rounded-lg"></div>
                <div className="h-20 w-20 bg-gray-200 rounded-lg"></div>
                <div className="h-20 w-20 bg-gray-200 rounded-lg"></div>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-12"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>

          {/* Right Column - Price Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
              <div className="space-y-3">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 6 }: { columns?: number }) {
  return (
    <tr className="animate-pulse">
      {[...Array(columns)].map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </td>
      ))}
    </tr>
  );
}

export function SearchBarSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
    </div>
  );
}
