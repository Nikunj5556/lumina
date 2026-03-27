import { Link } from 'wouter';
import { Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="hidden md:block bg-stone-950 text-white py-20 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-serif italic">Lumina</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Curated minimalist home goods for the modern living experience.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-8">Shop</h4>
            <ul className="space-y-4 text-sm text-stone-400">
              <li><Link href="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Featured</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Best Sellers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-8">Company</h4>
            <ul className="space-y-4 text-sm text-stone-400">
              <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-8">Newsletter</h4>
            <p className="text-sm text-stone-400 mb-6">Join our list for exclusive offers and design inspiration.</p>
            <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email address"
                className="bg-stone-800 border-none rounded-full px-4 py-2 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-white transition-all text-white"
              />
              <button type="submit" className="bg-white text-stone-900 p-2 rounded-full hover:bg-stone-200 transition-all">
                <Mail className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-10 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-stone-500">© 2026 Lumina Store. All rights reserved.</p>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold text-stone-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Shipping Info</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
