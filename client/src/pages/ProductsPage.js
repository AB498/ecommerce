import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiFilter, FiX, FiSearch } from 'react-icons/fi';
import ProductList from '../components/products/ProductList';
import ProductFilter from '../components/products/ProductFilter';
import ProductSort from '../components/products/ProductSort';
import api from '../services/api';

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // Ref to track if this is the initial render
  const isInitialRender = useRef(true);

  // Set up listener for browser navigation events
  useEffect(() => {
    // Initialize the navigation flag
    window.navigationFromBrowser = false;

    // Listen for popstate events (browser back/forward)
    const handlePopState = () => {
      window.navigationFromBrowser = true;
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters and sorting
  const [filters, setFilters] = useState({
    categories: queryParams.getAll('category') || [],
    brands: queryParams.getAll('brand') || [],
    price: {
      min: Number(queryParams.get('minPrice')) || 0,
      max: Number(queryParams.get('maxPrice')) || 1000
    },
    inStock: queryParams.get('inStock') === 'true',
    onSale: queryParams.get('onSale') === 'true'
  });

  const [sortOption, setSortOption] = useState(queryParams.get('sort') || '-createdAt');
  const [viewMode, setViewMode] = useState(queryParams.get('view') || 'grid');
  const [currentPage, setCurrentPage] = useState(Number(queryParams.get('page')) || 1);
  const [limit, setLimit] = useState(Number(queryParams.get('limit')) || 12);
  const [searchQuery, setSearchQuery] = useState(queryParams.get('search') || '');
  // Handle search input change
  const [searchInputValue, setSearchInputValue] = useState(queryParams.get('search') || '');

  // This useEffect is for handling direct URL navigation or browser back/forward
  // It should only run on initial load or when the URL is changed by browser navigation
  useEffect(() => {
    // Skip if this is a programmatic URL update from our filter changes
    if (!isInitialRender.current && !window.navigationFromBrowser) {
      return;
    }

    // Reset the navigation flag
    window.navigationFromBrowser = false;

    // Get query parameters from URL
    const newQueryParams = new URLSearchParams(location.search);

    // Parse filters from URL
    const newFilters = {
      categories: newQueryParams.getAll('category') || [],
      brands: newQueryParams.getAll('brand') || [],
      price: {
        min: Number(newQueryParams.get('minPrice')) || 0,
        max: Number(newQueryParams.get('maxPrice')) || 1000
      },
      inStock: newQueryParams.get('inStock') === 'true',
      onSale: newQueryParams.get('onSale') === 'true'
    };

    const newSortOption = newQueryParams.get('sort') || '-createdAt';
    const newPage = Number(newQueryParams.get('page')) || 1;
    const newLimit = Number(newQueryParams.get('limit')) || 12;
    const newSearchQuery = newQueryParams.get('search') || '';

    // Update state with values from URL
    setFilters(newFilters);
    setSortOption(newSortOption);
    setCurrentPage(newPage);
    setLimit(newLimit);
    setSearchQuery(newSearchQuery);
    setSearchInputValue(newSearchQuery);

    // After initial render, mark it as completed
    isInitialRender.current = false;

    console.log('URL parameters loaded, filters set to:', newFilters);
  }, [location.search]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      try {
        // Build query parameters
        const params = new URLSearchParams();

        // Add search query
        if (searchQuery) {
          params.append('search', searchQuery);
        }

        // Add categories
        filters.categories.forEach(category => {
          params.append('category', category);
        });

        // Add brands
        filters.brands.forEach(brand => {
          params.append('brand', brand);
        });

        // Add price range
        if (filters.price.min > 0) {
          params.append('minPrice', filters.price.min);
        }

        if (filters.price.max < priceRange.max) {
          params.append('maxPrice', filters.price.max);
        }

        // Add stock filter
        if (filters.inStock) {
          params.append('inStock', 'true');
        }

        // Add sale filter
        if (filters.onSale) {
          params.append('onSale', 'true');
        }

        // Add sorting
        params.append('sort', sortOption);

        // Add pagination
        params.append('page', currentPage);
        params.append('limit', limit);

        // Update URL if needed
        const newSearchString = params.toString();
        const currentSearchString = new URLSearchParams(location.search).toString();

        // Only update URL if the search params have changed
        if (newSearchString !== currentSearchString) {
          navigate({
            pathname: location.pathname,
            search: newSearchString
          }, { replace: true });
        }

        // Fetch products
        const response = await api.get(`/products?${params.toString()}`);

        console.log('Search response:', response.data);

        if (response.data && response.data.products) {
          setProducts(response.data.products);
          setTotalProducts(response.data.pagination.total);
          setTotalPages(response.data.pagination.pages);

          // Log search results for debugging
          console.log(`Found ${response.data.products.length} products out of ${response.data.pagination.total} total`);
        } else {
          console.error('Unexpected response format:', response.data);
          setError('Received an invalid response from the server');
          setProducts([]);
          setTotalProducts(0);
          setTotalPages(0);
        }

        // Update price range if not set yet
        if (priceRange.min === 0 && priceRange.max === 1000) {
          setPriceRange({
            min: response.data.priceRange?.min || 0,
            max: response.data.priceRange?.max || 1000
          });
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Set a small delay to avoid race conditions with URL updates
    const timer = setTimeout(() => {
      fetchProducts();
    }, 0);

    return () => clearTimeout(timer);
  }, [filters, sortOption, currentPage, limit, searchQuery, navigate, location.pathname, priceRange.min, priceRange.max]);

  // Fetch categories and brands
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await api.get('/categories');
        setCategories(categoriesResponse.data.categories);

        // Fetch brands
        const brandsResponse = await api.get('/products/brands');
        if (brandsResponse.data && brandsResponse.data.brands) {
          setBrands(brandsResponse.data.brands);
        } else {
          console.warn('Unexpected brands response format:', brandsResponse.data);
          setBrands([]);
        }
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    fetchFilters();
  }, []);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      price: {
        min: 0,
        max: priceRange.max
      },
      inStock: false,
      onSale: false
    });
    setCurrentPage(1);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchInputValue('');
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (value) => {
    setSortOption(value);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  // Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Handle limit change
  const handleLimitChange = (value) => {
    setLimit(value);
    setCurrentPage(1); // Reset to first page when limit changes
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchInput = e.target.elements.search.value.trim();
    setSearchQuery(searchInput);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Keep searchInputValue in sync with searchQuery
  useEffect(() => {
    setSearchInputValue(searchQuery);
  }, [searchQuery]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
        </h1>

        {/* Search Form */}
        <div className="mb-6">
          <form onSubmit={handleSearchSubmit} className="flex w-full md:w-2/3 lg:w-1/2">
            <div className="relative flex-grow">
              <input
                type="text"
                name="search"
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 border border-secondary-300 rounded-l-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-secondary-400" />
              </div>
            </div>
            <button
              type="submit"
              className="bg-primary-600 text-white px-4 py-2 rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Search
            </button>
          </form>
        </div>

        {searchQuery && (
          <div className="mt-2 flex items-center">
            <span className="text-secondary-600 mr-2">
              {totalProducts} results found
            </span>
            <button
              onClick={handleClearSearch}
              className="flex items-center text-primary-600 hover:text-primary-800"
            >
              <FiX className="mr-1" /> Clear search
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <ProductFilter
            categories={categories}
            brands={brands}
            priceRange={priceRange}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="w-full flex items-center justify-center py-2 px-4 border border-secondary-300 rounded-md text-secondary-700 hover:bg-secondary-50"
          >
            <FiFilter className="mr-2" />
            Filter Products
          </button>
        </div>

        {/* Mobile Filter Sidebar */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileFilterOpen(false)}></div>
            <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl overflow-y-auto">
              <div className="p-4 border-b border-secondary-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="text-secondary-500 hover:text-secondary-700"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <ProductFilter
                  categories={categories}
                  brands={brands}
                  priceRange={priceRange}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-grow">
          {/* Sort and View Options */}
          <ProductSort
            sortOption={sortOption}
            onSortChange={handleSortChange}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            totalProducts={totalProducts}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            limit={limit}
            onLimitChange={handleLimitChange}
          />

          {/* Product List */}
          <ProductList
            products={products}
            loading={loading}
            error={error}
          />

          {/* Pagination (Mobile) */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center lg:hidden">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md border border-secondary-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>

                <span className="px-3 py-1">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md border border-secondary-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
