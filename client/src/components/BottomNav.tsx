import { Link, useLocation } from 'wouter';
import { Home, ShoppingBag, Heart, User, Store } from 'lucide-react';
import { useCart } from '../CartContext';
import { cn } from '../lib/utils';

export const BottomNav = () => {
  const { totalItems, wishlist, userProfile } = useCart();
  const [location] = useLocation();

  const navItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Shop', icon: Store, href: '/shop' },
    { label: 'Wishlist', icon: Heart, href: '/wishlist', badge: wishlist.length },
    { label: 'Cart', icon: ShoppingBag, href: '/cart', badge: totalItems },
    { label: userProfile ? 'Profile' : 'Sign In', icon: User, href: userProfile ? '/profile' : '/auth' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-background/95 backdrop-blur-md border-t border-border pb-safe">
      <div className="flex items-center justify-around px-2 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || (item.href === '/shop' && location.startsWith('/product'));
          return (
            <Link
              key={item.href}
              href={item.href}
              data-testid={`bottom-nav-${item.label.toLowerCase()}`}
              className="flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-xl relative min-w-[56px]"
            >
              <div className="relative">
                <Icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-1.5 bg-foreground text-background text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                ) : null}
              </div>
              <span className={cn(
                "text-[10px] font-medium tracking-wide transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-foreground rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
