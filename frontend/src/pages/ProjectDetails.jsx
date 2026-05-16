import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit2, Trash2, Calendar, Users, CheckSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getProjectById, updateProject, deleteProject } from '../api/projectApi';
import { getTasks } from '../api/taskApi';
import { getUsers } from '../api/userApi';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import TaskCard from '../components/TaskCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import useAuth from '../hooks/useAuth';
import { formatDate, getStatusBadgeClass, getInitials } from '../utils/helpers';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, tasksRes, usersRes] = await Promise.all([
          getProjectById(id),
          getTasks({ project: id, limit: 50 }),
          getUsers({ limit: 100 }),
        ]);
        setProject(projectRes.data.data);
        setTasks(tasksRes.data.data);
        setUsers(usersRes.data.data);
        const memberIds = projectRes.data.data.members?.map((m) => m._id) || [];
        setSelectedMembers(memberIds);
      } catch {
        toast.error('Failed to load project');
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const openEdit = () => {
    if (project) {
      setValue('title', project.title);
      setValue('description', project.description);
      setValue('status', project.status);
      setValue('dueDate', project.dueDate?.split('T')[0]);
      setSelectedMembers(project.members?.map((m) => m._id) || []);
    }
    setShowEdit(true);
  };

  const onUpdate = async (data) => {
    setUpdating(true);
    try {
      const { data: res } = await updateProject(id, { ...data, members: selectedMembers });
      setProject(res.data);
      toast.success('Project updated');
      setShowEdit(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProject(id);
      toast.success('Project deleted');
      navigate('/projects');
    } catch {
      toast.error('Failed to delete project');
    } finally {
      setDeleting(false);
    }
  };

  const toggleMember = (uid) => {
    setSelectedMembers((prev) =>
      prev.includes(uid) ? prev.filter((m) => m !== uid) : [...prev, uid]
    );
  };

  if (loading) return <Loader />;
  if (!project) return null;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-dark-400 hover:text-dark-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </button>

      {/* Project header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-2xl font-bold text-dark-100">{project.title}</h1>
              <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                {project.status}
              </span>
            </div>
            <p className="text-dark-400 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-dark-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Due: {formatDate(project.dueDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" /> {project.members?.length || 0} members
              </span>
              <span className="flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4" /> {tasks.length} tasks
              </span>
            </div>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <button onClick={openEdit} className="btn-secondary flex items-center gap-2 text-sm">
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className="btn-danger flex items-center gap-2 text-sm"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Members */}
        {project.members && project.members.length > 0 && (
          <div className="mt-6 pt-4 border-t border-dark-700/50">
            <h3 className="text-sm font-medium text-dark-300 mb-3">Team Members</h3>
            <div className="flex flex-wrap gap-2">
              {project.members.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center gap-2 bg-dark-800/50 rounded-lg px-3 py-1.5"
                >
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center text-[10px] font-bold text-primary-300">
                    {getInitials(member.name)}
                  </div>
                  <span className="text-sm text-dark-300">{member.name}</span>
                  <span
                    className={`badge text-[10px] ${
                      member.role === 'Admin' ? 'badge-admin' : 'badge-member'
                    }`}
                  >
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Project tasks */}
      <div>
        <h2 className="text-lg font-semibold text-dark-200 mb-4">
          Tasks ({tasks.length})
        </h2>
        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task, i) => (
              <TaskCard key={task._id} task={task} delay={i * 0.05} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CheckSquare}
            title="No tasks yet"
            message="Create tasks for this project to track progress."
          />
        )}
      </div>

      {/* Edit modal */}
      <Modal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit Project"
        size="lg"
      >
        <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">Title</label>
            <input {...register('title')} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">Description</label>
            <textarea
              {...register('description')}
              className="input-field min-h-[100px] resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Status</label>
              <select
                {...register('status')}
                className="input-field appearance-none cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Due Date</label>
              <input {...register('dueDate')} type="date" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Team Members</label>
            <div className="max-h-40 overflow-y-auto space-y-1 bg-dark-900/50 rounded-xl p-3 border border-dark-700">
              {users.map((u) => (
                <label
                  key={u._id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-dark-800 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(u._id)}
                    onChange={() => toggleMember(u._id)}
                    className="rounded border-dark-600 text-primary-500"
                  />
                  <span className="text-sm text-dark-300">{u.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowEdit(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={updating} className="btn-gradient">
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        message="This will permanently delete the project and all its tasks."
        loading={deleting}
      />
    </div>
  );
};

export default ProjectDetails;
