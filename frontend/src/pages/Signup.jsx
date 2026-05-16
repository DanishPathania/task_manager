import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Shield, Navigation, CheckCircle2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import CustomSelect from '../components/CustomSelect';

const schema = yup.object({
  name: yup.string().required('Name is required').max(50, 'Name cannot exceed 50 characters'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  role: yup.string().oneOf(['Admin', 'Member'], 'Invalid role').required('Role is required'),
});

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: 'Member' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authRegister(data);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: "Create Workspace", desc: "Set up your team's digital headquarters" },
    { title: "Invite Team", desc: "Bring your coworkers into the loop" },
    { title: "Boost Productivity", desc: "Start delivering projects faster" }
  ];

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col lg:flex-row">
      {/* Left Side — Visual Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-dark-900 items-center justify-center p-12">
        {/* Abstract background patterns */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-accent-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
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
              Start your <span className="gradient-text">journey</span> with TaskVita.
            </h1>
            <p className="text-dark-400 text-lg mb-10 leading-relaxed">
              Join thousands of teams who have transformed their workflow and reclaimed their time.
            </p>

            <div className="space-y-8">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0 text-primary-400 font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{step.title}</h3>
                    <p className="text-dark-400 text-sm">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[20%] right-[15%] w-40 h-40 border border-white/5 rounded-3xl rotate-12" />
          <div className="absolute bottom-[20%] left-[10%] w-32 h-32 border border-white/5 rounded-full" />
        </div>
      </div>

      {/* Right Side — Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md my-8"
        >
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4">
              <Navigation className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <h2 className="text-2xl font-bold text-white">TaskVita</h2>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-dark-400">Join TaskVita and lead your team to success</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Full Name</label>
              <div className="relative group">
                <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-dark-500 group-focus-within:text-primary-500 transition-colors" />
                <input
                  {...register('name')}
                  type="text"
                  placeholder="John Doe"
                  className="input-field pl-12 h-12"
                  id="signup-name"
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Email Address</label>
              <div className="relative group">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-dark-500 group-focus-within:text-primary-500 transition-colors" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="name@company.com"
                  className="input-field pl-12 h-12"
                  id="signup-email"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Password</label>
              <div className="relative group">
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-dark-500 group-focus-within:text-primary-500 transition-colors" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  className="input-field pl-12 pr-12 h-12"
                  id="signup-password"
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

            <div className="grid grid-cols-1 gap-4">
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    label="What is your role?"
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { value: 'Member', label: 'Team Member' },
                      { value: 'Admin', label: 'Project Administrator' },
                    ]}
                    icon={Shield}
                    error={errors.role?.message}
                  />
                )}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-gradient w-full py-3.5 flex items-center justify-center gap-2 group h-12"
                id="signup-submit"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-dark-400 text-sm mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
