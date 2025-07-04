import React, { useState, useMemo } from 'react';
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ui/ProductCard';
import Button from '../components/ui/Button';
import { mockProducts } from '../data/mockData';
import { useStore } from '../store/useStore';

const Shop: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 5000],
    inStock: false,
    preOrder: false,
    materials: [] as string[],
  });

  const { categories } = useStore();

  const allMaterials = useMemo(() => {
    const materials = new Set<string>();
    mockProducts.forEach(product => {
      product.materials.forEach(material => materials.add(material));
    });
    return Array.from(materials);
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = mockProducts.filter(product => {
      // Category filter
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Stock filter
      if (filters.inStock && !product.inStock) {
        return false;
      }

      // Pre-order filter
      if (filters.preOrder && !product.preOrder) {
        return false;
      }

      // Materials filter
      if (filters.materials.length > 0) {
        const hasMatchingMaterial = filters.materials.some(material =>
          product.materials.includes(material)
        );
        if (!hasMatchingMaterial) {
          return false;
        }
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [filters, sortBy]);

  const handleMaterialToggle = (material: string) => {
    setFilters(prev => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter(m => m !== material)
        : [...prev.materials, material]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-luxury-800 mb-4">
            Shop Jewelry
          </h1>
          <p className="text-luxury-600">
            Discover our complete collection of handcrafted jewelry pieces
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="font-semibold text-luxury-800">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <div className={`space-y-6 ${filterOpen ? 'block' : 'hidden lg:block'}`}>
                {/* Category Filter */}
                <div>
                  <h4 className="font-medium text-luxury-800 mb-3">Category</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="category"
                        value=""
                        checked={filters.category === ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                        className="text-gold-500"
                      />
                      <span className="text-sm text-luxury-600">All Categories</span>
                    </label>
                    {categories.map(category => (
                      <label key={category} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={filters.category === category}
                          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                          className="text-gold-500"
                        />
                        <span className="text-sm text-luxury-600">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-medium text-luxury-800 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        priceRange: [0, parseInt(e.target.value)]
                      }))}
                      className="w-full accent-gold-500"
                    />
                    <div className="flex justify-between text-sm text-luxury-600">
                      <span>$0</span>
                      <span>${filters.priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h4 className="font-medium text-luxury-800 mb-3">Availability</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                        className="text-gold-500"
                      />
                      <span className="text-sm text-luxury-600">In Stock</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.preOrder}
                        onChange={(e) => setFilters(prev => ({ ...prev, preOrder: e.target.checked }))}
                        className="text-gold-500"
                      />
                      <span className="text-sm text-luxury-600">Pre-Order Available</span>
                    </label>
                  </div>
                </div>

                {/* Materials */}
                <div>
                  <h4 className="font-medium text-luxury-800 mb-3">Materials</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {allMaterials.map(material => (
                      <label key={material} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.materials.includes(material)}
                          onChange={() => handleMaterialToggle(material)}
                          className="text-gold-500"
                        />
                        <span className="text-sm text-luxury-600">{material}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-luxury-600">
                    {filteredProducts.length} products found
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-luxury-200 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Best Rated</option>
                    <option value="newest">Newest First</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex items-center border border-luxury-200 rounded">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-gold-500 text-white' : 'text-luxury-600'}`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-gold-500 text-white' : 'text-luxury-600'}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <motion.div layout className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Filter className="h-12 w-12 text-luxury-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-luxury-800 mb-2">No products found</h3>
                <p className="text-luxury-600 mb-4">Try adjusting your filters to see more results</p>
                <Button
                  onClick={() => setFilters({
                    category: '',
                    priceRange: [0, 5000],
                    inStock: false,
                    preOrder: false,
                    materials: [],
                  })}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;