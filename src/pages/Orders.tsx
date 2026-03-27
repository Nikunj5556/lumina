import React from 'react';
import { motion } from 'motion/react';
import { Package, ChevronRight, ExternalLink, ShoppingBag } from 'lucide-react';
import { useCart } from '../CartContext';
import { formatPrice, cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export const Orders: React.FC = () => {
  const { orders } = useCart();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-serif italic text-stone-900 dark:text-white mb-4">Order History</h1>
        <p className="text-stone-500">Track and manage your recent purchases.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-stone-50 dark:bg-stone-900 rounded-3xl">
          <Package className="w-16 h-16 text-stone-300 mx-auto mb-6" />
          <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-2">No orders yet</h2>
          <p className="text-stone-500 mb-8">You haven't placed any orders in this demo store.</p>
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-8 py-3 rounded-full font-bold hover:bg-stone-800 dark:hover:bg-stone-100 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-stone-950 border border-stone-100 dark:border-stone-900 rounded-3xl overflow-hidden shadow-sm"
            >
              {/* Order Header */}
              <div className="p-6 sm:p-8 border-b border-stone-100 dark:border-stone-900 flex flex-wrap justify-between items-center gap-4 bg-stone-50/50 dark:bg-stone-900/50">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Order ID</p>
                  <p className="text-sm font-mono font-bold text-stone-900 dark:text-white">#{order.id.toUpperCase()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Date</p>
                  <p className="text-sm font-bold text-stone-900 dark:text-white">{new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Total</p>
                  <p className="text-sm font-bold text-stone-900 dark:text-white">{formatPrice(order.total)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Status</p>
                  <span className={cn(
                    "inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    order.status === 'Delivered' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                    order.status === 'Shipped' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  )}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 sm:p-8 space-y-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-center">
                    <div className="w-20 h-24 bg-stone-100 dark:bg-stone-900 rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-stone-900 dark:text-white truncate">{item.name}</h4>
                      <p className="text-xs text-stone-500 mt-1">
                        Qty: {item.quantity} • {formatPrice(item.price)}
                      </p>
                      {item.selectedVariants && (
                        <div className="flex gap-2 mt-2">
                          {Object.entries(item.selectedVariants).map(([type, value]) => (
                            <span key={type} className="text-[10px] uppercase tracking-widest font-bold text-stone-400 bg-stone-50 dark:bg-stone-900 px-2 py-0.5 rounded">
                              {type}: {value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Link 
                      to={`/product/${item.id}`}
                      className="p-2 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="px-6 sm:px-8 py-4 bg-stone-50/30 dark:bg-stone-900/30 border-t border-stone-100 dark:border-stone-900 flex justify-end">
                <button className="text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors flex items-center gap-2">
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
