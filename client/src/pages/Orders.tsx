import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronDown, ShoppingBag, Clock, CheckCircle2, Truck, Box } from 'lucide-react';
import { useCart } from '../CartContext';
import { formatPrice, cn } from '../lib/utils';
import { Link } from 'wouter';
import { Order } from '../types';

const STATUS_STEPS: Array<{ key: Order['status']; label: string; icon: React.ComponentType<any> }> = [
  { key: 'Processing', label: 'Processing', icon: Clock },
  { key: 'Shipped', label: 'Shipped', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: CheckCircle2 },
];

const Orders = () => {
  const { orders } = useCart();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-serif italic text-foreground mb-4">Order History</h1>
        <p className="text-muted-foreground">Track and manage your recent purchases.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-muted rounded-3xl">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-xl font-bold text-foreground mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-8">You haven't placed any orders yet.</p>
          <Link
            href="/shop"
            data-testid="link-start-shopping"
            className="inline-flex items-center gap-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-8 py-3 rounded-full font-bold hover:bg-stone-800 dark:hover:bg-stone-100 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => {
            const isExpanded = expandedId === order.id;
            const statusIndex = STATUS_STEPS.findIndex(s => s.key === order.status);

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-3xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  data-testid={`button-expand-order-${order.id}`}
                  className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Order</p>
                      <p className="font-bold text-foreground">#{order.id}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Date</p>
                      <p className="font-bold text-foreground text-sm">{order.date}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Total</p>
                      <p className="font-bold text-foreground">{formatPrice(order.total)}</p>
                    </div>
                    <span
                      className={cn(
                        'text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full',
                        order.status === 'Delivered' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
                        order.status === 'Shipped' && 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
                        order.status === 'Processing' && 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
                        order.status === 'Cancelled' && 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                      )}
                    >
                      {order.status}
                    </span>
                  </div>
                  <ChevronDown
                    className={cn('w-5 h-5 text-muted-foreground transition-transform', isExpanded && 'rotate-180')}
                  />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-8 border-t border-border pt-6 space-y-8">
                        {/* Status tracker */}
                        {order.status !== 'Cancelled' && (
                          <div className="flex items-center gap-0">
                            {STATUS_STEPS.map((step, i) => {
                              const isActive = i <= statusIndex;
                              const Icon = step.icon;
                              return (
                                <div key={step.key} className="flex items-center flex-1">
                                  <div className="flex flex-col items-center gap-2">
                                    <div className={cn(
                                      'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                                      isActive ? 'bg-stone-900 dark:bg-white' : 'bg-muted'
                                    )}>
                                      <Icon className={cn('w-5 h-5', isActive ? 'text-white dark:text-stone-900' : 'text-muted-foreground')} />
                                    </div>
                                    <span className={cn('text-[10px] uppercase tracking-widest font-bold', isActive ? 'text-foreground' : 'text-muted-foreground')}>
                                      {step.label}
                                    </span>
                                  </div>
                                  {i < STATUS_STEPS.length - 1 && (
                                    <div className={cn('flex-1 h-0.5 mx-2 mb-5 transition-colors', i < statusIndex ? 'bg-stone-900 dark:bg-white' : 'bg-border')} />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Items</h4>
                            <div className="space-y-4">
                              {order.items.map(item => (
                                <div key={item.id} className="flex gap-4">
                                  <div className="w-12 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-foreground">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Shipping Address</h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p className="font-bold text-foreground">{order.address.firstName} {order.address.lastName}</p>
                              <p>{order.address.address}</p>
                              <p>{order.address.city}, {order.address.state} {order.address.zip}</p>
                              <p>{order.address.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between pt-4 border-t border-border">
                          <span className="text-muted-foreground text-sm">Total</span>
                          <span className="font-bold text-foreground">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
