import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, X, ChevronDown, SlidersHorizontal, Search, Star, RotateCcw } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';
import { PRODUCTS, CATEGORIES } from '../data';
import { ProductCard, ProductSkeleton } from '../components/ProductCard';
import { useCart } from '../CartContext';
import { Toast } from '../components/Toast';
import { Product } from '../types';
import { cn, formatPrice } from '../lib/utils';

const PriceSlider: React.FC<{
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  max?: number;
}> = ({ value, onValueChange, max = 500 }) => {
  return (
    <Slider.Root
      className="relative flex items-center select-none touch-none w-full h-5"
      value={value}
      max={max}
      step={10}
      onValueChange={(val) => onValueChange(val as [number, number])}
    >
      <Slider.Track className="bg-stone-200 dark:bg-stone-800 relative grow rounded-full h-[3px]">
        <Slider.Range className="absolute bg-stone-900 dark:bg-white rounded-full h-full" />
      </Slider.Track>
      <Slider.Thumb
        className="block w-4 h-4 bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-white rounded-full hover:scale-110 focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-white transition-all cursor-pointer"
        aria-label="Min price"
      />
      <Slider.Thumb
        className="block w-4 h-4 bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-white rounded-full hover:scale-110 focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-white transition-all cursor-pointer"
        aria-label="Max price"
      />
    </Slider.Root>
  );
};

