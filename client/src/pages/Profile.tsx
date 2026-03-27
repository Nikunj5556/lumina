import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, MapPin, ChevronDown, Trash2, Plus, Clock, CheckCircle2, Truck,
  X, Edit2, User, Mail, Phone, Save, LogOut
} from 'lucide-react';
import { useCart } from '../CartContext';
import { formatPrice, cn } from '../lib/utils';
import { Address, Order, UserProfile as UserProfileType } from '../types';
import { AddressForm } from '../components/AddressForm';
import { Link, useLocation } from 'wouter';

const Profile = () => {
  const { orders, addresses, addAddress, removeAddress, updateAddress, userProfile, updateUserProfile, logout } = useCart();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const [profileForm, setProfileForm] = useState<UserProfileType>(
    userProfile || { name: '', email: '', phone: '', bio: '', joinedDate: new Date().toLocaleDateString() }
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddAddress = (formData: Omit<Address, 'id'>) => {
    addAddress({ ...formData, id: Math.random().toString(36).substr(2, 9) });
    setIsAddingAddress(false);
  };

  const handleEditAddress = (formData: Omit<Address, 'id'>) => {
    if (editingAddress) {
      updateAddress({ ...formData, id: editingAddress.id });
      setEditingAddress(null);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(profileForm);
    setIsEditingProfile(false);
  };

  const STATUS_STEPS: Array<{ key: Order['status']; icon: React.ComponentType<any> }> = [
    { key: 'Processing', icon: Clock },
    { key: 'Shipped', icon: Truck },
    { key: 'Delivered', icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-serif italic mb-2 text-foreground">
            {userProfile ? `Welcome back, ${userProfile.name.split(' ')[0]}` : 'Profile'}
          </h1>
          <p className="text-muted-foreground">Manage your profile, orders and saved addresses</p>
        </div>
        <button
          onClick={handleLogout}
          data-testid="button-logout"
          className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-red-500 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:block">Sign Out</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-border mb-10 overflow-x-auto no-scrollbar">
        {(['orders', 'addresses', 'profile'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            data-testid={`button-tab-${tab}`}
            className={cn(
              'pb-4 text-sm font-bold uppercase tracking-widest transition-all relative whitespace-nowrap',
              activeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab === 'orders' ? 'Orders' : tab === 'addresses' ? 'Addresses' : 'Profile Info'}
            {activeTab === tab && (
              <motion.div layoutId="profileTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
            )}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-muted rounded-3xl">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-xl font-bold text-foreground mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-8">You haven't placed any orders.</p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-8 py-3 rounded-full font-bold hover:bg-stone-800 dark:hover:bg-stone-100 transition-all"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            orders.map(order => {
              const isExpanded = expandedOrderId === order.id;
              const statusIndex = STATUS_STEPS.findIndex(s => s.key === order.status);
              return (
                <div key={order.id} className="bg-card border border-border rounded-3xl overflow-hidden">
                  <button
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
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
                      <span className={cn(
                        'text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full',
                        order.status === 'Delivered' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
                        order.status === 'Shipped' && 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
                        order.status === 'Processing' && 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
                        order.status === 'Cancelled' && 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
                      )}>
                        {order.status}
                      </span>
                    </div>
                    <ChevronDown className={cn('w-5 h-5 text-muted-foreground transition-transform', isExpanded && 'rotate-180')} />
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-border"
                      >
                        <div className="p-6 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Items</h4>
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
                            <div className="space-y-2">
                              <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Shipping Address</h4>
                              <p className="font-bold text-sm text-foreground">{order.address.firstName} {order.address.lastName}</p>
                              <p className="text-sm text-muted-foreground">{order.address.address}</p>
                              <p className="text-sm text-muted-foreground">{order.address.city}, {order.address.state} {order.address.zip}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Addresses Tab */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {addresses.map(addr => (
              <div key={addr.id} className="bg-card border border-border rounded-3xl p-6 relative group">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingAddress(addr)}
                    data-testid={`button-edit-address-${addr.id}`}
                    className="p-2 bg-muted rounded-full hover:bg-border transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-foreground" />
                  </button>
                  <button
                    onClick={() => removeAddress(addr.id)}
                    data-testid={`button-delete-address-${addr.id}`}
                    className="p-2 bg-muted rounded-full hover:bg-red-100 dark:hover:bg-red-950 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <MapPin className="w-5 h-5 text-muted-foreground mb-3" />
                <p className="font-bold text-foreground">{addr.firstName} {addr.lastName}</p>
                <p className="text-sm text-muted-foreground mt-1">{addr.address}</p>
                <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.zip}</p>
                <p className="text-sm text-muted-foreground">{addr.email}</p>
              </div>
            ))}

            {editingAddress && (
              <div className="col-span-full bg-card border border-border rounded-3xl p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground mb-6">Edit Address</h3>
                <AddressForm
                  initialData={editingAddress}
                  onSubmit={handleEditAddress}
                  onCancel={() => setEditingAddress(null)}
                  submitLabel="Save Changes"
                />
              </div>
            )}

            {isAddingAddress ? (
              <div className="col-span-full bg-card border border-border rounded-3xl p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground mb-6">New Address</h3>
                <AddressForm
                  onSubmit={handleAddAddress}
                  onCancel={() => setIsAddingAddress(false)}
                  submitLabel="Save Address"
                />
              </div>
            ) : (
              <button
                onClick={() => setIsAddingAddress(true)}
                data-testid="button-add-address"
                className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border rounded-3xl p-10 hover:border-foreground transition-colors text-muted-foreground hover:text-foreground"
              >
                <Plus className="w-8 h-8" />
                <span className="text-sm font-bold">Add Address</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="max-w-xl">
          {isEditingProfile ? (
            <form onSubmit={handleProfileSubmit} className="bg-card border border-border rounded-3xl p-8 space-y-6">
              <h2 className="text-xl font-serif italic text-foreground">Edit Profile</h2>
              {[
                { label: 'Full Name', key: 'name', icon: User, type: 'text' },
                { label: 'Email', key: 'email', icon: Mail, type: 'email' },
                { label: 'Phone', key: 'phone', icon: Phone, type: 'tel' },
              ].map(({ label, key, icon: Icon, type }) => (
                <div key={key}>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={type}
                      value={(profileForm as any)[key] || ''}
                      onChange={e => setProfileForm(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-full pl-11 pr-4 py-3 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:border-foreground transition-colors text-foreground"
                    />
                  </div>
                </div>
              ))}
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsEditingProfile(false)} className="flex-1 border border-border py-3 rounded-full text-sm font-bold text-muted-foreground hover:bg-muted transition-all">
                  Cancel
                </button>
                <button type="submit" data-testid="button-save-profile" className="flex-1 bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-3 rounded-full text-sm font-bold hover:bg-stone-800 dark:hover:bg-stone-100 transition-all flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-card border border-border rounded-3xl p-8 space-y-6">
              <div className="flex items-center gap-6">
                {userProfile?.avatar ? (
                  <img src={userProfile.avatar} alt={userProfile.name} className="w-20 h-20 rounded-full border-2 border-border" />
                ) : (
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-serif italic text-foreground">{userProfile?.name || 'No name set'}</h2>
                  <p className="text-muted-foreground text-sm">{userProfile?.email}</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                {[
                  { label: 'Email', value: userProfile?.email, icon: Mail },
                  { label: 'Phone', value: userProfile?.phone || 'Not set', icon: Phone },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-4">
                    <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest">{label}</p>
                      <p className="text-sm font-bold text-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsEditingProfile(true)}
                data-testid="button-edit-profile"
                className="w-full flex items-center justify-center gap-2 border border-border py-3 rounded-full text-sm font-bold hover:bg-muted transition-all text-foreground"
              >
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
