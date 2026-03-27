import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  MapPin, 
  ChevronRight, 
  Trash2, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Box,
  X,
  Edit2,
  User,
  Mail,
  Phone,
  Calendar,
  Save,
  LogOut
} from 'lucide-react';
import { useCart } from '../CartContext';
import { formatPrice } from '../lib/utils';
import { Address, Order, UserProfile } from '../types';
import { cn } from '../lib/utils';
import { AddressForm } from '../components/AddressForm';
import { Link } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { orders, addresses, addAddress, removeAddress, updateAddress, userProfile, updateUserProfile, logout } = useCart();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(!userProfile);

  const [profileForm, setProfileForm] = useState<UserProfile>(userProfile || {
    name: '',
    email: '',
    phone: '',
    bio: '',
    joinedDate: new Date().toLocaleDateString()
  });

  const handleLogout = () => {
    logout();
  };

  const handleAddAddress = (formData: Omit<Address, 'id'>) => {
    const address: Address = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
    };
    addAddress(address);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-serif italic mb-2 dark:text-white">
          {userProfile ? `Welcome back, ${userProfile.name.split(' ')[0]}` : 'Welcome back'}
        </h1>
        <p className="text-stone-500">Manage your profile, orders and saved addresses</p>
      </div>

      <div className="flex gap-8 border-b border-stone-200 dark:border-stone-800 mb-10 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('orders')}
          className={cn(
            "pb-4 text-sm font-bold uppercase tracking-widest transition-all relative whitespace-nowrap",
            activeTab === 'orders' ? "text-stone-900 dark:text-white" : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
          )}
        >
          Orders
          {activeTab === 'orders' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 dark:bg-white" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={cn(
            "pb-4 text-sm font-bold uppercase tracking-widest transition-all relative whitespace-nowrap",
            activeTab === 'addresses' ? "text-stone-900 dark:text-white" : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
          )}
        >
          Addresses
          {activeTab === 'addresses' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 dark:bg-white" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={cn(
            "pb-4 text-sm font-bold uppercase tracking-widest transition-all relative whitespace-nowrap",
            activeTab === 'profile' ? "text-stone-900 dark:text-white" : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
          )}
        >
          Profile Info
          {activeTab === 'profile' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 dark:bg-white" />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'orders' ? (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {orders.length === 0 ? (
              <div className="text-center py-20 bg-stone-50 dark:bg-stone-900 rounded-3xl">
                <Package className="w-12 h-12 text-stone-200 dark:text-stone-700 mx-auto mb-4" />
                <p className="text-stone-500">You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
                <div className="flex justify-center pt-4">
                  <Link 
                    to="/orders" 
                    className="text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors flex items-center gap-2"
                  >
                    View Full Order History
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        ) : activeTab === 'addresses' ? (
          <motion.div
            key="addresses"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {addresses.map((address) => (
              <div key={address.id} className="bg-white dark:bg-stone-950 border border-stone-100 dark:border-stone-900 p-6 rounded-2xl relative group">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingAddress(address)}
                    className="text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeAddress(address.id)}
                    className="text-stone-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-stone-400 mt-1" />
                  <div>
                    <h3 className="font-bold text-stone-900 dark:text-white">{address.firstName} {address.lastName}</h3>
                    <p className="text-sm text-stone-500">{address.email}</p>
                  </div>
                </div>
                <div className="text-sm text-stone-600 dark:text-stone-400 space-y-1">
                  <p>{address.address}</p>
                  <p>{address.city}, {address.state} {address.zip}</p>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => setIsAddingAddress(true)}
              className="border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-stone-400 hover:text-stone-600 hover:border-stone-400 dark:hover:border-stone-600 transition-all min-h-[160px]"
            >
              <Plus className="w-6 h-6" />
              <span className="text-sm font-bold uppercase tracking-widest">Add New Address</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl"
          >
            <div className="bg-white dark:bg-stone-950 border border-stone-100 dark:border-stone-900 p-8 rounded-3xl">
              {isEditingProfile ? (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type="text"
                          required
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full bg-stone-50 dark:bg-stone-900 border-none rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-stone-900 dark:focus:ring-white transition-all dark:text-white"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type="email"
                          required
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full bg-stone-50 dark:bg-stone-900 border-none rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-stone-900 dark:focus:ring-white transition-all dark:text-white"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type="tel"
                          required
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full bg-stone-50 dark:bg-stone-900 border-none rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-stone-900 dark:focus:ring-white transition-all dark:text-white"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Joined Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type="text"
                          disabled
                          value={profileForm.joinedDate}
                          className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl py-3 pl-12 pr-4 text-stone-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Bio / Notes</label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className="w-full bg-stone-50 dark:bg-stone-900 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-stone-900 dark:focus:ring-white transition-all min-h-[120px] dark:text-white"
                      placeholder="Tell us a bit about yourself..."
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-4 rounded-xl font-bold hover:bg-stone-800 dark:hover:bg-stone-100 transition-all flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Profile
                    </button>
                    {userProfile && (
                      <button
                        type="button"
                        onClick={() => {
                          setProfileForm(userProfile);
                          setIsEditingProfile(false);
                        }}
                        className="px-8 py-4 rounded-xl font-bold text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-900 transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <div className="space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-stone-100 dark:bg-stone-900 rounded-3xl flex items-center justify-center">
                        <User className="w-10 h-10 text-stone-300 dark:text-stone-700" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-stone-900 dark:text-white">{userProfile?.name}</h2>
                        <p className="text-stone-500">{userProfile?.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="p-3 bg-stone-100 dark:bg-stone-900 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-stone-900 transition-all"
                        title="Edit Profile"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleLogout}
                        className="p-3 bg-stone-100 dark:bg-stone-900 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-red-500 hover:text-white transition-all"
                        title="Logout"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Phone</p>
                      <p className="text-stone-900 dark:text-white font-medium">{userProfile?.phone}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Member Since</p>
                      <p className="text-stone-900 dark:text-white font-medium">{userProfile?.joinedDate}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Bio</p>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed italic">
                      {userProfile?.bio || "No bio added yet."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Address Modal */}
      <AnimatePresence>
        {(isAddingAddress || editingAddress) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAddingAddress(false);
                setEditingAddress(null);
              }}
              className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-auto md:w-full md:max-w-lg bg-white dark:bg-stone-950 z-50 rounded-3xl p-8 shadow-2xl border border-stone-100 dark:border-stone-900"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-serif italic dark:text-white">
                  {editingAddress ? 'Edit Address' : 'New Address'}
                </h2>
                <button 
                  onClick={() => {
                    setIsAddingAddress(false);
                    setEditingAddress(null);
                  }}
                  className="text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <AddressForm
                initialData={editingAddress || {}}
                onSubmit={editingAddress ? handleEditAddress : handleAddAddress}
                onCancel={() => {
                  setIsAddingAddress(false);
                  setEditingAddress(null);
                }}
                submitLabel={editingAddress ? 'Save Changes' : 'Add Address'}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);

  const statusSteps = [
    { label: 'Processing', icon: Clock, color: 'text-amber-500' },
    { label: 'Shipped', icon: Truck, color: 'text-blue-500' },
    { label: 'Delivered', icon: CheckCircle2, color: 'text-emerald-500' },
  ];

  const currentStepIndex = statusSteps.findIndex(s => s.label === order.status);

  return (
    <div className="bg-white dark:bg-stone-950 rounded-3xl overflow-hidden border border-stone-100 dark:border-stone-900 shadow-sm">
      <div 
        className="p-6 cursor-pointer hover:bg-stone-50/50 dark:hover:bg-stone-900/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-stone-100 dark:bg-stone-900 rounded-2xl flex items-center justify-center">
              <Box className="w-6 h-6 text-stone-400" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-white">Order #{order.id}</h3>
              <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">{order.date}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-xs text-stone-400 uppercase tracking-widest font-bold mb-1">Status</p>
              <span className={cn(
                "text-sm font-bold",
                order.status === 'Delivered' ? "text-emerald-500" : "text-amber-500"
              )}>
                {order.status}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-stone-400 uppercase tracking-widest font-bold mb-1">Total</p>
              <p className="text-sm font-bold text-stone-900 dark:text-white">{formatPrice(order.total)}</p>
            </div>
            <ChevronRight className={cn("w-5 h-5 text-stone-300 transition-transform", isOpen && "rotate-90")} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-8 bg-stone-50/50 dark:bg-stone-900/50 border-t border-stone-100 dark:border-stone-900 space-y-10">
              {/* Progress Tracker */}
              <div className="relative flex justify-between max-w-2xl mx-auto">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-stone-200 dark:bg-stone-800 z-0" />
                <div 
                  className="absolute top-5 left-0 h-0.5 bg-stone-900 dark:bg-white z-0 transition-all duration-1000" 
                  style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                />
                
                {statusSteps.map((step, i) => {
                  const Icon = step.icon;
                  const isActive = i <= currentStepIndex;
                  return (
                    <div key={step.label} className="relative z-10 flex flex-col items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                        isActive ? "bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-lg" : "bg-white dark:bg-stone-950 text-stone-300 dark:text-stone-700 border-2 border-stone-100 dark:border-stone-900"
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={cn(
                        "text-[10px] uppercase tracking-widest font-bold",
                        isActive ? "text-stone-900 dark:text-white" : "text-stone-300 dark:text-stone-700"
                      )}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Items */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-stone-400">Items</h4>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-12 h-16 rounded-lg overflow-hidden bg-white dark:bg-stone-900 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-900 dark:text-white">{item.name}</p>
                          <p className="text-xs text-stone-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-stone-400">Shipping Address</h4>
                  <div className="text-sm text-stone-600 dark:text-stone-400 space-y-1">
                    <p className="font-bold text-stone-900 dark:text-white">{order.address.firstName} {order.address.lastName}</p>
                    <p>{order.address.address}</p>
                    <p>{order.address.city}, {order.address.state} {order.address.zip}</p>
                    <p>{order.address.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
