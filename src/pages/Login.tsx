import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useStore } from '../store/useStore';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useStore();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    const success = await login(data.email, data.password);
    if (success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-luxury-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <Crown className="h-10 w-10 text-gold-500" />
            <span className="font-display text-3xl font-bold text-luxury-800">
              LuxeJewels
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-luxury-800">
            Welcome back
          </h2>
          <p className="mt-2 text-luxury-600">
            Sign in to your account to continue shopping
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-luxury-700 mb-1">
                Email Address
              </label>
              <input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Please enter a valid email'
                  }
                })}
                type="email"
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-500 ${
                  errors.email ? 'border-red-500' : 'border-luxury-300'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-luxury-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-500 ${
                    errors.password ? 'border-red-500' : 'border-luxury-300'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-luxury-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-luxury-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-gold-500 focus:ring-gold-500 border-luxury-300 rounded"
              />
              <span className="ml-2 text-sm text-luxury-600">Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-sm text-gold-500 hover:text-gold-600"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="lg"
          >
            Sign In
          </Button>

          <div className="text-center">
            <p className="text-sm text-luxury-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-gold-500 hover:text-gold-600 font-medium">
                Sign up here
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-luxury-50 rounded-lg">
            <h4 className="text-sm font-medium text-luxury-700 mb-2">Demo Credentials:</h4>
            <div className="text-xs text-luxury-600 space-y-1">
              <p><strong>Customer:</strong> customer@demo.com / password123</p>
              <p><strong>Admin:</strong> admin@jewelry.com / admin123</p>
            </div>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Login;