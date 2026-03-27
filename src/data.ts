import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Minimalist Ceramic Vase',
    price: 45.00,
    category: 'Home Decor',
    image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1578500484748-4829868607d9?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Handcrafted ceramic vase with a matte finish. Perfect for minimalist interiors and single stem arrangements.',
    rating: 4.8,
    reviewsCount: 124,
    reviews: [
      { id: 'r1', userName: 'Alex M.', rating: 5, comment: 'Beautiful and simple. Exactly what I wanted.', date: '2024-03-15' },
      { id: 'r2', userName: 'Sarah K.', rating: 4, comment: 'A bit smaller than expected but very high quality.', date: '2024-03-10' },
      { id: 'r3', userName: 'James L.', rating: 5, comment: 'The texture is amazing. Highly recommend!', date: '2024-02-28' }
    ],
    isFeatured: true,
    stock: 5,
    variants: [
      { id: 'v1', name: 'Small', type: 'size' },
      { id: 'v2', name: 'Large', type: 'size', priceModifier: 15 }
    ]
  },
  {
    id: '2',
    name: 'Pure Cotton Bed Linen',
    price: 120.00,
    category: 'Bedding',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1505693419173-42b9258a634e?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Ultra-soft 400 thread count Egyptian cotton bed linen set. Breathable and durable for a perfect night sleep.',
    rating: 4.9,
    reviewsCount: 89,
    reviews: [
      { id: 'r4', userName: 'Emily R.', rating: 5, comment: 'Like sleeping on a cloud. Best purchase ever.', date: '2024-03-20' },
      { id: 'r5', userName: 'Michael T.', rating: 5, comment: 'Great quality, washes well.', date: '2024-03-05' }
    ],
    isNew: true,
    stock: 12,
    variants: [
      { id: 'v3', name: 'White', type: 'color' },
      { id: 'v4', name: 'Grey', type: 'color' },
      { id: 'v5', name: 'King', type: 'size', priceModifier: 30 }
    ]
  },
  {
    id: '3',
    name: 'Abstract Wall Art',
    price: 75.00,
    category: 'Home Decor',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
    description: 'Original abstract painting on canvas. Adds a sophisticated touch of color to any modern living space.',
    rating: 4.7,
    reviewsCount: 56,
    reviews: [
      { id: 'r6', userName: 'David W.', rating: 4, comment: 'Looks great in my living room.', date: '2024-02-15' }
    ],
    stock: 3,
  },
  {
    id: '4',
    name: 'Scented Soy Candle',
    price: 28.00,
    category: 'Fragrance',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800',
    description: 'Natural soy wax candle with essential oils of sandalwood and bergamot. 40-hour burn time.',
    rating: 4.6,
    reviewsCount: 210,
    reviews: [
      { id: 'r7', userName: 'Jessica B.', rating: 5, comment: 'The scent is divine and lasts long.', date: '2024-03-18' },
      { id: 'r8', userName: 'Tom H.', rating: 4, comment: 'Nice smell, but a bit pricey for the size.', date: '2024-03-12' }
    ],
    isFeatured: true,
    stock: 50,
    variants: [
      { id: 'v6', name: 'Sandalwood', type: 'color' },
      { id: 'v7', name: 'Lavender', type: 'color' }
    ]
  },
  {
    id: '5',
    name: 'Oak Wood Coffee Table',
    price: 350.00,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800',
    description: 'Solid oak coffee table with a natural oil finish. Features a lower shelf for storage and clean, tapered legs.',
    rating: 4.9,
    reviewsCount: 34,
    reviews: [
      { id: 'r9', userName: 'Robert C.', rating: 5, comment: 'Solid build and beautiful wood grain.', date: '2024-03-01' }
    ],
    isNew: true,
    stock: 2,
  },
  {
    id: '6',
    name: 'Linen Throw Pillow',
    price: 35.00,
    category: 'Home Decor',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800',
    description: 'Soft linen pillow cover with a hidden zipper. Available in multiple earthy tones to complement your sofa.',
    rating: 4.5,
    reviewsCount: 145,
    reviews: [
      { id: 'r10', userName: 'Anna S.', rating: 4, comment: 'Very soft and the color is perfect.', date: '2024-02-20' }
    ],
    stock: 20,
    variants: [
      { id: 'v8', name: 'Beige', type: 'color' },
      { id: 'v9', name: 'Terracotta', type: 'color' }
    ]
  },
  {
    id: '7',
    name: 'Brass Desk Lamp',
    price: 85.00,
    category: 'Lighting',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
    description: 'Elegant brass desk lamp with an adjustable arm. Provides warm, focused light for your workspace.',
    rating: 4.8,
    reviewsCount: 72,
    reviews: [
      { id: 'r11', userName: 'Chris P.', rating: 5, comment: 'Stylish and functional. Great for late night work.', date: '2024-03-10' }
    ],
    isFeatured: true,
    stock: 0, // Out of stock demo
  },
  {
    id: '8',
    name: 'Wool Area Rug',
    price: 220.00,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1534889156217-d3c8ef4caac2?auto=format&fit=crop&q=80&w=800',
    description: 'Hand-tufted wool rug with a subtle geometric pattern. Durable and soft underfoot.',
    rating: 4.7,
    reviewsCount: 43,
    reviews: [
      { id: 'r12', userName: 'Megan D.', rating: 5, comment: 'High quality rug. Feels great underfoot.', date: '2024-03-05' }
    ],
    stock: 10,
  },
];

export const CATEGORIES = ['All', 'Home Decor', 'Bedding', 'Fragrance', 'Furniture', 'Lighting'];
