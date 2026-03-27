import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../CartContext';
import { formatPrice } from '../lib/utils';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-3xl font-serif italic text-foreground">Your cart is empty</h2>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link
            href="/shop"
            data-testid="link-start-shopping"
            className="inline-block bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-8 py-4 rounded-full font-bold hover:bg-stone-800 dark:hover:bg-stone-100 transition-all"
          >
            Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif italic mb-12 text-foreground">Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="popLayout">
            {cart.map(item => (
              <motion.div
                key={`${item.id}-${JSON.stringify(item.selectedVariants)}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex gap-6 pb-8 border-b border-border"
              >
                <Link
                  href={`/product/${item.id}`}
                  className="w-24 h-32 sm:w-32 sm:h-40 rounded-2xl overflow-hidden bg-muted flex-shrink-0"
                >
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </Link>

                <div className="flex-1 flex flex-col justify-between py-2">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-foreground">{item.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        data-testid={`button-remove-${item.id}`}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{item.category}</p>
                    {item.selectedVariants && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {Object.entries(item.selectedVariants).map(([k, v]) => (
                          <span key={k} className="text-[10px] uppercase tracking-wider bg-muted px-2 py-0.5 rounded text-muted-foreground">
                            {k}: {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-border rounded-full px-3 py-1 gap-4">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        data-testid={`button-decrease-${item.id}`}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold w-4 text-center text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        data-testid={`button-increase-${item.id}`}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-lg font-bold text-foreground">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-3xl p-8 sticky top-24">
            <h2 className="text-xl font-serif italic mb-8 text-foreground">Order Summary</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal ({totalItems} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>{subtotal > 150 ? 'Free' : formatPrice(15)}</span>
              </div>
              <div className="pt-4 border-t border-border flex justify-between text-lg font-bold text-foreground">
                <span>Estimated Total</span>
                <span>{formatPrice(subtotal + (subtotal > 150 ? 0 : 15))}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              data-testid="link-checkout"
              className="flex items-center justify-center gap-2 w-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-4 rounded-full font-bold hover:bg-stone-800 dark:hover:bg-stone-100 transition-all"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/shop"
              className="block text-center mt-4 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
