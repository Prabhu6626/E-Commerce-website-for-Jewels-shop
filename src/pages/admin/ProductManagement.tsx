import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Upload } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  inStock: boolean;
  stockQuantity: number;
  preOrder: boolean;
  estimatedDispatch?: string;
  materials: string[];
  sizes: string[];
  colors: string[];
  tags: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
}

const ProductManagement: React.FC = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    inStock: true,
    stockQuantity: '',
    preOrder: false,
    estimatedDispatch: '',
    materials: '',
    sizes: '',
    colors: '',
    tags: '',
    isFeatured: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsResponse = await axios.get('/api/products');
        const productsData = productsResponse.data.products.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          originalPrice: p.originalPrice,
          category: p.category,
          inStock: p.inStock,
          stockQuantity: p.stockQuantity,
          preOrder: p.preOrder,
          estimatedDispatch: p.estimatedDispatch,
          materials: p.materials,
          sizes: p.sizes,
          colors: p.colors,
          tags: p.tags,
          images: p.images,
          rating: p.rating,
          reviewCount: p.reviewCount,
          isFeatured: p.isFeatured
        }));
        
        setProducts(productsData);
        
        // Fetch categories
        const categoriesResponse = await axios.get('/api/categories');
        setCategories(categoriesResponse.data.map((c: any) => c.name));
        
      } catch (error) {
        toast.error('Failed to fetch data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(files);
      
      // Create preview URLs
      const previews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('originalPrice', formData.originalPrice);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('inStock', String(formData.inStock));
      formDataToSend.append('stockQuantity', formData.stockQuantity);
      formDataToSend.append('preOrder', String(formData.preOrder));
      formDataToSend.append('estimatedDispatch', formData.estimatedDispatch);
      formDataToSend.append('materials', formData.materials);
      formDataToSend.append('sizes', formData.sizes);
      formDataToSend.append('colors', formData.colors);
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('isFeatured', String(formData.isFeatured));
      
      // Append image files
      imageFiles.forEach((file, index) => {
        formDataToSend.append(`image${index}`, file);
      });
      
      let response;
      if (editingProduct) {
        response = await axios.put(`/api/admin/products/${editingProduct.id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.post('/api/admin/products', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      toast.success(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
      resetForm();
      
      // Refresh product list
      const productsResponse = await axios.get('/api/products');
      setProducts(productsResponse.data.products);
      
    } catch (error) {
      toast.error('Failed to save product');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: '',
      inStock: true,
      stockQuantity: '',
      preOrder: false,
      estimatedDispatch: '',
      materials: '',
      sizes: '',
      colors: '',
      tags: '',
      isFeatured: false
    });
    setImageFiles([]);
    setPreviewImages([]);
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity.toString(),
      preOrder: product.preOrder,
      estimatedDispatch: product.estimatedDispatch || '',
      materials: product.materials.join(', '),
      sizes: product.sizes.join(', '),
      colors: product.colors.join(', '),
      tags: product.tags.join(', '),
      isFeatured: product.isFeatured
    });
    setPreviewImages(product.images);
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        await axios.delete(`/api/admin/products/${productId}`);
        toast.success('Product deleted successfully!');
        
        // Refresh product list
        const productsResponse = await axios.get('/api/products');
        setProducts(productsResponse.data.products);
        
      } catch (error) {
        toast.error('Failed to delete product');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && !showForm) {
    return (
      <div className="min-h-screen bg-luxury-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p className="mt-4 text-luxury-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-luxury-800">Product Management</h1>
            <p className="text-luxury-600 mt-2">Manage your jewelry inventory</p>
          </div>
          <Button onClick={() => {
            resetForm();
            setShowForm(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-luxury-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-luxury-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-luxury-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-luxury-400" />
              <span className="text-sm text-luxury-600">
                {filteredProducts.length} products found
              </span>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-luxury-200">
              <thead className="bg-luxury-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-luxury-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-luxury-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-luxury-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-luxury-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-luxury-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-luxury-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-luxury-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-luxury-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.images[0] || '/placeholder.jpg'}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-luxury-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-luxury-500">
                            {product.description.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-luxury-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-luxury-900">
                        ${product.price.toLocaleString()}
                      </div>
                      {product.originalPrice && (
                        <div className="text-sm text-luxury-500 line-through">
                          ${product.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-luxury-900">
                      {product.stockQuantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.inStock 
                          ? 'bg-green-100 text-green-800' 
                          : product.preOrder
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? 'In Stock' : product.preOrder ? 'Pre-Order' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-gold-600 hover:text-gold-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-luxury-800 mb-6">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-luxury-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-luxury-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-luxury-700 mb-2">
                        Category *
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-luxury-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-luxury-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-luxury-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-luxury-700 mb-2">
                        Price *
                      </label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full px-3 py-2 border border-luxury-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-luxury-700 mb-2">
                        Original Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                        className="w-full px-3 py-2 border border-luxury-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-luxury-700 mb-2">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stockQuantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: e.target.value }))}
                        className="w-full px-3 py-2 border border-luxury-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-luxury-700 mb-2">
                        Materials (comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.materials}
                        onChange={(e) => setFormData(prev => ({ ...prev, materials: e.target.value }))}
                        className="w-full px-3 py-2 border border-luxury-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                        placeholder="Gold, Silver, Diamond"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-luxury-700 mb-2">
                        Sizes (comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.sizes}
                        onChange={(e) => setFormData(prev => ({ ...prev, sizes: e.target.value }))}
                        className="w-full px-3 py-2 border border-luxury-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                        placeholder="Small, Medium, Large"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-luxury-700 mb-2">
                        Colors (comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.colors}
                        onChange={(e) => setFormData(prev => ({ ...prev, colors: e.target.value }))}
                        className="w-full px-3 py-2 border border-luxury-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                        placeholder="Gold, Silver, Rose Gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-luxury-700 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-3 py-2 border border-luxury-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                      placeholder="luxury, wedding, gift"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-luxury-700 mb-2">
                      Product Images
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-luxury-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                    
                    {/* Image previews */}
                    <div className="mt-4 flex flex-wrap gap-4">
                      {previewImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Preview ${index}`}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="inStock"
                        checked={formData.inStock}
                        onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                        className="h-4 w-4 text-gold-600 focus:ring-gold-500 border-luxury-300 rounded"
                      />
                      <label htmlFor="inStock" className="ml-2 block text-sm text-luxury-900">
                        In Stock
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="preOrder"
                        checked={formData.preOrder}
                        onChange={(e) => setFormData(prev => ({ ...prev, preOrder: e.target.checked }))}
                        className="h-4 w-4 text-gold-600 focus:ring-gold-500 border-luxury-300 rounded"
                      />
                      <label htmlFor="preOrder" className="ml-2 block text-sm text-luxury-900">
                        Pre-Order Available
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                        className="h-4 w-4 text-gold-600 focus:ring-gold-500 border-luxury-300 rounded"
                      />
                      <label htmlFor="isFeatured" className="ml-2 block text-sm text-luxury-900">
                        Featured Product
                      </label>
                    </div>
                  </div>

                  {formData.preOrder && (
                    <div>
                      <label className="block text-sm font-medium text-luxury-700 mb-2">
                        Estimated Dispatch Date
                      </label>
                      <input
                        type="date"
                        value={formData.estimatedDispatch}
                        onChange={(e) => setFormData(prev => ({ ...prev, estimatedDispatch: e.target.value }))}
                        className="w-full px-3 py-2 border border-luxury-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                  )}

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      loading={loading}
                    >
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;