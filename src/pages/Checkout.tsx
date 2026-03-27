import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ShieldCheck, CreditCard, Truck, MapPin, Check, Plus, Tag, Info } from 'lucide-react';
import { useCart } from '../CartContext';
import { formatPrice } from '../lib/utils';
import { Address, Order } from '../types';
import { cn } from '../lib/utils';
import { AddressForm } from '../components/AddressForm';

const SHIPPING_METHODS = [
  { id: 'standard', name: 'Standard Shipping', price: 15, time: '3-5 business days' },
  { id: 'express', name: 'Express Shipping', price: 35, time: '1-2 business days' },
];

export const Checkout: React.FC = () => {
  const { cart, subtotal, clearCart, addresses, addOrder, addAddress, appliedCoupon, applyCoupon } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.length > 0 ? addresses[0].id : null
  );
  const [shippingMethod, setShippingMethod] = useState(SHIPPING_METHODS[0]);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const taxRate = 0.08; // 8% fake tax
  const taxAmount = subtotal * taxRate;
  const shippingCost = subtotal > 150 ? 0 : shippingMethod.price;
  const discountAmount = appliedCoupon ? (appliedCoupon.discountType === 'percentage' ? (subtotal * appliedCoupon.value) / 100 : appliedCoupon.value) : 0;
  const total = subtotal + taxAmount + shippingCost - discountAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    
    const success = applyCoupon(couponCode);
    if (!success) {
      setCouponError('Invalid coupon code');
      setTimeout(() => setCouponError(''), 3000);
    } else {
      setCouponCode('');
      setCouponError('');
    }
  };

  const handleSubmit = (address: Address | Omit<Address, 'id'>) => {
    setIsProcessing(true);

    let finalAddress: Address;
    if (!('id' in address)) {
      finalAddress = {
        ...address,
        id: Math.random().toString(36).substr(2, 9),
      };
      addAddress(finalAddress);
    } else {
      finalAddress = address as Address;
    }

    // Simulate API call
    setTimeout(() => {
      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        items: [...cart],
        subtotal: subtotal,
        discount: discountAmount,
        total: total,
        status: 'Processing',
        address: finalAddress,
      };
      
      addOrder(newOrder);
      clearCart();
      navigate('/success');
    }, 2000);
  };

  const handleFormSubmit = (formData: Omit<Address, 'id'>) => {
    handleSubmit(formData);
  };

  const handleSelectedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAddressId) {
      const address = addresses.find(a => a.id === selectedAddressId);
      if (address) {
        handleSubmit(address);
      }
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif italic mb-4 dark:text-white">Your cart is empty</h2>
        <Link to="/shop" className="text-stone-900 dark:text-white font-bold border-b-2 border-stone-900 dark:border-white">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Cart</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Checkout Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-serif italic mb-10 dark:text-white">Checkout</h1>
          
          <div className="space-y-12">
            {/* Address Selection */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">Shipping Information</h3>
              
              {addresses.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {addresses.map((addr) => (
                    <div 
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={cn(
                        "p-4 rounded-2xl border-2 cursor-pointer transition-all relative",
                        selectedAddressId === addr.id 
                          ? "border-stone-900 bg-stone-50 dark:bg-stone-900 dark:border-white" 
                          : "border-stone-100 dark:border-stone-800 hover:border-stone-200 dark:hover:border-stone-700"
                      )}
                    >
                      {selectedAddressId === addr.id && (
                        <div className="absolute top-3 right-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-full p-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                      <div className="flex items-start gap-3 mb-2">
                        <MapPin className="w-4 h-4 text-stone-400 mt-0.5" />
                        <p className="text-sm font-bold text-stone-900 dark:text-white">{addr.firstName} {addr.lastName}</p>
                      </div>
                      <p className="text-xs text-stone-500 line-clamp-1">{addr.address}</p>
                      <p className="text-xs text-stone-500">{addr.city}, {addr.state}</p>
                    </div>
                  ))}
                  <div 
                    onClick={() => setSelectedAddressId(null)}
                    className={cn(
                      "p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all flex items-center justify-center gap-2",
                      selectedAddressId === null 
                        ? "border-stone-900 bg-stone-50 dark:bg-stone-900 dark:border-white text-stone-900 dark:text-white" 
                        : "border-stone-200 dark:border-stone-800 text-stone-400 hover:border-stone-400 hover:text-stone-600"
                    )}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">New Address</span>
                  </div>
                </div>
              )}

              {selectedAddressId === null ? (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <AddressForm 
                    onCancel={() => addresses.length > 0 && setSelectedAddressId(addresses[0].id)}
                    onSubmit={handleFormSubmit}
                    submitLabel={isProcessing ? "Processing..." : `Complete Purchase — ${formatPrice(total)}`}
                  />
                </motion.div>
              ) : (
                <form onSubmit={handleSelectedSubmit} className="space-y-12">
                  {/* Shipping Method */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">Shipping Method</h3>
                    <div className="space-y-3">
                      {SHIPPING_METHODS.map((method) => (
                        <label 
                          key={method.id}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all",
                            shippingMethod.id === method.id 
                              ? "border-stone-900 bg-stone-50 dark:bg-stone-900 dark:border-white" 
                              : "border-stone-100 dark:border-stone-800 hover:border-stone-200 dark:hover:border-stone-700"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                              shippingMethod.id === method.id ? "border-stone-900 dark:border-white" : "border-stone-300 dark:border-stone-700"
                            )}>
                              {shippingMethod.id === method.id && <div className="w-2.5 h-2.5 rounded-full bg-stone-900 dark:bg-white" />}
                            </div>
                            <input 
                              type="radio" 
                              name="shipping" 
                              className="hidden" 
                              checked={shippingMethod.id === method.id}
                              onChange={() => setShippingMethod(method)}
                            />
                            <div>
                              <p className="text-sm font-bold text-stone-900 dark:text-white">{method.name}</p>
                              <p className="text-xs text-stone-500">{method.time}</p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-stone-900 dark:text-white">
                            {subtotal > 150 ? 'Free' : formatPrice(method.price)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">Payment (Demo)</h3>
                    <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center gap-3 text-stone-600 dark:text-stone-400 mb-2">
                        <CreditCard className="w-5 h-5" />
                        <span className="text-sm font-medium">Credit / Debit Card</span>
                      </div>
                      <input
                        disabled
                        type="text"
                        placeholder="Card Number (Disabled for Demo)"
                        className="w-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm opacity-50 cursor-not-allowed dark:text-white"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          disabled
                          type="text"
                          placeholder="MM/YY"
                          className="w-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm opacity-50 cursor-not-allowed dark:text-white"
                        />
                        <input
                          disabled
                          type="text"
                          placeholder="CVC"
                          className="w-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm opacity-50 cursor-not-allowed dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-5 rounded-full font-bold text-lg hover:bg-stone-800 dark:hover:bg-stone-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 dark:border-stone-900/30 border-t-white dark:border-t-stone-900 rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Complete Purchase — ${formatPrice(total)}`
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>

        {/* Order Summary */}
        <div className="hidden lg:block">
          <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 p-10 rounded-3xl sticky top-24">
            <h2 className="text-xl font-serif italic mb-8 dark:text-white">Order Summary</h2>
            <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-4 no-scrollbar">
              {cart.map((item) => (
                <div key={`${item.id}-${JSON.stringify(item.selectedVariants)}`} className="flex gap-4">
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white line-clamp-1">{item.name}</h4>
                    {item.selectedVariants && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(item.selectedVariants).map(([key, value]) => (
                          <span key={key} className="text-[10px] uppercase tracking-wider bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded text-stone-500 dark:text-stone-400">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-stone-400 mt-1">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium text-stone-900 dark:text-white mt-1">{formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code */}
            <div className="mb-8 pt-6 border-t border-stone-100 dark:border-stone-800">
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input 
                      type="text" 
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-sm dark:text-white focus:outline-none focus:border-stone-900 dark:focus:border-white transition-colors"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-stone-800 dark:hover:bg-stone-100 transition-all"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-xs text-red-500 ml-1">{couponError}</p>}
                {appliedCoupon && (
                  <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{appliedCoupon.code} Applied</span>
                    </div>
                    <button 
                      onClick={() => applyCoupon('')}
                      className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>
            </div>
            
            <div className="space-y-3 pt-6 border-t border-stone-100 dark:border-stone-800">
              <div className="flex justify-between text-sm text-stone-500 dark:text-stone-400">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-500 dark:text-stone-400">
                <div className="flex items-center gap-1.5">
                  <span>Shipping</span>
                  <div className="group relative">
                    <Info className="w-3.5 h-3.5 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-stone-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      Free shipping on orders over $150.00
                    </div>
                  </div>
                </div>
                <span>{subtotal > 150 ? 'Free' : formatPrice(shippingMethod.price)}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-500 dark:text-stone-400">
                <span>Estimated Tax (8%)</span>
                <span>{formatPrice(taxAmount)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Discount ({appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.value}%` : formatPrice(appliedCoupon.value)})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="pt-4 flex justify-between text-xl font-bold text-stone-900 dark:text-white">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3 text-xs text-stone-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Secure SSL encrypted payment
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-400 font-medium">
                <Truck className="w-4 h-4 text-stone-400" />
                Estimated delivery: {shippingMethod.time}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
