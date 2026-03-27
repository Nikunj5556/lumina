import { useState, useMemo } from 'react';
import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';
import { ChevronLeft, ShieldCheck, Truck, MapPin, Check, Plus, Tag, Info } from 'lucide-react';
import { useCart } from '../CartContext';
import { formatPrice, cn } from '../lib/utils';
import { Address, Order } from '../types';
import { AddressForm } from '../components/AddressForm';

const SHIPPING_METHODS = [
  { id: 'standard', name: 'Standard Shipping', price: 15, time: '3-5 business days' },
  { id: 'express', name: 'Express Shipping', price: 35, time: '1-2 business days' },
];

const Checkout = () => {
  const { cart, subtotal, clearCart, addresses, addOrder, addAddress, appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const [, navigate] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.length > 0 ? addresses[0].id : null
  );
  const [showAddressForm, setShowAddressForm] = useState(addresses.length === 0);
  const [shippingMethod, setShippingMethod] = useState(SHIPPING_METHODS[0]);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const taxRate = 0.08;
  const taxAmount = subtotal * taxRate;
  const shippingCost = subtotal > 150 ? 0 : shippingMethod.price;
  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === 'percentage'
      ? (subtotal * appliedCoupon.value) / 100
      : appliedCoupon.value
    : 0;
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

  const placeOrder = (address: Address) => {
    setIsProcessing(true);
    setTimeout(() => {
      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        items: [...cart],
        subtotal,
        discount: discountAmount,
        total,
        status: 'Processing',
        address,
      };
      addOrder(newOrder);
      clearCart();
      navigate('/success');
    }, 2000);
  };

  const handleAddressFormSubmit = (formData: Omit<Address, 'id'>) => {
    const newAddress: Address = { ...formData, id: Math.random().toString(36).substr(2, 9) };
    addAddress(newAddress);
    setSelectedAddressId(newAddress.id);
    setShowAddressForm(false);
    placeOrder(newAddress);
  };

  const handleSelectedAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddressId) return;
    const address = addresses.find(a => a.id === selectedAddressId);
    if (address) placeOrder(address);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif italic mb-4 text-foreground">Your cart is empty</h2>
        <Link href="/shop" className="text-foreground font-bold border-b-2 border-foreground">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold">Back</span>
      </button>

      <h1 className="text-4xl font-serif italic mb-12 text-foreground">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: address + shipping */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
          {/* Shipping Method */}
          <div>
            <h2 className="text-xl font-serif italic mb-6 text-foreground flex items-center gap-2">
              <Truck className="w-5 h-5" /> Shipping Method
            </h2>
            <div className="space-y-3">
              {SHIPPING_METHODS.map(method => (
                <button
                  key={method.id}
                  onClick={() => setShippingMethod(method)}
                  data-testid={`button-shipping-${method.id}`}
                  className={cn(
                    'w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left',
                    shippingMethod.id === method.id
                      ? 'border-stone-900 dark:border-white bg-muted'
                      : 'border-border hover:border-muted-foreground'
                  )}
                >
                  <div>
                    <p className="font-bold text-sm text-foreground">{method.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{method.time}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground">{subtotal > 150 ? 'Free' : formatPrice(method.price)}</span>
                    {shippingMethod.id === method.id && (
                      <div className="w-5 h-5 bg-stone-900 dark:bg-white rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white dark:text-stone-900" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Coupon */}
          <div>
            <h2 className="text-xl font-serif italic mb-6 text-foreground flex items-center gap-2">
              <Tag className="w-5 h-5" /> Coupon Code
            </h2>
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <div>
                    <p className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">{appliedCoupon.code}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-500">
                      {appliedCoupon.discountType === 'percentage'
                        ? `${appliedCoupon.value}% off`
                        : `${formatPrice(appliedCoupon.value)} off`}
                    </p>
                  </div>
                </div>
                <button onClick={removeCoupon} className="text-xs font-bold text-muted-foreground hover:text-foreground">Remove</button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-3">
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                  placeholder="WELCOME10, LUMINA20, FREESHIP"
                  data-testid="input-coupon"
                  className="flex-1 bg-muted border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-stone-900 dark:focus:border-white transition-colors text-foreground placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  data-testid="button-apply-coupon"
                  className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-stone-800 dark:hover:bg-stone-100 transition-all"
                >
                  Apply
                </button>
              </form>
            )}
            {couponError && <p className="text-xs text-red-500 font-bold mt-2 ml-1">{couponError}</p>}
          </div>

          {/* Shipping Address */}
          <div>
            <h2 className="text-xl font-serif italic mb-6 text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Delivery Address
            </h2>

            {addresses.length > 0 && !showAddressForm && (
              <form onSubmit={handleSelectedAddressSubmit} className="space-y-4">
                {addresses.map(addr => (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => setSelectedAddressId(addr.id)}
                    data-testid={`button-select-address-${addr.id}`}
                    className={cn(
                      'w-full text-left p-5 rounded-2xl border-2 transition-all',
                      selectedAddressId === addr.id
                        ? 'border-stone-900 dark:border-white bg-muted'
                        : 'border-border hover:border-muted-foreground'
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-sm text-foreground">{addr.firstName} {addr.lastName}</p>
                        <p className="text-xs text-muted-foreground mt-1">{addr.address}</p>
                        <p className="text-xs text-muted-foreground">{addr.city}, {addr.state} {addr.zip}</p>
                      </div>
                      {selectedAddressId === addr.id && (
                        <div className="w-5 h-5 bg-stone-900 dark:bg-white rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white dark:text-stone-900" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setShowAddressForm(true)}
                  className="w-full flex items-center gap-2 p-5 rounded-2xl border-2 border-dashed border-border hover:border-muted-foreground transition-all text-muted-foreground hover:text-foreground"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-bold">Add New Address</span>
                </button>

                <button
                  type="submit"
                  disabled={isProcessing || !selectedAddressId}
                  data-testid="button-place-order"
                  className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-5 rounded-full font-bold text-lg hover:bg-stone-800 dark:hover:bg-stone-100 transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
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

            {(showAddressForm || addresses.length === 0) && (
              <div className="space-y-4">
                <AddressForm
                  onSubmit={handleAddressFormSubmit}
                  onCancel={() => { if (addresses.length > 0) setShowAddressForm(false); }}
                  submitLabel={isProcessing ? 'Processing...' : `Complete Purchase — ${formatPrice(total)}`}
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Right: Order summary */}
        <div className="hidden lg:block">
          <div className="bg-card border border-border p-10 rounded-3xl sticky top-24">
            <h2 className="text-xl font-serif italic mb-8 text-foreground">Order Summary</h2>
            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
              {cart.map(item => (
                <div key={`${item.id}-${JSON.stringify(item.selectedVariants)}`} className="flex gap-4">
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-foreground line-clamp-1">{item.name}</h4>
                    {item.selectedVariants && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(item.selectedVariants).map(([k, v]) => (
                          <span key={k} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground uppercase tracking-wider">
                            {k}: {v}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium text-foreground mt-1">{formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-border">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>{subtotal > 150 ? 'Free' : formatPrice(shippingMethod.price)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tax (8%)</span>
                <span>{formatPrice(taxAmount)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="pt-4 flex justify-between text-xl font-bold text-foreground">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                Secure SSL encrypted payment
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                <Truck className="w-4 h-4 flex-shrink-0" />
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
