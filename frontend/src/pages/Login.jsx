import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Navigation, CheckCircle2, ArrowRight, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';

const schema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
  securityKey: yup.string().when('isAdmin', {
    is: true,
    then: (schema) => schema.required('Security key is required for admins'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "Real-time task synchronization",
    "Comprehensive project analytics",
    "Role-based access control",
    "Seamless team collaboration"
  ];

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col lg:flex-row">
      {/* Left Side — Visual Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-dark-900 items-center justify-center p-12">
        {/* Abstract background patterns */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-accent-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-lg w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-8 shadow-glow">
              <Navigation className="w-8 h-8 text-white" fill="currentColor" />
            </div>
            <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">
              Manage your <span className="gradient-text">projects</span> with speed and style.
            </h1>
            <p className="text-dark-400 text-lg mb-10 leading-relaxed">
              TaskVita helps teams stay organized, track progress, and deliver high-quality work without the chaos.
            </p>

            <div className="space-y-4">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3 text-dark-200"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary-500" />
                  <span className="font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Floating elements for depth */}
        <motion.div 
          animate={{ y: [0, -20, 0] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-32 h-32 glass-card-sm opacity-20 border-white/10"
        />
        <motion.div 
          animate={{ y: [0, 20, 0] }} 
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 left-1/3 w-24 h-24 glass-card-sm opacity-10 border-white/10 rounded-full"
        />
      </div>

      {/* Right Side — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4">
              <Navigation className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <h2 className="text-2xl font-bold text-white">TaskVita</h2>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-dark-400">Please enter your details to sign in</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Email Address</label>
              <div className="relative group">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-dark-500 group-focus-within:text-primary-500 transition-colors" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="name@company.com"
                  className="input-field pl-12 h-13"
                  id="login-email"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-dark-300">Password</label>
                <Link to="#" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-dark-500 group-focus-within:text-primary-500 transition-colors" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pl-12 pr-12 h-13"
                  id="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500/50 w-4 h-4" />
                <label htmlFor="remember" className="text-sm text-dark-400 cursor-pointer">Remember me</label>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="isAdmin" 
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="rounded border-dark-600 bg-dark-800 text-accent-500 focus:ring-accent-500/50 w-4 h-4" 
                />
                <label htmlFor="isAdmin" className="text-sm text-dark-400 cursor-pointer font-medium text-accent-400">Admin Login?</label>
              </div>
            </div>

            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-accent-300 mb-2">Admin Security Key</label>
                <div className="relative group">
                  <Shield className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-accent-500 group-focus-within:text-accent-400 transition-colors" />
                  <input
                    {...register('securityKey')}
                    type="password"
                    placeholder="Enter security key"
                    className="input-field pl-12 h-13 border-accent-500/30 focus:border-accent-500/50"
                    id="login-security-key"
                  />
                </div>
                {errors.securityKey && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.securityKey.message}</p>}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full py-3.5 flex items-center justify-center gap-2 group h-13"
              id="login-submit"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-dark-400 text-sm mt-8">
            New to TaskVita?{' '}
            <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
