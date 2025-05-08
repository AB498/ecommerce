import React, { useState } from 'react';
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const ProductFilter = ({
  categories,
  brands,
  priceRange,
  filters,
  onFilterChange,
  onClearFilters
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    brands: true,
    availability: true
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const handleCategoryChange = (categorySlug) => {
    const newCategories = filters.categories.includes(categorySlug)
      ? filters.categories.filter(slug => slug !== categorySlug)
      : [...filters.categories, categorySlug];

    onFilterChange('categories', newCategories);
  };

  const handleBrandChange = (brand) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];

    onFilterChange('brands', newBrands);
  };

  const handlePriceChange = (min, max) => {
    onFilterChange('price', { min, max });
  };

  const handleAvailabilityChange = (key) => {
    onFilterChange(key, !filters[key]);
  };

  return (
    <>
      {/* Mobile filter button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-full py-2 px-4 bg-secondary-100 text-secondary-800 rounded-md hover:bg-secondary-200 transition-colors"
        >
          <FiFilter className="mr-2" />
          Filter Products
        </button>
      </div>

      {/* Mobile filter sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-secondary-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-secondary-500 hover:text-secondary-700"
                aria-label="Close filters"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {renderFilterContent()}
            </div>
          </div>
        </div>
      )}

      {/* Desktop filter sidebar */}
      <div className="hidden md:block">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button
              onClick={onClearFilters}
              className="text-sm text-primary-600 hover:text-primary-800"
            >
              Clear All
            </button>
          </div>
          {renderFilterContent()}
        </div>
      </div>
    </>
  );

  function renderFilterContent() {
    return (
      <div className="space-y-6">
        {/* Categories */}
        <div>
          <div
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => toggleSection('categories')}
          >
            <h4 className="font-medium">Categories</h4>
            {expandedSections.categories ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {expandedSections.categories && (
            <div className="space-y-2 ml-1">
              {categories.map(category => (
                <div key={category._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category.slug}`}
                    checked={filters.categories.includes(category.slug)}
                    onChange={() => handleCategoryChange(category.slug)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                  />
                  <label htmlFor={`category-${category.slug}`} className="ml-2 text-sm text-secondary-700">
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div>
          <div
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => toggleSection('price')}
          >
            <h4 className="font-medium">Price Range</h4>
            {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {expandedSections.price && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={filters.price.min}
                  onChange={(e) => handlePriceChange(Number(e.target.value), filters.price.max)}
                  placeholder="Min"
                  className="w-full px-2 py-1 text-sm border border-secondary-300 rounded"
                />
                <span className="text-secondary-500">to</span>
                <input
                  type="number"
                  value={filters.price.max}
                  onChange={(e) => handlePriceChange(filters.price.min, Number(e.target.value))}
                  placeholder="Max"
                  className="w-full px-2 py-1 text-sm border border-secondary-300 rounded"
                />
              </div>
              <div className="flex justify-between text-xs text-secondary-500">
                <span>${priceRange.min}</span>
                <span>${priceRange.max}</span>
              </div>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={filters.price.max}
                onChange={(e) => handlePriceChange(filters.price.min, Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Brands */}
        <div>
          <div
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => toggleSection('brands')}
          >
            <h4 className="font-medium">Brands</h4>
            {expandedSections.brands ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {expandedSections.brands && (
            <div className="space-y-2 ml-1">
              {brands.map(brand => (
                <div key={brand} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`brand-${brand}`}
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                  />
                  <label htmlFor={`brand-${brand}`} className="ml-2 text-sm text-secondary-700">
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Availability */}
        <div>
          <div
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => toggleSection('availability')}
          >
            <h4 className="font-medium">Availability</h4>
            {expandedSections.availability ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {expandedSections.availability && (
            <div className="space-y-2 ml-1">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={filters.inStock}
                  onChange={() => handleAvailabilityChange('inStock')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
                <label htmlFor="inStock" className="ml-2 text-sm text-secondary-700">
                  In Stock
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="onSale"
                  checked={filters.onSale}
                  onChange={() => handleAvailabilityChange('onSale')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
                <label htmlFor="onSale" className="ml-2 text-sm text-secondary-700">
                  On Sale
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Apply button (mobile only) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    );
  }
};

export default ProductFilter;
