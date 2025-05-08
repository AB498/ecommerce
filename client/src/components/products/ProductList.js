import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-12 h-12 border-t-4 border-primary-600 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md my-4">
        <p className="font-medium">Error loading products</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-secondary-50 text-secondary-700 p-8 rounded-md my-4 text-center">
        <p className="text-lg font-medium mb-2">No products found</p>
        <p>Try adjusting your filters or search criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
