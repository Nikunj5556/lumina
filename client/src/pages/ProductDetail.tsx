import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Star, Minus, Plus, ShoppingBag, Truck, ShieldCheck, RotateCcw,
  Heart, Check, User, MessageSquare
} from 'lucide-react';
import { PRODUCTS } from '../data';
import { formatPrice, cn } from '../lib/utils';
import { useCart } from '../CartContext';
import { Toast } from '../components/Toast';
import { ProductReview } from '../types';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const {
    addToCart, wishlist, toggleWishlist, addToRecentlyViewed,
    setIsCartOpen, userProfile, productReviews, addProductReview
  } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const product = PRODUCTS.find(p => p.id === id);

  const allReviews = useMemo(() => {
    if (!product) return [];
    return [...(product.reviews || []), ...(productReviews[product.id] || [])].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [product, productReviews]);

  const dynamicRating = useMemo(() => {
    if (allReviews.length === 0) return product?.rating || 0;
    return parseFloat((allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length).toFixed(1));
  }, [allReviews, product]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) addToRecentlyViewed(id);
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif italic mb-4 text-foreground">Product not found</h2>
        <Link href="/shop" className="text-foreground font-bold border-b-2 border-foreground">Back to Shop</Link>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = product.stock === 0;
  const images = product.images || [product.image];

  const priceModifier = product.variants?.reduce((acc, v) => {
    if (selectedVariants[v.type] === v.name) return acc + (v.priceModifier || 0);
    return acc;
  }, 0) || 0;
  const displayPrice = product.price + priceModifier;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart({ ...product, price: displayPrice, quantity, selectedVariants: Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined });
    setShowToast(true);
    setIsCartOpen(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: ((e.pageX - left) / width) * 100, y: ((e.pageY - top) / height) * 100 });
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim() || !product) return;
    setIsSubmittingReview(true);
    setTimeout(() => {
      const newReview: ProductReview = {
        id: Math.random().toString(36).substr(2, 9),
        userName: userProfile?.name || 'Anonymous User',
        rating: reviewRating,
        comment: reviewComment,
        date: new Date().toISOString(),
      };
      addProductReview(product.id, newReview);
      setReviewComment('');
      setReviewRating(5);
      setShowReviewForm(false);
      setIsSubmittingReview(false);
    }, 500);
  };

  // Group variants by type
  const variantGroups = product.variants?.reduce((acc, v) => {
    if (!acc[v.type]) acc[v.type] = [];
    acc[v.type].push(v);
    return acc;
  }, {} as Record<string, typeof product.variants>) || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold">Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Images */}
        <div className="space-y-4">
          <div
            className={cn('relative rounded-3xl overflow-hidden bg-muted aspect-square cursor-zoom-in', isZoomed && 'cursor-zoom-out')}
            onClick={() => setIsZoomed(!isZoomed)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={images[selectedImage]}
              alt={product.name}
              className={cn(
                'w-full h-full object-cover transition-transform duration-300',
                isZoomed && 'scale-150'
              )}
              style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
              referrerPolicy="no-referrer"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                <span className="bg-red-500 text-white px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  data-testid={`button-image-${i}`}
                  className={cn(
                    'w-20 h-20 rounded-xl overflow-hidden border-2 transition-all',
                    selectedImage === i ? 'border-foreground' : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-8">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-serif italic text-foreground mb-4">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn('w-4 h-4', i < Math.round(dynamicRating) ? 'fill-amber-400 text-amber-400' : 'text-border')} />
                ))}
              </div>
              <span className="text-sm font-bold text-foreground">{dynamicRating}</span>
              <span className="text-sm text-muted-foreground">({allReviews.length} reviews)</span>
            </div>
          </div>

          <p className="text-3xl font-bold text-foreground">{formatPrice(displayPrice)}</p>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Variants */}
          {Object.entries(variantGroups).map(([type, variants]) => (
            <div key={type}>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-foreground">{type}</h3>
              <div className="flex flex-wrap gap-3">
                {variants?.map(variant => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariants(prev => ({
                      ...prev,
                      [type]: prev[type] === variant.name ? '' : variant.name,
                    }))}
                    data-testid={`button-variant-${variant.id}`}
                    className={cn(
                      'px-5 py-2.5 rounded-full text-sm font-bold border-2 transition-all',
                      selectedVariants[type] === variant.name
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border hover:border-foreground text-foreground'
                    )}
                  >
                    {variant.name}
                    {variant.priceModifier ? ` (+${formatPrice(variant.priceModifier)})` : ''}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity + Stock */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border-2 border-border rounded-full px-4 py-2 gap-4">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                data-testid="button-decrease-qty"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-bold text-foreground w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))}
                data-testid="button-increase-qty"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {!isOutOfStock && product.stock < 5 && (
              <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">Only {product.stock} left!</span>
            )}
          </div>

          {/* CTA buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              data-testid="button-add-to-cart"
              className={cn(
                'flex-1 flex items-center justify-center gap-3 py-4 rounded-full font-bold text-sm transition-all',
                isOutOfStock
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-100'
              )}
            >
              <ShoppingBag className="w-5 h-5" />
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              data-testid="button-wishlist"
              className={cn(
                'p-4 rounded-full border-2 transition-all',
                isWishlisted
                  ? 'border-red-400 bg-red-50 dark:bg-red-950 text-red-500'
                  : 'border-border hover:border-foreground text-muted-foreground hover:text-foreground'
              )}
            >
              <Heart className={cn('w-5 h-5', isWishlisted && 'fill-current')} />
            </button>
          </div>

          {/* Trust signals */}
          <div className="space-y-3 pt-4 border-t border-border">
            {[
              { icon: Truck, text: 'Free shipping on orders over $150' },
              { icon: ShieldCheck, text: 'Secure payment — SSL encrypted' },
              { icon: RotateCcw, text: '30-day hassle-free return policy' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                <Icon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-24">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-serif italic text-foreground mb-2">Customer Reviews</h2>
            <p className="text-muted-foreground">{allReviews.length} reviews · {dynamicRating} average rating</p>
          </div>
          {userProfile && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              data-testid="button-write-review"
              className="flex items-center gap-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-6 py-3 rounded-full text-sm font-bold hover:bg-stone-800 dark:hover:bg-stone-100 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              Write Review
            </button>
          )}
        </div>

        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-10"
            >
              <div className="bg-muted rounded-3xl p-8">
                <h3 className="text-xl font-serif italic text-foreground mb-6">Your Review</h3>
                <form onSubmit={handleAddReview} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          data-testid={`button-review-star-${star}`}
                          className="transition-transform hover:scale-110"
                        >
                          <Star className={cn('w-7 h-7', star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-border')} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Comment</label>
                    <textarea
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                      rows={4}
                      placeholder="Share your experience with this product..."
                      data-testid="input-review-comment"
                      className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors resize-none text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="flex-1 border border-border py-3 rounded-full font-bold text-sm text-muted-foreground hover:bg-muted transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingReview || !reviewComment.trim()}
                      data-testid="button-submit-review"
                      className="flex-1 bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-3 rounded-full font-bold text-sm hover:bg-stone-800 dark:hover:bg-stone-100 transition-all disabled:opacity-50"
                    >
                      {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {allReviews.map(review => (
            <div key={review.id} className="bg-card p-8 rounded-3xl border border-border space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{review.userName}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn('w-3 h-3', i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-border')} />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed italic">"{review.comment}"</p>
            </div>
          ))}
          {allReviews.length === 0 && (
            <div className="col-span-full text-center py-20 bg-muted rounded-3xl">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>

      <Toast message="Added to cart successfully!" isVisible={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default ProductDetail;
