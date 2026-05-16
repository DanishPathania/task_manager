import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

const EmptyState = ({ icon: Icon = Inbox, title = 'No data found', message = 'There is nothing to display here yet.', action, actionLabel }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-dark-800/50 flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-dark-500" />
      </div>
      <h3 className="text-lg font-semibold text-dark-300 mb-2">{title}</h3>
      <p className="text-dark-500 text-sm mb-6 max-w-sm">{message}</p>
      {action && (
        <button onClick={action} className="btn-gradient">
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
