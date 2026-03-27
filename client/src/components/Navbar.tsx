import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingBag, Menu, X, User, Heart, Moon, Sun, Search } from 'lucide-react';
import { useCart } from '../CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export const Navbar = () => {
  const { totalItems, userProfile, wishlist, preferences, setPreferences, setIsCartOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

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
  ];

  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-border/60 dark:bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-serif italic font-bold tracking-tight text-foreground">Lumina</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground",
                  location === link.path ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={toggleTheme}
              data-testid="button-toggle-theme"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary"
            >
              {preferences.theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Wishlist - hidden on mobile (shown in bottom nav) */}
            <Link
              href="/wishlist"
              data-testid="link-wishlist"
              className="hidden md:flex p-2 text-muted-foreground hover:text-foreground transition-colors relative rounded-full hover:bg-secondary"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* User - hidden on mobile (shown in bottom nav) */}
            <Link
              href={userProfile ? "/profile" : "/auth"}
              data-testid="link-profile"
              className="hidden md:flex items-center gap-2 p-2 text-muted-foreground hover:text-foreground transition-colors group rounded-full hover:bg-secondary"
            >
              {userProfile?.avatar ? (
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-6 h-6 rounded-full border border-border"
                />
              ) : (
                <User className="w-5 h-5" />
              )}
              <span className="hidden lg:block text-xs font-bold uppercase tracking-widest">
                {userProfile ? userProfile.name.split(' ')[0] : 'Sign In'}
              </span>
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              data-testid="button-cart"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors relative rounded-full hover:bg-secondary"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-foreground text-background text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile hamburger - hidden on md and up, since we use BottomNav */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-6 py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex py-3 text-base font-medium transition-colors",
                    location === link.path ? "text-foreground" : "text-muted-foreground"
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
