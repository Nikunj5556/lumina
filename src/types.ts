export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g., "Small", "Medium", "Red", "Blue"
  type: 'size' | 'color';
  priceModifier?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  images?: string[]; // Multiple images for gallery
  description: string;
  rating: number;
  reviewsCount: number;
  reviews?: ProductReview[];
  isNew?: boolean;
  isFeatured?: boolean;
  variants?: ProductVariant[];
  stock: number; // For inventory logic
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariants?: { [key: string]: string }; // e.g., { size: "M", color: "Red" }
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  address: Address;
}

export interface UserPreferences {
  categoryFilter: string;
  priceRange: [number, number];
  ratingFilter: number;
  sortBy: 'popularity' | 'price-low' | 'price-high';
  theme: 'light' | 'dark';
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bio: string;
  joinedDate: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
}
