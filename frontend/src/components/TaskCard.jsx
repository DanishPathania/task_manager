import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate, getStatusBadgeClass, getPriorityBadgeClass, getInitials, truncate } from '../utils/helpers';

const TaskCard = ({ task, delay = 0 }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -2 }}
      onClick={() => navigate(`/tasks/${task._id}`)}
      className="glass-card p-5 cursor-pointer hover:border-primary-500/30 transition-all duration-300 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-dark-100 font-semibold text-sm group-hover:text-primary-400 transition-colors">
          {truncate(task.title, 50)}
        </h3>
        <ArrowRight className="w-4 h-4 text-dark-600 group-hover:text-primary-400 transition-colors" />
      </div>

      {/* Description */}
      <p className="text-dark-400 text-xs mb-4 leading-relaxed">
        {truncate(task.description, 80)}
      </p>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`badge ${getStatusBadgeClass(task.status)}`}>{task.status}</span>
        <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>{task.priority}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-dark-500">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(task.dueDate)}</span>
        </div>
        {task.assignedTo && (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-primary-500/20 flex items-center justify-center text-[10px] font-bold text-primary-400">
              {getInitials(task.assignedTo.name)}
            </div>
            <span>{task.assignedTo.name}</span>
          </div>
        )}
      </div>

      {/* Project label */}
      {task.project && (
        <div className="mt-3 pt-3 border-t border-dark-700/50">
          <span className="text-xs text-dark-500">
            📁 {task.project.title || 'No project'}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default TaskCard;
