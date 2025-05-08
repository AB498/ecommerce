import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiShare2, FiMinus, FiPlus, FiCheck } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductDetail = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(0);
  const [variantsInitialized, setVariantsInitialized] = useState(false);

  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  // Initialize variants with default values
  React.useEffect(() => {
    if (product && product.variants && product.variants.length > 0 && !variantsInitialized) {
      const defaultVariants = {};

      // Select the first option for each variant by default
      product.variants.forEach(variant => {
        if (variant.options && variant.options.length > 0) {
          defaultVariants[variant.name] = variant.options[0].name;
        }
      });

      setSelectedVariants(defaultVariants);
      setVariantsInitialized(true);

      console.log('Default variants set:', defaultVariants);
    }
  }, [product, variantsInitialized]);

  if (!product) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-12 h-12 border-t-4 border-primary-600 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(product.stockQuantity, value));
    setQuantity(newQuantity);
  };

  const handleVariantChange = (variantName, optionName) => {
    setSelectedVariants({
      ...selectedVariants,
      [variantName]: optionName
    });
  };

  const handleAddToCart = () => {
    const selectedVariantsList = Object.entries(selectedVariants).map(([name, value]) => ({
      name,
      value
    }));

    addToCart(product._id, quantity, selectedVariantsList);
  };

  const handleAddToWishlist = () => {
    addToWishlist(product._id);
  };

  // Calculate price with variants
  const calculatePrice = () => {
    let basePrice = product.price.amount;

    // Add price modifiers from selected variants
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach(variant => {
        const selectedOption = selectedVariants[variant.name];
        if (selectedOption) {
          const option = variant.options.find(opt => opt.name === selectedOption);
          if (option && option.priceModifier) {
            basePrice += option.priceModifier;
          }
        }
      });
    }

    return basePrice;
  };

  // Format price with discount
  const formatPrice = () => {
    const currentPrice = calculatePrice();

    if (product.onSale && product.price.compareAtPrice) {
      const discountPercentage = Math.round(
        ((product.price.compareAtPrice - product.price.amount) / product.price.compareAtPrice) * 100
      );

      return (
        <div className="flex items-center">
          <span className="text-3xl font-bold text-accent-600">${currentPrice.toFixed(2)}</span>
          <span className="ml-2 text-lg line-through text-secondary-400">${product.price.compareAtPrice.toFixed(2)}</span>
          <span className="ml-2 bg-accent-100 text-accent-800 text-sm font-medium px-2 py-0.5 rounded">
            {discountPercentage}% OFF
          </span>
        </div>
      );
    }

    return <span className="text-3xl font-bold text-secondary-900">${currentPrice.toFixed(2)}</span>;
  };

  // Check if product is in stock
  const isInStock = product.stockQuantity > 0;

  // Check if all required variants are selected
  const areAllVariantsSelected = () => {
    if (!product.variants || product.variants.length === 0) {
      return true;
    }

    return product.variants.every(variant => selectedVariants[variant.name]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        {/* Product Images */}
        <div>
          <div className="mb-4 rounded-lg overflow-hidden bg-secondary-100 h-80 flex items-center justify-center">
            <img
              src={product.images[activeImage]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'}
              alt={product.images[activeImage]?.alt || product.name}
              className="w-full h-full object-contain"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                    activeImage === index ? 'border-primary-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'}
                    alt={image.alt || `${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Breadcrumbs */}
          <nav className="mb-4">
            <ol className="flex text-sm text-secondary-500">
              <li>
                <Link to="/" className="hover:text-primary-600">Home</Link>
              </li>
              <li className="mx-2">/</li>
              <li>
                <Link to="/products" className="hover:text-primary-600">Products</Link>
              </li>
              {product.categories && product.categories.length > 0 && (
                <>
                  <li className="mx-2">/</li>
                  <li>
                    <Link
                      to={`/products/category/${product.categories[0].slug}`}
                      className="hover:text-primary-600"
                    >
                      {product.categories[0].name}
                    </Link>
                  </li>
                </>
              )}
            </ol>
          </nav>

          {/* Product Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-2">
            {product.name}
          </h1>

          {/* Brand */}
          {product.brand && (
            <p className="text-secondary-600 mb-2">
              Brand: <span className="font-medium">{product.brand}</span>
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating?.average || 0) ? 'text-accent-500' : 'text-secondary-300'}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-secondary-500 ml-2">
              {product.rating?.average?.toFixed(1) || '0.0'} ({product.rating?.count || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            {formatPrice()}
          </div>

          {/* Short Description */}
          {product.shortDescription && (
            <div className="mb-6 text-secondary-700">
              <p>{product.shortDescription}</p>
            </div>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6 space-y-4">
              {product.variants.map((variant) => (
                <div key={variant.name}>
                  <h3 className="text-sm font-medium text-secondary-900 mb-2">
                    {variant.name}:
                    {selectedVariants[variant.name] && (
                      <span className="ml-2 font-normal text-secondary-600">
                        {selectedVariants[variant.name]}
                      </span>
                    )}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((option) => (
                      <button
                        key={option.name}
                        onClick={() => handleVariantChange(variant.name, option.name)}
                        className={`px-3 py-1 border rounded-md text-sm ${
                          selectedVariants[variant.name] === option.name
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-secondary-300 hover:border-secondary-400'
                        }`}
                      >
                        {option.name}
                        {option.priceModifier > 0 && ` (+$${option.priceModifier.toFixed(2)})`}
                        {option.priceModifier < 0 && ` (-$${Math.abs(option.priceModifier).toFixed(2)})`}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-secondary-900 mb-2">Quantity:</h3>
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="p-2 border border-secondary-300 rounded-l-md disabled:opacity-50"
              >
                <FiMinus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="1"
                max={product.stockQuantity}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                className="w-16 text-center border-t border-b border-secondary-300 py-2"
              />
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stockQuantity}
                className="p-2 border border-secondary-300 rounded-r-md disabled:opacity-50"
              >
                <FiPlus className="w-4 h-4" />
              </button>

              <span className="ml-4 text-sm text-secondary-600">
                {isInStock ? (
                  <span className="flex items-center text-green-600">
                    <FiCheck className="mr-1" /> In Stock
                    {product.stockQuantity < 10 && (
                      <span className="ml-1">({product.stockQuantity} left)</span>
                    )}
                  </span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={!isInStock || !areAllVariantsSelected()}
              className="flex-1 flex items-center justify-center bg-primary-600 text-white py-3 px-6 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title={!isInStock ? "Out of stock" : !areAllVariantsSelected() ? "Please select all options" : "Add to cart"}
            >
              <FiShoppingCart className="mr-2" />
              {!isInStock ? "Out of Stock" :
               !areAllVariantsSelected() ? "Select Options" :
               "Add to Cart"}
            </button>

            <button
              onClick={handleAddToWishlist}
              className={`flex items-center justify-center px-4 py-3 rounded-md font-medium ${
                isInWishlist(product._id)
                  ? 'bg-accent-50 text-accent-600 border border-accent-300'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200 border border-secondary-300'
              }`}
            >
              <FiHeart className="mr-2" />
              {isInWishlist(product._id) ? 'In Wishlist' : 'Add to Wishlist'}
            </button>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: product.name,
                    text: product.shortDescription,
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
              className="flex items-center justify-center px-4 py-3 rounded-md font-medium bg-secondary-100 text-secondary-700 hover:bg-secondary-200 border border-secondary-300"
            >
              <FiShare2 className="mr-2" />
            </button>
          </div>

          {/* SKU */}
          {product.sku && (
            <p className="text-sm text-secondary-500">
              SKU: <span className="font-medium">{product.sku}</span>
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-secondary-200">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('description')}
            className={`px-6 py-3 font-medium text-sm border-b-2 ${
              activeTab === 'description'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-secondary-600 hover:text-secondary-900 hover:border-secondary-300'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`px-6 py-3 font-medium text-sm border-b-2 ${
              activeTab === 'specifications'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-secondary-600 hover:text-secondary-900 hover:border-secondary-300'
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 font-medium text-sm border-b-2 ${
              activeTab === 'reviews'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-secondary-600 hover:text-secondary-900 hover:border-secondary-300'
            }`}
          >
            Reviews ({product.rating?.count || 0})
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p>{product.description}</p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="overflow-hidden">
              {product.specifications && product.specifications.length > 0 ? (
                <table className="min-w-full divide-y divide-secondary-200">
                  <tbody className="divide-y divide-secondary-200">
                    {product.specifications.map((spec, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-secondary-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 w-1/3">
                          {spec.name}
                        </td>
                        <td className="px-6 py-4 whitespace-normal text-sm text-secondary-700">
                          {spec.value}
                        </td>
                      </tr>
                    ))}

                    {/* Additional specifications */}
                    {product.weight && (
                      <tr className={product.specifications.length % 2 === 0 ? 'bg-secondary-50' : 'bg-white'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 w-1/3">
                          Weight
                        </td>
                        <td className="px-6 py-4 whitespace-normal text-sm text-secondary-700">
                          {product.weight.value} {product.weight.unit}
                        </td>
                      </tr>
                    )}

                    {product.dimensions && (
                      <tr className={(product.specifications.length + (product.weight ? 1 : 0)) % 2 === 0 ? 'bg-secondary-50' : 'bg-white'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 w-1/3">
                          Dimensions
                        </td>
                        <td className="px-6 py-4 whitespace-normal text-sm text-secondary-700">
                          {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} {product.dimensions.unit}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <p className="text-secondary-500">No specifications available for this product.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {/* Reviews would be implemented here */}
              <p className="text-secondary-500">Reviews coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
