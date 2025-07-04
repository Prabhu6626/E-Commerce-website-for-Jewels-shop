import React from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { mockProducts } from '../../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const CartSidebar: React.FC = () => {
  const { cartOpen, setCartOpen, cartItems, updateCartItem, removeFromCart } = useStore();
  const navigate = useNavigate();

  const getProductById = (id: string) => mockProducts.find(p => p.id === id);

  const subtotal = cartItems.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setCartOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-luxury-800">Shopping Cart</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-luxury-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="h-12 w-12 text-luxury-300 mb-4" />
                  <p className="text-luxury-500 mb-4">Your cart is empty</p>
                  <Button
                    onClick={() => {
                      setCartOpen(false);
                      navigate('/shop');
                    }}
                    variant="outline"
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const product = getProductById(item.productId);
                    if (!product) return null;

                    return (
                      <motion.div
                        key={item.productId}
                        layout
                        className="flex items-center space-x-3 p-3 border rounded-lg"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-luxury-800 truncate">
                            {product.name}
                          </h3>
                          <p className="text-sm text-luxury-500">
                            ${product.price.toLocaleString()}
                          </p>
                          {item.selectedSize && (
                            <p className="text-xs text-luxury-400">Size: {item.selectedSize}</p>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateCartItem(item.productId, { 
                              quantity: Math.max(1, item.quantity - 1) 
                            })}
                            className="p-1 hover:bg-luxury-100 rounded"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateCartItem(item.productId, { 
                              quantity: item.quantity + 1 
                            })}
                            className="p-1 hover:bg-luxury-100 rounded"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-luxury-800">Subtotal:</span>
                  <span className="font-bold text-lg text-luxury-800">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Button
                    onClick={handleCheckout}
                    className="w-full"
                    size="lg"
                  >
                    Checkout
                  </Button>
                  <Button
                    onClick={() => {
                      setCartOpen(false);
                      navigate('/cart');
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    View Cart
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;