export const Shop: React.FC = () => {
  const { preferences, setPreferences, productReviews } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    const getDynamicRating = (product: Product) => {
      const initialReviews = product.reviews || [];
      const customReviews = productReviews[product.id] || [];
      const allReviews = [...initialReviews, ...customReviews];
      if (allReviews.length === 0) return product.rating;
      const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
      return parseFloat((sum / allReviews.length).toFixed(1));
    };

    let result = PRODUCTS.filter((product) => {
      const dynamicRating = getDynamicRating(product);
      const categoryMatch = preferences.categoryFilter === 'All' || product.category === preferences.categoryFilter;
      const priceMatch = product.price >= preferences.priceRange[0] && product.price <= preferences.priceRange[1];
      const ratingMatch = dynamicRating >= preferences.ratingFilter;
      const searchMatch = !searchQuery.trim() || 
                         product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && priceMatch && ratingMatch && searchMatch;
    });

    // Sorting
    if (preferences.sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (preferences.sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (preferences.sortBy === 'popularity') {
      result.sort((a, b) => getDynamicRating(b) - getDynamicRating(a));
    }

    return result;
  }, [preferences, searchQuery, productReviews]);

  const handleCategoryChange = (category: string) => {
    setPreferences(prev => ({ ...prev, categoryFilter: category }));
  };

  const handlePriceChange = (value: [number, number]) => {
    setPreferences(prev => ({ ...prev, priceRange: value }));
  };

  const handleRatingChange = (rating: number) => {
    setPreferences(prev => ({ ...prev, ratingFilter: prev.ratingFilter === rating ? 0 : rating }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferences(prev => ({ ...prev, sortBy: e.target.value as any }));
  };

  const clearAllFilters = () => {
    setPreferences(prev => ({
      ...prev,
      categoryFilter: 'All',
      priceRange: [0, 500],
      ratingFilter: 0,
      sortBy: 'popularity',
    }));
    setSearchQuery('');
  };

  const activeFiltersCount = [
    preferences.categoryFilter !== 'All',
    preferences.priceRange[0] > 0 || preferences.priceRange[1] < 500,
    preferences.ratingFilter > 0,
    searchQuery.trim().length > 0
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden md:block w-64 space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest dark:text-white">Filters</h3>
            {activeFiltersCount > 0 && (
              <button 
                onClick={clearAllFilters}
                className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-900 border-none rounded-xl py-3 pl-10 pr-10 text-sm focus:ring-2 focus:ring-stone-900 dark:focus:ring-white transition-all dark:text-white"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 dark:text-white">Categories</h3>
            <div className="space-y-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={cn(
                    "block text-sm transition-colors hover:text-stone-900 dark:hover:text-white",
                    preferences.categoryFilter === cat ? "text-stone-900 dark:text-white font-bold" : "text-stone-500 dark:text-stone-400"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 dark:text-white">Price Range</h3>
            <div className="space-y-6">
              <PriceSlider 
                value={preferences.priceRange}
                onValueChange={handlePriceChange}
              />
              <div className="flex justify-between text-xs font-bold text-stone-900 dark:text-white">
                <span>{formatPrice(preferences.priceRange[0])}</span>
                <span>{formatPrice(preferences.priceRange[1])}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 dark:text-white">Minimum Rating</h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingChange(star)}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    preferences.ratingFilter >= star 
                      ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900" 
                      : "bg-stone-50 dark:bg-stone-900 text-stone-300 dark:text-stone-700 hover:text-stone-400"
                  )}
                >
                  <Star className={cn("w-4 h-4", preferences.ratingFilter >= star && "fill-current")} />
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-serif italic dark:text-white">
              {preferences.categoryFilter === 'All' ? 'All Products' : preferences.categoryFilter}
              <span className="ml-3 text-sm font-sans not-italic text-stone-400 font-normal">
                ({filteredProducts.length} items)
              </span>
            </h1>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Sort by:</span>
                <select 
                  value={preferences.sortBy}
                  onChange={handleSortChange}
                  className="bg-transparent border-none text-sm font-bold text-stone-900 dark:text-white focus:ring-0 cursor-pointer"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="md:hidden flex items-center gap-2 text-sm font-bold border border-stone-200 dark:border-stone-800 px-4 py-2 rounded-full dark:text-white"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="w-4 h-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-[10px] rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active Filter Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {preferences.categoryFilter !== 'All' && (
              <button 
                onClick={() => handleCategoryChange('All')}
                className="inline-flex items-center gap-2 bg-stone-100 dark:bg-stone-900 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 transition-all"
              >
                Category: {preferences.categoryFilter}
                <X className="w-3 h-3" />
              </button>
            )}
            {(preferences.priceRange[0] > 0 || preferences.priceRange[1] < 500) && (
              <button 
                onClick={() => handlePriceChange([0, 500])}
                className="inline-flex items-center gap-2 bg-stone-100 dark:bg-stone-900 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 transition-all"
              >
                Price: {formatPrice(preferences.priceRange[0])} - {formatPrice(preferences.priceRange[1])}
                <X className="w-3 h-3" />
              </button>
            )}
            {preferences.ratingFilter > 0 && (
              <button 
                onClick={() => handleRatingChange(0)}
                className="inline-flex items-center gap-2 bg-stone-100 dark:bg-stone-900 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 transition-all"
              >
                Rating: {preferences.ratingFilter}+ Stars
                <X className="w-3 h-3" />
              </button>
            )}
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-2 bg-stone-100 dark:bg-stone-900 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 transition-all"
              >
                Search: "{searchQuery}"
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onAddToCart={() => setShowToast(true)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-20 bg-stone-50 dark:bg-stone-900 rounded-3xl">
                  <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-stone-300 dark:text-stone-600" />
                  </div>
                  <h3 className="text-xl font-serif italic mb-2 dark:text-white">No products found</h3>
                  <p className="text-stone-500 dark:text-stone-400 mb-8 max-w-xs mx-auto">
                    Try adjusting your filters or search terms to find what you're looking for.
                  </p>
                  <button 
                    onClick={clearAllFilters}
                    className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-8 py-3 rounded-full font-bold hover:scale-105 transition-all"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 md:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-stone-950 z-50 p-8 md:hidden flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-serif italic dark:text-white">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="dark:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-10 no-scrollbar pb-24">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input 
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-900 border-none rounded-xl py-3 pl-10 pr-10 text-sm focus:ring-2 focus:ring-stone-900 dark:focus:ring-white transition-all dark:text-white"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-6 dark:text-white">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm border transition-all",
                          preferences.categoryFilter === cat 
                            ? "bg-stone-900 dark:bg-white border-stone-900 dark:border-white text-white dark:text-stone-900" 
                            : "border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-6 dark:text-white">Price Range</h3>
                  <div className="space-y-6">
                    <PriceSlider 
                      value={preferences.priceRange}
                      onValueChange={handlePriceChange}
                    />
                    <div className="flex justify-between text-xs font-bold text-stone-900 dark:text-white">
                      <span>{formatPrice(preferences.priceRange[0])}</span>
                      <span>{formatPrice(preferences.priceRange[1])}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-6 dark:text-white">Minimum Rating</h3>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingChange(star)}
                        className={cn(
                          "p-3 rounded-xl transition-all",
                          preferences.ratingFilter >= star 
                            ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900" 
                            : "bg-stone-50 dark:bg-stone-900 text-stone-300 dark:text-stone-700"
                        )}
                      >
                        <Star className={cn("w-5 h-5", preferences.ratingFilter >= star && "fill-current")} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-6 dark:text-white">Sort By</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {['popularity', 'price-low', 'price-high'].map((option) => (
                      <button
                        key={option}
                        onClick={() => setPreferences(prev => ({ ...prev, sortBy: option as any }))}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all",
                          preferences.sortBy === option 
                            ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900" 
                            : "bg-stone-50 dark:bg-stone-900 text-stone-500 dark:text-stone-400"
                        )}
                      >
                        {option === 'popularity' ? 'Popularity' : 
                         option === 'price-low' ? 'Price: Low to High' : 'Price: High to Low'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsFilterOpen(false)}
                className="absolute bottom-8 left-8 right-8 bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-4 rounded-full font-bold shadow-xl"
              >
                Show {filteredProducts.length} Results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Toast 
        message="Added to cart successfully!" 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </div>
  );
};

export default Shop;
