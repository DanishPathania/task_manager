import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { getUsers } from '../api/userApi';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { getInitials, formatDate } from '../utils/helpers';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12 };
        if (search) params.search = search;
        if (roleFilter) params.role = roleFilter;
        const { data } = await getUsers(params);
        setUsers(data.data);
        setPagination(data.pagination);
      } catch {
        toast.error('Failed to load team members');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page, search, roleFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-100">Team Members</h1>
        <p className="text-dark-400 text-sm">{pagination.total || 0} members</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
          <input type="text" placeholder="Search members..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-10" />
        </div>
        <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }} className="input-field appearance-none cursor-pointer min-w-[140px]">
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Member">Member</option>
        </select>
      </div>

      {loading ? <Loader /> : users.length === 0 ? (
        <EmptyState icon={Users} title="No members found" message="Try adjusting your search." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {users.map((member, i) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-5 text-center hover:border-primary-500/30 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                  {getInitials(member.name)}
                </div>
                <h3 className="text-dark-100 font-semibold mb-1">{member.name}</h3>
                <p className="text-dark-500 text-sm mb-3">{member.email}</p>
                <span className={`badge ${member.role === 'Admin' ? 'badge-admin' : 'badge-member'}`}>{member.role}</span>
                <p className="text-dark-600 text-xs mt-3">Joined {formatDate(member.createdAt)}</p>
              </motion.div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-primary-600 text-white' : 'bg-dark-800 text-dark-400 hover:bg-dark-700'}`}>{i + 1}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Team;
