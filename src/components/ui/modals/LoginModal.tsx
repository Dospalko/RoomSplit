"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight, FiX, FiEye, FiEyeOff } from 'react-icons/fi';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (user: { id: number; email: string; name: string }) => void;
}

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
}

const AnimatedInput = ({ icon, ...props }: AnimatedInputProps) => (
  <motion.div 
    className="relative"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
      {icon}
    </div>
    <input
      {...props}
      className="w-full px-4 py-4 pl-12 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-600 focus:bg-slate-800"
    />
  </motion.div>
);

export default function LoginModal({ onClose, onLogin }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { email: formData.email, name: formData.name, password: formData.password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onLogin(data.user);
        onClose();
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl" 
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="relative w-full max-w-4xl h-auto md:h-[700px] bg-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Left Panel - Branding */}
          <div className="hidden md:flex w-full md:w-1/2 p-12 flex-col justify-between bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
            <motion.div 
              className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full opacity-50"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            ></motion.div>
            <motion.div 
              className="absolute -bottom-24 -right-10 w-72 h-72 bg-white/10 rounded-full opacity-50"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, -90, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
                delay: 5
              }}
            ></motion.div>
            <div>
              <motion.h1 
                className="text-4xl font-bold text-white tracking-tight"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >RoomSplit</motion.h1>
              <motion.p 
                className="text-white/80 mt-4 text-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >Share expenses, not headaches. The simplest way to manage group finances.</motion.p>
            </div>
            <motion.div 
              className="text-white/60 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              &copy; {new Date().getFullYear()} RoomSplit Inc. All rights reserved.
            </motion.div>
          </div>

          {/* Right Panel - Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-slate-900">
            <motion.button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-slate-500 hover:bg-slate-800 hover:text-white rounded-full transition-all duration-200 group"
              whileHover={{ scale: 1.1, rotate: 90 }}
            >
              <FiX className="w-6 h-6" />
            </motion.button>
            
            <div className="w-full max-w-sm mx-auto">
              <motion.h2 
                className="text-3xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >{isLogin ? 'Welcome Back' : 'Create Account'}</motion.h2>
              <motion.p 
                className="text-slate-400 mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >{isLogin ? 'Enter your credentials to access your account.' : 'Join us and start splitting expenses.'}</motion.p>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    className="mb-6 p-4 bg-red-900/50 border border-red-500/30 rounded-xl"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <p className="text-sm text-red-300">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <AnimatedInput
                      key="name"
                      icon={<FiUser />}
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required={!isLogin}
                      placeholder="Full Name"
                    />
                  )}
                </AnimatePresence>

                <AnimatedInput
                  icon={<FiMail />}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Email Address"
                />

                <div className="relative">
                  <AnimatedInput
                    icon={<FiLock />}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Password"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={showPassword ? 'eye-off' : 'eye'}
                        initial={{ opacity: 0, rotate: -45 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 45 }}
                        transition={{ duration: 0.2 }}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </motion.div>
                    </AnimatePresence>
                  </motion.button>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatePresence>
                    {loading ? (
                      <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-3"
                      >
                        <motion.div 
                          className="w-5 h-5 rounded-full border-2 border-white border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        ></motion.div>
                        <span>{isLogin ? 'Signing In...' : 'Creating...'}</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-3"
                      >
                        <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                        <motion.div
                          initial={{ x: 0 }}
                          animate={{ x: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                          className="transform group-hover:translate-x-1 transition-transform duration-200"
                        >
                          <FiArrowRight />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                <div className="mt-6 text-center">
                  <p className="text-slate-500">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                        setFormData({ email: '', name: '', password: '' });
                      }}
                      className="ml-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200 hover:underline"
                    >
                      {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
