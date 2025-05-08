import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ProductDetail from '../components/products/ProductDetail';
import ProductList from '../components/products/ProductList';
import api from '../services/api';

const ProductDetailPage = () => {
  const { productSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Log the current route information
  console.log('ProductDetailPage - Current route:', {
    pathname: location.pathname,
    productSlug: productSlug,
    params: useParams()
  });

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');

      console.log('Starting to fetch product with slug:', productSlug);
      console.log('API URL will be:', `${api.defaults.baseURL}/products/${productSlug}`);

      if (!productSlug || productSlug.trim() === '') {
        console.error('Invalid productSlug value:', productSlug);
        setError('Invalid product URL - Missing product slug parameter');
        setLoading(false);
        return;
      }

      try {
        // Fetch product details
        console.log('Making API request to fetch product...');
        const response = await api.get(`/products/${productSlug}`);
        console.log('Product API response received:', response);
        console.log('Product API response data:', response.data);

        if (!response.data.product) {
          console.error('Product data missing in response:', response.data);
          throw new Error('Product data is missing in the response');
        }

        // Ensure the product has all required fields
        const productData = response.data.product;
        console.log('Product data extracted:', productData);

        // Ensure images array exists
        if (!productData.images || !Array.isArray(productData.images)) {
          console.log('Adding empty images array to product');
          productData.images = [];
        }

        // Ensure categories array exists
        if (!productData.categories || !Array.isArray(productData.categories)) {
          console.log('Adding empty categories array to product');
          productData.categories = [];
        }

        // Ensure rating object exists
        if (!productData.rating) {
          console.log('Adding default rating object to product');
          productData.rating = { average: 0, count: 0 };
        }

        console.log('Setting product state with:', productData);
        setProduct(productData);

        // Fetch related products only if categories exist and are populated
        if (productData.categories && productData.categories.length > 0 && productData.categories[0]._id) {
          const categoryId = productData.categories[0]._id;
          console.log('Fetching related products for category:', categoryId);

          try {
            const relatedResponse = await api.get(`/products?category=${categoryId}&limit=4&exclude=${productData._id}`);
            console.log('Related products response:', relatedResponse.data);

            if (relatedResponse.data.products && Array.isArray(relatedResponse.data.products)) {
              setRelatedProducts(relatedResponse.data.products);
            }
          } catch (relatedError) {
            console.error('Error fetching related products:', relatedError);
            // Don't fail the whole page if related products fail to load
          }
        } else {
          console.log('No categories found or categories not properly populated:', productData.categories);
        }
      } catch (error) {
        console.error('Error fetching product:', error);

        if (error.response) {
          console.error('Error response status:', error.response.status);
          console.error('Error response data:', error.response.data);

          if (error.response.status === 404) {
            setError('Product not found');
            // Redirect to 404 page after a delay
            setTimeout(() => {
              navigate('/not-found', { replace: true });
            }, 3000);
          } else {
            setError(`Failed to load product: ${error.response.data.message || 'Unknown error'}`);
          }
        } else if (error.request) {
          console.error('No response received - request details:', error.request);
          setError('Failed to load product. No response from server.');
        } else {
          console.error('Error message:', error.message);
          setError(`Failed to load product: ${error.message}`);
        }
      } finally {
        console.log('Finished product fetch attempt, setting loading to false');
        setLoading(false);
      }
    };

    if (productSlug) {
      console.log('Product slug is present, calling fetchProduct()');
      fetchProduct();
    } else {
      console.error('No product slug parameter found in URL');
      setError('Invalid product URL - Missing product slug parameter');
      setLoading(false);
    }
  }, [productSlug, navigate]);

  // Update page title
  useEffect(() => {
    if (product) {
      document.title = `${product.name} | E-Commerce`;
    } else {
      document.title = 'Product | E-Commerce';
    }

    return () => {
      document.title = 'E-Commerce';
    };
  }, [product]);

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-12 h-12 border-t-4 border-primary-600 border-solid rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-md my-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <ProductDetail product={product} />

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">Related Products</h2>
              <ProductList products={relatedProducts} loading={false} error={null} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductDetailPage;
