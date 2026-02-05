import React from 'react';

export const WatchlistSkeleton: React.FC = () => {
  return (
    <div className="space-y-2 transition-opacity duration-500 ease-out animate-pulse">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
    </div>
  );
};
