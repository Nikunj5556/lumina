import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, ShoppingBag } from 'lucide-react';

export const OrderSuccess: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-32 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto"
      >
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-10">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        
        <h1 className="text-4xl font-serif italic text-stone-900 mb-6">Order Placed!</h1>
        <p className="text-stone-500 mb-10 leading-relaxed">
          Thank you for your purchase. Your order has been received and is being processed. 
          You will receive a confirmation email shortly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/shop"
            className="bg-stone-900 text-white px-8 py-4 rounded-full font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="bg-stone-100 text-stone-900 px-8 py-4 rounded-full font-bold hover:bg-stone-200 transition-all flex items-center justify-center gap-2"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-16 pt-10 border-t border-stone-100">
          <p className="text-xs text-stone-400 uppercase tracking-[0.2em] font-bold mb-4">Need Help?</p>
          <p className="text-sm text-stone-500">
            Contact our support team at <span className="text-stone-900 font-bold">support@lumina.com</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
