import { motion } from 'framer-motion';

const Loader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-4 border-dark-700 border-t-primary-500 animate-spin" />
      <div className="w-12 h-12 rounded-full border-4 border-transparent border-b-accent-500 animate-spin absolute inset-0" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="glass-card p-5 animate-pulse">
    <div className="h-4 bg-dark-700 rounded w-3/4 mb-3" />
    <div className="h-3 bg-dark-700 rounded w-full mb-2" />
    <div className="h-3 bg-dark-700 rounded w-2/3 mb-4" />
    <div className="flex gap-2">
      <div className="h-6 bg-dark-700 rounded-full w-16" />
      <div className="h-6 bg-dark-700 rounded-full w-20" />
    </div>
  </div>
);

const SkeletonTable = ({ rows = 5 }) => (
  <div className="glass-card overflow-hidden animate-pulse">
    <div className="h-12 bg-dark-800 border-b border-dark-700" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-14 border-b border-dark-700/50 flex items-center px-4 gap-4">
        <div className="h-3 bg-dark-700 rounded w-1/4" />
        <div className="h-3 bg-dark-700 rounded w-1/3" />
        <div className="h-3 bg-dark-700 rounded w-1/6" />
        <div className="h-3 bg-dark-700 rounded w-1/6" />
      </div>
    ))}
  </div>
);

export { Loader, SkeletonCard, SkeletonTable };
export default Loader;
