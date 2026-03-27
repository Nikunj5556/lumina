import { Switch, Route, Redirect } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CartProvider, useCart } from './CartContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SupportBot } from './components/SupportBot';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import OrderSuccess from './pages/OrderSuccess';
import NotFound from './pages/not-found';
import { useEffect } from 'react';

function ThemeApplier() {
  const { preferences } = useCart();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', preferences.theme === 'dark');
  }, [preferences.theme]);
  return null;
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { userProfile } = useCart();
  if (!userProfile) return <Redirect to="/auth" />;
  return <Component />;
}

function Router() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <ThemeApplier />
      <Navbar />
      <CartDrawer />
      <main className="flex-1 pb-20 md:pb-0">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/shop" component={Shop} />
          <Route path="/product/:id" component={ProductDetail} />
          <Route path="/cart" component={Cart} />
          <Route path="/wishlist" component={Wishlist} />
          <Route path="/auth" component={Auth} />
          <Route path="/checkout">
            <ProtectedRoute component={Checkout} />
          </Route>
          <Route path="/success" component={OrderSuccess} />
          <Route path="/profile">
            <ProtectedRoute component={Profile} />
          </Route>
          <Route path="/orders">
            <ProtectedRoute component={Orders} />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <SupportBot />
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Router />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
