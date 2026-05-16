import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h1 className="text-9xl font-black gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-bold text-dark-200 mb-2">Page Not Found</h2>
        <p className="text-dark-400 mb-8 max-w-md">The page you are looking for doesn&apos;t exist or has been moved.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-gradient flex items-center gap-2 mx-auto">
          <Home className="w-4 h-4" /> Go to Dashboard
        </button>
      </motion.div>
    </div>
  );
};

export default NotFound;
