import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, Heart, Moon, Sun } from 'lucide-react';
import { useCart } from '../CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const Navbar: React.FC = () => {
  const { totalItems, userProfile, wishlist, preferences, setPreferences, setIsCartOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleTheme = () => {
    setPreferences(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Orders', path: '/orders' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full glass dark:bg-stone-900/80 border-b border-stone-200 dark:border-stone-800 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-serif italic font-bold tracking-tight text-stone-900 dark:text-white">Lumina</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-stone-900 dark:hover:text-white",
                  location.pathname === link.path ? "text-stone-900 dark:text-white" : "text-stone-500 dark:text-stone-400"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              {preferences.theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button className="hidden sm:block p-2 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/wishlist" className="p-2 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors relative">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-bold w-3 h-3 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link 
              to={userProfile ? "/profile" : "/auth"} 
              className="flex items-center gap-2 p-2 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors group"
            >
              {userProfile?.avatar ? (
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.name} 
                  className="w-6 h-6 rounded-full border border-stone-200 dark:border-stone-800 group-hover:border-stone-900 dark:group-hover:border-white transition-colors"
                />
              ) : (
                <User className="w-5 h-5" />
              )}
              <span className="hidden lg:block text-xs font-bold uppercase tracking-widest">
                {userProfile ? userProfile.name.split(' ')[0] : 'Sign In'}
              </span>
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button 
              className="md:hidden p-2 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "block text-lg font-medium transition-colors",
                    location.pathname === link.path ? "text-stone-900 dark:text-white" : "text-stone-500 dark:text-stone-400"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
