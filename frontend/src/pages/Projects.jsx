import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, FolderKanban } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { getProjects, createProject, deleteProject } from '../api/projectApi';
import { getUsers } from '../api/userApi';
import ProjectCard from '../components/ProjectCard';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import useAuth from '../hooks/useAuth';

const schema = yup.object({
  title: yup.string().required('Title is required').max(100),
  description: yup.string().required('Description is required').max(1000),
  status: yup.string().oneOf(['Active', 'Completed', 'On Hold']),
  dueDate: yup.string().required('Due date is required'),
});

const Projects = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [creating, setCreating] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { status: 'Active' },
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const { data } = await getProjects(params);
      setProjects(data.data);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, search, statusFilter]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await getUsers({ limit: 100 });
        setUsers(data.data);
      } catch {}
    };
    fetchUsers();
  }, []);

  const onCreateProject = async (formData) => {
    setCreating(true);
    try {
      await createProject({ ...formData, members: selectedMembers });
      toast.success('Project created!');
      setShowCreateModal(false);
      reset();
      setSelectedMembers([]);
      setPage(1);
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProject(deleteId);
      toast.success('Project deleted');
      setDeleteId(null);
      fetchProjects();
    } catch {
      toast.error('Failed to delete project');
    } finally {
      setDeleting(false);
    }
  };

  const toggleMember = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-100">Projects</h1>
          <p className="text-dark-400 text-sm">{pagination.total || 0} total projects</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowCreateModal(true)} className="btn-gradient flex items-center gap-2" id="create-project-btn">
            <Plus className="w-4 h-4" /> New Project
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-10"
          />
        </div>
        <div className="relative">
          <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="input-field pl-10 pr-8 appearance-none cursor-pointer min-w-[160px]"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Project grid */}
      {loading ? (
        <Loader />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          message={search || statusFilter ? 'Try adjusting your filters.' : 'Create your first project to get started.'}
          action={isAdmin ? () => setShowCreateModal(true) : undefined}
          actionLabel="Create Project"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, i) => (
              <ProjectCard key={project._id} project={project} delay={i * 0.05} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    page === i + 1
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); reset(); }} title="Create Project" size="lg">
        <form onSubmit={handleSubmit(onCreateProject)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">Title</label>
            <input {...register('title')} className="input-field" placeholder="Project title" />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">Description</label>
            <textarea {...register('description')} className="input-field min-h-[100px] resize-none" placeholder="Describe the project..." />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Status</label>
              <select {...register('status')} className="input-field appearance-none cursor-pointer">
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Due Date</label>
              <input {...register('dueDate')} type="date" className="input-field" />
              {errors.dueDate && <p className="text-red-400 text-xs mt-1">{errors.dueDate.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Team Members</label>
            <div className="max-h-40 overflow-y-auto space-y-1 bg-dark-900/50 rounded-xl p-3 border border-dark-700">
              {users.map((u) => (
                <label key={u._id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-dark-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(u._id)}
                    onChange={() => toggleMember(u._id)}
                    className="rounded border-dark-600 text-primary-500 focus:ring-primary-500/50"
                  />
                  <span className="text-sm text-dark-300">{u.name}</span>
                  <span className={`badge ${u.role === 'Admin' ? 'badge-admin' : 'badge-member'} ml-auto text-[10px]`}>{u.role}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setShowCreateModal(false); reset(); }} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={creating} className="btn-gradient">{creating ? 'Creating...' : 'Create Project'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        message="This will permanently delete the project and all its tasks. This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
};

export default Projects;
