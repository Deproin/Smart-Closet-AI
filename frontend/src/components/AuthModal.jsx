import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, Lock, User as UserIcon, X, Sparkles, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function AuthModal({ isOpen, onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const params = new URLSearchParams();
        params.append('username', formData.username);
        params.append('password', formData.password);

        const res = await axios.post('http://127.0.0.1:8000/auth/login', params);
        localStorage.setItem('token', res.data.access_token);
        onLogin(formData.username);
      } else {
        await axios.post('http://127.0.0.1:8000/auth/register', {
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        setSuccess("Account created! Switching to login...");
        setTimeout(() => {
          setIsLogin(true);
          setSuccess('');
          setFormData(f => ({ ...f, password: '' }));
        }, 1500);
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) setError(detail[0].msg);
      else setError(detail || "An error occurred. Check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-pink-300 transition-all placeholder:text-slate-400";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[101] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)]"
          >
            {/* Header gradient band */}
            <div className="relative h-36 premium-gradient flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-2">
                <Sparkles size={22} className="text-white" />
              </div>
              <h2 className="text-xl font-black text-white">
                {isLogin ? 'Welcome Back' : 'Join SmartCloset'}
              </h2>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-all"
            >
              <X size={18} />
            </button>

            {/* Form */}
            <div className="p-8">
              <p className="text-slate-500 text-center mb-6 font-medium text-sm">
                {isLogin ? 'Enter your details to pick up where you left off.' : 'Create an account to digitize your wardrobe.'}
              </p>

              {/* Error / Success */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl mb-5 text-sm font-bold">
                    ⚠ {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-2xl mb-5 text-sm font-bold">
                    ✓ {success}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text" placeholder="Username" required
                    className={inputClass}
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>

                {/* Email (Signup only) */}
                <AnimatePresence>
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="relative overflow-hidden"
                    >
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="email" placeholder="Email Address" required
                        className={inputClass}
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Password */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password" placeholder="Password" required
                    className={inputClass}
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                {/* Submit */}
                <button
                  disabled={loading}
                  className="w-full py-4 premium-gradient text-white rounded-2xl font-black shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                  {isLogin ? 'Sign In to Closet' : 'Create Account'}
                </button>
              </form>

              {/* Toggle */}
              <p className="mt-6 text-center text-slate-500 text-sm font-medium">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
                  className="ml-2 text-pink-600 font-black hover:underline"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
