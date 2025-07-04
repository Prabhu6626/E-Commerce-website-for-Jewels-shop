import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ui/ProductCard';
import Button from '../components/ui/Button';

const Collections: React.FC = () => {
  const { products, fetchProducts, categories, fetchCategories } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  const featuredCollections = [
    {
      name: 'Bridal Collection',
      description: 'Exquisite pieces for your special day',
      image: 'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Sets'
    },
    {
      name: 'Diamond Elegance',
      description: 'Timeless diamond jewelry',
      image: 'https://images.pexels.com/photos/1616428/pexels-photo-1616428.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Necklaces'
    },
    {
      name: 'Gold Classics',
      description: 'Traditional gold jewelry',
      image: 'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Bracelets'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl font-bold text-luxury-800 mb-4">
            Our Collections
          </h1>
          <p className="text-luxury-600 max-w-2xl mx-auto">
            Discover our carefully curated collections of fine jewelry, 
            each piece crafted with precision and passion.
          </p>
        </motion.div>

        {/* Featured Collections */}
        <div className="mb-16">
          <h2 className="font-display text-3xl font-bold text-luxury-800 mb-8 text-center">
            Featured Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCollections.map((collection, index) => (
              <motion.div
                key={collection.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-lg h-80 cursor-pointer"
                onClick={() => setSelectedCategory(collection.category)}
              >
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center text-center text-white p-6">
                  <div>
                    <h3 className="font-display text-2xl font-bold mb-2">{collection.name}</h3>
                    <p className="text-sm opacity-90 mb-4">{collection.description}</p>
                    <Button variant="outline" size="sm">
                      Explore Collection
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-6 py-2 rounded-full transition-colors ${
                selectedCategory === ''
                  ? 'bg-gold-500 text-white'
                  : 'bg-luxury-100 text-luxury-700 hover:bg-gold-100'
              }`}
            >
              All Collections
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-gold-500 text-white'
                    : 'bg-luxury-100 text-luxury-700 hover:bg-gold-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-luxury-600 mb-4">No products found in this collection.</p>
            <Button onClick={() => setSelectedCategory('')} variant="outline">
              View All Collections
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;