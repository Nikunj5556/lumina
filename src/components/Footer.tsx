import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="text-3xl font-serif italic font-bold">Lumina</Link>
            <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
              Curating the finest minimalist home essentials for the modern lifestyle. 
              Quality, elegance, and simplicity in every piece.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-stone-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-stone-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-stone-400 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-8">Shop</h4>
            <ul className="space-y-4 text-sm text-stone-400">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Featured</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Best Sellers</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-8">Company</h4>
            <ul className="space-y-4 text-sm text-stone-400">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Sustainability</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-8">Newsletter</h4>
            <p className="text-sm text-stone-400 mb-6">Join our list for exclusive offers and design inspiration.</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-stone-800 border-none rounded-full px-4 py-2 text-sm flex-1 focus:ring-1 focus:ring-white transition-all"
              />
              <button className="bg-white text-stone-900 p-2 rounded-full hover:bg-stone-200 transition-all">
                <Mail className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-10 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-stone-500">© 2026 Lumina Store. All rights reserved.</p>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold text-stone-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Shipping Info</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
