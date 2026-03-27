import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Star, RotateCcw } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';
import { PRODUCTS, CATEGORIES } from '../data';
import { ProductCard, ProductSkeleton } from '../components/ProductCard';
import { useCart } from '../CartContext';
import { Toast } from '../components/Toast';
import { Product } from '../types';
import { cn, formatPrice } from '../lib/utils';

const PriceSlider = ({
  value,
  onValueChange,
  max = 500,
}: {
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  max?: number;
}) => (
  <Slider.Root
    className="relative flex items-center select-none touch-none w-full h-5"
    value={value}
    max={max}
    step={10}
    onValueChange={val => onValueChange(val as [number, number])}
  >
    <Slider.Track className="bg-muted relative grow rounded-full h-[3px]">
      <Slider.Range className="absolute bg-stone-900 dark:bg-white rounded-full h-full" />
    </Slider.Track>
    <Slider.Thumb
      className="block w-4 h-4 bg-background border-2 border-stone-900 dark:border-white rounded-full hover:scale-110 focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-white transition-all cursor-pointer"
      aria-label="Min price"
    />
    <Slider.Thumb
      className="block w-4 h-4 bg-background border-2 border-stone-900 dark:border-white rounded-full hover:scale-110 focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-white transition-all cursor-pointer"
      aria-label="Max price"
    />
  </Slider.Root>
);

const Shop = () => {
  const { preferences, setPreferences, productReviews } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const getDynamicRating = (product: Product) => {
    const allReviews = [...(product.reviews || []), ...(productReviews[product.id] || [])];
    if (allReviews.length === 0) return product.rating;
    return parseFloat((allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length).toFixed(1));
  };

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter(product => {
      const dynamicRating = getDynamicRating(product);
      const categoryMatch = preferences.categoryFilter === 'All' || product.category === preferences.categoryFilter;
      const priceMatch = product.price >= preferences.priceRange[0] && product.price <= preferences.priceRange[1];
      const ratingMatch = dynamicRating >= preferences.ratingFilter;
      const searchMatch =
        !searchQuery.trim() ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && priceMatch && ratingMatch && searchMatch;
    });

    if (preferences.sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (preferences.sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    else result.sort((a, b) => getDynamicRating(b) - getDynamicRating(a));

    return result;
  }, [preferences, searchQuery, productReviews]);

  const activeFilterCount =
    (preferences.categoryFilter !== 'All' ? 1 : 0) +
    (preferences.priceRange[0] > 0 || preferences.priceRange[1] < 500 ? 1 : 0) +
    (preferences.ratingFilter > 0 ? 1 : 0);

  const resetFilters = () => {
    setPreferences(prev => ({
      ...prev,
      categoryFilter: 'All',
      priceRange: [0, 500],
      ratingFilter: 0,
      sortBy: 'popularity',
    }));
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-serif italic text-foreground mb-4">The Collection</h1>
        <p className="text-muted-foreground">Explore our full range of minimalist home goods.</p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex gap-3 mb-8">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            data-testid="input-search"
            className="w-full bg-muted border border-border rounded-2xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-foreground transition-colors text-foreground placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setIsFilterOpen(true)}
          data-testid="button-open-filter"
          className="flex items-center gap-2 bg-muted border border-border px-5 py-3 rounded-2xl text-sm font-bold text-foreground hover:bg-border transition-all"
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:block">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            data-testid="button-reset-filters"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:block">Reset</span>
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setPreferences(prev => ({ ...prev, categoryFilter: cat }))}
            data-testid={`button-category-${cat}`}
            className={cn(
              'whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all',
              preferences.categoryFilter === cat
                ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900'
                : 'bg-muted text-muted-foreground hover:text-foreground border border-border'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-6">
        {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
      </p>

      {/* Product Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-muted rounded-3xl">
          <p className="text-foreground font-bold mb-2">No products found</p>
          <p className="text-muted-foreground text-sm">Try adjusting your filters or search query.</p>
          <button onClick={resetFilters} className="mt-6 text-sm font-bold underline text-foreground">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={() => setShowToast(true)} />
          ))}
        </div>
      )}

      {/* Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-background z-[70] shadow-2xl flex flex-col overflow-y-auto no-scrollbar"
            >
              <div className="p-8 border-b border-border flex items-center justify-between sticky top-0 bg-background z-10">
                <h2 className="text-xl font-serif italic text-foreground">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              <div className="p-8 space-y-10 flex-1">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-foreground">Categories</h3>
                  <div className="space-y-3">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setPreferences(prev => ({ ...prev, categoryFilter: cat }))}
                        className={cn(
                          'block text-sm transition-colors hover:text-foreground',
                          preferences.categoryFilter === cat ? 'text-foreground font-bold' : 'text-muted-foreground'
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-foreground">Price Range</h3>
                  <PriceSlider
                    value={preferences.priceRange}
                    onValueChange={val => setPreferences(prev => ({ ...prev, priceRange: val }))}
                  />
                  <div className="flex justify-between text-xs font-bold text-foreground mt-4">
                    <span>{formatPrice(preferences.priceRange[0])}</span>
                    <span>{formatPrice(preferences.priceRange[1])}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-foreground">Minimum Rating</h3>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setPreferences(prev => ({ ...prev, ratingFilter: prev.ratingFilter === star ? 0 : star }))}
                        data-testid={`button-rating-${star}`}
                        className={cn(
                          'p-2 rounded-lg transition-all',
                          preferences.ratingFilter >= star
                            ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900'
                            : 'bg-muted text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <Star className={cn('w-5 h-5', preferences.ratingFilter >= star && 'fill-current')} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-foreground">Sort By</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {(['popularity', 'price-low', 'price-high'] as const).map(option => (
                      <button
                        key={option}
                        onClick={() => setPreferences(prev => ({ ...prev, sortBy: option }))}
                        data-testid={`button-sort-${option}`}
                        className={cn(
                          'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all',
                          preferences.sortBy === option
                            ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {option === 'popularity' ? 'Popularity' : option === 'price-low' ? 'Price: Low to High' : 'Price: High to Low'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-border sticky bottom-0 bg-background">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  data-testid="button-apply-filter"
                  className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-4 rounded-full font-bold shadow-xl hover:bg-stone-800 dark:hover:bg-stone-100 transition-all"
                >
                  Show {filteredProducts.length} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Toast message="Added to cart successfully!" isVisible={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default Shop;
