import React from 'react';

function SkeletonCard() {
  return (
    <div className="border rounded-lg shadow-lg overflow-hidden animate-pulse">
      {/* Image Placeholder */}
      <div className="w-full h-48 bg-gray-300"></div>

      <div className="p-4">
        {/* Title Placeholder */}
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>

        {/* Price Placeholder */}
        <div className="h-5 bg-gray-300 rounded w-1/4 mb-2"></div>

        {/* Details Placeholder */}
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>

      <div className="p-4 pt-0">
        {/* Button Placeholder */}
        <div className="h-10 bg-gray-300 rounded-lg mt-4"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;