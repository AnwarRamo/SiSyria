// src/components/SkeletonLoader.jsx
import React from 'react';

export const CardSkeleton = () => (
  <div className="animate-pulse bg-white p-6 rounded-2xl shadow-xl">
    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
    <div className="h-48 bg-gray-200 rounded-lg"></div>
  </div>
);