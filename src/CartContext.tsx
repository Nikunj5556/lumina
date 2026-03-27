import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, UserPreferences, Order, Address, UserProfile, Coupon, Product, ProductReview } from './types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
  orders: Order[];
  addOrder: (order: Order) => void;
  addresses: Address[];
  addAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  updateAddress: (address: Address) => void;
  userProfile: UserProfile | null;
  updateUserProfile: (profile: UserProfile) => void;
  login: (email: string, password: string) => boolean;
  signup: (profile: UserProfile, password: string) => boolean;
  logout: () => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  recentlyViewed: string[];
  addToRecentlyViewed: (id: string) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  productReviews: { [productId: string]: ProductReview[] };
  addProductReview: (productId: string, review: ProductReview) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DEFAULT_PREFERENCES: UserPreferences = {
  categoryFilter: 'All',
  priceRange: [0, 500],
  ratingFilter: 0,
  sortBy: 'popularity',
  theme: 'light',
};

const COUPONS: Coupon[] = [
  { code: 'WELCOME10', discountType: 'percentage', value: 10 },
  { code: 'LUMINA20', discountType: 'percentage', value: 20 },
  { code: 'FREESHIP', discountType: 'fixed', value: 15 },
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('lumina_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const userId = userProfile?.id || 'guest';
    const saved = localStorage.getItem(`lumina_cart_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const userId = userProfile?.id || 'guest';
    const saved = localStorage.getItem(`lumina_prefs_${userId}`);
    return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const userId = userProfile?.id || 'guest';
    const saved = localStorage.getItem(`lumina_orders_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [addresses, setAddresses] = useState<Address[]>(() => {
    const userId = userProfile?.id || 'guest';
    const saved = localStorage.getItem(`lumina_addresses_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const userId = userProfile?.id || 'guest';
    const saved = localStorage.getItem(`lumina_wishlist_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    const userId = userProfile?.id || 'guest';
    const saved = localStorage.getItem(`lumina_recent_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    const userId = userProfile?.id || 'guest';
    const saved = localStorage.getItem(`lumina_coupon_${userId}`);
    return saved ? JSON.parse(saved) : null;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  const [productReviews, setProductReviews] = useState<{ [productId: string]: ProductReview[] }>(() => {
    const saved = localStorage.getItem('lumina_reviews');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('lumina_reviews', JSON.stringify(productReviews));
  }, [productReviews]);

  const addProductReview = (productId: string, review: ProductReview) => {
    setProductReviews(prev => ({
      ...prev,
      [productId]: [...(prev[productId] || []), review]
    }));
  };

  useEffect(() => {
    const userId = userProfile?.id || 'guest';
    const savedCart = localStorage.getItem(`lumina_cart_${userId}`);
    const savedPrefs = localStorage.getItem(`lumina_prefs_${userId}`);
    const savedOrders = localStorage.getItem(`lumina_orders_${userId}`);
    const savedAddresses = localStorage.getItem(`lumina_addresses_${userId}`);
    const savedWishlist = localStorage.getItem(`lumina_wishlist_${userId}`);
    const savedRecent = localStorage.getItem(`lumina_recent_${userId}`);
    const savedCoupon = localStorage.getItem(`lumina_coupon_${userId}`);

    setCart(savedCart ? JSON.parse(savedCart) : []);
    setPreferences(savedPrefs ? JSON.parse(savedPrefs) : DEFAULT_PREFERENCES);
    setOrders(savedOrders ? JSON.parse(savedOrders) : []);
    setAddresses(savedAddresses ? JSON.parse(savedAddresses) : []);
    setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
    setRecentlyViewed(savedRecent ? JSON.parse(savedRecent) : []);
    setAppliedCoupon(savedCoupon ? JSON.parse(savedCoupon) : null);
  }, [userProfile?.id]);

  useEffect(() => {
    const userId = userProfile?.id || 'guest';
    localStorage.setItem(`lumina_cart_${userId}`, JSON.stringify(cart));
  }, [cart, userProfile?.id]);

  useEffect(() => {
    const userId = userProfile?.id || 'guest';
    localStorage.setItem(`lumina_prefs_${userId}`, JSON.stringify(preferences));
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences, userProfile?.id]);

  useEffect(() => {
    const userId = userProfile?.id || 'guest';
    localStorage.setItem(`lumina_orders_${userId}`, JSON.stringify(orders));
  }, [orders, userProfile?.id]);

  useEffect(() => {
    const userId = userProfile?.id || 'guest';
    localStorage.setItem(`lumina_addresses_${userId}`, JSON.stringify(addresses));
  }, [addresses, userProfile?.id]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('lumina_current_user', JSON.stringify(userProfile));
      // Also update the users list
      const savedUsers = localStorage.getItem('lumina_users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      const updatedUsers = users.map((u: any) => u.profile.id === userProfile.id ? { ...u, profile: userProfile } : u);
      localStorage.setItem('lumina_users', JSON.stringify(updatedUsers));
    } else {
      localStorage.removeItem('lumina_current_user');
    }
  }, [userProfile]);

  useEffect(() => {
    const userId = userProfile?.id || 'guest';
    localStorage.setItem(`lumina_wishlist_${userId}`, JSON.stringify(wishlist));
  }, [wishlist, userProfile?.id]);

  useEffect(() => {
    const userId = userProfile?.id || 'guest';
    localStorage.setItem(`lumina_recent_${userId}`, JSON.stringify(recentlyViewed));
  }, [recentlyViewed, userProfile?.id]);

  useEffect(() => {
    const userId = userProfile?.id || 'guest';
    localStorage.setItem(`lumina_coupon_${userId}`, JSON.stringify(appliedCoupon));
  }, [appliedCoupon, userProfile?.id]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => 
        i.id === item.id && 
        JSON.stringify(i.selectedVariants) === JSON.stringify(item.selectedVariants)
      );
      if (existing) {
        return prev.map((i) =>
          (i.id === item.id && JSON.stringify(i.selectedVariants) === JSON.stringify(item.selectedVariants))
            ? { ...i, quantity: i.quantity + item.quantity } 
            : i
        );
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const addAddress = (address: Address) => {
    setAddresses((prev) => [...prev, address]);
  };

  const removeAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const updateAddress = (address: Address) => {
    setAddresses((prev) => prev.map((a) => (a.id === address.id ? address : a)));
  };

  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const login = (email: string, password: string) => {
    const savedUsers = localStorage.getItem('lumina_users');
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    const user = users.find((u: any) => u.profile.email === email && u.password === password);
    
    if (user) {
      setUserProfile(user.profile);
      return true;
    }
    return false;
  };

  const signup = (profile: UserProfile, password: string) => {
    const savedUsers = localStorage.getItem('lumina_users');
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    
    if (users.find((u: any) => u.profile.email === profile.email)) {
      return false;
    }

    const newUser = { profile, password };
    localStorage.setItem('lumina_users', JSON.stringify([...users, newUser]));
    setUserProfile(profile);
    return true;
  };

  const logout = () => {
    setUserProfile(null);
    setCart([]);
    setOrders([]);
    setAddresses([]);
    setWishlist([]);
    setRecentlyViewed([]);
    setAppliedCoupon(null);
    window.location.href = '/';
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const addToRecentlyViewed = (id: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter(i => i !== id);
      return [id, ...filtered].slice(0, 10);
    });
  };

  const applyCoupon = (code: string) => {
    const coupon = COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (coupon) {
      setAppliedCoupon(coupon);
      return true;
    }
    return false;
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        preferences,
        setPreferences,
        orders,
        addOrder,
        addresses,
        addAddress,
        removeAddress,
        updateAddress,
        userProfile,
        updateUserProfile,
        login,
        signup,
        logout,
        wishlist,
        toggleWishlist,
        recentlyViewed,
        addToRecentlyViewed,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        productReviews,
        addProductReview,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
