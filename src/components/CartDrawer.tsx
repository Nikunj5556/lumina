import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../CartContext';
import { formatPrice } from '../lib/utils';
import { Link } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, isCartOpen, setIsCartOpen } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-stone-900 z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-stone-900 dark:text-white" />
                <h2 className="text-xl font-serif italic dark:text-white">Your Cart</h2>
                <span className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-bold px-2 py-1 rounded-full">
                  {cart.length}
                </span>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 dark:text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-stone-50 dark:bg-stone-800 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-stone-200 dark:text-stone-700" />
                  </div>
                  <div>
                    <p className="text-stone-900 dark:text-white font-bold">Your cart is empty</p>
                    <p className="text-stone-500 dark:text-stone-400 text-sm">Start adding some beautiful pieces to your collection.</p>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-stone-900 dark:text-white text-sm font-bold uppercase tracking-widest border-b-2 border-stone-900 dark:border-white pb-1"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${JSON.stringify(item.selectedVariants)}`} className="flex gap-4 group">
                    <div className="w-20 h-24 bg-stone-50 dark:bg-stone-800 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-sm font-bold text-stone-900 dark:text-white truncate">{item.name}</h3>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.selectedVariants && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {Object.entries(item.selectedVariants).map(([key, value]) => (
                            <span key={key} className="text-[10px] uppercase tracking-wider bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <span className="opacity-50">{key}:</span>
                              <span className="font-bold">{value}</span>
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Stock Warning */}
                      {item.stock < 5 && item.stock > 0 && (
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mb-2">
                          Only {item.stock} left in stock
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-3 bg-stone-50 dark:bg-stone-800 rounded-lg p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-white dark:hover:bg-stone-700 rounded transition-colors"
                          >
                            <Minus className="w-3 h-3 dark:text-white" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center dark:text-white">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                            disabled={item.quantity >= item.stock}
                            className="p-1 hover:bg-white dark:hover:bg-stone-700 rounded transition-colors disabled:opacity-30"
                          >
                            <Plus className="w-3 h-3 dark:text-white" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-stone-900 dark:text-white">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-stone-100 dark:border-stone-800 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 dark:text-stone-400 text-sm">Subtotal</span>
                  <span className="text-xl font-bold text-stone-900 dark:text-white">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-[10px] text-stone-400 dark:text-stone-500 uppercase tracking-widest text-center">
                  Shipping and taxes calculated at checkout
                </p>
                <Link 
                  to="/checkout" 
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-stone-900 dark:bg-white dark:text-stone-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 dark:hover:bg-stone-100 transition-all group"
                >
                  Checkout
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
