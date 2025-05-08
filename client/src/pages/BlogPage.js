import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUser, FiTag, FiArrowRight } from 'react-icons/fi';

const BlogPage = () => {
  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: 'Top 10 Electronics Trends in 2023',
      excerpt: 'Discover the latest electronics trends that are shaping the industry this year, from foldable devices to AI-powered gadgets.',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      date: 'June 15, 2023',
      author: 'Alex Johnson',
      category: 'Electronics',
      slug: 'top-10-electronics-trends-2023'
    },
    {
      id: 2,
      title: 'How to Choose the Perfect Smartphone',
      excerpt: 'A comprehensive guide to help you navigate the complex world of smartphones and find the perfect device for your needs.',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      date: 'May 28, 2023',
      author: 'Sarah Miller',
      category: 'Smartphones',
      slug: 'how-to-choose-perfect-smartphone'
    },
    {
      id: 3,
      title: 'Summer Fashion Essentials for 2023',
      excerpt: 'Stay stylish this summer with our curated list of fashion essentials that will keep you looking cool and feeling comfortable.',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      date: 'May 10, 2023',
      author: 'Emma Wilson',
      category: 'Fashion',
      slug: 'summer-fashion-essentials-2023'
    },
    {
      id: 4,
      title: 'Home Office Setup: Essential Equipment',
      excerpt: 'Create a productive and comfortable home office with these essential equipment recommendations and setup tips.',
      image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      date: 'April 22, 2023',
      author: 'Michael Brown',
      category: 'Home & Office',
      slug: 'home-office-setup-essential-equipment'
    },
    {
      id: 5,
      title: 'Must-Read Books for Summer 2023',
      excerpt: 'Expand your reading list with these captivating books that are perfect for your summer reading adventures.',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      date: 'April 15, 2023',
      author: 'David Clark',
      category: 'Books',
      slug: 'must-read-books-summer-2023'
    },
    {
      id: 6,
      title: 'Kitchen Gadgets That Will Change Your Cooking Game',
      excerpt: 'Discover innovative kitchen gadgets that will make cooking easier, faster, and more enjoyable for home chefs of all levels.',
      image: 'https://images.unsplash.com/photo-1556911220-bda9f7f7597b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      date: 'March 30, 2023',
      author: 'Jennifer Lee',
      category: 'Kitchen',
      slug: 'kitchen-gadgets-change-cooking-game'
    }
  ];

  // Categories for the sidebar
  const categories = [
    { name: 'Electronics', count: 12 },
    { name: 'Fashion', count: 9 },
    { name: 'Home & Office', count: 7 },
    { name: 'Books', count: 5 },
    { name: 'Kitchen', count: 4 },
    { name: 'Smartphones', count: 8 }
  ];

  // Recent posts for the sidebar
  const recentPosts = blogPosts.slice(0, 3);

  return (
    <div className="bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Our Blog</h1>
          <p className="text-xl text-center max-w-2xl mx-auto">
            Discover the latest trends, tips, and insights about our products and the industry.
          </p>
        </div>
      </div>

      {/* Blog Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="flex items-center mr-4">
                        <FiCalendar className="mr-1" /> {post.date}
                      </span>
                      <span className="flex items-center">
                        <FiUser className="mr-1" /> {post.author}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold mb-3 text-gray-800">
                      <Link to={`/blog/${post.slug}`} className="hover:text-indigo-600 transition-colors">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center text-sm text-indigo-600">
                        <FiTag className="mr-1" /> {post.category}
                      </span>
                      <Link 
                        to={`/blog/${post.slug}`} 
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        Read More <FiArrowRight className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="inline-flex rounded-md shadow">
                <a href="#" className="py-2 px-4 bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-l-md">
                  Previous
                </a>
                <a href="#" className="py-2 px-4 bg-indigo-600 border border-indigo-600 text-sm font-medium text-white">
                  1
                </a>
                <a href="#" className="py-2 px-4 bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50">
                  2
                </a>
                <a href="#" className="py-2 px-4 bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-r-md">
                  Next
                </a>
              </nav>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* Search */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Search</h3>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link 
                      to={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center justify-between text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      <span>{category.name}</span>
                      <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Recent Posts</h3>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex items-start">
                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-800 hover:text-indigo-600 transition-colors">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{post.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-indigo-50 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-2 text-gray-800">Subscribe to Our Newsletter</h3>
              <p className="text-gray-600 text-sm mb-4">Get the latest posts delivered right to your inbox.</p>
              <form>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
