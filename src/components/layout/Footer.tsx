import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-luxury-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Crown className="h-8 w-8 text-gold-500" />
              <span className="font-display text-2xl font-bold">LuxeJewels</span>
            </Link>
            <p className="text-luxury-300 text-sm">
              Crafting timeless elegance with the finest jewelry pieces. 
              Your trusted partner for life's precious moments.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-luxury-400 hover:text-gold-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-luxury-400 hover:text-gold-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-luxury-400 hover:text-gold-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-luxury-300 hover:text-gold-500 transition-colors text-sm">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-luxury-300 hover:text-gold-500 transition-colors text-sm">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-luxury-300 hover:text-gold-500 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-luxury-300 hover:text-gold-500 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shipping" className="text-luxury-300 hover:text-gold-500 transition-colors text-sm">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-luxury-300 hover:text-gold-500 transition-colors text-sm">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-luxury-300 hover:text-gold-500 transition-colors text-sm">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="/care" className="text-luxury-300 hover:text-gold-500 transition-colors text-sm">
                  Jewelry Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Info</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gold-500" />
                <span className="text-luxury-300 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gold-500" />
                <span className="text-luxury-300 text-sm">info@luxejewels.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gold-500" />
                <span className="text-luxury-300 text-sm">123 Jewelry Ave, NYC 10001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-8 pt-8 border-t border-luxury-700">
          <div className="max-w-md mx-auto text-center">
            <h3 className="font-semibold text-lg mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-luxury-300 text-sm mb-4">
              Get the latest updates on new collections and exclusive offers
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-luxury-700 border border-luxury-600 rounded-l-lg text-white placeholder-luxury-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <button className="px-6 py-2 bg-gold-500 text-white rounded-r-lg hover:bg-gold-600 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-luxury-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-luxury-400 text-sm">
            © 2024 LuxeJewels. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-luxury-400 hover:text-gold-500 transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-luxury-400 hover:text-gold-500 transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;