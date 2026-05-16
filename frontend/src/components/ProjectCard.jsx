import { motion } from 'framer-motion';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate, getStatusBadgeClass, getInitials, truncate } from '../utils/helpers';

const ProjectCard = ({ project, delay = 0 }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -2 }}
      onClick={() => navigate(`/projects/${project._id}`)}
      className="glass-card p-5 cursor-pointer hover:border-primary-500/30 transition-all duration-300 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-dark-100 font-semibold group-hover:text-primary-400 transition-colors">
          {truncate(project.title, 40)}
        </h3>
        <ArrowRight className="w-4 h-4 text-dark-600 group-hover:text-primary-400 transition-colors" />
      </div>

      {/* Description */}
      <p className="text-dark-400 text-sm mb-4 leading-relaxed">
        {truncate(project.description, 100)}
      </p>

      {/* Status badge */}
      <div className="mb-4">
        <span className={`badge ${getStatusBadgeClass(project.status)}`}>
          {project.status}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-dark-500">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(project.dueDate)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          <span>{project.members?.length || 0} members</span>
        </div>
      </div>

      {/* Member avatars */}
      {project.members && project.members.length > 0 && (
        <div className="mt-3 pt-3 border-t border-dark-700/50 flex items-center gap-1">
          {project.members.slice(0, 4).map((member) => (
            <div
              key={member._id}
              className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center text-[10px] font-bold text-primary-300 border border-primary-500/20"
              title={member.name}
            >
              {getInitials(member.name)}
            </div>
          ))}
          {project.members.length > 4 && (
            <div className="w-7 h-7 rounded-lg bg-dark-700 flex items-center justify-center text-[10px] font-medium text-dark-400">
              +{project.members.length - 4}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ProjectCard;
