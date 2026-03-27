import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../CartContext';
import { formatPrice } from '../lib/utils';
import { Link } from 'wouter';

export const CartDrawer = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, isCartOpen, setIsCartOpen } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-foreground" />
                <h2 className="text-xl font-serif italic text-foreground">Your Cart</h2>
                <span className="bg-muted text-muted-foreground text-xs font-bold px-2 py-1 rounded-full">
                  {cart.length}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                data-testid="button-close-cart"
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-foreground font-bold">Your cart is empty</p>
                    <p className="text-muted-foreground text-sm">Start adding some beautiful pieces.</p>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-foreground text-sm font-bold uppercase tracking-widest border-b-2 border-foreground pb-1"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${JSON.stringify(item.selectedVariants)}`} className="flex gap-4 group">
                    <div className="w-20 h-24 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-sm font-bold text-foreground truncate pr-2">{item.name}</h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          data-testid={`button-remove-${item.id}`}
                          className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.selectedVariants && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {Object.entries(item.selectedVariants).map(([key, value]) => (
                            <span key={key} className="text-[10px] uppercase tracking-wider bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border rounded-full px-2 py-1 gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            data-testid={`button-decrease-${item.id}`}
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center text-foreground">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            data-testid={`button-increase-${item.id}`}
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-foreground">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Subtotal</span>
                  <span className="font-bold text-foreground text-lg">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Taxes and shipping calculated at checkout</p>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  data-testid="link-checkout"
                  className="flex items-center justify-center gap-2 w-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-4 rounded-full font-bold hover:bg-stone-800 dark:hover:bg-stone-100 transition-all"
                >
                  Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="block text-center text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
