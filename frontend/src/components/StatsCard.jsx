import { motion } from 'framer-motion';

const StatsCard = ({ icon: Icon, label, value, color, delay = 0 }) => {
  const colorClasses = {
    purple: 'from-primary-600/20 to-primary-800/20 border-primary-500/30 text-primary-400',
    blue: 'from-accent-600/20 to-accent-800/20 border-accent-500/30 text-accent-400',
    green: 'from-emerald-600/20 to-emerald-800/20 border-emerald-500/30 text-emerald-400',
    red: 'from-red-600/20 to-red-800/20 border-red-500/30 text-red-400',
    amber: 'from-amber-600/20 to-amber-800/20 border-amber-500/30 text-amber-400',
    cyan: 'from-cyan-600/20 to-cyan-800/20 border-cyan-500/30 text-cyan-400',
  };

  const iconBgClasses = {
    purple: 'bg-primary-500/20',
    blue: 'bg-accent-500/20',
    green: 'bg-emerald-500/20',
    red: 'bg-red-500/20',
    amber: 'bg-amber-500/20',
    cyan: 'bg-cyan-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-5 backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-dark-400 text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-dark-100">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${iconBgClasses[color]} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colorClasses[color].split(' ').pop()}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
