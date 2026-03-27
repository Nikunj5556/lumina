import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { formatPrice, cn } from '../lib/utils';
import { motion } from 'motion/react';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useCart } from '../CartContext';

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { addToCart, wishlist, toggleWishlist, setIsCartOpen, productReviews } = useCart();
  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = product.stock === 0;

  const dynamicRating = React.useMemo(() => {
    const initialReviews = product.reviews || [];
    const customReviews = productReviews[product.id] || [];
    const allReviews = [...initialReviews, ...customReviews];
    if (allReviews.length === 0) return product.rating;
    const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
    return parseFloat((sum / allReviews.length).toFixed(1));
  }, [product, productReviews]);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    
    addToCart({ ...product, quantity: 1 });
    if (onAddToCart) onAddToCart();
    setIsCartOpen(true);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-[4/5] overflow-hidden relative">
          <img
            src={product.image}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
              isOutOfStock && "grayscale opacity-60"
            )}
            referrerPolicy="no-referrer"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <span className="bg-stone-900 dark:bg-white dark:text-stone-900 text-white text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded">
                New
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-red-500 text-white text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded">
                Sold Out
              </span>
            )}
            {!isOutOfStock && product.stock < 5 && (
              <span className="bg-amber-500 text-white text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded">
                Only {product.stock} Left
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleWishlist}
              className={cn(
                "p-2.5 rounded-full shadow-lg backdrop-blur-md transition-all active:scale-95",
                isWishlisted 
                  ? "bg-red-500 text-white" 
                  : "bg-white/90 dark:bg-stone-800/90 text-stone-600 dark:text-stone-300 hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-stone-900"
              )}
            >
              <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
            </button>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={cn(
              "absolute bottom-4 right-4 p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 active:scale-95",
              isOutOfStock 
                ? "bg-stone-200 text-stone-400 cursor-not-allowed dark:bg-stone-800 dark:text-stone-600" 
                : "bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm text-stone-900 dark:text-white hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-stone-900"
            )}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <p className="text-xs text-stone-400 uppercase tracking-wider font-medium">{product.category}</p>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-bold text-stone-600 dark:text-stone-400">{dynamicRating}</span>
            </div>
          </div>
          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200 line-clamp-1 mb-2 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">{product.name}</h3>
          <p className="text-base font-bold text-stone-900 dark:text-white">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export const ProductSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-800 animate-pulse">
    <div className="aspect-[4/5] bg-stone-200 dark:bg-stone-800" />
    <div className="p-4 space-y-3">
      <div className="flex justify-between">
        <div className="h-3 w-16 bg-stone-200 dark:bg-stone-800 rounded" />
        <div className="h-3 w-8 bg-stone-200 dark:bg-stone-800 rounded" />
      </div>
      <div className="h-4 w-3/4 bg-stone-200 dark:bg-stone-800 rounded" />
      <div className="h-5 w-1/4 bg-stone-200 dark:bg-stone-800 rounded" />
    </div>
  </div>
);
