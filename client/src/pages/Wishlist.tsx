import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../CartContext';
import { PRODUCTS } from '../data';
import { Link } from 'wouter';
import { ProductCard } from '../components/ProductCard';

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useCart();
  const wishlistedProducts = PRODUCTS.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-serif italic text-foreground mb-4">My Wishlist</h1>
        <p className="text-muted-foreground">Items you've saved for later.</p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 bg-muted rounded-3xl"
        >
          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-xl font-bold text-foreground mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-8">Save items you love to find them easily later.</p>
          <Link
            href="/shop"
            data-testid="link-explore-shop"
            className="inline-flex items-center gap-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-8 py-3 rounded-full font-bold hover:bg-stone-800 dark:hover:bg-stone-100 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            Explore Shop
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {wishlistedProducts.map(product => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} />
              <button
                onClick={() => toggleWishlist(product.id)}
                data-testid={`button-remove-wishlist-${product.id}`}
                className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-stone-800/80 backdrop-blur-md rounded-full text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
