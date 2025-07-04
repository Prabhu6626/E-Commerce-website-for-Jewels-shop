import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../store/useStore';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useStore();
  const isInWishlist = wishlist.includes(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      productId: product.id,
      quantity: 1,
    });
    
    toast.success('Added to cart!');
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product.id);
      toast.success('Added to wishlist!');
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {discountPercentage > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                {discountPercentage}% OFF
              </span>
            )}
            {product.preOrder && (
              <span className="bg-gold-500 text-white text-xs px-2 py-1 rounded">
                PRE-ORDER
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleWishlistToggle}
              className={`p-2 rounded-full shadow-md transition-colors ${
                isInWishlist
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-luxury-600 hover:bg-red-500 hover:text-white'
              }`}
            >
              <Heart className="h-4 w-4" fill={isInWishlist ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-2 bg-white text-luxury-600 rounded-full shadow-md hover:bg-gold-500 hover:text-white transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-luxury-800 group-hover:text-gold-600 transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center space-x-1 mt-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-luxury-500">({product.reviewCount})</span>
          </div>

          <div className="mt-2 flex items-center space-x-2">
            <span className="text-lg font-bold text-luxury-800">
              ${product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-luxury-500 line-through">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="mt-2">
            {product.inStock ? (
              <span className="text-sm text-green-600 font-medium">In Stock</span>
            ) : product.preOrder ? (
              <div className="text-sm">
                <span className="text-gold-600 font-medium">Pre-Order</span>
                {product.estimatedDispatch && (
                  <p className="text-luxury-500 text-xs mt-1">
                    Ships: {new Date(product.estimatedDispatch).toLocaleDateString()}
                  </p>
                )}
              </div>
            ) : (
              <span className="text-sm text-red-600 font-medium">Out of Stock</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;