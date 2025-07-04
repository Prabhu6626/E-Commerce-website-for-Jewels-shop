import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X, Crown } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const { user, isAuthenticated, cartItems, wishlist, setCartOpen, logout, search } = useStore();
  const navigate = useNavigate();

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleProfileClick = () => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    } else {
      navigate('/login');
    }
  };

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      const results = await search(query);
      setSearchResults(results);
    } else {
      setSearchResults(null);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        setSearchResults(null);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearchResultClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults(null);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Crown className="h-8 w-8 text-gold-500" />
            <span className="font-display text-2xl font-bold text-luxury-800">
              LuxeJewels
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/shop" className="text-luxury-700 hover:text-gold-500 transition-colors">
              Shop
            </Link>
            <Link to="/collections" className="text-luxury-700 hover:text-gold-500 transition-colors">
              Collections
            </Link>
            <Link to="/about" className="text-luxury-700 hover:text-gold-500 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-luxury-700 hover:text-gold-500 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-luxury-700 hover:text-gold-500 transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
            
            <button
              onClick={handleProfileClick}
              className="p-2 text-luxury-700 hover:text-gold-500 transition-colors"
            >
              <User className="h-5 w-5" />
            </button>

            <Link
              to="/wishlist"
              className="p-2 text-luxury-700 hover:text-gold-500 transition-colors relative"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="p-2 text-luxury-700 hover:text-gold-500 transition-colors relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {isAuthenticated && (
              <button
                onClick={logout}
                className="text-sm text-luxury-700 hover:text-gold-500 transition-colors"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-luxury-700"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pb-4 relative"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-luxury-400" />
                <input
                  type="text"
                  placeholder="Search jewelry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-luxury-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              {/* Search Results */}
              {searchResults && (
                <div className="absolute top-full left-0 right-0 bg-white border border-luxury-200 rounded-lg shadow-lg mt-1 max-h-96 overflow-y-auto z-50">
                  {searchResults.products.length > 0 && (
                    <div className="p-4">
                      <h4 className="font-medium text-luxury-800 mb-2">Products</h4>
                      {searchResults.products.map((product: any) => (
                        <button
                          key={product.id}
                          onClick={() => handleSearchResultClick(product.id)}
                          className="w-full flex items-center space-x-3 p-2 hover:bg-luxury-50 rounded text-left"
                        >
                          <img
                            src={product.images[0] || '/placeholder.jpg'}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-luxury-800">{product.name}</p>
                            <p className="text-sm text-luxury-600">${product.price}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {searchResults.categories.length > 0 && (
                    <div className="p-4 border-t">
                      <h4 className="font-medium text-luxury-800 mb-2">Categories</h4>
                      {searchResults.categories.map((category: any) => (
                        <Link
                          key={category.id}
                          to={`/shop?category=${category.name}`}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery('');
                            setSearchResults(null);
                          }}
                          className="block p-2 hover:bg-luxury-50 rounded text-luxury-700"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  {searchResults.products.length === 0 && searchResults.categories.length === 0 && (
                    <div className="p-4 text-center text-luxury-500">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 py-4 space-y-4">
              <Link
                to="/shop"
                className="block text-luxury-700 hover:text-gold-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/collections"
                className="block text-luxury-700 hover:text-gold-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Collections
              </Link>
              <Link
                to="/about"
                className="block text-luxury-700 hover:text-gold-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block text-luxury-700 hover:text-gold-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              <div className="pt-4 border-t flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleProfileClick}
                    className="p-2 text-luxury-700 hover:text-gold-500 transition-colors"
                  >
                    <User className="h-5 w-5" />
                  </button>
                  <Link
                    to="/wishlist"
                    className="p-2 text-luxury-700 hover:text-gold-500 transition-colors relative"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart className="h-5 w-5" />
                    {wishlist.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={() => {
                      setCartOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="p-2 text-luxury-700 hover:text-gold-500 transition-colors relative"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                </div>
                
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-sm text-luxury-700 hover:text-gold-500 transition-colors"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;