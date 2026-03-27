# Lumina — Minimalist Home Goods Store

## Overview
Lumina is a full-featured e-commerce app for minimalist home goods. It is a frontend-only React SPA with localStorage persistence (no backend database required for core features), served via an Express + Vite setup.

## Architecture

- **Frontend**: React + TypeScript + Vite, located in `client/src/`
- **Backend**: Express server at `server/index.ts` serving Vite on port 5000
- **Routing**: [wouter](https://github.com/molefrog/wouter) (not react-router-dom)
- **Animation**: `framer-motion` (import as `from 'framer-motion'`)
- **Styling**: Tailwind CSS with warm stone HSL color tokens in `client/src/index.css`
- **State**: React Context (`client/src/CartContext.tsx`) with localStorage persistence

## Pages
| Path | Component | Protected |
|------|-----------|-----------|
| `/` | `pages/Home.tsx` | No |
| `/shop` | `pages/Shop.tsx` | No |
| `/product/:id` | `pages/ProductDetail.tsx` | No |
| `/cart` | `pages/Cart.tsx` | No |
| `/wishlist` | `pages/Wishlist.tsx` | No |
| `/auth` | `pages/Auth.tsx` | No |
| `/checkout` | `pages/Checkout.tsx` | Yes |
| `/success` | `pages/OrderSuccess.tsx` | No |
| `/profile` | `pages/Profile.tsx` | Yes |
| `/orders` | `pages/Orders.tsx` | Yes |

## Components
- `Navbar.tsx` — Sticky desktop navbar with cart, wishlist, user links, dark mode toggle
- `BottomNav.tsx` — Fixed mobile bottom navigation (md:hidden)
- `CartDrawer.tsx` — Slide-in cart drawer (z-70)
- `ProductCard.tsx` — Product grid card with wishlist + add-to-cart
- `SupportBot.tsx` — Floating support chatbot (bottom-right)
- `Footer.tsx` — Desktop-only dark footer
- `AddressForm.tsx` — Reusable address form with validation
- `Toast.tsx` — Animated success toast (bottom-24 on mobile)

## Key Design Decisions
- **Wouter differences from react-router-dom**: `Link` uses `href`, `useLocation()` returns `[location, navigate]` tuple
- **No useNavigate()** — use `const [, navigate] = useLocation()` or `window.history.back()` for back nav
- **Mobile**: BottomNav fixed at bottom (md:hidden), main content has `pb-20 md:pb-0`
- **Dark mode**: Toggled via ThemeApplier component in App.tsx; uses `preferences.theme` in CartContext
- **No backend DB**: All state persisted in localStorage with user-scoped keys

## Color Tokens (index.css)
- Background: `40 30% 98%` (warm off-white)
- Foreground: `24 9% 10%` (dark charcoal)
- Muted: `35 20% 94%` (warm stone)
- Primary: `24 8% 12%` (same as foreground)

## Demo Coupons
- `WELCOME10` — 10% off
- `LUMINA20` — 20% off
- `FREESHIP` — $15 off shipping

## Run
```bash
npm run dev
```
Starts Express + Vite on port 5000.
