import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../CartContext';
import { formatPrice } from '../lib/utils';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-10 h-10 text-stone-300" />
          </div>
          <h2 className="text-3xl font-serif italic text-stone-900">Your cart is empty</h2>
          <p className="text-stone-500 max-w-xs mx-auto">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-stone-900 text-white px-8 py-4 rounded-full font-bold hover:bg-stone-800 transition-all"
          >
            Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif italic mb-12">Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex gap-6 pb-8 border-b border-stone-100"
              >
                <Link to={`/product/${item.id}`} className="w-24 h-32 sm:w-32 sm:h-40 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </Link>

                <div className="flex-1 flex flex-col justify-between py-2">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-stone-900">{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-sm text-stone-400 mb-4">{item.category}</p>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-stone-200 rounded-full px-3 py-1 gap-4">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-stone-400 hover:text-stone-900 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-stone-400 hover:text-stone-900 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-lg font-bold text-stone-900">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="glass p-8 rounded-3xl sticky top-24">
            <h2 className="text-xl font-serif italic mb-6">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm text-stone-500">
                <span>Subtotal ({totalItems} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-500">
                <span>Shipping</span>
                <span>{subtotal > 150 ? 'Free' : '$15.00'}</span>
              </div>
              <div className="pt-4 border-t border-stone-100 flex justify-between text-lg font-bold text-stone-900">
                <span>Total</span>
                <span>{formatPrice(subtotal > 150 ? subtotal : subtotal + 15)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="w-full bg-stone-900 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-all group"
            >
              Checkout
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-[10px] text-center text-stone-400 mt-4 uppercase tracking-widest">
              Secure checkout powered by Lumina
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
