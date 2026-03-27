import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Star, Minus, Plus, ShoppingBag, Truck, ShieldCheck, RotateCcw, Heart, Share2, Check, User, MessageSquare } from 'lucide-react';
import { PRODUCTS } from '../data';
import { formatPrice, cn } from '../lib/utils';
import { useCart } from '../CartContext';
import { Toast } from '../components/Toast';
import { ProductReview } from '../types';

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist, addToRecentlyViewed, setIsCartOpen, userProfile, productReviews, addProductReview } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedImage, setSelectedImage] = useState(0);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const product = PRODUCTS.find(p => p.id === id);

  const allReviews = useMemo(() => {
    if (!product) return [];
    const initialReviews = product.reviews || [];
    const customReviews = productReviews[product.id] || [];
    return [...initialReviews, ...customReviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [product, productReviews]);

  const dynamicRating = useMemo(() => {
    if (allReviews.length === 0) return product?.rating || 0;
    const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
    return parseFloat((sum / allReviews.length).toFixed(1));
  }, [allReviews, product]);

  const reviewsCount = allReviews.length;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      addToRecentlyViewed(id);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif italic mb-4 dark:text-white">Product not found</h2>
        <Link to="/shop" className="text-stone-900 dark:text-white font-bold border-b-2 border-stone-900 dark:border-white">
          Back to Shop
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);

  const priceModifier = product.variants?.reduce((acc, v) => {
    if (selectedVariants[v.type] === v.name) {
      return acc + (v.priceModifier || 0);
    }
    return acc;
  }, 0) || 0;
  
  const displayPrice = product.price + priceModifier;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    
    addToCart({ 
      ...product, 
      price: displayPrice,
      quantity,
      selectedVariants: Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined
    });
    setShowToast(true);
    setIsCartOpen(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim() || !product) return;
    
    setIsSubmittingReview(true);
    // Simulate API call
    setTimeout(() => {
      const newReview: ProductReview = {
        id: Math.random().toString(36).substr(2, 9),
        userName: userProfile?.name || 'Anonymous User',
        rating: reviewRating,
        comment: reviewComment,
        date: new Date().toISOString()
      };
      
      addProductReview(product.id, newReview);
      
      setReviewComment('');
      setReviewRating(5);
      setIsSubmittingReview(false);
      setShowReviewForm(false);
    }, 1000);
  };

  const sizes = Array.from(new Set(product.variants?.filter(v => v.type === 'size').map(v => v.name)));
  const colors = Array.from(new Set(product.variants?.filter(v => v.type === 'color').map(v => v.name)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image Gallery */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-stone-100 dark:bg-stone-900 cursor-zoom-in group"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={product.images?.[selectedImage] || product.image}
              alt={product.name}
              className={cn(
                "w-full h-full object-cover transition-transform duration-500",
                isZoomed ? "scale-150" : "scale-100"
              )}
              style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
              referrerPolicy="no-referrer"
            />
            
            <button 
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product.id);
              }}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/80 dark:bg-stone-800/80 backdrop-blur-md shadow-sm hover:scale-110 transition-all active:scale-95 z-10"
            >
              <Heart className={cn("w-5 h-5", isWishlisted ? "fill-red-500 text-red-500" : "text-stone-600 dark:text-stone-300")} />
            </button>
          </motion.div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={cn(
                    "aspect-square rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-900 border-2 transition-all",
                    selectedImage === idx ? "border-stone-900 dark:border-white scale-105" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-stone-400">{product.category}</p>
              <button className="text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif italic text-stone-900 dark:text-white mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "w-4 h-4", 
                      i < Math.floor(dynamicRating) ? "fill-amber-400 text-amber-400" : "text-stone-200 dark:text-stone-800"
                    )} 
                  />
                ))}
              </div>
              <span className="text-sm text-stone-500 font-medium">{reviewsCount} Reviews</span>
            </div>
            
            <div className="flex items-baseline gap-4">
              <p className="text-3xl font-bold text-stone-900 dark:text-white">{formatPrice(displayPrice)}</p>
              {displayPrice !== product.price && (
                <p className="text-xl text-stone-400 line-through">{formatPrice(product.price)}</p>
              )}
            </div>
          </div>

          <div className="space-y-10 mb-10">
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              {product.description}
            </p>

            {/* Variants */}
            <div className="space-y-8">
              {colors.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-4 dark:text-white">Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedVariants(prev => ({ ...prev, color }))}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all",
                          selectedVariants.color === color 
                            ? "border-stone-900 dark:border-white scale-110" 
                            : "border-transparent hover:scale-105"
                        )}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      >
                        {selectedVariants.color === color && (
                          <Check className={cn(
                            "w-4 h-4",
                            color.toLowerCase() === 'white' ? "text-black" : "text-white"
                          )} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {sizes.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-4 dark:text-white">Size</h3>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedVariants(prev => ({ ...prev, size }))}
                        className={cn(
                          "min-w-[3rem] h-12 rounded-xl border-2 font-bold text-sm transition-all",
                          selectedVariants.size === size 
                            ? "border-stone-900 bg-stone-900 text-white dark:border-white dark:bg-white dark:text-stone-900" 
                            : "border-stone-100 text-stone-600 hover:border-stone-300 dark:border-stone-800 dark:text-stone-400 dark:hover:border-stone-600"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Inventory Status */}
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                isOutOfStock ? "bg-red-500" : product.stock < 5 ? "bg-amber-500" : "bg-green-500"
              )} />
              <span className={cn(
                "text-sm font-medium",
                isOutOfStock ? "text-red-500" : product.stock < 5 ? "text-amber-500" : "text-green-600 dark:text-green-400"
              )}>
                {isOutOfStock ? "Out of Stock" : product.stock < 5 ? `Only ${product.stock} left in stock` : "In Stock"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex items-center border border-stone-200 dark:border-stone-800 rounded-full px-4 py-2 w-full sm:w-auto justify-between sm:justify-start gap-6">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isOutOfStock}
                  className="p-1 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors disabled:opacity-30"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold w-4 text-center dark:text-white">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={isOutOfStock || quantity >= product.stock}
                  className="p-1 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors disabled:opacity-30"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={cn(
                  "flex-1 w-full rounded-full py-4 px-8 font-bold flex items-center justify-center gap-3 transition-all active:scale-95",
                  isOutOfStock 
                    ? "bg-stone-200 text-stone-400 cursor-not-allowed dark:bg-stone-800 dark:text-stone-600" 
                    : "bg-stone-900 text-white hover:bg-stone-800 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-100"
                )}
              >
                <ShoppingBag className="w-5 h-5" />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-10 border-t border-stone-100 dark:border-stone-900">
            <div className="flex flex-col items-center text-center gap-2">
              <Truck className="w-5 h-5 text-stone-400" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <ShieldCheck className="w-5 h-5 text-stone-400" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Secure Checkout</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RotateCcw className="w-5 h-5 text-stone-400" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-stone-500">30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Reviews Section */}
      <div className="mt-24 pt-24 border-t border-stone-100 dark:border-stone-900">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div>
            <h2 className="text-3xl font-serif italic text-stone-900 dark:text-white mb-4">Customer Reviews</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("w-5 h-5", i < Math.floor(dynamicRating) ? "fill-amber-400 text-amber-400" : "text-stone-200 dark:text-stone-800")} />
                ))}
              </div>
              <span className="font-bold text-stone-900 dark:text-white">{dynamicRating} out of 5</span>
              <span className="text-stone-400 text-sm">({reviewsCount} reviews)</span>
            </div>
          </div>
          <button 
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-8 py-3 rounded-full font-bold hover:bg-stone-800 dark:hover:bg-stone-100 transition-all"
          >
            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
          </button>
        </div>

        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-16"
            >
              <div className="bg-stone-50 dark:bg-stone-900 p-8 rounded-3xl max-w-2xl">
                <h3 className="text-lg font-bold mb-6 dark:text-white">Share Your Experience</h3>
                <form onSubmit={handleAddReview} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className={cn(
                            "p-1 transition-colors",
                            star <= reviewRating ? "text-amber-400" : "text-stone-300 dark:text-stone-700"
                          )}
                        >
                          <Star className="w-8 h-8 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Your Review</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="What did you like or dislike? How was the quality?"
                      className="w-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-stone-900 dark:focus:border-white transition-colors min-h-[150px] dark:text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-10 py-4 rounded-full font-bold hover:bg-stone-800 dark:hover:bg-stone-100 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmittingReview ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 dark:border-stone-900/30 border-t-white dark:border-t-stone-900 rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : "Post Review"}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {allReviews.map((review) => (
            <div key={review.id} className="bg-white dark:bg-stone-950 p-8 rounded-3xl border border-stone-100 dark:border-stone-900 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-stone-100 dark:bg-stone-900 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-stone-400" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 dark:text-white">{review.userName}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn("w-3 h-3", i < review.rating ? "fill-amber-400 text-amber-400" : "text-stone-200 dark:text-stone-800")} />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-stone-400">{new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed italic">
                "{review.comment}"
              </p>
            </div>
          ))}
          {allReviews.length === 0 && (
            <div className="col-span-full text-center py-20 bg-stone-50 dark:bg-stone-900 rounded-3xl">
              <MessageSquare className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>

      <Toast 
        message="Added to cart successfully!" 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </div>
  );
};

export default ProductDetail;
