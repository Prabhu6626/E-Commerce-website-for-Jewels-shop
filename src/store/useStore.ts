import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, User, CartItem, Order } from '../types';
import { apiService } from '../services/api';

interface StoreState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Products state
  products: Product[];
  categories: string[];
  featuredProducts: Product[];
  
  // Cart state
  cartItems: CartItem[];
  cartOpen: boolean;
  
  // Wishlist state
  wishlist: string[];
  wishlistProducts: Product[];
  
  // Orders state
  orders: Order[];
  
  // UI state
  loading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<boolean>;
  
  fetchProducts: (params?: any) => Promise<void>;
  fetchProduct: (id: string) => Promise<Product | null>;
  setProducts: (products: Product[]) => void;
  addProduct: (productData: FormData) => Promise<boolean>;
  updateProduct: (id: string, productData: FormData) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartItem: (productId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  
  fetchOrders: () => Promise<void>;
  createOrder: (orderData: any) => Promise<string | null>;
  updateOrderStatus: (orderId: string, statusData: any) => Promise<boolean>;
  
  fetchCategories: () => Promise<void>;
  search: (query: string) => Promise<any>;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      products: [],
      categories: [],
      featuredProducts: [],
      cartItems: [],
      cartOpen: false,
      wishlist: [],
      wishlistProducts: [],
      orders: [],
      loading: false,
      error: null,

      // User actions
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.login(email, password);
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            loading: false 
          });
          return true;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          return false;
        }
      },

      logout: () => {
        apiService.clearToken();
        set({ 
          user: null, 
          isAuthenticated: false, 
          cartItems: [], 
          wishlist: [],
          wishlistProducts: [],
          orders: []
        });
      },

      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.register(userData);
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            loading: false 
          });
          return true;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          return false;
        }
      },

      // Product actions
      fetchProducts: async (params = {}) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.getProducts(params);
          set({ 
            products: response.products, 
            loading: false 
          });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      fetchProduct: async (id: string) => {
        try {
          const product = await apiService.getProduct(id);
          return product;
        } catch (error: any) {
          set({ error: error.message });
          return null;
        }
      },

      setProducts: (products) => set({ products }),
      
      addProduct: async (productData) => {
        set({ loading: true, error: null });
        try {
          await apiService.createProduct(productData);
          set({ loading: false });
          // Refresh products list
          get().fetchProducts();
          return true;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          return false;
        }
      },

      updateProduct: async (id, productData) => {
        set({ loading: true, error: null });
        try {
          await apiService.updateProduct(id, productData);
          set({ loading: false });
          // Refresh products list
          get().fetchProducts();
          return true;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          return false;
        }
      },

      deleteProduct: async (id) => {
        set({ loading: true, error: null });
        try {
          await apiService.deleteProduct(id);
          set({ loading: false });
          // Refresh products list
          get().fetchProducts();
          return true;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          return false;
        }
      },

      // Cart actions
      addToCart: (item) => {
        set((state) => {
          const existingItem = state.cartItems.find(i => i.productId === item.productId);
          if (existingItem) {
            return {
              cartItems: state.cartItems.map(i =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              )
            };
          }
          return { cartItems: [...state.cartItems, item] };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cartItems: state.cartItems.filter(item => item.productId !== productId)
        }));
      },

      updateCartItem: (productId, updates) => {
        set((state) => ({
          cartItems: state.cartItems.map(item =>
            item.productId === productId ? { ...item, ...updates } : item
          )
        }));
      },

      clearCart: () => set({ cartItems: [] }),
      setCartOpen: (open) => set({ cartOpen: open }),

      // Wishlist actions
      fetchWishlist: async () => {
        if (!get().isAuthenticated) return;
        
        try {
          const products = await apiService.getWishlist();
          set({ 
            wishlistProducts: products,
            wishlist: products.map((p: Product) => p.id)
          });
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      addToWishlist: async (productId) => {
        if (!get().isAuthenticated) return;
        
        try {
          await apiService.addToWishlist(productId);
          set((state) => ({
            wishlist: [...state.wishlist, productId]
          }));
          // Refresh wishlist
          get().fetchWishlist();
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      removeFromWishlist: async (productId) => {
        if (!get().isAuthenticated) return;
        
        try {
          await apiService.removeFromWishlist(productId);
          set((state) => ({
            wishlist: state.wishlist.filter(id => id !== productId),
            wishlistProducts: state.wishlistProducts.filter(p => p.id !== productId)
          }));
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      // Order actions
      fetchOrders: async () => {
        if (!get().isAuthenticated) return;
        
        set({ loading: true, error: null });
        try {
          const orders = await apiService.getOrders();
          set({ orders, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      createOrder: async (orderData) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.createOrder(orderData);
          set({ loading: false });
          // Clear cart after successful order
          get().clearCart();
          return response.orderId;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          return null;
        }
      },

      updateOrderStatus: async (orderId, statusData) => {
        set({ loading: true, error: null });
        try {
          await apiService.updateOrderStatus(orderId, statusData);
          set({ loading: false });
          // Refresh orders
          get().fetchOrders();
          return true;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          return false;
        }
      },

      // Category actions
      fetchCategories: async () => {
        try {
          const categories = await apiService.getCategories();
          set({ categories: categories.map((c: any) => c.name) });
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      // Search
      search: async (query) => {
        try {
          return await apiService.search(query);
        } catch (error: any) {
          set({ error: error.message });
          return { products: [], categories: [] };
        }
      },

      // UI actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'jewelry-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        cartItems: state.cartItems,
        wishlist: state.wishlist,
      }),
    }
  )
);