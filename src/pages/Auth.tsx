import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../CartContext';
import { cn } from '../lib/utils';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as any)?.from?.pathname || '/profile';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for "demo" feel
    await new Promise(resolve => setTimeout(resolve, 800));

    if (isLogin) {
      const success = login(email, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Invalid email or password. Try "demo@example.com" / "password" if you have signed up.');
      }
    } else {
      if (!name || !email || !password) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }
      const success = signup({
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        phone: '',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
      }, password);
      
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Email already exists');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-stone-900 dark:bg-white mb-6">
            <ShoppingBag className="w-8 h-8 text-white dark:text-stone-900" />
          </div>
          <h1 className="text-3xl font-serif italic text-stone-900 dark:text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-stone-500 dark:text-stone-400">
            {isLogin ? 'Enter your details to access your account' : 'Join Lumina for a personalized experience'}
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-stone-200/50 dark:shadow-none border border-stone-100 dark:border-stone-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                      type="text"
                      required={!isLogin}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-stone-900 dark:focus:border-white transition-colors dark:text-white"
                      placeholder="John Doe"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-stone-900 dark:focus:border-white transition-colors dark:text-white"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-400">Password</label>
                {isLogin && (
                  <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-stone-900 dark:focus:border-white transition-colors dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-stone-800 dark:hover:bg-stone-100 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 dark:border-stone-900/30 border-t-white dark:border-t-stone-900 rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-stone-50 dark:border-stone-800 text-center">
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="ml-2 font-bold text-stone-900 dark:text-white hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        {isLogin && (
          <div className="mt-8 p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800">
            <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2 text-center">Demo Credentials</p>
            <div className="flex justify-center gap-4 text-xs">
              <span className="text-stone-500">Email: <code className="text-stone-900 dark:text-white font-bold">demo@example.com</code></span>
              <span className="text-stone-500">Pass: <code className="text-stone-900 dark:text-white font-bold">password</code></span>
            </div>
            <p className="text-[10px] text-stone-400 mt-2 text-center italic">* Sign up first to use these or any other credentials</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
