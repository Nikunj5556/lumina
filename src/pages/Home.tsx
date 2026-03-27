import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { PRODUCTS } from '../data';
import { ProductCard } from '../components/ProductCard';
import { Toast } from '../components/Toast';
import { useCart } from '../CartContext';

export const Home: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const { recentlyViewed } = useCart();
  
  const featuredProducts = useMemo(() => PRODUCTS.filter(p => p.isFeatured).slice(0, 4), []);
  
  const recentlyViewedProducts = useMemo(() => {
    return recentlyViewed
      .map(id => PRODUCTS.find(p => p.id === id))
      .filter((p): p is typeof PRODUCTS[0] => !!p)
      .slice(0, 4);
  }, [recentlyViewed]);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000"
            alt="Hero"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-stone-900/40" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="text-xs uppercase tracking-[0.3em] font-bold mb-4 block">New Collection 2026</span>
            <h1 className="text-6xl md:text-8xl font-serif italic leading-tight mb-8">
              Elevate Your <br /> Living Space
            </h1>
            <p className="text-lg text-stone-200 mb-10 max-w-lg leading-relaxed">
              Discover our curated collection of minimalist home essentials designed for modern living and timeless elegance.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-white text-stone-900 px-8 py-4 rounded-full font-bold hover:bg-stone-100 transition-all group"
            >
              Shop Collection
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'On all orders over $150' },
            { icon: ShieldCheck, title: 'Secure Payment', desc: '100% secure checkout process' },
            { icon: RotateCcw, title: 'Easy Returns', desc: '30-day hassle-free return policy' },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-stone-100 dark:bg-stone-900 rounded-full flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-stone-800 dark:text-stone-200" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">{feature.title}</h3>
              <p className="text-stone-500 dark:text-stone-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-serif italic mb-2 dark:text-white">Featured Pieces</h2>
            <p className="text-stone-500 dark:text-stone-400">Handpicked items for your home</p>
          </div>
          <Link to="/shop" className="text-sm font-bold border-b-2 border-stone-900 dark:border-white dark:text-white pb-1 hover:text-stone-600 dark:hover:text-stone-300 hover:border-stone-600 dark:hover:border-stone-300 transition-all">
            View All Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={() => setShowToast(true)}
            />
          ))}
        </div>
      </section>

      {/* Recently Viewed */}
      {recentlyViewedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-serif italic mb-2 dark:text-white">Recently Viewed</h2>
              <p className="text-stone-500 dark:text-stone-400">Pick up where you left off</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recentlyViewedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={() => setShowToast(true)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-[500px] rounded-3xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=2000"
            alt="Banner"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-4xl md:text-5xl font-serif italic text-white mb-6">The Art of Minimalist Living</h2>
            <p className="text-white/80 max-w-xl mb-8">
              "Design is not just what it looks like and feels like. Design is how it works."
            </p>
            <Link to="/shop" className="bg-white text-stone-900 px-8 py-3 rounded-full font-bold hover:bg-stone-100 transition-all">
              Explore Our Story
            </Link>
          </div>
        </div>
      </section>

      <Toast 
        message="Added to cart successfully!" 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </div>
  );
};

export default Home;
