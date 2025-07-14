import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  customersChange: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  date: string;
}

interface TopProduct {
  id: string;
  name: string;
  price: number;
  reviewCount: number;
  image: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    revenueChange: 0,
    ordersChange: 0,
    productsChange: 0,
    customersChange: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/dashboard');
        const data = response.data;
        
        setStats({
          totalRevenue: data.stats.totalRevenue,
          totalOrders: data.stats.totalOrders,
          totalProducts: data.stats.totalProducts,
          totalCustomers: data.stats.totalCustomers,
          revenueChange: 12.5, // You would calculate this from API
          ordersChange: 8.2,
          productsChange: 2.1,
          customersChange: 15.3,
        });

        setRecentOrders(data.recentOrders.map((order: any) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          total: order.total,
          status: order.status,
          date: order.createdAt
        })));

        setTopProducts(data.topProducts.map((product: any) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          reviewCount: product.reviewCount,
          image: product.images?.[0] || ''
        })));

      } catch (error) {
        toast.error('Failed to load dashboard data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeframe]);

  const StatCard = ({ title, value, change, icon: Icon, isPositive }: any) => (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-luxury-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-luxury-600">{title}</p>
          <p className="text-2xl font-bold text-luxury-800 mt-1">
            {title.includes('Revenue') ? `$${value.toLocaleString()}` : value.toLocaleString()}
          </p>
        </div>
        <div className="p-3 bg-gold-100 rounded-lg">
          <Icon className="h-6 w-6 text-gold-600" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {isPositive ? (
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {change}%
        </span>
        <span className="text-sm text-luxury-600 ml-1">vs last {timeframe}</span>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p className="mt-4 text-luxury-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-luxury-800">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-luxury-600 mt-2">
            Here's what's happening with your jewelry store today.
          </p>
        </motion.div>

        {/* Time Frame Selector */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {['7d', '30d', '90d', '1y'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-2 text-sm rounded-lg ${
                  timeframe === period
                    ? 'bg-gold-500 text-white'
                    : 'bg-white text-luxury-600 border border-luxury-200 hover:bg-luxury-50'
                }`}
              >
                {period === '7d' && 'Last 7 Days'}
                {period === '30d' && 'Last 30 Days'}
                {period === '90d' && 'Last 90 Days'}
                {period === '1y' && 'Last Year'}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={stats.totalRevenue}
            change={stats.revenueChange}
            icon={DollarSign}
            isPositive={stats.revenueChange > 0}
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            change={stats.ordersChange}
            icon={ShoppingCart}
            isPositive={stats.ordersChange > 0}
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            change={stats.productsChange}
            icon={Package}
            isPositive={stats.productsChange > 0}
          />
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers}
            change={stats.customersChange}
            icon={Users}
            isPositive={stats.customersChange > 0}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border border-luxury-200"
          >
            <div className="p-6 border-b border-luxury-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-luxury-800">Recent Orders</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/admin/orders')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
            </div>
            <div className="p-0">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-6 border-b border-luxury-100 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-luxury-800">{order.customerName}</p>
                      <p className="text-sm text-luxury-600">Order #{order.orderNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-luxury-800">
                        ${order.total.toLocaleString()}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border border-luxury-200"
          >
            <div className="p-6 border-b border-luxury-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-luxury-800">Top Products</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/admin/products')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>
            <div className="p-0">
              {topProducts.map((product, index) => (
                <div key={product.id} className="p-6 border-b border-luxury-100 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-luxury-800 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-luxury-600">
                        {product.reviewCount} reviews
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-luxury-800">
                        ${product.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-luxury-600">
                        #{index + 1}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white rounded-xl shadow-sm border border-luxury-200 p-6"
        >
          <h3 className="text-lg font-semibold text-luxury-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={() => navigate('/admin/products/new')}
            >
              <Package className="h-5 w-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Add Product</p>
                <p className="text-sm text-luxury-600">Create new jewelry listing</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={() => navigate('/admin/orders')}
            >
              <ShoppingCart className="h-5 w-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">View Orders</p>
                <p className="text-sm text-luxury-600">Manage customer orders</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={() => navigate('/admin/customers')}
            >
              <Users className="h-5 w-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Customer List</p>
                <p className="text-sm text-luxury-600">View customer database</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={() => navigate('/admin/analytics')}
            >
              <BarChart3 className="h-5 w-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Analytics</p>
                <p className="text-sm text-luxury-600">View detailed reports</p>
              </div>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;