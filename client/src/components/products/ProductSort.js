import React from 'react';
import { FiGrid, FiList } from 'react-icons/fi';

const ProductSort = ({ 
  sortOption, 
  onSortChange, 
  viewMode, 
  onViewModeChange,
  totalProducts,
  currentPage,
  totalPages,
  onPageChange,
  limit,
  onLimitChange
}) => {
  const sortOptions = [
    { value: '-createdAt', label: 'Newest' },
    { value: 'price.amount', label: 'Price: Low to High' },
    { value: '-price.amount', label: 'Price: High to Low' },
    { value: '-rating.average', label: 'Best Rating' },
    { value: '-rating.count', label: 'Most Reviewed' },
    { value: 'name', label: 'Name: A to Z' },
    { value: '-name', label: 'Name: Z to A' }
  ];

  const limitOptions = [12, 24, 36, 48];

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex items-center">
          <span className="text-secondary-600 mr-2">Sort by:</span>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="border border-secondary-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-secondary-600 mr-2">Show:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="border border-secondary-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {limitOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-md ${
                viewMode === 'grid'
                  ? 'bg-primary-100 text-primary-600'
                  : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
              }`}
              aria-label="Grid view"
            >
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-md ${
                viewMode === 'list'
                  ? 'bg-primary-100 text-primary-600'
                  : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
              }`}
              aria-label="List view"
            >
              <FiList className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {totalProducts > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 pt-4 border-t border-secondary-200">
          <div className="text-secondary-600 mb-2 md:mb-0">
            Showing {Math.min((currentPage - 1) * limit + 1, totalProducts)} - {Math.min(currentPage * limit, totalProducts)} of {totalProducts} products
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border border-secondary-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              // Show first page, last page, current page, and pages around current page
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => onPageChange(pageNumber)}
                    className={`w-8 h-8 rounded-md ${
                      currentPage === pageNumber
                        ? 'bg-primary-600 text-white'
                        : 'border border-secondary-300 hover:bg-secondary-100'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                (pageNumber === 2 && currentPage > 3) ||
                (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
              ) {
                return <span key={pageNumber} className="px-1">...</span>;
              }
              return null;
            })}
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border border-secondary-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSort;
