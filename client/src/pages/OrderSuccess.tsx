import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const OrderSuccess = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-32 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto"
      >
        <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-950 rounded-full flex items-center justify-center mx-auto mb-10">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>

        <h1 className="text-4xl font-serif italic text-foreground mb-6">Order Placed!</h1>
        <p className="text-muted-foreground mb-10 leading-relaxed">
          Thank you for your purchase. Your order has been received and is being processed. You will receive a
          confirmation email shortly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            data-testid="link-continue-shopping"
            className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-8 py-4 rounded-full font-bold hover:bg-stone-800 dark:hover:bg-stone-100 transition-all flex items-center justify-center gap-2"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/orders"
            className="bg-muted text-foreground px-8 py-4 rounded-full font-bold hover:bg-muted/80 transition-all flex items-center justify-center gap-2"
          >
            View Orders
          </Link>
        </div>

        <div className="mt-16 pt-10 border-t border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold mb-4">Need Help?</p>
          <p className="text-sm text-muted-foreground">
            Contact our support team at{' '}
            <span className="text-foreground font-bold">support@lumina.com</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
